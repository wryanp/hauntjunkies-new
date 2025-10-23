-- Safe Schema Setup - Won't error if tables already exist
-- This creates only the missing tables and data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
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
CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review comments table
CREATE TABLE IF NOT EXISTS review_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  comment_text TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero message table
CREATE TABLE IF NOT EXISTS hero_message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- McCloud Manor info table
CREATE TABLE IF NOT EXISTS mccloud_info (
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
CREATE TABLE IF NOT EXISTS mccloud_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket requests table
CREATE TABLE IF NOT EXISTS ticket_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  date DATE,
  tickets INTEGER NOT NULL,
  special_requests TEXT,
  confirmation_number VARCHAR(20) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quantity INTEGER,
  preferred_date DATE,
  message TEXT
);

-- Ticket dates table
CREATE TABLE IF NOT EXISTS ticket_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  start_time TIME,
  end_time TIME,
  capacity INTEGER NOT NULL DEFAULT 50,
  max_tickets_per_request INTEGER NOT NULL DEFAULT 10,
  notes TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  by VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data only if tables are empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM hero_message) THEN
    INSERT INTO hero_message (message, is_active)
    VALUES ('We will open our haunt in 2026!', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM mccloud_info) THEN
    INSERT INTO mccloud_info (title, description, dates, hours, pricing, address)
    VALUES ('McCloud Manor', 'A terrifying home haunt experience', 'October 2025', '7:00 PM - 11:00 PM', 'Free admission', 'TBD');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM quotes) THEN
    INSERT INTO quotes (text, by, is_active, display_order) VALUES
    ('The oldest and strongest emotion of mankind is fear, and the oldest and strongest kind of fear is fear of the unknown.', 'H.P. Lovecraft', true, 1),
    ('Fear is the oldest and strongest emotion of mankind', 'H.P. Lovecraft', true, 2),
    ('Hell is empty and all the devils are here.', 'William Shakespeare', true, 3),
    ('There is something at work in my soul, which I do not understand.', 'Mary Shelley', true, 4),
    ('Monsters are real, and ghosts are real too. They live inside us, and sometimes, they win.', 'Stephen King', true, 5),
    ('We make up horrors to help us cope with the real ones.', 'Stephen King', true, 6),
    ('The boundaries which divide Life from Death are at best shadowy and vague. Who shall say where the one ends, and where the other begins?', 'Edgar Allan Poe', true, 7),
    ('All that we see or seem is but a dream within a dream.', 'Edgar Allan Poe', true, 8),
    ('I have seen the dark universe yawning where the black planets roll without aim.', 'H.P. Lovecraft', true, 9),
    ('The world is indeed comic, but the joke is on mankind.', 'H.P. Lovecraft', true, 10),
    ('I am haunted by humans.', 'Markus Zusak', true, 11),
    ('We are all monsters in our subconscious; that is why we are all afraid of the dark.', 'Jeremy Bates', true, 12),
    ('There is no terror in the bang, only in the anticipation of it.', 'Alfred Hitchcock', true, 13),
    ('The night is darkest just before dawn.', 'Harvey Dent', true, 14),
    ('It''s a very greek idea, and a very profound one. Beauty is terror. Whatever we call beautiful, we quiver before it.', 'Donna Tartt', true, 15),
    ('Sometimes dead is better.', 'Stephen King', true, 16),
    ('I would rather walk with a friend in the dark, than alone in the light.', 'Helen Keller', true, 17),
    ('What terrified me will terrify others; and I need only describe the spectre which had haunted my midnight pillow.', 'Mary Shelley', true, 18),
    ('The thing under my bed waiting to grab my ankle isn''t real. I know that, and I also know that if I''m careful to keep my foot under the covers, it will never be able to grab my ankle.', 'Stephen King', true, 19),
    ('Never trust the living.', 'Beetlejuice', true, 20),
    ('I see dead people.', 'Cole Sear', true, 21),
    ('Be afraid. Be very afraid.', 'The Fly', true, 22),
    ('They''re here.', 'Poltergeist', true, 23),
    ('I ate his liver with some fava beans and a nice chianti.', 'Hannibal Lecter', true, 24),
    ('Here''s Johnny!', 'Jack Torrance', true, 25),
    ('Do you like scary movies?', 'Ghostface', true, 26),
    ('Whatever you do, don''t fall asleep.', 'Nancy Thompson', true, 27),
    ('Welcome to prime time, bitch!', 'Freddy Krueger', true, 28),
    ('He died of fright.', 'Dr. Jekyll and Mr. Hyde', true, 29),
    ('It was a dark and stormy night.', 'Edward Bulwer-Lytton', true, 30),
    ('I have lived a thousand lives and I''ve loved a thousand loves. I''ve walked on distant worlds and seen the end of time. Because I read.', 'George R.R. Martin', true, 31),
    ('Books are a uniquely portable magic.', 'Stephen King', true, 32),
    ('Sleep is good, he said, and books are better.', 'George R.R. Martin', true, 33),
    ('Beware; for I am fearless, and therefore powerful.', 'Mary Shelley', true, 34);
  END IF;
