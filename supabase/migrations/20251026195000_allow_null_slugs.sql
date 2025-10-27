-- Temporarily allow NULL slugs for migration
-- We'll generate slugs for NULL values after import
ALTER TABLE reviews ALTER COLUMN slug DROP NOT NULL;
