-- Check the actual data for Kersey Valley review
SELECT
  name,
  address,
  city,
  state,
  zip,
  slug
FROM reviews
WHERE slug = 'kersey-valley-spookywoods-2023';
