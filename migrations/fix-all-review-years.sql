-- Comprehensive check and fix for all review years
-- This ensures reviews are grouped correctly based on the year in their name

-- Step 1: Check which reviews have mismatched years
SELECT
  name,
  slug,
  year AS current_year,
  CASE
    WHEN name ~ '2025' THEN 2025
    WHEN name ~ '2024' THEN 2024
    WHEN name ~ '2023' THEN 2023
    WHEN name ~ '2022' THEN 2022
    WHEN name ~ '2021' THEN 2021
    WHEN name ~ '2020' THEN 2020
    WHEN name ~ '2019' THEN 2019
    WHEN name ~ '2018' THEN 2018
    ELSE year
  END AS correct_year,
  CASE
    WHEN name ~ '2025' THEN 2025
    WHEN name ~ '2024' THEN 2024
    WHEN name ~ '2023' THEN 2023
    WHEN name ~ '2022' THEN 2022
    WHEN name ~ '2021' THEN 2021
    WHEN name ~ '2020' THEN 2020
    WHEN name ~ '2019' THEN 2019
    WHEN name ~ '2018' THEN 2018
    ELSE year
  END != year AS needs_fix
FROM reviews
WHERE name ~ '\d{4}'  -- Only reviews with a year in the name
ORDER BY needs_fix DESC, name;

-- Step 2: Fix all reviews with years in their names
-- Uncomment and run this UPDATE after reviewing the results above

/*
UPDATE reviews
SET year = CASE
    WHEN name ~ '2025' THEN 2025
    WHEN name ~ '2024' THEN 2024
    WHEN name ~ '2023' THEN 2023
    WHEN name ~ '2022' THEN 2022
    WHEN name ~ '2021' THEN 2021
    WHEN name ~ '2020' THEN 2020
    WHEN name ~ '2019' THEN 2019
    WHEN name ~ '2018' THEN 2018
    ELSE year
  END
WHERE name ~ '\d{4}'  -- Only reviews with a year in the name
  AND (
    (name ~ '2025' AND year != 2025) OR
    (name ~ '2024' AND year != 2024) OR
    (name ~ '2023' AND year != 2023) OR
    (name ~ '2022' AND year != 2022) OR
    (name ~ '2021' AND year != 2021) OR
    (name ~ '2020' AND year != 2020) OR
    (name ~ '2019' AND year != 2019) OR
    (name ~ '2018' AND year != 2018)
  );
*/

-- Step 3: Verify the fix worked
-- Uncomment and run this after the UPDATE

/*
SELECT
  year,
  COUNT(*) AS review_count,
  string_agg(name, ', ' ORDER BY name) AS reviews
FROM reviews
WHERE name ~ '\d{4}'
GROUP BY year
ORDER BY year DESC;
*/
