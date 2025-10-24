-- =====================================================
-- Golden Ghost Awards Database Schema
-- =====================================================
-- Execute this SQL in your Supabase SQL Editor
--
-- This creates:
-- 1. Six award columns on the reviews table (one per category)
-- 2. Site settings table for homepage hero toggle
-- =====================================================

-- Add award columns to reviews table
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS award_best_actors_year INT NULL,
  ADD COLUMN IF NOT EXISTS award_best_makeup_year INT NULL,
  ADD COLUMN IF NOT EXISTS award_best_set_design_year INT NULL,
  ADD COLUMN IF NOT EXISTS award_best_story_year INT NULL,
  ADD COLUMN IF NOT EXISTS award_scariest_year INT NULL,
  ADD COLUMN IF NOT EXISTS award_best_overall_year INT NULL;

-- Add comments for documentation
COMMENT ON COLUMN reviews.award_best_actors_year IS 'Year this review won Best Haunt Actors award (NULL = no award)';
COMMENT ON COLUMN reviews.award_best_makeup_year IS 'Year this review won Best Haunt Makeup award (NULL = no award)';
COMMENT ON COLUMN reviews.award_best_set_design_year IS 'Year this review won Best Set Design award (NULL = no award)';
COMMENT ON COLUMN reviews.award_best_story_year IS 'Year this review won Best Haunt Story award (NULL = no award)';
COMMENT ON COLUMN reviews.award_scariest_year IS 'Year this review won Scariest Haunt award (NULL = no award)';
COMMENT ON COLUMN reviews.award_best_overall_year IS 'Year this review won Best Overall Haunt award (NULL = no award)';

-- Create site_settings table for configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Allow public read access to site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Only authenticated users can update settings (admin only in practice)
CREATE POLICY "Allow authenticated users to update settings"
  ON site_settings FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert default setting for homepage awards hero
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES (
  'show_awards_hero',
  '{"enabled": true}'::jsonb,
  'Controls whether multi-award winners are shown in a hero section on the homepage'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_award_best_actors
  ON reviews(award_best_actors_year)
  WHERE award_best_actors_year IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_award_best_makeup
  ON reviews(award_best_makeup_year)
  WHERE award_best_makeup_year IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_award_best_set_design
  ON reviews(award_best_set_design_year)
  WHERE award_best_set_design_year IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_award_best_story
  ON reviews(award_best_story_year)
  WHERE award_best_story_year IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_award_scariest
  ON reviews(award_scariest_year)
  WHERE award_scariest_year IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_award_best_overall
  ON reviews(award_best_overall_year)
  WHERE award_best_overall_year IS NOT NULL;

-- Create a composite index for finding multi-award winners efficiently
CREATE INDEX IF NOT EXISTS idx_reviews_multiple_awards
  ON reviews(
    award_best_actors_year,
    award_best_makeup_year,
    award_best_set_design_year,
    award_best_story_year,
    award_scariest_year,
    award_best_overall_year
  )
  WHERE award_best_actors_year IS NOT NULL
     OR award_best_makeup_year IS NOT NULL
     OR award_best_set_design_year IS NOT NULL
     OR award_best_story_year IS NOT NULL
     OR award_scariest_year IS NOT NULL
     OR award_best_overall_year IS NOT NULL;

-- =====================================================
-- IMPORTANT: After running this SQL:
-- 1. Save the golden-ghost-award.png image to static/ folder
-- 2. Update TypeScript types in src/lib/types.ts
-- 3. Continue with component implementation
-- =====================================================
