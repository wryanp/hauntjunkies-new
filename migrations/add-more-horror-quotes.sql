-- Additional horror movie and horror-themed quotes for Haunt Junkies
-- Run this in Supabase SQL editor to add more quotes
-- These quotes are NOT already in the database

INSERT INTO quotes (text, by, is_active, display_order) VALUES
('We all go a little mad sometimes.', 'Norman Bates', true, 35),
('Every town has an Elm Street.', 'A Nightmare on Elm Street', true, 36),
('In space, no one can hear you scream.', 'Alien', true, 37),
('The power of Christ compels you!', 'The Exorcist', true, 38),
('When there is no more room in hell, the dead will walk the earth.', 'Dawn of the Dead', true, 39),
('I want to play a game.', 'Jigsaw', true, 40),
('It''s alive! It''s alive!', 'Frankenstein', true, 42),
('We came. We saw. We kicked its ass!', 'Ghostbusters', true, 43),
('Listen to them, the children of the night. What music they make!', 'Dracula', true, 44),
('What an excellent day for an exorcism.', 'The Exorcist', true, 45),
('One, two, Freddy''s coming for you.', 'A Nightmare on Elm Street', true, 46),
('Kill her, mommy! Kill her!', 'Friday the 13th', true, 47),
('I met him, fifteen years ago. I was told there was nothing left.', 'Halloween', true, 48),
('A census taker once tried to test me. I ate his liver with some fava beans and a nice Chianti.', 'Hannibal Lecter', false, 49),
('Seven days.', 'The Ring', true, 50);
