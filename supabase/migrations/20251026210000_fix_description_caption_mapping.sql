-- Fix field mapping from Heroku migration
-- Issue: description field should have been mapped to caption
-- Heroku schema: description (short preview) → Supabase caption
-- Heroku schema: article (full review) → Supabase review_text (already correct)

-- Move description data to caption field for preview text
-- Clear description field as it's not used in the current schema
UPDATE reviews
SET
  caption = description,
  description = NULL
WHERE description IS NOT NULL;

-- Verify the update
DO $$
DECLARE
  updated_count INTEGER;
  null_caption_count INTEGER;
BEGIN
  -- Count updated records
  SELECT COUNT(*) INTO updated_count FROM reviews WHERE caption IS NOT NULL;
  SELECT COUNT(*) INTO null_caption_count FROM reviews WHERE caption IS NULL;

  RAISE NOTICE 'Migration complete:';
  RAISE NOTICE '  - Reviews with caption: %', updated_count;
  RAISE NOTICE '  - Reviews with NULL caption: %', null_caption_count;
END $$;
