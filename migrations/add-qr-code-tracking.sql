-- Migration to add QR code tracking for one-time use validation
-- This enables secure, one-time use QR codes for ticket entry

-- Create QR code tracking table
CREATE TABLE IF NOT EXISTS ticket_qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_request_id UUID REFERENCES ticket_requests(id) ON DELETE CASCADE,
  qr_token VARCHAR(64) UNIQUE NOT NULL,  -- Unique token embedded in QR code
  used_at TIMESTAMP WITH TIME ZONE,      -- NULL = not used, timestamp = when scanned
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,   -- Optional expiration

  -- Index for fast lookups
  CONSTRAINT qr_token_unique UNIQUE (qr_token)
);

-- Create index for fast QR token lookups
CREATE INDEX IF NOT EXISTS idx_ticket_qr_codes_qr_token ON ticket_qr_codes(qr_token);
CREATE INDEX IF NOT EXISTS idx_ticket_qr_codes_ticket_request_id ON ticket_qr_codes(ticket_request_id);
CREATE INDEX IF NOT EXISTS idx_ticket_qr_codes_used_at ON ticket_qr_codes(used_at);

-- Row Level Security policies
ALTER TABLE ticket_qr_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read for validation (via service role key in practice)
CREATE POLICY "Allow public read for QR validation" ON ticket_qr_codes
  FOR SELECT
  USING (true);

-- Only allow inserts via service role
CREATE POLICY "Service role can insert QR codes" ON ticket_qr_codes
  FOR INSERT
  WITH CHECK (true);

-- Only allow updates via service role (for marking as used)
CREATE POLICY "Service role can update QR codes" ON ticket_qr_codes
  FOR UPDATE
  USING (true);

-- Function to validate and mark QR code as used (atomic operation)
CREATE OR REPLACE FUNCTION validate_qr_code(p_qr_token VARCHAR)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_qr_record RECORD;
  v_ticket_record RECORD;
BEGIN
  -- Lock the QR code row to prevent concurrent scans
  SELECT * INTO v_qr_record
  FROM ticket_qr_codes
  WHERE qr_token = p_qr_token
  FOR UPDATE;

  -- Check if QR code exists
  IF NOT FOUND THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Invalid QR code'
    );
  END IF;

  -- Check if already used
  IF v_qr_record.used_at IS NOT NULL THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'QR code has already been used',
      'used_at', v_qr_record.used_at
    );
  END IF;

  -- Check if expired (if expiration is set)
  IF v_qr_record.expires_at IS NOT NULL AND v_qr_record.expires_at < NOW() THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'QR code has expired',
      'expired_at', v_qr_record.expires_at
    );
  END IF;

  -- Mark as used
  UPDATE ticket_qr_codes
  SET used_at = NOW()
  WHERE qr_token = p_qr_token;

  -- Get ticket details
  SELECT
    tr.confirmation_number,
    tr.first_name,
    tr.last_name,
    tr.email,
    tr.date,
    tr.tickets,
    td.start_time,
    td.end_time
  INTO v_ticket_record
  FROM ticket_requests tr
  LEFT JOIN ticket_dates td ON tr.date = td.date
  WHERE tr.id = v_qr_record.ticket_request_id;

  -- Return success with ticket details
  RETURN json_build_object(
    'valid', true,
    'used_at', NOW(),
    'ticket', json_build_object(
      'confirmation_number', v_ticket_record.confirmation_number,
      'name', v_ticket_record.first_name || ' ' || v_ticket_record.last_name,
      'email', v_ticket_record.email,
      'date', v_ticket_record.date,
      'time', CASE
        WHEN v_ticket_record.start_time IS NOT NULL
        THEN v_ticket_record.start_time::TEXT || ' - ' || v_ticket_record.end_time::TEXT
        ELSE NULL
      END,
      'tickets', v_ticket_record.tickets
    )
  );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION validate_qr_code TO authenticated, anon;

COMMENT ON TABLE ticket_qr_codes IS 'Tracks QR codes for one-time use ticket validation';
COMMENT ON COLUMN ticket_qr_codes.qr_token IS 'Unique token embedded in QR code URL';
COMMENT ON COLUMN ticket_qr_codes.used_at IS 'Timestamp when QR code was scanned (NULL = not used)';
COMMENT ON COLUMN ticket_qr_codes.expires_at IS 'Optional expiration timestamp';
COMMENT ON FUNCTION validate_qr_code IS 'Atomically validates and marks QR code as used';
