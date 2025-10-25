-- Migration: Add tiktok_url column to reviews table
-- Description: Separates TikTok URLs from Twitter URLs for better social media link management
-- Date: 2025-01-24

-- Add the tiktok_url column to the reviews table
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS tiktok_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN reviews.tiktok_url IS 'TikTok profile URL for the haunted attraction';
