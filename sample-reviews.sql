-- Sample Reviews to Test New Features
-- This adds realistic haunt reviews with review_date and inline reviewer photos

-- Note: Replace the image URLs with actual images from your Supabase Storage
-- For testing, you can use placeholder images from services like placeholder.com

-- Georgia Reviews (2024)
INSERT INTO reviews (
  name, slug, state, city, year, review_date,
  address, zip,
  description, review_text,
  rating_overall, rating_scares, rating_atmosphere, rating_value,
  cover_image_url, featured
) VALUES
(
  'Netherworld Haunted House',
  'netherworld-2024',
  'Georgia',
  'Stone Mountain',
  2024,
  '2024-10-29',
  '1313 Netherworld Way',
  '30087',
  'One of the most intense and professionally produced haunted attractions in the Southeast.',
  'Walking up to Netherworld, we could already feel the intensity. The facade is absolutely massive and incredibly detailed, setting the stage for what''s to come.

[REVIEWER_PHOTO:1]

The wait time on opening night was about 45 minutes, but the queue line entertainment kept everyone engaged. We met some of the actors in the outdoor area who were already in full character and makeup - absolutely terrifying!

The production value inside is immediately apparent. Every room is meticulously designed with Hollywood-quality sets and props. The attention to detail is incredible, from the sound design to the lighting effects.

[REVIEWER_PHOTO:2]

The animatronics are some of the best we''ve seen anywhere. The timing and realism are exceptional, and they''re seamlessly integrated with live actors for maximum scares. The combination of technology and talent creates truly immersive experiences.

One standout moment was the laser vortex tunnel - a classic effect executed perfectly. Another was the clown section, which even had our most seasoned haunter jumping.

Overall, Netherworld continues to set the bar for haunted attractions. It''s a must-visit for any haunt junkie. Well worth the drive and the wait!',
  4.9,
  4.8,
  5.0,
  4.7,
  'https://via.placeholder.com/800x600/FC7403/ffffff?text=Netherworld',
  true
),
(
  'Scarehouse Studios',
  'scarehouse-studios-2024',
  'Georgia',
  'Atlanta',
  2024,
  '2024-10-15',
  '456 Fright Street',
  '30303',
  'A newer haunt in Atlanta with impressive special effects and unique storylines.',
  'Scarehouse Studios is a relatively new addition to the Atlanta haunt scene, but they''re making a big impression. The team clearly has experience in theater and film production.

[REVIEWER_PHOTO:1]

What sets this haunt apart is the narrative structure. Each room tells part of a larger story, and the transitions between scenes are smooth and logical. It''s not just random scares - there''s a plot.

The practical effects are outstanding. We were particularly impressed with the transformation sequences and the use of mirrors and lighting to create illusions. The finale scene left us speechless.

[REVIEWER_PHOTO:2]

The actors are well-trained and stay in character throughout. They improvise based on guest reactions, which keeps the experience fresh and unpredictable.

At about 20 minutes, it''s a good length for the price point. We''d love to see them expand in future years as they''ve clearly got the talent and creativity to create something even bigger.

Definitely worth checking out if you''re in the Atlanta area!',
  4.5,
  4.3,
  4.7,
  4.6,
  'https://via.placeholder.com/800x600/a41214/ffffff?text=Scarehouse',
  true
);

-- North Carolina Reviews (2024)
INSERT INTO reviews (
  name, slug, state, city, year, review_date,
  address, zip,
  description, review_text,
  rating_overall, rating_scares, rating_atmosphere, rating_value,
  cover_image_url, featured
) VALUES
(
  'Kersey Valley Spookywoods',
  'spookywoods-2024',
  'North Carolina',
  'High Point',
  2024,
  '2024-10-20',
  '1615 Kersey Valley Road',
  '27265',
  'North Carolina''s largest scream park with multiple haunted attractions and outdoor trail.',
  'Spookywoods has been a staple of North Carolina Halloween for years, and they continue to evolve and improve. This year''s visit did not disappoint.

[REVIEWER_PHOTO:1]

The outdoor trail is what sets Spookywoods apart. Walking through the dark woods with only flashlights, you never know what''s lurking behind the next tree. The use of natural terrain creates authentic scares.

Inside the buildings, they''ve really upped their game with new animatronics and set pieces. The asylum section was particularly well-done, with attention to creepy details that create genuine unease.

[REVIEWER_PHOTO:2]

We also appreciated the variety - from intense scares to more campy fun sections. This makes it great for groups with different scare tolerances.

The whole experience takes about 45 minutes to an hour depending on your pace and crowd levels. For the price, you get a lot of haunt for your money.

The only downside is that peak night wait times can get long, so arrive early or consider their speed pass option.

Overall, a fantastic outdoor haunt experience!',
  4.6,
  4.5,
  4.8,
  4.7,
  'https://via.placeholder.com/800x600/FC7403/ffffff?text=Spookywoods',
  true
);

