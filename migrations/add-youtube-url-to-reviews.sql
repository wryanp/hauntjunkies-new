-- Migration: Add youtube_url column to reviews table
-- Date: 2025-10-23
-- Description: Adds support for YouTube video embeds in reviews

-- Add youtube_url column to reviews table
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN reviews.youtube_url IS 'URL to YouTube video for this review (will be embedded)';
