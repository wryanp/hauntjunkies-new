-- Add 'read' column to contact_submissions table
-- This allows admins to mark messages as read/unread

-- Add the read column (defaults to false for new messages)
ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false;

-- Add UPDATE policy for authenticated users (admins)
DROP POLICY IF EXISTS "Authenticated users can update contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated users can update contact submissions" ON contact_submissions
  FOR UPDATE USING (true);

-- Add DELETE policy for authenticated users (admins)
DROP POLICY IF EXISTS "Authenticated users can delete contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated users can delete contact submissions" ON contact_submissions
  FOR DELETE USING (true);

-- Add comment
COMMENT ON COLUMN contact_submissions.read IS 'Whether the admin has read this message';
