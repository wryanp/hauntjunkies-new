-- Fix trailing spaces in state abbreviations
-- This will trim any leading/trailing whitespace from state values

-- Step 1: Check which reviews have states with trailing spaces
SELECT
  id,
  name,
  state,
  LENGTH(state) AS state_length,
  TRIM(state) AS trimmed_state
FROM reviews
WHERE state != TRIM(state)
ORDER BY state;

-- Step 2: Update all states to remove trailing/leading spaces
-- Uncomment and run this after reviewing Step 1 results

/*
UPDATE reviews
SET state = TRIM(state)
WHERE state != TRIM(state);
*/

-- Step 3: Verify the fix
-- Uncomment and run this after Step 2

/*
SELECT DISTINCT
  state,
  LENGTH(state) AS length,
  COUNT(*) AS review_count
FROM reviews
WHERE state IS NOT NULL
GROUP BY state
ORDER BY state;
*/
