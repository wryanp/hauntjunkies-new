-- Clean up carriage returns (\r) from review text
-- These appear as standalone "r" characters in the review display
-- Run this in the Supabase SQL Editor

-- Update all reviews to remove carriage returns from review_text
UPDATE reviews
SET review_text = REPLACE(review_text, E'\r', '')
WHERE review_text IS NOT NULL
  AND review_text LIKE '%' || E'\r' || '%';

-- Also clean up carriage returns from description field if present
UPDATE reviews
SET description = REPLACE(description, E'\r', '')
WHERE description IS NOT NULL
  AND description LIKE '%' || E'\r' || '%';

-- Clean up carriage returns from review names
UPDATE reviews
SET name = REPLACE(name, E'\r', '')
WHERE name IS NOT NULL
  AND name LIKE '%' || E'\r' || '%';

-- Show how many reviews were affected
SELECT
  COUNT(*) as total_reviews_cleaned
FROM reviews
WHERE review_text IS NOT NULL OR description IS NOT NULL;
