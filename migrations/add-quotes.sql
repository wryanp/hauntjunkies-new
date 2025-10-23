-- Add quotes table and data
-- Run this in Supabase SQL Editor

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  by VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert quotes
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_active ON quotes(is_active);
CREATE INDEX IF NOT EXISTS idx_quotes_order ON quotes(display_order);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Public can read active quotes
CREATE POLICY "Public can read active quotes" ON quotes
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage quotes
CREATE POLICY "Authenticated users can manage quotes" ON quotes
  FOR ALL USING (auth.role() = 'authenticated');
