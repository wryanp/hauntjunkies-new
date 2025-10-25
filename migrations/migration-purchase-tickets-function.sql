-- PostgreSQL function to safely handle ticket purchases with race condition protection
-- Execute this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

CREATE OR REPLACE FUNCTION purchase_tickets(
  p_date DATE,
  p_tickets INTEGER,
  p_name TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_confirmation_number TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_date_info RECORD;
  v_tickets_sold INTEGER;
  v_remaining INTEGER;
  v_ticket_id UUID;
BEGIN
  -- Lock the ticket_dates row to prevent concurrent purchases
  SELECT * INTO v_date_info
  FROM ticket_dates
  WHERE date = p_date AND is_available = true
  FOR UPDATE;  -- This locks the row until transaction completes

  -- Check if date exists and is available
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Selected date is no longer available'
    );
  END IF;

  -- Check max tickets per request
  IF p_tickets > v_date_info.max_tickets_per_request THEN
    RETURN json_build_object(
      'success', false,
      'error', format('Maximum %s tickets per request', v_date_info.max_tickets_per_request)
    );
  END IF;

  -- Calculate tickets sold with the lock held
  SELECT COALESCE(SUM(tickets), 0) INTO v_tickets_sold
  FROM ticket_requests
  WHERE date = p_date AND status = 'confirmed';

  v_remaining := v_date_info.capacity - v_tickets_sold;

  -- Check if enough tickets remain
  IF p_tickets > v_remaining THEN
    RETURN json_build_object(
      'success', false,
      'error', format('Only %s tickets remaining for this date', v_remaining)
    );
  END IF;

  -- Insert the ticket request
  INSERT INTO ticket_requests (
    name,
    first_name,
    last_name,
    email,
    date,
    tickets,
    confirmation_number,
    status
  ) VALUES (
    p_name,
    p_first_name,
    p_last_name,
    p_email,
    p_date,
    p_tickets,
    p_confirmation_number,
    'confirmed'
  )
  RETURNING id INTO v_ticket_id;

  -- Return success with ticket ID
  RETURN json_build_object(
    'success', true,
    'ticket_id', v_ticket_id,
    'confirmation_number', p_confirmation_number
  );
END;
$$;
