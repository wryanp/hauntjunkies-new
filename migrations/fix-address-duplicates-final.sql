-- Find all reviews where address contains city or state
-- These need to be cleaned up

SELECT
  name,
  address,
  city,
  state,
  zip,
  -- Show what the cleaned address would be
  CASE
    -- If address contains ", [city]" pattern, extract everything before it
    WHEN address LIKE '%,' || city || '%' THEN
      TRIM(SPLIT_PART(address, ',' || city, 1))
    -- If address contains the city without comma, try splitting at city
    WHEN address LIKE '%' || city || '%' THEN
      TRIM(REGEXP_REPLACE(address, city || '.*$', '', 'i'))
    -- Otherwise just take everything before first comma after street
    ELSE
      TRIM(SPLIT_PART(address, ',', 1))
  END as cleaned_address
FROM reviews
WHERE
  address IS NOT NULL
  AND city IS NOT NULL
  AND (
    address ILIKE '%' || city || '%'
    OR address ILIKE '%' || state || '%'
  )
ORDER BY name;

-- Now fix them all
-- This will extract just the street address portion

UPDATE reviews
SET address = CASE
  -- If there's a comma followed by city name, take everything before that
  WHEN address LIKE '%,' || city || '%' THEN
    TRIM(REGEXP_REPLACE(address, ',\s*' || city || '.*$', '', 'i'))
  -- If city appears without comma, remove from city onwards
  WHEN address LIKE '%' || city || '%' THEN
    TRIM(REGEXP_REPLACE(address, '\s+' || city || '.*$', '', 'i'))
  -- Fallback: just take first part before comma
  ELSE
    TRIM(SPLIT_PART(address, ',', 1))
END
WHERE
  address IS NOT NULL
  AND city IS NOT NULL
  AND (
    address ILIKE '%' || city || '%'
    OR address ILIKE '%' || state || '%'
  );

-- Verify the fix
SELECT
  name,
  address,
  city,
  state,
  zip
FROM reviews
WHERE slug = 'woods-of-terror-2023';
