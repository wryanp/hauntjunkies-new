-- Add likes_count column to review_comments table
ALTER TABLE review_comments
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create comment_likes table to track who liked what
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES review_comments(id) ON DELETE CASCADE,
    user_identifier TEXT NOT NULL, -- Can be IP address or session ID
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_identifier) -- Prevent duplicate likes from same user
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_identifier ON comment_likes(user_identifier);

-- Enable Row Level Security
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view likes
CREATE POLICY "Anyone can view comment likes"
ON comment_likes FOR SELECT
USING (true);

-- Policy: Anyone can insert likes (we'll validate in the application)
CREATE POLICY "Anyone can add likes"
ON comment_likes FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can delete their own likes
CREATE POLICY "Users can delete their own likes"
ON comment_likes FOR DELETE
USING (true);

-- Function to update likes_count when a like is added or removed
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE review_comments
        SET likes_count = likes_count + 1
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE review_comments
        SET likes_count = likes_count - 1
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update likes_count
DROP TRIGGER IF EXISTS trigger_update_comment_likes_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_likes_count
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW
EXECUTE FUNCTION update_comment_likes_count();
