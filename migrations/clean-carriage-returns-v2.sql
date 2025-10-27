-- Clean up carriage returns (\r) from review text - Version 2
-- More aggressive cleanup of all line ending variations
-- Run this in the Supabase SQL Editor

-- First, let's see what we're dealing with
SELECT
  id,
  name,
  LENGTH(review_text) as original_length,
  LENGTH(REPLACE(REPLACE(REPLACE(review_text, E'\r\n', E'\n'), E'\r', E'\n'), E'\n\n\n', E'\n\n')) as cleaned_length,
  (LENGTH(review_text) - LENGTH(REPLACE(REPLACE(REPLACE(review_text, E'\r\n', E'\n'), E'\r', E'\n'), E'\n\n\n', E'\n\n'))) as chars_to_remove
FROM reviews
WHERE review_text IS NOT NULL
LIMIT 5;

-- Now clean up all variations of line endings
-- Step 1: Replace Windows line endings (\r\n) with Unix line endings (\n)
UPDATE reviews
SET review_text = REPLACE(review_text, E'\r\n', E'\n')
WHERE review_text IS NOT NULL
  AND POSITION(E'\r\n' IN review_text) > 0;

-- Step 2: Replace any remaining standalone carriage returns (\r) with newlines (\n)
UPDATE reviews
SET review_text = REPLACE(review_text, E'\r', E'\n')
WHERE review_text IS NOT NULL
  AND POSITION(E'\r' IN review_text) > 0;

-- Step 3: Clean up excessive newlines (more than 2 consecutive)
UPDATE reviews
SET review_text = REGEXP_REPLACE(review_text, E'\n\n\n+', E'\n\n', 'g')
WHERE review_text IS NOT NULL
  AND review_text ~ E'\n\n\n+';

-- Clean description field too
UPDATE reviews
SET description = REPLACE(REPLACE(description, E'\r\n', E'\n'), E'\r', E'\n')
WHERE description IS NOT NULL
  AND (POSITION(E'\r\n' IN description) > 0 OR POSITION(E'\r' IN description) > 0);

-- Verify the cleanup
SELECT
  COUNT(*) as total_reviews,
  COUNT(CASE WHEN review_text LIKE '%' || E'\r' || '%' THEN 1 END) as still_has_carriage_returns,
  COUNT(CASE WHEN review_text IS NOT NULL THEN 1 END) as has_review_text
FROM reviews;
