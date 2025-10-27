-- Remove standalone "r" characters from ALL reviews
-- These are literal "r" characters (ASCII 114) that appear at the end of lines
-- Pattern: "r\n" (the letter r followed by newline)

-- Update ALL review_text fields
UPDATE reviews
SET review_text = regexp_replace(review_text, 'r\n', E'\n', 'g')
WHERE review_text ~ 'r\n'
  AND review_text IS NOT NULL;

-- Update ALL description fields (in case they have the same issue)
UPDATE reviews
SET description = regexp_replace(description, 'r\n', E'\n', 'g')
WHERE description ~ 'r\n'
  AND description IS NOT NULL;

-- Show summary of what was cleaned
SELECT
  COUNT(*) as total_reviews_cleaned,
  COUNT(CASE WHEN review_text ~ 'r\n' THEN 1 END) as still_has_r_in_review_text,
  COUNT(CASE WHEN description ~ 'r\n' THEN 1 END) as still_has_r_in_description
FROM reviews;

-- Show sample of cleaned reviews (first 5)
SELECT
  name,
  LEFT(review_text, 200) as cleaned_text_preview
FROM reviews
WHERE review_text IS NOT NULL
ORDER BY updated_at DESC
LIMIT 5;
