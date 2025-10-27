-- Show the actual hex bytes of the review text to identify the exact character
-- Run this in Supabase SQL Editor

SELECT
  name,
  slug,
  -- Show first 500 characters
  LEFT(review_text, 500) as text_preview,
  -- Convert to hex to see actual bytes
  encode(substring(review_text::bytea, 1, 200), 'hex') as hex_bytes,
  -- Check for different variations
  CASE
    WHEN review_text LIKE '%\\r%' THEN 'HAS LITERAL BACKSLASH-R (\\r)'
    WHEN review_text LIKE '%' || CHR(13) || '%' THEN 'HAS ACTUAL CR (ASCII 13)'
    WHEN review_text LIKE '%' || CHR(10) || '%' THEN 'HAS LF (ASCII 10 - normal)'
    ELSE 'UNKNOWN'
  END as character_type
FROM reviews
WHERE slug = 'extreme-fear-scaregrounds-2023';