-- Georgia Reviews (2023)
INSERT INTO reviews (
  name, slug, state, city, year, review_date,
  address, zip,
  description, review_text,
  rating_overall, rating_scares, rating_atmosphere, rating_value,
  cover_image_url, featured
) VALUES
(
  'The Dungeon of Doom',
  'dungeon-of-doom-2023',
  'Georgia',
  'Marietta',
  2023,
  '2023-10-31',
  '789 Terror Lane',
  '30060',
  'Classic underground haunt with medieval torture theme and claustrophobic corridors.',
  'Visited The Dungeon of Doom on Halloween night 2023, and it lived up to its reputation as one of the more intense haunts in the metro Atlanta area.

[REVIEWER_PHOTO:1]

The entrance alone sets the mood - you descend into an actual basement space, and the temperature drops immediately. The claustrophobic feeling is real and adds to the tension.

The medieval torture theme is executed with disturbing realism. The sets include authentic-looking props (we hope they''re just props!) and the actors are committed to their roles as deranged jailers and executioners.

Several sections require you to navigate tight spaces and low ceilings. If you''re claustrophobic, this might not be for you. But if you want an intense, immersive experience, this is it.

[REVIEWER_PHOTO:2]

The finale involves a live chainsaw chase through a pitch-black corridor. Our hearts were racing!

It''s not the longest haunt - probably 15-20 minutes - but it''s intense enough that it feels longer. The intimacy of the space means scares are up close and personal.

A solid addition to any Georgia haunt tour!',
  4.4,
  4.7,
  4.5,
  4.2,
  'https://via.placeholder.com/800x600/a41214/ffffff?text=Dungeon',
  false
);

-- Tennessee Reviews (2024)
INSERT INTO reviews (
  name, slug, state, city, year, review_date,
  address, zip,
  description, review_text,
  rating_overall, rating_scares, rating_atmosphere, rating_value,
  cover_image_url, featured
) VALUES
(
  'Nashville Nightmare',
  'nashville-nightmare-2024',
  'Tennessee',
  'Nashville',
  2024,
  '2024-10-25',
  '1016 Madison Square',
  '37115',
  'Multi-story haunted attraction in the heart of Nashville with cutting-edge effects.',
  'Made the drive to Nashville specifically for this haunt, and it was absolutely worth the trip. Nashville Nightmare has earned its reputation as one of the top haunts in the South.

[REVIEWER_PHOTO:1]

The building itself is massive - four stories of terror. Each floor has a different theme, from an abandoned hospital to a demonic cathedral. The transitions are seamless and the theming is consistent.

What impressed us most was the integration of technology. They use projection mapping, motion sensors, and pneumatic effects that we haven''t seen elsewhere. It feels like stepping into a big-budget horror film.

The cast was fantastic - over 100 actors on busy nights. The character development and commitment to role were exceptional. We had several moments where we genuinely couldn''t tell what was an animatronic and what was a person.

[REVIEWER_PHOTO:2]

The entire experience took us about 35-40 minutes, which felt perfectly paced. No dead space, no rushed sections - just consistently excellent scares and atmosphere.

They also have a "zombie paintball" attraction and a "zombie laser tag" experience if you want to make a full night of it.

Highest recommendation - this is destination-worthy haunt!',
  4.9,
  4.9,
  5.0,
  4.7,
  'https://via.placeholder.com/800x600/FC7403/ffffff?text=Nashville+Nightmare',
  true
);

