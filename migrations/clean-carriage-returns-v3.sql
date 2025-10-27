-- Clean up carriage returns - Version 3 (Simple and direct)
-- This removes all carriage return characters that display as "r"
-- Run this in the Supabase SQL Editor

-- Update review_text to remove all carriage returns
UPDATE reviews
SET review_text = REPLACE(review_text, CHR(13), '')
WHERE review_text IS NOT NULL;

-- Update description to remove all carriage returns
UPDATE reviews
SET description = REPLACE(description, CHR(13), '')
WHERE description IS NOT NULL;

-- Verify - this should return 0 if successful
SELECT
  COUNT(*) as reviews_with_carriage_returns
FROM reviews
WHERE review_text LIKE '%' || CHR(13) || '%'
   OR description LIKE '%' || CHR(13) || '%';
