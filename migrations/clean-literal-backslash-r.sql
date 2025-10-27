-- Clean up literal \r escape sequences (backslash + r) from review text
-- These appear as standalone "r" in the rendered HTML
-- Run this in the Supabase SQL Editor

-- Update review_text to remove literal \r strings
UPDATE reviews
SET review_text = REPLACE(review_text, E'\\r\\n', E'\n')
WHERE review_text LIKE '%\\r\\n%';

UPDATE reviews
SET review_text = REPLACE(review_text, E'\\r', E'\n')
WHERE review_text LIKE '%\\r%';

-- Update description to remove literal \r strings
UPDATE reviews
SET description = REPLACE(description, E'\\r\\n', E'\n')
WHERE description LIKE '%\\r\\n%';

UPDATE reviews
SET description = REPLACE(description, E'\\r', E'\n')
WHERE description LIKE '%\\r%';

-- Verify the cleanup
SELECT
  COUNT(*) as total_reviews,
  COUNT(CASE WHEN review_text LIKE '%\\r%' THEN 1 END) as still_has_backslash_r,
  COUNT(CASE WHEN review_text IS NOT NULL THEN 1 END) as has_review_text
FROM reviews;

-- Show the specific review to verify
SELECT
  name,
  LEFT(review_text, 200) as preview
FROM reviews
WHERE slug = 'extreme-fear-scaregrounds-2023';
