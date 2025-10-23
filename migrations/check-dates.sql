-- Check what dates are already in the ticket_dates table
SELECT
  date,
  is_available,
  capacity,
  max_tickets_per_request,
  created_at
FROM ticket_dates
ORDER BY date;
