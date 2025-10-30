-- Update validate_qr_code function to return correct field names
-- This fixes the ticket count display on validation confirmation page

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
      'message', 'QR code not found'
    );
  END IF;

  -- Check if already used
  IF v_qr_record.used_at IS NOT NULL THEN
    RETURN json_build_object(
      'valid', false,
      'message', 'QR code has already been used',
      'used_at', v_qr_record.used_at
    );
  END IF;

  -- Check if expired (if expiration is set)
  IF v_qr_record.expires_at IS NOT NULL AND v_qr_record.expires_at < NOW() THEN
    RETURN json_build_object(
      'valid', false,
      'message', 'QR code has expired',
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

  -- Return success with ticket details (updated field names to match frontend)
  RETURN json_build_object(
    'valid', true,
    'message', 'Ticket validated successfully',
    'used_at', NOW(),
    'ticket_info', json_build_object(
      'confirmation_number', v_ticket_record.confirmation_number,
      'guest_name', v_ticket_record.first_name || ' ' || v_ticket_record.last_name,
      'email', v_ticket_record.email,
      'event_date', v_ticket_record.date::TEXT,
      'time', CASE
        WHEN v_ticket_record.start_time IS NOT NULL
        THEN v_ticket_record.start_time::TEXT || ' - ' || v_ticket_record.end_time::TEXT
        ELSE NULL
      END,
      'ticket_count', v_ticket_record.tickets
    )
  );
END;
$$;
