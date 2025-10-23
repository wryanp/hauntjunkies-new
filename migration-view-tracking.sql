-- Migration: Add View Tracking to Reviews
-- Tracks how many times each review has been viewed and when

-- Add view tracking columns to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP WITH TIME ZONE;

-- Create an index for sorting by popularity
CREATE INDEX IF NOT EXISTS idx_reviews_view_count ON reviews(view_count DESC);

-- Add comment explaining the purpose
COMMENT ON COLUMN reviews.view_count IS 'Total number of times this review has been viewed';
COMMENT ON COLUMN reviews.last_viewed_at IS 'Timestamp of the most recent view';

-- Optional: Create a function to increment view count (for performance)
CREATE OR REPLACE FUNCTION increment_review_views(review_slug VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE reviews
  SET
    view_count = COALESCE(view_count, 0) + 1,
    last_viewed_at = NOW()
  WHERE slug = review_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION increment_review_views(VARCHAR) TO anon, authenticated;

-- Verify the changes
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'reviews'
  AND column_name IN ('view_count', 'last_viewed_at');
