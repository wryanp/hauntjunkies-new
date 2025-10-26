-- Migration: Security Enhancements
-- Created: 2025-10-26
-- Description: Adds rate limiting table and comment approval token expiration

-- =====================================================
-- 1. Rate Limiting Table
-- =====================================================
-- Create table for distributed rate limiting
-- This replaces the in-memory Map which doesn't work across serverless instances

CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- e.g., "comment-submission", "ticket-request"
    client_ip TEXT NOT NULL, -- Client IP address
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    window_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Composite unique constraint to ensure one row per IP+identifier combination
    UNIQUE(identifier, client_ip)
);

-- Index for fast lookups by identifier and IP
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
ON rate_limits(identifier, client_ip, window_end);

-- Index for cleanup of expired entries
CREATE INDEX IF NOT EXISTS idx_rate_limits_expiry
ON rate_limits(window_end);

-- Enable Row Level Security
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for server-side operations)
CREATE POLICY "Service role can manage rate limits"
ON rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rate_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rate_limits_updated_at
BEFORE UPDATE ON rate_limits
FOR EACH ROW
EXECUTE FUNCTION update_rate_limits_updated_at();

-- =====================================================
-- 2. Comment Approval Token Expiration
-- =====================================================
-- Add approval token columns to review_comments table

-- Add approval_token column if it doesn't exist
ALTER TABLE review_comments
ADD COLUMN IF NOT EXISTS approval_token TEXT;

-- Add approval_token_expires_at column if it doesn't exist
ALTER TABLE review_comments
ADD COLUMN IF NOT EXISTS approval_token_expires_at TIMESTAMPTZ;

-- Create index for expired token cleanup
CREATE INDEX IF NOT EXISTS idx_review_comments_token_expiry
ON review_comments(approval_token_expires_at)
WHERE approval_token IS NOT NULL;

-- =====================================================
-- 3. Cleanup Functions
-- =====================================================

-- Function to clean up expired rate limit entries
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM rate_limits
    WHERE window_end < NOW() - INTERVAL '1 hour';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired approval tokens
CREATE OR REPLACE FUNCTION cleanup_expired_approval_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE review_comments
    SET approval_token = NULL,
        approval_token_expires_at = NULL
    WHERE approval_token IS NOT NULL
    AND approval_token_expires_at < NOW();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. Scheduled Cleanup (Optional - requires pg_cron extension)
-- =====================================================
-- Note: Uncomment if pg_cron extension is available
-- This will automatically clean up expired entries every hour

-- SELECT cron.schedule(
--     'cleanup-rate-limits',
--     '0 * * * *', -- Every hour
--     $$ SELECT cleanup_expired_rate_limits(); $$
-- );

-- SELECT cron.schedule(
--     'cleanup-approval-tokens',
--     '0 * * * *', -- Every hour
--     $$ SELECT cleanup_expired_approval_tokens(); $$
-- );

-- =====================================================
-- Migration Complete
-- =====================================================

-- Verify tables exist
SELECT
    'rate_limits' AS table_name,
    COUNT(*) AS row_count
FROM rate_limits
UNION ALL
SELECT
    'review_comments' AS table_name,
    COUNT(*) AS row_count
FROM review_comments;
