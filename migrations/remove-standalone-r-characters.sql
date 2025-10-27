-- Remove standalone "r" characters that appear at the end of lines
-- These are literal "r" characters (ASCII 114), not carriage returns
-- Pattern: "r\n" (the letter r followed by newline)

-- Update review_text to remove standalone "r" at end of lines
UPDATE reviews
SET review_text = regexp_replace(review_text, 'r\n', E'\n', 'g')
WHERE review_text ~ 'r\n';

-- Verify the cleanup - should show the text without "r" characters
SELECT
  name,
  LEFT(review_text, 300) as first_300_chars
FROM reviews
WHERE slug = 'extreme-fear-scaregrounds-2023';
