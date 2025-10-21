-- HauntJunkies Database Schema for Supabase
-- Run this in your Supabase SQL editor after creating a new project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),
  year INTEGER,
  description TEXT,
  review_text TEXT,
  featured BOOLEAN DEFAULT false,
  rating_overall DECIMAL(3,2),
  rating_scares DECIMAL(3,2),
  rating_atmosphere DECIMAL(3,2),
  rating_value DECIMAL(3,2),
  cover_image_url TEXT,
  website_url VARCHAR(500),
  facebook_url VARCHAR(500),
  instagram_url VARCHAR(500),
  twitter_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review images table
CREATE TABLE review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review comments table
CREATE TABLE review_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  comment_text TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero message table (single row for homepage hero announcement)
CREATE TABLE hero_message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- McCloud Manor info table (single row for site info)
CREATE TABLE mccloud_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) DEFAULT 'McCloud Manor',
  description TEXT,
  story TEXT,
  dates TEXT,
  hours TEXT,
  pricing TEXT,
  address VARCHAR(255),
  video_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- McCloud Manor photos table
CREATE TABLE mccloud_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket requests table
CREATE TABLE ticket_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  quantity INTEGER NOT NULL,
  preferred_date DATE,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact form submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial hero message
INSERT INTO hero_message (message, is_active)
VALUES (
  'We will open our haunt in 2026!',
  true
);

-- Insert initial McCloud Manor info
INSERT INTO mccloud_info (title, description, dates, hours, pricing, address)
VALUES (
  'McCloud Manor',
  'A terrifying home haunt experience',
  'October 2025',
  '7:00 PM - 11:00 PM',
  'Free admission',
  'TBD'
);

-- Create indexes for better performance
CREATE INDEX idx_reviews_slug ON reviews(slug);
CREATE INDEX idx_reviews_featured ON reviews(featured);
CREATE INDEX idx_reviews_year ON reviews(year);
CREATE INDEX idx_review_comments_review_id ON review_comments(review_id);
CREATE INDEX idx_review_comments_approved ON review_comments(approved);
CREATE INDEX idx_review_images_review_id ON review_images(review_id);
CREATE INDEX idx_mccloud_photos_order ON mccloud_photos(display_order);
CREATE INDEX idx_ticket_requests_status ON ticket_requests(status);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE mccloud_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE mccloud_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for reviews
CREATE POLICY "Public can read reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Public can read review images" ON review_images
  FOR SELECT USING (true);

-- Public can read approved comments only
CREATE POLICY "Public can read approved comments" ON review_comments
  FOR SELECT USING (approved = true);

-- Public can create comments (will need approval)
CREATE POLICY "Public can create comments" ON review_comments
  FOR INSERT WITH CHECK (true);

-- Public read access for hero message
CREATE POLICY "Public can read hero message" ON hero_message
  FOR SELECT USING (true);

-- Public read access for McCloud Manor
CREATE POLICY "Public can read mccloud info" ON mccloud_info
  FOR SELECT USING (true);

CREATE POLICY "Public can read mccloud photos" ON mccloud_photos
  FOR SELECT USING (true);

-- Public can submit ticket requests
CREATE POLICY "Public can create ticket requests" ON ticket_requests
  FOR INSERT WITH CHECK (true);

-- Public can submit contact forms
CREATE POLICY "Public can create contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Admin policies (authenticated users can do everything)
-- You'll need to create admin users in Supabase Auth

CREATE POLICY "Authenticated users can manage reviews" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage review images" ON review_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage comments" ON review_comments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage hero message" ON hero_message
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage mccloud info" ON mccloud_info
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage mccloud photos" ON mccloud_photos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read ticket requests" ON ticket_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update ticket requests" ON ticket_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read contact submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mccloud_info_updated_at BEFORE UPDATE ON mccloud_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
