-- Create contact_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Public can create contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can read contact submissions" ON contact_submissions;

-- Allow public to submit contact forms
CREATE POLICY "Public can create contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read contact submissions
CREATE POLICY "Authenticated users can read contact submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');
