-- Find what character appears after "too!" in the review text
SELECT
  name,
  -- Get the substring around "too!"
  substring(review_text from position('too!' in review_text) for 20) as text_around_too,
  -- Get hex of that same substring
  encode(substring(review_text::bytea from position('too!' in review_text::bytea) for 20), 'hex') as hex_around_too,
  -- Get the specific byte right after "too!"
  encode(substring(review_text::bytea from position('too!' in review_text::bytea) + 4 for 1), 'hex') as byte_after_too,
  -- Convert to decimal to see ASCII code
  get_byte(review_text::bytea, position('too!' in review_text::bytea) + 3) as ascii_code_after_too
FROM reviews
WHERE slug = 'extreme-fear-scaregrounds-2023'
  AND review_text LIKE '%too!%';
