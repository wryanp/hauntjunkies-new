-- Fix review addresses that were incorrectly combined into a single field
-- This script attempts to parse the combined address field back into separate fields

-- First, let's see what we're working with
SELECT
  id,
  name,
  address,
  city,
  state,
  zip
FROM reviews
WHERE address IS NOT NULL
ORDER BY name
LIMIT 10;

-- If the addresses look like they need to be split, uncomment and run the UPDATE below
-- Note: This is a best-effort approach and may need manual review

/*
-- Example update if addresses are in format "street1 street2"
-- You may need to adjust this based on the actual data format

UPDATE reviews
SET
  -- This is a placeholder - you'll need to adjust based on actual data format
  -- For now, the address field contains the combined address1 + address2
  address = TRIM(address)
WHERE address IS NOT NULL;
*/
