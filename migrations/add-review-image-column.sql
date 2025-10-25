-- Add review_image column to reviews table for social media sharing thumbnails
-- This is the "Social Media Share Image" field in the admin panel

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS review_image TEXT;

COMMENT ON COLUMN reviews.review_image IS 'Social media thumbnail image URL for sharing (og:image)';