END $$;

-- Create indexes (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_reviews_slug ON reviews(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(featured);
CREATE INDEX IF NOT EXISTS idx_reviews_year ON reviews(year);
CREATE INDEX IF NOT EXISTS idx_review_comments_review_id ON review_comments(review_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_approved ON review_comments(approved);
CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON review_images(review_id);
CREATE INDEX IF NOT EXISTS idx_mccloud_photos_order ON mccloud_photos(display_order);
CREATE INDEX IF NOT EXISTS idx_ticket_requests_status ON ticket_requests(status);
CREATE INDEX IF NOT EXISTS idx_ticket_dates_date ON ticket_dates(date);
CREATE INDEX IF NOT EXISTS idx_ticket_dates_available ON ticket_dates(is_available);
CREATE INDEX IF NOT EXISTS idx_quotes_active ON quotes(is_active);
CREATE INDEX IF NOT EXISTS idx_quotes_order ON quotes(display_order);

-- Enable Row Level Security
DO $$
BEGIN
  ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
  ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
  ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE hero_message ENABLE ROW LEVEL SECURITY;
  ALTER TABLE mccloud_info ENABLE ROW LEVEL SECURITY;
  ALTER TABLE mccloud_photos ENABLE ROW LEVEL SECURITY;
  ALTER TABLE ticket_requests ENABLE ROW LEVEL SECURITY;
  ALTER TABLE ticket_dates ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
  -- RLS might already be enabled, that's fine
  NULL;
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
DROP POLICY IF EXISTS "Public can read review images" ON review_images;
DROP POLICY IF EXISTS "Public can read approved comments" ON review_comments;
DROP POLICY IF EXISTS "Public can create comments" ON review_comments;
DROP POLICY IF EXISTS "Public can read hero message" ON hero_message;
DROP POLICY IF EXISTS "Public can read mccloud info" ON mccloud_info;
DROP POLICY IF EXISTS "Public can read mccloud photos" ON mccloud_photos;
DROP POLICY IF EXISTS "Public can create ticket requests" ON ticket_requests;
DROP POLICY IF EXISTS "Public can create contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can manage reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can manage review images" ON review_images;
DROP POLICY IF EXISTS "Authenticated users can manage comments" ON review_comments;
DROP POLICY IF EXISTS "Authenticated users can manage hero message" ON hero_message;
DROP POLICY IF EXISTS "Authenticated users can manage mccloud info" ON mccloud_info;
DROP POLICY IF EXISTS "Authenticated users can manage mccloud photos" ON mccloud_photos;
DROP POLICY IF EXISTS "Authenticated users can read ticket requests" ON ticket_requests;
DROP POLICY IF EXISTS "Authenticated users can update ticket requests" ON ticket_requests;
DROP POLICY IF EXISTS "Public can read available ticket dates" ON ticket_dates;
DROP POLICY IF EXISTS "Authenticated users can manage ticket dates" ON ticket_dates;
DROP POLICY IF EXISTS "Authenticated users can read contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Public can read active quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can manage quotes" ON quotes;

-- Create policies
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public can read review images" ON review_images FOR SELECT USING (true);
CREATE POLICY "Public can read approved comments" ON review_comments FOR SELECT USING (approved = true);
CREATE POLICY "Public can create comments" ON review_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read hero message" ON hero_message FOR SELECT USING (true);
CREATE POLICY "Public can read mccloud info" ON mccloud_info FOR SELECT USING (true);
CREATE POLICY "Public can read mccloud photos" ON mccloud_photos FOR SELECT USING (true);
CREATE POLICY "Public can create ticket requests" ON ticket_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create contact submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage review images" ON review_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage comments" ON review_comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage hero message" ON hero_message FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage mccloud info" ON mccloud_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage mccloud photos" ON mccloud_photos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read ticket requests" ON ticket_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update ticket requests" ON ticket_requests FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read available ticket dates" ON ticket_dates FOR SELECT USING (is_available = true);
CREATE POLICY "Authenticated users can manage ticket dates" ON ticket_dates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read contact submissions" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read active quotes" ON quotes FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage quotes" ON quotes FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate triggers
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS update_mccloud_info_updated_at ON mccloud_info;
DROP TRIGGER IF EXISTS update_ticket_dates_updated_at ON ticket_dates;

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mccloud_info_updated_at BEFORE UPDATE ON mccloud_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_dates_updated_at BEFORE UPDATE ON ticket_dates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
