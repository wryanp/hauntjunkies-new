-- Verify that all standalone "r" characters have been removed
-- This should return 0 rows if the cleanup was successful

SELECT
  name,
  slug,
  CASE
    WHEN review_text ~ 'r\n' THEN 'STILL HAS r\\n in review_text'
    WHEN description ~ 'r\n' THEN 'STILL HAS r\\n in description'
    ELSE 'CLEAN'
  END as status,
  -- Show a preview if there are still issues
  CASE
    WHEN review_text ~ 'r\n' THEN LEFT(review_text, 200)
    WHEN description ~ 'r\n' THEN LEFT(description, 200)
    ELSE NULL
  END as problem_preview
FROM reviews
WHERE review_text ~ 'r\n' OR description ~ 'r\n';

-- If this returns 0 rows, all reviews are clean!
-- If it returns any rows, those reviews still need cleaning
