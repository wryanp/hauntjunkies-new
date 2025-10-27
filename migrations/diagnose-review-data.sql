-- Diagnostic query to check review data status
-- Run this in Supabase SQL Editor to see current state

-- 1. Check address data format
SELECT
  name,
  address,
  city,
  state,
  zip
FROM reviews
WHERE address IS NOT NULL
ORDER BY name
LIMIT 10;

-- 2. Check date/year data
SELECT
  name,
  year,
  review_date,
  created_at,
  updated_at
FROM reviews
ORDER BY name
LIMIT 10;

-- 3. Summary statistics
SELECT
  COUNT(*) as total_reviews,
  COUNT(address) as reviews_with_address,
  COUNT(city) as reviews_with_city,
  COUNT(state) as reviews_with_state,
  COUNT(zip) as reviews_with_zip,
  COUNT(year) as reviews_with_year,
  COUNT(review_date) as reviews_with_review_date
FROM reviews;
