-- Check actual year values for reviews that should be in 2023
SELECT
  name,
  slug,
  year,
  state,
  city
FROM reviews
WHERE name LIKE '%2023%'
ORDER BY name;

-- Fix: Update all reviews with "2023" in the name to have year = 2023
-- UPDATE reviews
-- SET year = 2023
-- WHERE name LIKE '%2023%' AND year != 2023;
