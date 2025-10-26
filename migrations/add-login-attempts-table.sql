-- ============================================================================
-- Login Attempts Tracking Table
-- ============================================================================
-- Purpose: Track failed login attempts and implement account lockout
-- Security: Prevents brute force attacks by locking accounts after 10 failures
-- ============================================================================

-- Create login_attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
    email TEXT PRIMARY KEY,
    attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_attempt TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add index for locked_until queries
-- Note: We index all locked_until values (not just active locks)
-- because filtering with NOW() in WHERE clause requires IMMUTABLE function
CREATE INDEX IF NOT EXISTS idx_login_attempts_locked
ON login_attempts(email, locked_until)
WHERE locked_until IS NOT NULL;

-- Add index for cleanup queries (remove old records)
CREATE INDEX IF NOT EXISTS idx_login_attempts_last_attempt
ON login_attempts(last_attempt);

-- Enable Row Level Security
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: No public access (server-side only via service role key)
CREATE POLICY "No public access to login attempts"
ON login_attempts
FOR ALL
TO public
USING (false);

-- Function to check if account is locked
CREATE OR REPLACE FUNCTION is_account_locked(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_locked_until TIMESTAMP;
BEGIN
    SELECT locked_until INTO v_locked_until
    FROM login_attempts
    WHERE email = p_email;

    -- Not locked if no record or lock expired
    IF v_locked_until IS NULL OR v_locked_until <= NOW() THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$;

-- Function to record failed login attempt
CREATE OR REPLACE FUNCTION record_failed_login(p_email TEXT)
RETURNS TABLE(attempts INTEGER, locked_until TIMESTAMP)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_attempts INTEGER;
    v_locked_until TIMESTAMP;
BEGIN
    -- Insert or update attempt record
    INSERT INTO login_attempts (email, attempts, last_attempt)
    VALUES (p_email, 1, NOW())
    ON CONFLICT (email) DO UPDATE
    SET
        attempts = CASE
            -- Reset if lock expired
            WHEN login_attempts.locked_until IS NOT NULL AND login_attempts.locked_until <= NOW() THEN 1
            -- Increment if not locked
            ELSE login_attempts.attempts + 1
        END,
        last_attempt = NOW(),
        locked_until = CASE
            -- Lock for 30 minutes after 10 failed attempts
            WHEN login_attempts.attempts + 1 >= 10 THEN NOW() + INTERVAL '30 minutes'
            ELSE NULL
        END
    RETURNING login_attempts.attempts, login_attempts.locked_until
    INTO v_attempts, v_locked_until;

    RETURN QUERY SELECT v_attempts, v_locked_until;
END;
$$;

-- Function to reset login attempts on successful login
CREATE OR REPLACE FUNCTION reset_login_attempts(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM login_attempts WHERE email = p_email;
END;
$$;

-- Function to clean up old login attempts (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM login_attempts
    WHERE last_attempt < NOW() - INTERVAL '30 days'
    AND (locked_until IS NULL OR locked_until <= NOW());

    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$;

-- ============================================================================
-- EXECUTION INSTRUCTIONS
-- ============================================================================
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and execute
-- 4. Verify tables created: Database → Tables → login_attempts
-- 5. Verify functions created: Database → Functions → is_account_locked, etc.
-- ============================================================================

-- Test queries (optional)
-- SELECT is_account_locked('test@example.com');
-- SELECT * FROM record_failed_login('test@example.com');
-- SELECT reset_login_attempts('test@example.com');
-- SELECT cleanup_old_login_attempts();
