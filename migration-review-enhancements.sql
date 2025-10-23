-- Migration: Add review_date and reviewer_photos support
-- This adds fields to organize reviews by state/year and support inline reviewer images

-- Add review_date field to reviews table (the date the haunt was actually visited)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_date DATE;

-- Create an index on review_date for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_review_date ON reviews(review_date DESC);

-- Create indexes for state and year to improve filtering performance
CREATE INDEX IF NOT EXISTS idx_reviews_state ON reviews(state);
CREATE INDEX IF NOT EXISTS idx_reviews_year ON reviews(year);

-- Create reviewer_photos table (photos of the reviewers visiting the haunt)
-- These can be placed strategically throughout the review text
CREATE TABLE IF NOT EXISTS reviewer_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster retrieval
CREATE INDEX IF NOT EXISTS idx_reviewer_photos_review_id ON reviewer_photos(review_id, display_order);

-- Add RLS policies for reviewer_photos (same as review_images)
ALTER TABLE reviewer_photos ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Public read access for reviewer photos" ON reviewer_photos;
DROP POLICY IF EXISTS "Authenticated users can manage reviewer photos" ON reviewer_photos;

-- Allow public read access for reviewer photos
CREATE POLICY "Public read access for reviewer photos"
  ON reviewer_photos FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update/delete reviewer photos
CREATE POLICY "Authenticated users can manage reviewer photos"
  ON reviewer_photos FOR ALL
  USING (auth.role() = 'authenticated');

-- Add comment explaining the purpose
COMMENT ON TABLE reviewer_photos IS 'Photos of the Haunt Junkies reviewers visiting haunted attractions. These images can be placed strategically throughout review text using placeholders like [REVIEWER_PHOTO:1]';
COMMENT ON COLUMN reviews.review_date IS 'The date the haunt was actually visited/reviewed (different from created_at which is when the review was added to the site)';
