-- Add approval_token column to review_comments table
-- This allows comments to be approved via email link

-- Add the approval_token column
ALTER TABLE review_comments
ADD COLUMN IF NOT EXISTS approval_token TEXT;

-- Add index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_review_comments_approval_token
ON review_comments(approval_token);

-- Add comment for documentation
COMMENT ON COLUMN review_comments.approval_token IS 'Secure token used for email-based comment approval. Token is cleared after use.';