-- Now add sample reviewer photos for each review
-- First, get the review IDs (we'll use a DO block to insert photos with proper references)

DO $$
DECLARE
  v_netherworld_id UUID;
  v_scarehouse_id UUID;
  v_spookywoods_id UUID;
  v_dungeon_id UUID;
  v_nashville_id UUID;
BEGIN
  -- Get review IDs
  SELECT id INTO v_netherworld_id FROM reviews WHERE slug = 'netherworld-2024';
  SELECT id INTO v_scarehouse_id FROM reviews WHERE slug = 'scarehouse-studios-2024';
  SELECT id INTO v_spookywoods_id FROM reviews WHERE slug = 'spookywoods-2024';
  SELECT id INTO v_dungeon_id FROM reviews WHERE slug = 'dungeon-of-doom-2023';
  SELECT id INTO v_nashville_id FROM reviews WHERE slug = 'nashville-nightmare-2024';

  -- Netherworld photos
  IF v_netherworld_id IS NOT NULL THEN
    INSERT INTO reviewer_photos (review_id, image_url, caption, alt_text, display_order) VALUES
    (v_netherworld_id, 'https://via.placeholder.com/800x600/333333/FC7403?text=Team+at+Netherworld+Entrance', 'The Haunt Junkies team outside the massive Netherworld facade', 'Team photo at Netherworld entrance', 1),
    (v_netherworld_id, 'https://via.placeholder.com/800x600/1a1a1a/FC7403?text=Queue+Line+Actor', 'One of the terrifying actors prowling the queue line', 'Close-up of haunted house actor in costume', 2);
  END IF;

  -- Scarehouse photos
  IF v_scarehouse_id IS NOT NULL THEN
    INSERT INTO reviewer_photos (review_id, image_url, caption, alt_text, display_order) VALUES
    (v_scarehouse_id, 'https://via.placeholder.com/800x600/333333/a41214?text=Scarehouse+Front', 'The entrance to Scarehouse Studios - unassuming from the outside!', 'Exterior of Scarehouse Studios', 1),
    (v_scarehouse_id, 'https://via.placeholder.com/800x600/1a1a1a/a41214?text=Team+Photo', 'Our team after making it through - still catching our breath', 'Group photo after completing the haunt', 2);
  END IF;

  -- Spookywoods photos
  IF v_spookywoods_id IS NOT NULL THEN
    INSERT INTO reviewer_photos (review_id, image_url, caption, alt_text, display_order) VALUES
    (v_spookywoods_id, 'https://via.placeholder.com/800x600/333333/FC7403?text=Woods+Trail', 'About to enter the dark forest trail - flashlights ready!', 'Team at the start of the outdoor trail', 1),
    (v_spookywoods_id, 'https://via.placeholder.com/800x600/1a1a1a/FC7403?text=Building+Entrance', 'The main building complex at Spookywoods', 'Exterior of Spookywoods main haunt building', 2);
  END IF;

  -- Dungeon photos
  IF v_dungeon_id IS NOT NULL THEN
    INSERT INTO reviewer_photos (review_id, image_url, caption, alt_text, display_order) VALUES
    (v_dungeon_id, 'https://via.placeholder.com/800x600/333333/a41214?text=Descent+Into+Darkness', 'The ominous entrance - descending into the dungeon', 'Stairway entrance to underground haunt', 1),
    (v_dungeon_id, 'https://via.placeholder.com/800x600/1a1a1a/a41214?text=Survivors', 'Made it out alive! The chainsaw finale was intense.', 'Team photo after exiting the haunt', 2);
  END IF;

  -- Nashville photos
  IF v_nashville_id IS NOT NULL THEN
    INSERT INTO reviewer_photos (review_id, image_url, caption, alt_text, display_order) VALUES
    (v_nashville_id, 'https://via.placeholder.com/800x600/333333/FC7403?text=Nashville+Building', 'The four-story Nashville Nightmare building in all its glory', 'Exterior of Nashville Nightmare haunt', 1),
    (v_nashville_id, 'https://via.placeholder.com/800x600/1a1a1a/FC7403?text=Team+After', 'Exhausted but exhilarated after four floors of terror', 'Team photo outside Nashville Nightmare', 2);
  END IF;

END $$;

-- Verify the data
SELECT
  r.name,
  r.state,
  r.year,
  r.review_date,
  COUNT(rp.id) as photo_count
FROM reviews r
LEFT JOIN reviewer_photos rp ON r.id = rp.review_id
WHERE r.slug IN (
  'netherworld-2024',
  'scarehouse-studios-2024',
  'spookywoods-2024',
  'dungeon-of-doom-2023',
  'nashville-nightmare-2024'
)
GROUP BY r.id, r.name, r.state, r.year, r.review_date
ORDER BY r.state, r.year DESC, r.review_date DESC;
