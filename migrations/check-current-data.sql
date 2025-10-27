-- Check what's ACTUALLY in the database right now
SELECT
  LEFT(review_text, 300) as first_300_chars,
  CASE
    WHEN review_text LIKE '%\r%' THEN 'HAS BACKSLASH-R'
    WHEN review_text LIKE '%' || CHR(13) || '%' THEN 'HAS ACTUAL CR'
    ELSE 'CLEAN'
  END as status
FROM reviews
WHERE slug = 'extreme-fear-scaregrounds-2023';
