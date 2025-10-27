-- Diagnostic query to find what's causing the "r" characters
-- Run this in Supabase SQL Editor

-- Look for the specific review and show raw bytes around problem areas
SELECT
  id,
  name,
  -- Show first 500 characters with special characters visible
  REPLACE(REPLACE(REPLACE(
    LEFT(review_text, 500),
    E'\r', '[CR]'),
    E'\n', '[LF]'),
    E'\r\n', '[CRLF]'
  ) as text_with_visible_special_chars,
  -- Count different line ending types
  (LENGTH(review_text) - LENGTH(REPLACE(review_text, E'\r', ''))) as carriage_return_count,
  (LENGTH(review_text) - LENGTH(REPLACE(review_text, E'\n', ''))) as newline_count,
  -- Check for literal 'r' at end of words
  (LENGTH(review_text) - LENGTH(REPLACE(review_text, 'r', ''))) as literal_r_count
FROM reviews
WHERE slug = 'extreme-fear-scaregrounds-2023'
LIMIT 1;

-- Also check if there are HTML encoded versions
SELECT
  id,
  name,
  -- Check for various encoded forms
  CASE
    WHEN review_text LIKE '%&#13;%' THEN 'Contains &#13;'
    WHEN review_text LIKE '%&#x0D;%' THEN 'Contains &#x0D;'
    WHEN review_text LIKE '%\r%' THEN 'Contains \r escape'
    ELSE 'No obvious encoding'
  END as encoding_check
FROM reviews
WHERE slug = 'extreme-fear-scaregrounds-2023';
