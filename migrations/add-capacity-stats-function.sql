-- Function to get real-time capacity statistics for today's event
-- Used by staff scanner page to show admission status

CREATE OR REPLACE FUNCTION get_todays_capacity_stats()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_today_date DATE;
  v_total_capacity INTEGER;
  v_tickets_sold INTEGER;
  v_tickets_scanned INTEGER;
  v_percentage_scanned NUMERIC;
  v_status TEXT;
  v_color TEXT;
BEGIN
  -- Get today's date
  v_today_date := CURRENT_DATE;

  -- Get capacity for today from ticket_dates table
  SELECT COALESCE(capacity, 0) INTO v_total_capacity
  FROM ticket_dates
  WHERE date = v_today_date;

  -- If no event today, return null status
  IF v_total_capacity IS NULL OR v_total_capacity = 0 THEN
    RETURN json_build_object(
      'has_event_today', false,
      'date', v_today_date,
      'message', 'No event scheduled for today'
    );
  END IF;

  -- Get total tickets sold for today
  SELECT COALESCE(SUM(tickets), 0) INTO v_tickets_sold
  FROM ticket_requests
  WHERE date = v_today_date
  AND status = 'confirmed';

  -- Get count of scanned tickets (used QR codes) for today
  SELECT COUNT(*) INTO v_tickets_scanned
  FROM ticket_qr_codes qr
  INNER JOIN ticket_requests tr ON qr.ticket_request_id = tr.id
  WHERE tr.date = v_today_date
  AND qr.used_at IS NOT NULL;

  -- Calculate percentage
  IF v_tickets_sold > 0 THEN
    v_percentage_scanned := ROUND((v_tickets_scanned::NUMERIC / v_tickets_sold::NUMERIC) * 100, 1);
  ELSE
    v_percentage_scanned := 0;
  END IF;

  -- Determine status and color based on percentage
  IF v_percentage_scanned >= 100 THEN
    v_status := 'Full';
    v_color := 'gray';
  ELSIF v_percentage_scanned >= 91 THEN
    v_status := 'At Capacity';
    v_color := 'red';
  ELSIF v_percentage_scanned >= 76 THEN
    v_status := 'Getting Busy';
    v_color := 'yellow';
  ELSE
    v_status := 'Plenty of Space';
    v_color := 'green';
  END IF;

  -- Return comprehensive stats
  RETURN json_build_object(
    'has_event_today', true,
    'date', v_today_date,
    'total_capacity', v_total_capacity,
    'tickets_sold', v_tickets_sold,
    'tickets_scanned', v_tickets_scanned,
    'tickets_remaining', v_tickets_sold - v_tickets_scanned,
    'percentage_scanned', v_percentage_scanned,
    'status', v_status,
    'color', v_color,
    'is_sold_out', v_tickets_sold >= v_total_capacity
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_todays_capacity_stats TO authenticated, anon;

COMMENT ON FUNCTION get_todays_capacity_stats IS 'Returns real-time capacity statistics for today''s event for staff scanner page';
