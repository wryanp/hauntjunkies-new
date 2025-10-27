-- Migration Script: Import Reviews from Heroku to Supabase
-- Created: 2025-10-26
-- Description: Migrates 90 reviews from Heroku Postgres to Supabase
--
-- IMPORTANT: This script will DELETE all existing reviews in Supabase!
-- Make sure to backup your Supabase reviews table before running this script.
--
-- Instructions:
-- 1. Backup existing Supabase reviews (if needed)
-- 2. Run this script in Supabase SQL Editor
-- 3. Verify data imported correctly
-- 4. If using images, update image URLs to point to Supabase Storage

-- Step 1: Clear existing reviews (cascades to related tables)
DELETE FROM reviews;

-- Step 2: Insert reviews from Heroku
-- Note: We're manually inserting each review with proper UUID generation and field mapping

-- FIELD MAPPING:
-- Heroku → Supabase
-- id (bigint) → Generate new UUID
-- name → name
-- address1 + address2 → address (concatenated)
-- city → city
-- state → state
-- zip → zip
-- year (VARCHAR) → year (INTEGER)
-- description → description
-- article → review_text
-- slug → slug
-- rating (double precision) → rating_overall (DECIMAL)
-- url → website_url
-- facebook → facebook_url
-- twitter → twitter_url
-- instagram → instagram_url
-- youtube → youtube_url
-- featured → featured
-- created_at → created_at
-- updated_at → updated_at
--
-- NEW FIELDS (not in Heroku, set to NULL/defaults):
-- review_date, caption, review_image, tiktok_url, view_count, last_viewed_at
-- rating_scares, rating_atmosphere, rating_value
-- award_best_actors_year, award_best_makeup_year, award_best_set_design_year,
-- award_best_story_year, award_scariest_year, award_best_overall_year

-- NOTE: The actual INSERT statements should be generated from the heroku-reviews-data.sql file
-- by parsing the COPY data and transforming it to INSERT format.
--
-- You'll need to manually paste the transformed INSERT statements below this comment.
-- Each INSERT should follow this format:
--
-- INSERT INTO reviews (
--   id, name, address, city, state, zip, year, description, review_text, slug,
--   rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
--   featured, created_at, updated_at
-- ) VALUES (
--   uuid_generate_v4(),  -- Generate new UUID
--   'Haunt Name',
--   'Address 1 Address 2',  -- Concatenated
--   'City',
--   'State',
--   'Zip',
--   2020,  -- Convert from string to integer
--   'Description text...',
--   'Article/Review text...',
--   'haunt-slug',
--   4.5,  -- Rating
--   'http://website.com',
--   'http://facebook.com/...',
--   'http://twitter.com/...',
--   'http://instagram.com/...',
--   'http://youtube.com/...',
--   true,  -- featured
--   '2020-01-01 00:00:00+00',  -- created_at
--   '2020-01-01 00:00:00+00'   -- updated_at
-- );

-- ==================================================================
-- INSERT STATEMENTS GENERATED FROM HEROKU DATA
-- Generated: 2025-10-26T23:27:55.647Z
-- Total reviews: 90
-- ==================================================================

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Sinister Suites: Hotel Of Horror 2016',
  '132 W Solomon St',
  'Griffin',
  'GA',
  '30223',
  2016,
  '2016 was our second year visiting Sinister Suites. Our first year (2015) had us looking forward...',
  '<p dir="ltr">2016 was our second year visiting Sinister Suites. Our first year (2015) had us looking forward to the next because it was their rookie season and we saw a tremendous amount of potential here. They probably have one of the creepiest venues of all the GA haunts!!! The building was a 5-story hotel built in 1910 and from the outside, it is very creepy and intimidating. The scene is set so perfect that you expect a truly scary visit but… unfortunately, they are just lacking the vision to take this haunt to the level it should be on.</p><p dir="ltr">The layout and setup is so impossible to navigate that they assign you a guide, who completely broke the ENTIRE experience. “Stop. Turn left. Watch your step.” Seriously dude… The performance from the actors was not much better. In fact, one of the actors playing a baby literally said “BOO!” There was just an overall lack of costuming, makeup, and set design which made it even more disappointing.</p><p dir="ltr">There is no cohesive theme which is crazy considering the building (an old, potentially seriously haunted hotel) should provide all the inspiration necessary. The owner is a great guy and being that we were late (as usual) we had the opportunity to talk to him before and after we walked through. Regrettably, we weren''t able to give exciting feedback which resulted in a “that was cool” type of response. We truly hope they get it together because the building alone has limitless possibilities! Yes, we keep talking about the building; it is really that awesome!</p>',
  NULL,
  2,
  'http://sinistersuites.com/',
  'https://www.facebook.com/SinisterSuites/',
  'https://twitter.com/sinistersuites?lang=en',
  'https://www.instagram.com/sinistersuites/?hl=en',
  NULL,
  false,
  '2017-09-05 07:10:22.845991',
  '2022-09-11 07:57:38.074932'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Uncle Shuck''s Corn Maze and The Dark Rows 2017',
  '4520 Highway 53 E',
  'Dawsonville',
  'GA',
  '30534',
  2017,
  'We had some serious family fun at Uncle Shucks...',
  '<p>We had some serious family fun at Uncle Shucks! They have all the fall staples - pumpkin patch, pony rides, play area, hayride, bonfire, yummy concessions, and corn mazes galore! There is a corn maze for just about every age and skill set... but our favorite was their haunted one, The Dark Rows.<br><br>This is the perfect haunted attraction for your Haunt Junkie Jr.! It had just the right amount of scare (the actors will adjust as needed), enough cool effects to keep us adults entertained, and it''s all for a good cause. The proceeds benefit a local cheerleading squad with many of the girls working as actors and taking part in the scares.<br><br>This haunt is mostly outdoors with a few small shelters constructed to house more scare scenes. And woah... we were super surprised by the level of props and effects they managed to incorporate in these small buildings.<br><br>Costuming was all over the place in terms of degree of detail but it all seemed to work. The ages of the actors ranged from 5 to 30''s. This just further reinforced the overall family feel and environment of Uncle Shucks.<br><br>If you follow us on Facebook or Instagram you may have seen our daughter''s video review. She gave them "fifty hundred" stars (she''s 5). We are going to give them 4 because we think they could give us more. Can''t wait to see what they come up with next year.!</p>',
  NULL,
  4,
  'http://www.uncleshucks.com/',
  'https://www.facebook.com/UncleShucks/',
  'https://twitter.com/UncleShucks',
  'https://www.instagram.com/uncleshuckscornmaze/',
  NULL,
  false,
  '2017-10-06 02:34:27.062171',
  '2022-09-11 08:04:27.757944'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Booger Jim''s Hollow 2020',
  '278 Doolittle St',
  'Blacksburg',
  'SC',
  '29702',
  2020,
  'Booger Jim is a local legend in Cherokee Falls, SC who, after...',
  'Booger Jim is a local legend in Cherokee Falls, SC who, after murdering his wife and son in a drunken rage, hung himself with jumper cables from a nearby bridge. Locals say he can sometimes be seen on that bridge, now known as Booger Jim Bridge. He’s an angry, sorrowful spirit who has manifested an impenetrable darkness in the surrounding woods. We’re also pretty sure Booger Jim is slowly taking over the hillside neighborhood in Blacksburg, SC with Booger Jim’s Hollow. This haunt inhabits two houses and the woods behind the unsuspecting neighborhood. They have such an unusual locale that really makes you feel as if you’ve stepped into a real-life horror movie!r
r
Booger Jim’s Hollow is a 3-part attraction that begins with the optional $2 hayride, but this is not your typical tractor through the woods. Guests are loaded into a hay-filled flatbed trailer and pulled by a pick-up truck up the steep neighborhood street. It was such a surreal experience to be driving past people’s houses on our way to the first attraction, not knowing when or where we’d be dropped off.r
r
The first attraction was an outdoor haunted trail through the woods. It wasn’t long before we realized that these woods were inhabited by a bunch of chainsaw-toting hillbillies and clowns! The dark trail wove amongst the trees with a few small walk-throughs built along the way. The scariest scene by far was when we ended up in a room surrounded and held captive by the chainsaw-wielding killers! We narrowly escaped and made our way through the woods to the next attraction.r
r
Next up was the Doll House. This attraction was a newer addition to Booger Jim’s Hollow; this year only being its second. The Doll House definitely stayed true to its name featuring room after creepy, doll-filled room. Kids and dolls are always disturbing, but we wish the actors in this house played up the creepy factor and imitated dolls coming to life instead of just screaming. Another new addition was the concession area located right behind the Doll House which featured fall favorites like boiled peanuts as well as some Booger Jim’s merchandise.r
r
After the Doll House, we had to take a little trek down the hill to the haunted house and final attraction. WATCH OUT FOR THE SLIDER!!! This house had been overrun by clowns. We’ve had A LOT of fun with clown characters this year and the ones at Booger Jim’s were NO exception! They kept the fun going with a game of monkey in the barrel with Megan as the monkey! This was a wild and fun time! r
r
The fact that both haunted houses are in actual houses gave them not just a realistic, but a REAL backdrop to work with. Each scene was detailed and given a convincing look without needing to break the budget. The music and sounds used in the sets fit so perfectly that you barely even notice them while they’re enhancing the atmosphere. r
r
The costuming at Booger Jim’s stayed pretty consistent in the realm of hillbillies, clowns, and hillbilly clowns with the exception being the kids and dolls in the Doll House. In addition to many of the characters wearing masks, Booger Jim''s COVID-19 precautions include requiring that all guests sign a waiver plus there are many signs posted reminding guests about social distancing and wearing masks themselves.r
r
Booger Jim’s is the labor of scary love of just one guy. The owner not only dreams up and designs the scares but builds everything himself! With the recent acquisition of the Doll House and the crazy creativity in the other house and trail, Booger Jim’s proves it doesn’t take a big budget to put on a great show! r
r
We love that the neighborhood is so supportive of the haunt, but it’s easy to see why. Booger Jim’s has a lot of younger actors who are encouraged to keep their grades up so they can act in the haunt each year. So, make sure to show your support too and head on out to live the legend of Booger Jim at Booger Jim’s Hollow!!!',
  NULL,
  3.5,
  'http://www.boogerjims.com/',
  'https://www.facebook.com/boogerjimshollow/',
  'http://twitter.com/boogerjimhollow',
  'http://www.instagram.com/boogerjimshollow/',
  'http://www.youtube.com/channel/UCfhCO4P0ZzQObejbjJ37tnA',
  false,
  '2020-10-24 05:12:39.574997',
  '2022-09-11 08:06:06.874842'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Kreepy Hollow Haunted House 2020',
  '1155 Joe Dority Rd',
  'Bishopville',
  'SC',
  '29010',
  2020,
  'When we arrived at Kreepy Hollow we were so excited to see...',
  'When we arrived at Kreepy Hollow we were so excited to see how packed they were! We’re glad to see people getting out this year and embracing the Halloween season despite the pandemic. COVID-19 protocols were in effect with hand sanitizing stations and they require that all their guests wear a mask especially since social distancing is difficult in the attractions. r
Kreepy Hollow in Bishopville, SC offers 3 very different haunted experiences - a bus ride, a traditional haunted house, and a hayride. r
r
First up was their famous bus ride! You are given a choice between the Masters of Horror or Mystery Bus. The Masters Bus features some of your favorite classic horror movies characters like Freddy Krueger, Jason, and Michael Myers while the Mystery Bus has varying themes using more current horror movie characters. We got a recommendation for the Mystery Bus so Mystery it was! Our theme ended up being The Purge and the ride was CRAZY!!! The actors were climbing all over – not just inside but also outside of the bus - even dropping in from the roof! They did all of this while music blasted, the lights flashed on and off, and the bus driver maneuvered like a maniac along the narrow and bumpy dirt road.r
r
This super fun and wild ride dropped us off in a graveyard which we walked through up to the haunted house. The house was a multi-level attraction featuring no cohesive storyline, but lots of various creepy scenes. The sets were nicely balanced between actors and pneumatic props but not super detailed with the exception of one. Kreepy Hollow haunted house had a full-on, 2-story outdoor scene complete with rain pouring from the ceiling onto an old cabin in the woods. SUPERRRRR DOPE!!! r
r
After the haunted house, Kreepy Hollow had a perfectly placed concession truck. You could grab some snacks and a drink to take on the hayride or just hang out to decompress after the first 2 attractions. Those funnel cakes smelled delicious and must have been because that line was longggggg as hell.r
r
The hayride was a real hayride… like with actual hay… not just seats on a tractor. This added some great fall flavor! It was a 2-mile trail through the woods with 7 differently themed stops spread out along the way… reallyyyyy spread out. We had a chance to really enjoy the fall weather as we rode through the dark woods between each stop, but about halfway through we would have preferred a little less dead space. The hayride sets were enormous structures, some were on both sides of the trail and some were fully enclosed. Each scene was like its own mini-movie! Themes ranged everywhere from witch executions to a carnival freak show. They were all super detailed, music pumped through hidden speakers, there were chainsaws galore, and even pyrotechnics! Multiple actors in each scene jumped on and off the trailer interacting with each haunt-goer.r
r
The house seemed to be geared towards animatronics and pneumatic props while the hayride spotlighted the actors. There was also a similar disparity in costuming between the house and hayride. In the house, characters were simpler with no one really standing out while the costuming and characters for the hayride were much more elaborate. Having well-defined and detailed costumes is what makes a scene feel more real.r
r
One thing that surprised us, and that we have to mention, is how diverse the crowd was at Kreepy Hollow. To be completely frank, this was the most black people we’ve ever seen at a haunted attraction. PERIOD. And we LOVED IT!!! r
r
Multi-attraction/scream parks are always a great time and Kreepy Hollow is no exception, so of course, we would totally recommend you check them out! Pull on your favorite fall hoodie and grab your friends and family to enjoy a full night of Halloween fun… eat some funnel cake for us! r
',
  NULL,
  4,
  'https://www.kreepyhollowhauntedattraction.com/',
  'https://www.facebook.com/kreepy.hollow/',
  NULL,
  'https://www.instagram.com/kreepyhollowofficial/',
  'https://www.youtube.com/channel/UCtdzEsEt76p-4s92bnmJe5A',
  false,
  '2020-10-23 03:13:54.394349',
  '2022-09-11 08:12:50.247235'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Madworld Haunted Attraction 2020',
  '147 Country Manor Rd.',
  'Piedmont',
  'SC',
  '29673',
  2020,
  'It’s been a few years since we last visited Madworld and they have definitely...',
  'It’s been a few years since we last visited Madworld and they have definitely grown in size and vision! What we love the most about them is the moment you step through their entrance they have such a DOPE spooky season vibe!!! The whole attraction is centered around an amazing midway where there’s food, a picnic pavilion, two escape rooms, a gift shop, live music/DJ, carnival games, and face painting. You can watch a scary movie playing on the big screen while relaxing by the bonfire but watch out for the creepy characters roaming around looking for their next victim. Madworld has some of the most original and iconic queue/grounds characters we’ve ever met, and they are always available for some epic photo ops! Everything about the atmosphere of Madworld invites you to sit down and stay awhile, but… no rest for the wicked! We had at least one more haunt we still wanted to hit the night we visited.r
r
The queue line starts outside but then led us into Hotel Hell where we roamed the dilapidated hallways until we ran into the innkeeper. Creepy, but seemed nice enough. He warned us that once we stepped foot on the surrounding grounds, anything goes. After a death-defying ride on their Hellivator (when’s the last time that thing went through a safety inspection?!), we stepped out into Madworld… and it is exactly that! A crazy, mad place where you never know where in the world you’re going to end up next. Indoor themes varied from blood-soaked kitchens to Exorcist-esque bedrooms and transitioned to outdoor trails and scenes ranging anywhere and everywhere from hillbilly shacks to pirate ships, and then back again… exploring every terror and phobia you can think of! r
r
The inside sets had received substantial improvements since our last visit adding to the realism and the outside builds had been creatively scaled up to larger than life! All were well-themed and nicely detailed, plus… BONUS POINTS… most areas included appropriate smells! We absolutely LOVE when all of our senses are engaged! Funny thing is though, the scariest room of all didn’t have or need any of these things!!!r
r
Actors also broadly ranged from more dialogue-focused to strictly jump scares, and there were A LOT of them! They kept us entertained and guessing what was next. Most scenes had at least two actors, in fact, there were some rooms that curiously seemed to be full of them, but everyone was appropriately placed, and make-up and costuming meshed well with their location.  While the make-up at Madworld has always been top-notch, costuming just wasn’t hitting as much for us this year. We wish more characters in the main attraction were as elaborate as the ones lurking in the midway, but this is probably a difficult task considering they have over 175 actors available on any given night.r
r
To protect the safety of their guests and actors during the current COVID-19 pandemic, Madworld recommends that their guests wear masks (although it is optional) and practice social distancing. They’ve also set up several hand sanitizing stations throughout the midway and offer masks for sale.r
r
Madworld provides a very inclusive, family environment that is the perfect complement to the fall and Halloween season. In addition to the family-friendly midway and activities, they offer No Scare Medallions so even the smallest of Haunt Junkie Jr’s can enjoy the haunted adventure at Madworld without it being too frightening. All in all, this is a haunt you surely don’t want to miss! Definitely add them to your Halloween checklist, and not just for their haunted attraction! So grab your close friends and family (and a mask if you choose) and head out to Madworld for a fall night full of fun!',
  NULL,
  4,
  'https://madworldattractions.com/',
  'https://www.facebook.com/madworldhaunt/',
  'https://twitter.com/madworldhaunt?lang=en',
  'https://www.instagram.com/madworld_haunted_attraction/',
  'https://www.youtube.com/channel/UCjljnuHCURziANPjiBoXXdg',
  false,
  '2020-10-02 02:37:55.764678',
  '2022-09-11 08:14:08.785873'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Nightmare Dungeon 2020',
  '645 Old Anderson Rd',
  'Greenville',
  'SC',
  '29611',
  2020,
  'We’ve visited Nightmare Dungeon a lot in the past few years because, in addition to a...',
  'We’ve visited Nightmare Dungeon a lot in the past few years because, in addition to a great Halloween season schedule, they also have special haunt events all year long – Valentine’s Day, St. Patrick’s Day, a random all clown event with the Dead City Clowns – yes, please! But this year was different… VERY DIFFERENT! Let’s start at the beginning…r
r
At the ticket trailer, we were asked if we were okay with touching. Given the current situation with the pandemic and all, we figured this question was part of their COVID-19 protocols and covered the incidental touching that could occur in the very tight spaces of Nightmare Dungeon…. but we were wrooong… VEEERRRY WRONG!!! r
r
Not even 10 minutes after being asked this question, we were all handcuffed, Megan was blindfolded with her own damn facemask, picked up, thrown over a clown’s shoulder – SHOUT OUT TO SAVAGE – and spun around until she was so dizzy she couldn’t walk without the help of that same clown! AND THIS IS JUST THE QUEUE LINE; we didn’t even step foot into the cabin yet! r
r
There were a couple of other interesting characters – Duchess Noir and Demon Daddy - we had a lot of fun interacting with as well before the real show started. Though a lot less aggressive, they helped set the creepy mood and intensified our anticipation of the main event.r
r
Our group (we brought another couple with us) was then separated, the girls went in together first, leaving the guys behind handcuffed to each other nuts to butt LOL. The contact didn’t stop in the queue either. The inside of the old cabin that is Nightmare Dungeon is dark, dingy, and full of fog creating this very surreal, other-worldly feel. The ground is uneven, keeping you just a little off-balance, and the impossibly tight corridors twist and turn unexpectedly. You have this constant feeling of confusion and disorientation. The clever use of lighting pulls you into each space leading you right into the scare that you never saw coming. Around every corner, hands were not only reaching out for us through the foggy darkness but in some cases, we were grabbed and pulled into it! We also never knew when someone was going to materialize out of the fog to grab us from behind. All of this contact was entirely new for Nightmare Dungeon and refreshingly terrifying!r
r
One of our favorite things about the Dungeon has always been their classic haunt minimalism. They do not use any animatronics but rely heavily on their actors and the atmosphere set by the architecture of the old cabin. Their set design, characters, and costuming aren’t super elaborate, but everything is well-defined and fits in perfectly within their environment.r
r
We absolutely LOVE full contact haunts and had an insane amount of fun at Nightmare Dungeon but were completely blown away by the fact that they decided to add this element to their attraction in the current environment… bold move, Nightmare Dungeon, bold move… and BRAVO!!! This was easily one of the best haunt experineces we''ve had EVERRRRR!',
  NULL,
  5,
  'https://nightmaredungeon.com/',
  'https://www.facebook.com/nightmaredungeon/',
  'http://twitter.com/nightmardungeon',
  'https://www.instagram.com/nightmaredungeon13/',
  'https://www.youtube.com/c/NightmareDungeonHauntedHouse/featured',
  false,
  '2020-10-01 02:01:22.769475',
  '2022-09-11 08:15:39.502877'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Folklore Haunted House 2016',
  '5389 N Main St.',
  'Acworth',
  'GA',
  '30101',
  2016,
  'Folklore has some awesome people! The actors are super fun, personal...',
  '<p dir="ltr">Folklore has some awesome people! The actors are super fun, personal, and willing to take great pics with you. We arrived late… as usual… so we’re not sure if some of our experience here was due to the fact that it was close to closing time. We were greeted by the Dead City Clowns. Their characters were on point and extra creepy! Who doesn’t love a good scary clown? The main haunt at Folklore was well thought-out with a cohesive theme, but unfortunately, lacking the props, animatronics and/or number of actors to make it truly scary. There were quite a few areas where we said to each other, “Someone or something should have been there.” The same goes for the second house, it just felt incomplete. Both haunts had a lot of “surprise” scares but nothing that really triggered an intimate scare-sperience. Additionally, they had a pretty cool 3D house that they said was not meant to be scary but we think is still worth the walk-through.</p>',
  NULL,
  3,
  'http://www.folklorehauntedhouse.com/',
  'https://www.facebook.com/folklorehauntedhouse',
  'https://twitter.com/folklorehaunt',
  NULL,
  NULL,
  false,
  '2017-09-05 06:58:49.387203',
  '2022-09-11 07:59:39.889641'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Asylum on Pine Knoll 2020',
  '110 Pine Knoll Dr',
  'Easley',
  'SC',
  '29642',
  2020,
  '2020 is Asylum on Pine Knoll’s very first year as a pro haunt, so we were SUPER ...',
  '2020 is Asylum on Pine Knoll’s very first year as a pro haunt, so we were SUPER excited to support them! The day before going we found out the owner was only 17 years old… WTF???!!! This fueled our interest even more, so we definitely had to check them out!r
r
Upon pulling into the field to park, a giant laughing clown head welcomed us at the top of the hill. We entered into his dark, gaping mouth and then down a slide into Asylum’s common area. This space was so chill! There were picnic tables and gas heaters all beautifully lit by string lights and the roaring 20’s big band music that played seemed to compliment everything perfectly. The port-o-potty area was just as clean and well-designed; there was even a hand washing station!r
r
A fire-breather on stilts and a unicycling clown served as a little pre-haunt entertainment. Unfortunately, we didn’t get to experience the fire show due to light rain, but we were informed of his performances that happen multiple times throughout each night. There was also a small shop set-up adjacent to the picnic area providing snacks and merchandise.r
r
We walked up to the haunted façade past the drunk clown laying on the ground and, after sharing a drink, went in! Asylum on Pine Knoll is a classically built 4x8 panel labyrinth with some surprisingly large builds hidden within its walls. In addition to the clown asylum theming with midway areas and padded rooms, there was a shack in the bayou, an area of complete darkness, and then a 3D blacklight maze. There aren’t any animatronics, but they do utilize some cool lighting and fog effects. Our favorite was the 3D/blacklight section. The artwork was amazing! You were given 3D glasses, but the images were just more blacklight reactive than 3D but still cool, nonetheless.r
r
There were some interesting characters along the way like the voodoo witch, the demented doctor, and the pig face guy… we think he wanted to eat us! Despite the really narrow corridors (which were awesome!), there were still plenty of places for actors to hide offering up some well-timed jump scares. r
r
A lot of passion and vision went into the construction of this haunt and while it is definitely still a work in progress, we can see where it’s going and at this rate Asylum on Pine Knoll could be the dopest haunt in America before the owner is 30. Pretty much all of the actors and staff were high school age, so it was really cool to see this next generation of haunters. We are just so damn proud to welcome this young haunter and his whole crew into the game. Rumble, young man, rumble…r
r
We would love to see them continue to elaborate and expound on their clown-overrun asylum theme and enclose some of those corridors to create an even tighter feel. We are definitely looking forward to watching them grow!r
r
Everyone needs to go check out the Asylum on Pine Knoll, so you’ll be able to say sometime in the future, “I remember when…” ',
  NULL,
  3,
  'https://www.asylumonpineknolldr.com',
  'https://www.facebook.com/AsylumOnPineKnollDr/',
  NULL,
  'https://www.instagram.com/asylumonpineknolldr/',
  'https://www.youtube.com/channel/UC96qJhyNNC1BOwuF4tWLSEw',
  false,
  '2020-10-21 02:39:00.924271',
  '2022-09-11 08:03:32.238638'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Dark Castle Haunted Attraction 2020',
  '2076 Hwy Church Rd',
  'Elgin',
  'SC',
  '29045',
  2020,
  'Dark Castle was refreshingly different from...',
  'Dark Castle was refreshingly different from all of the other haunts we visited on our 2020 South Carolina haunt tour. They offer 3 very distinctive attractions – a haunted trail, haunted house, and zombie laser shoot. Each attraction is a theatrical experience with every scene its own performance.r
r
Sadly, Dark Castle was personally affected by the pandemic, losing one of their actors to COVID-19 back in July, so safety protocols were in full effect. The tickets are sold for time slots to help with social distancing and provide each group with a fun and safe experience. They also had multiple hand sanitizing stations and even creatively incorporated the use of sanitizer into the show. There were several Halloween-themed vignettes set up in their common area that their witchy crew spent many hours carefully crafting. There was one that held very special meaning made in honor of the actor’s memory and others the team has lost. r
r
The first attraction we tackled was the Terror Trail, which was a guided journey throughout the woods. Usually, we are not fans of guided haunted attractions, but these guides totally made each scene! We had 3 different guides along our journey to the “other side.” Sets varied in detail from a few props set up along the trail to fully enclosed, immersive structures. Every stop along the way was a short play. We would definitely categorize this haunt as PG-13 with an abundance of adult humor and themes like cannibal, cannabis strippers and a guide named Ass Clown. He was HILARIOUS! While the themes were horror-related (including a surprising IT cameo), the scenes themselves were not very scary for us; entertaining – absolutely! scary – not so much. r
r
After the trail, we hit their haunted house Dungeon of Darkness. This haunt explores the unusual basement space under a mortuary and was just as theatrical as the trail. The scenes here were much more detailed and designed to incorporate at least one large animatronic or pneumatic prop, and then the performance of the actor(s) in that room led up to the triggering of the prop for the scare. Jump scares abounded throughout this attraction!r
r
Dark Castle also offers a 3rd attraction called Zombie Zone. This laser shoot used to be a paintball adventure that they converted due to Covid. Unfortunately, due to time constraints we didn’t have the pleasure to experience this attraction, but the laser shoots we have done in the past have all been SUPER FUN, so we expect this one was nothing less.r
r
The actors at Dark Castle are all professional thespians turned haunters and it was AMAZING!!! This was such a nice change from the screaming teenagers we experience all too often. Even though each actor had their planned performance, they were still able to roll with the punches and appropriately respond to and interact with crowd involvement. They were creepy, engaging, and offered the perfect amount of brevity keeping you off guard for those unexpected scares their performances built up to.  r
r
The absolute best and most unique feature at this haunt was their RIP Experience. As a part of the Experience, guests receive their choice of a Halloween/haunt-themed face mask and gain entry into a comfortable VIP-style room packed with snacks and drinks, but the first thing we noticed was the monitor on the wall with 4 colored buttons surrounding it, 2 on each side. Hmmmm… Interesting… Hidden cameras have been set up inside the haunt with the 4 locations displayed on the monitor. Those 4 colored buttons connect to actual props in the haunt! We were able to set off these props with a simple push of the button! It was insanely fun to sit back there timing scares and seeing the reactions! The RIP Experience also includes the option to put on a costume and become a part of the show too. We didn’t have time do it but were intrigued by the idea of it! How original!!!r
r
Even though this haunt is not your traditional haunted house; it is still an INSANELY great time! So, if you’re looking for something a little different this Halloween season, we’d definitely recommend that you catch the show at Dark Castle!r
',
  NULL,
  4,
  'http://www.darkcastlesc.com/',
  'https://www.facebook.com/DarkCastleSC/',
  'https://twitter.com/darkcastlesc',
  'https://www.instagram.com/darkcastlesc',
  NULL,
  false,
  '2020-10-24 19:44:08.959377',
  '2022-09-11 08:11:38.35562'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Containment Haunted House 2017',
  '1320 Blairs Bridge Rd',
  'Lithia Springs',
  'GA',
  '30122',
  2017,
  'This was our 2nd year in a row visiting Containment and we have to say… ',
  '<p>This was our 2nd year in a row visiting Containment and we have to say… they rocked it again!!!</p><p>Based on the haunts we''ve visited so far this year, including more theatrical and immersive elements seems to be the trend; however, Containment is still the only one to do it well.&nbsp;</p><p>They have such an original concept of focusing almost completely on their actors. The majority of characters deliver scripted (and unscripted) mono- and dialogues. The actors really carry this haunt experience... and that is truly what it is, an experience! We cannot say enough about the talent here. When we learned that there were a few that are in popular TV shows it was easy to see why! Certain characters completely grabbed us and drew us in. Welcoming us into their world. As with any haunt, you can feel the empty space of a missing actor but with this style of haunt, that feeling is intensified.&nbsp;</p><p>Containment’s sets are nothing short of stellar! They have this uncanny ability to make everyday objects disturbingly eerie. This haunt is packaged in container trailers but you could never tell from the inside. The sets progressed like a horror novel. The story continues to build, introduce characters and stories, and gets increasingly scarier as you travel down their rabbit hole. They do a great job of mixing it up to keep it interesting, unexpected, and a good pace. There were a few scenes from last year that we were sad did not make this year’s cut.</p><p>While we love their unique style and storylines, there are definitely times when we felt the dialogue went on a little longer than necessary, especially in the intro. Knowing a backstory is great, it really helps you connect with the haunt and characters, but let your scenes tell the rest.&nbsp;</p><p>Unforgettable, quirky characters and creative sets make Containment so special. They prove there is no need for imaginary monsters or other-worldly set designs; there are plenty of monsters and horrors lurking beneath the seemingly mundane surface of our own world.</p><p>We are super excited that they have found a permanent home so they can spend even more time further developing their sets. We absolutely cannot wait to see where they will take us next year!!</p>',
  NULL,
  4,
  'https://www.containmenthauntedhouse.com/',
  'https://www.facebook.com/containmenthiram/',
  'https://twitter.com/containmentatl?lang=en',
  'https://www.instagram.com/containment_hauntedhouse/',
  NULL,
  false,
  '2017-09-29 05:02:58.09383',
  '2022-09-11 08:15:05.454815'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Stutman Hollow 2020',
  '213 Stutman Rd',
  'Leesville',
  'SC',
  '29070',
  2020,
  'Stutman Hollow was an unexpected addition to our ...',
  'Stutman Hollow was an unexpected addition to our 2020 South Carolina Haunt Tour. We found them on a whim after seeing the line at Deceased Farm just to purchase tickets was STUPPPIIIDDDD! They are located in Leesville, SC just outside of Lexington.r
r
When we arrived at Stutman Hollow we were surprised to see that this haunted attraction was set up right next to their family home! There’s a very large wooden façade entrance shrouded in fog and heavy metal music echoed through the trees. Upon walking through the entrance fog, we were surprisingly greeted by a festively fall common area! The space was deceptively larger than it appeared from outside. It glowed with string lights and featured a roaring bonfire, nice photo op area, and even port-o-potties! And thank goodness because Megan had to go!r
r
Stutman Hollow’s line starts in a clearing in the woods with spooky green lights dancing through the tree leaves overhead. When it was our turn, we entered through the wooden door into what felt like a narrow mine shaft that led us out to a trail in the woods. Stutman Hollow utilizes lots of pallets in their construction, and while they do not have any animatronics or pneumatic props out there, they do have some very creative lighting, fog effects, and large structures along the trail.r
r
As we walked through the woods, there was no real defined storyline, and we encountered all kinds of different monsters and characters along the way. The costuming and make-up were not super elaborate but more detailed than what one would expect from a haunt only in their 2nd year. There was blacklight reactive clown make-up, some super cool masks like creepy scarecrow creatures, and even a full werewolf. r
r
It’s definitely a family affair at Stutman Hollow with aunts and uncles, nieces and nephews all getting in on the haunt acting business. Being that there are a lot of kids, they are still learning the tricks of the haunting trade, but there were two clown girls in the blacklight pallet maze who were REALLY FUN!r
r
Stutman Hollow is starting to check all the boxes to be a very legit pro haunt: Cozy common area - check, cool queue line – check, blacklight area – check, scary chainsaw guys – check. We’d love to see them continue to grow and develop more detailed sets along their trail and hide some more actors out there in the woods. But until then it’s still a great little haunt to check out for family fun! r
',
  NULL,
  2.5,
  'http://stutman-hollow.business.site/',
  'https://www.facebook.com/pages/category/Haunted-House/Stutman-Hollow-358337228358094/',
  NULL,
  'https://www.instagram.com/stutman_hollow/',
  'https://www.youtube.com/channel/UCsbJ72n466ZvJE8aj-HaWrA',
  false,
  '2020-10-25 01:40:20.872744',
  '2022-09-11 08:21:45.092661'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Sweet Dreams Scare House 2020',
  '250 Saco Lowell Rd',
  'Easley',
  'SC ',
  '29640',
  2020,
  'We’ve experienced so called R-rated haunts and a few full contact haunts before, but...',
  'We’ve experienced so-called R-rated haunts and a few full-contact haunts before, but Sweet Dreams Scare House takes both of these elements to another level entirely! They are aggressive, they’re rude, they are vulgar, they are HARDCORE, they’re… AMAZING!!! We’ve said this before and we’ll say it again, “Haunted attractions like this are NOT for everyone!” No worries though, because Sweet Dreams has you covered by offering a no-touch, not R-rated version of their show… but what’s the fun in that?! r
r
Before entering the main attraction, we put on our glow necklaces to let the actors know it was on like Donkey Kong and started walking through their cool carnival midway. It was full of some of the craziest clown characters we’ve ever met. Never trust a clown… one stole Vilonte’s phone and recorded her own little video… but we highly recommend playing with them for a little while. You can try the casket challenge like Megan, if you dare…r
r
After playtime with the clowns in the midway, we really had no idea what to expect from the rest of the experience. Boy, were we in for the complete opposite of Sweet Dreams… we were in for a rude awakening! They wasted no time! Vilonte is a big guy and they went right for him, gripping him up by the front of his shirt and slamming him against the wall. Megan was grabbed by a handful of hair and thrown onto the bed and this was all just in the first room!r
r
In keeping with the Sweet Dreams name, most scenes were either bedroom themed or nightmarish. Every set was detailed to a T and each one brought a different type of scare; most were IN YOUR FACE interactive but there were also actors cleverly camouflaged for a perfectly timed jump scare. The sets transitioned from indoors to out in a way that totally flowed and made sense, keeping us immersed and on high alert for the next attack. Yes, attack… that is the most appropriate way to describe this. We weren’t being scared but attacked! Although, we did get a break from the assault to play some carnival games and compete in a twerk battle. Guess who won?r
r
We encountered some of the most terrifyingly different characters EVERRR, just waiting to strike the moment we stepped into their scene. They were physically and verbally abusive making our fear very real. Megan may have peed on herself a little. We definitely feel like every actor we combatted gave us 110%! Special shout out to Dollface! Vilonte already gave him his kudos by slapping his ass during an uncomfortable lap dance.r
r
Obviously, there was not 6 feet between us and the actors but we did wear masks, even if the majority of actors did not. Sweet Dreams'' COVID-19 safety protocols include the option for no touching and they do have hand sanitizing stations in the midway.r
r
Sweet Dreams Scare House is, by far, the most aggressive, most R-rated haunt we’ve ever visited, and we ABSOLUTELY LOVED IT! We’d be interested to know what their other show is like, but someone will just have to let us know because we’d never want to experience it any other way than the way we did. What an epic, freaking scary haunt!!!',
  NULL,
  5,
  'https://www.sweetdreamsscarehouse.com/',
  'https://www.facebook.com/sweetdreamsscarehouse/',
  'https://twitter.com/sweetdreams250?lang=en',
  'https://www.instagram.com/sweetdreams_scarehouse/',
  'https://www.youtube.com/channel/UCZ_ZMZeDM9w8YpuLkYMaWJA',
  false,
  '2020-10-18 00:40:09.41217',
  '2022-09-11 08:46:29.211171'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Fear Farm Haunted House 2020',
  '424 Ninety-Nine Island Rd.',
  'Blacksburg',
  'SC',
  '29702',
  2020,
  'Our boy, Stitches, with Dead City Collective (give them a follow if you don’t already!), recommended that...',
  'Our boy, Stitches, with Dead City Collective (give them a follow if you don’t already!), recommended that we check out The Fear Farm in Blacksburg, SC on our 2020 haunt tour, so of course, we did. His recommendation did not disappoint! Maaannn… it was DOPEEE!!!r
r
It was the perfect night for haunting; the temperature was just right and there was no rain in sight despite the reports of hurricane Delta on its way in from the gulf. We parked and headed towards the entrance, where they had their COVID-19 protocols posted. Masks are recommended but not required at Fear Farm.r
r
They have a gift shop that offered a variety of Fear Farm merchandise before we went down the trail to the main midway area. Various characters roamed the midway among the ticket booth, photo ops, and picnic tables. They have multiple food and snack locations selling snow cones, cotton candy, and some wheat yummy things that tasted kinda like pork rinds. The Fear Farm midway also featured their recently added putt putt course and escape room. This place has it all and that’s before even mentioning the 4 distinctly separate haunted attractions! r
r
The first attraction which had been updated for the 2020 season is called The Abyss, and that’s exactly what it is! This haunt is a completely silent, pitch-black labyrinth and is such an uncomfortably, unnerving experience! We were forced to navigate our way through the darkness along super narrow corridors, unexpected floor level changes, and seemingly dead ends. As we felt our way along the walls there were times when we would touch something furry, small and smooth things, or even got a shock! This was one of the longest pitch-black haunts we’ve done, and that fear of the unknown is always extremely unsettling plus the occasional scare actor coming out of nowhere was really intense!r
r
The fresh air and open sky above us were very welcoming after the sensory deprivation in The Abyss as we ended up in the queue line for the next attraction Mineshaft Mayhem. A bunch of crazed hillbillies had overrun this mineshaft. The sets here were incredible and featured elements like water towers, a hellivator, and so much more! The shafts offered many opportunities for jump scares and a fun adventure. This was by far the most fun that we’ve ever had in a mineshaft!r
r
The 3rd attraction was Experiment 13 which was brand new for the 2020 season. Experiment 13 was about the mind’s reaction to fear. What are you afraid of? Whatever it is, we can guarantee it was in Experiment 13. Pretty much every phobia was explored here. There was a great mix of animatronics and actors with no room feeling empty or overwhelming. r
r
The fourth and final haunt was the Farm House. We were introduced to The Fagan family who was an unfortunate family cursed with disfigurement which was only getting worse due to the inbreeding taking place. We entered their home through the fireplace even after being warned by WC that we should not. Like the previous attraction, the Farm House had a really fine-tuned combination of actors and props. The Fagan family liked to play tricks and kept us wondering what was next.r
r
The transitions between the haunts offered a break from the previous and introduced the upcoming attraction, and these queue lines were just as detailed as the haunt sets themselves! Costuming and make-up within each attraction worked well and blended with its respective theming. r
r
What we really loved about the Fear Farm was that each haunt was its own singular experience! The Fear Farm can be a one-stop-shop for a night of Halloween fun. Offering up multiple haunted attractions along with mini golf, the escape room, and carnival games. It is a complete haunted experience and we would completely recommend that you check them out! ',
  NULL,
  4.5,
  'http://www.scfearfarm.com/',
  'https://www.facebook.com/scfearfarm/',
  'https://twitter.com/SCFearFarm',
  'https://www.instagram.com/scfearfarm/',
  'https://www.youtube.com/user/mttd1',
  false,
  '2020-10-31 19:53:34.428392',
  '2022-09-11 08:47:46.1654'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Scream Acres Haunted House and Hayride 2020',
  '1137 Old, Camden Rd',
  'Bishopville',
  'SC',
  '29010',
  2020,
  'The last haunt of our 2020 haunt tour was Scream Acres in Bishopville, SC. They have been...',
  'The last haunt of our 2020 haunt tour was Scream Acres in Bishopville, SC. They have been delivering scares for over 30 years!r
r
When arriving at Scream Acres, you’re welcomed by a spookily decorated entrance and an elaborately built ticket booth that looks like a large shack. Seeing this deceptively small entrance, you have no idea how large Scream Acres actually is, but please believe, there are plenty of acres at Scream Acres! They feature two haunted attractions - a haunted house and a hayride, but the hayride is definitely the star of this show!r
r
Their COVID-19 protocols were similar to other haunts in that masks were recommended but not required, and there was plenty of hand sanitizer available.r
r
First up is the haunted house. This super-detailed but short walk-through features some really cool pneumatic props and animatronics. There are also a few actors offering up jump scares along the way. Costuming ranged from fully done to nothing at all. Seriously… there was a young girl sitting on top of a refrigerator in just her regular clothes. That was really disappointing because the scene she was in plus the rest of the house were really well done, but the acting and costuming here just…...weren’t.r
r
After exiting the house there is a short, decorated display that leads to a large pavilion. Body bags hang from the rafters dangling above the picnic tables. There are port-o-potties complete with a handwashing station, a really nice photo op area, and a food truck serving up some yummy goodies along with a lemonade stand. This is a great space to hang out and chill in between attractions and also houses the waiting line for the hayride.   r
r
We were super excited when our trailer arrived, and we headed into the woods. We have to say, these were legit the scariest woods we’ve ever been in! We’re not sure if this was due to the eerie consistency in the shape, spacing, and height of the trees or if it was the overwhelming darkness caused by the density… maybe a little bit of both. The sets along the ride were extremely detailed and HUGE!!! Each set was dark and mysterious until the trailer was in the perfect place then... lights, camera, action! The whole scene lit up, strobe lights and pyrotechnics were triggered, and music flooded the woods! They had some very interesting yet completely fitting music selections, definitely not the usual or expected. There were multiple actors per scene, and they had some really noteworthy props, including a live snake in the freak show. There was one lady on our ride who was completely freaking out!!! Each set offered up more of the same detail while actors jumped on and off the trailer, and there were so many chainsaws… SO MANY!!!r
r
The hayride at Scream Acres featured something we’ve never experienced before – an attraction within an attraction! The hayride dropped us off in, what felt like, the middle of nowhere. We went down a short, haunted trail that led us into a mineshaft out through a school bus (WTF?!) then into yet another haunted attraction. This one was a summer camp cabin in the woods. We were told of the tragedy that befell these campers, but that didn’t stop us from venturing further. r
r
This was the first year they had added the cabin and while the sets were really detailed, in fact more detailed than some areas of the house, the atmosphere just didn’t quite live up to the story that was told. We’re sure they’ll continue to build on this; it’s such an awesome concept!   r
r
After our stop at the cabin, we got back on the hayride and continued along our path through the woods. This was by far the longest hayride we’ve ever been on, even without the haunt pit stop. All night we had been trying to outrun the rains that hurricane Delta brought into South Carolina, but they finally caught up with us! Luckily, not until towards the end of our ride!r
r
Their COVID-19 protocols were similar to other haunts in that masks were recommended but not required, and there was plenty of hand sanitizer available in addition to the hand washing station in the pavilion.r
r
Overall, we had an awesome time at Scream Acres! We’re so stoked to see that even after 30 years in business they didn’t just become complacent and are still adding to and improving their attraction! Like we said before, there are A LOT of acres at Scream Acres, so they definitely have the room to grow and add even more screams! You absolutely have to check out this South Carolina OG haunt! ',
  NULL,
  4,
  'http://screamacreshauntedhouse.com/',
  'https://www.facebook.com/ScreamAcresPark/',
  NULL,
  'https://www.instagram.com/screamacres_official/',
  NULL,
  false,
  '2020-10-31 23:39:46.840165',
  '2022-09-17 05:23:49.296343'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Halls of Havoc 2015',
  '7536 Knoxville Rd.',
  'Lizella',
  'GA',
  '31052',
  2015,
  'We have visited Halls of Havoc. Unfortunately, we do not recall enough specific...',
  '<p>** This haunt is permanently closed **</p><p>We have visited Halls of Havoc. Unfortunately, we do not recall enough specific detail to write a full review. We do remember our overall experience and have rated it.</p>',
  NULL,
  3,
  'https://hallsofhavoc.com',
  NULL,
  NULL,
  NULL,
  NULL,
  false,
  '2017-09-24 02:48:40.965577',
  '2022-09-11 07:56:08.80803'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Containment Haunted House 2016',
  '1320 Blairs Bridge Rd',
  'Lithia Springs',
  'GA',
  '30122',
  2016,
  'Containment Haunted House was different than most haunts. Utilizing elements of...',
  '<p dir="ltr">Containment Haunted House was different than most haunts. Utilizing elements of theater, we were brought closer to the characters as we became immersed in the story instead of just walking through a bunch of dope sets with creepy themes. This haunt was creatively constructed using container trailers merged together. From the outward appearances you expect to feel cramped in some industrial-feeling rooms, but, what you get are these crazy-elaborate, realistic post-apocalyptic scenes. Like a super detailed dining room, a seriously disgusting kitchen, and a padded cell. The actors totally made this haunt what it was! They were so gifted and convincing that when they delivered these full-on dialogues (that were sometimes too drawn-out) they pulled us into every scene... until we got to a scene where the complete absence of dialogue was so creepy and eerily uncomfortable that we just wanted to get out. The costumes and makeup fit perfectly with the scene where there were no really being that We don’t want to give away too much but we will never turn our backs on dolls again. Containment really made us feel like a part of the experience and with such originality, we are excited to see what they come up with next year.</p>',
  NULL,
  4,
  'https://www.containmenthauntedhouse.com/',
  'https://www.facebook.com/containmenthiram/',
  'https://twitter.com/containmentatl?lang=en',
  'https://www.instagram.com/containment_hauntedhouse/',
  NULL,
  false,
  '2017-09-05 07:07:52.732467',
  '2022-09-11 08:00:36.920624'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Haunted Montrose 2016',
  '1728 2nd St',
  'Montrose',
  'GA',
  '31065',
  2016,
  'We were SOOOO STOKED to hit Haunted Montrose again. Last year was so...',
  '<p dir="ltr">We were SOOOO STOKED to hit Haunted Montrose again. Last year was so epic that we expected even more from them this year. As we pulled up, we were like, “Hey, where’s the fire?” As we got closer it was like, “Hey, where’s the whole damn Slaughterhouse??”</p><p dir="ltr">What seemed to be a “say it ain’t so” moment was actually...so. They had torn down the Slaughterhouse building to renovate for next year. That was pretty sad, but the other houses were open so we were satisfied, or at least we thought we would be. &nbsp;In what seemed rare form for them, two of the three haunts (ExperiMental and Havoc 3D) were mediocre at best. Especially compared to the terrors that lurked behind the cleavers at the Old Slaughterhouse in the year prior. Missing actors were an issue along with the same theme and sets. Even the weird tune from Havoc 3D was recognizable! The Raven was fun, as usual, but since there were little to no changes it wasn’t as scary as before.</p><p dir="ltr">We hope next year, their 10 year anniversary, they bring it!</p>',
  NULL,
  3,
  'http://hauntedmontrose.com/',
  'https://www.facebook.com/HauntedMontrose/',
  'https://twitter.com/hauntedmontrose?lang=en',
  'https://www.instagram.com/hauntedmontrose/?hl=en',
  NULL,
  false,
  '2017-09-05 07:06:09.809716',
  '2022-09-11 08:01:05.515646'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Davisboro Haunted Manor 2017',
  '211 N Main St',
  'Davisboro',
  'GA',
  '31018',
  2017,
  'Davisboro Haunted Manor is one of the...',
  '<p>Davisboro Haunted Manor is one of the BEST HAUNTS WE''VE EVER BEEN TO!!! If we could give them a 6 we would!<br><br>This was a hard review to write because words cannot adequately express how incredibly intense this haunt was.<br><br>Inside it''s dark, confined, and smothering, so every scare happened in our face, uncomfortably close with no space to move away. These are not just your typical, every haunt kind of scares, we are talking non-stop high intensity scares that engaged all our senses at every turn! The execution was impeccable. From the actors, the pace, the set design, the timing and placement of animatronics, everything was just horrific perfection. This was probably the best use of animatronics we''ve ever experienced!<br><br>Then to top it all off... they had the audacity to give chainsaws to clowns and the result was ABSOLUTELY TERRIFYING!!!<br><br>When we reached the end we were literally out of breath and we were actually relieved to get out of there. There are images carved in our memories that will haunt us forever courtesy of the Haunted Manor.<br><br>THIS HAUNT IS A NON-NEGOTIABLE MUST SEE. Seriously...GO...NOW!!!</p>',
  NULL,
  5,
  'http://hauntedmanorofdavisboro.com/',
  'https://www.facebook.com/HauntedManorOfDavisboro/',
  'https://twitter.com/hauntedmanor211',
  NULL,
  NULL,
  false,
  '2017-09-29 05:11:13.046373',
  '2022-09-11 08:14:40.973776'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Fear The Woods 2018',
  '3565 GA-155 N',
  'Stockbridge',
  'GA',
  '30281',
  2018,
  'October was unseasonably wet in GA last year and every...',
  '<p>October was unseasonably wet in GA last year and every time we planned a trip to this haunt the weather just did not cooperate. Fear the Woods was one of our favorite GA haunts in 2016, so since we missed them last year it was probably our most anticipated haunt of 2018…and they did not let us down! Our favorite thing about Fear the Woods is the variety of their attractions - indoor house, outdoor trail, plus a zombie shoot. They also have a fun little midway with games, concessions, and live entertainment. Fear the Woods is a full haunted experience. There is just a really good vibe out there.</p><p>Fear the Woods has a super well-rounded acting crew. If they were a sports team they would have one of the best benches in the game. There aren’t any that totally stand out because they are all so awesome, but Megan especially enjoyed the girl who was running the brain bash midway game. These are not your typical teenage haunt actors that just scream in your face, completely miss cues, mess up timing, or fall out of character. These are professionals with really well-developed personas and are incredibly fun to interact with.</p><p>The flow and pace from one attraction into the next is perfect- starting in the house, enjoying the midway games and entertainment on the way to Pandemic, then taking the Terror Transport to the haunted trail. The house features a variety of well-done themes that transition well into one another. The midway is the perfect place to decompress after the haunt. There are a couple fun games, a small concession stand, and live entertainment which was a duo called the Circus Bitties. Not only are these girls playing with fire they can breathe it too! Test your zombie-apocalypse survival skills at Pandemic. Then take a quick ride on the Terror Transport deep into the Yule Forest to the haunted trail for more scares.</p><p>Fear the Woods is the only haunt we have ever experienced that has successfully executed a zombie shoot and they are still nailing it! We absolutely love everything about Pandemic! We love it to the extent that none of our kills registered due to technical difficulties…the zombies’ headsets weren’t working… but it didn’t even matter. We still thoroughly enjoyed ourselves. Pandemic is just seriously fun. Gamers will especially enjoy this. The zombies are well hidden and always seem to appear at the perfect moment and are ideally spaced to keep you on your toes and your adrenaline pumping.</p><p>Other than last year we have been going to Fear the Woods every year since 2013. They have great vision and watching them develop their execution over the years has been awesome. We definitely recommend you checking out Fear the Woods in the 2018 haunt season and every season! Because the majority of this haunt is outdoors it will close if the weather is bad so be sure to check their website or social media for information!</p>',
  NULL,
  4,
  'http://fearthewoods.com/',
  'https://www.facebook.com/FearTheWoods/',
  'https://twitter.com/fearthewoods',
  'https://www.instagram.com/fearthewoods/?hl=en',
  NULL,
  false,
  '2018-10-08 03:56:40.506201',
  '2022-09-11 08:17:12.252666'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Haunted Hotel KY 2019',
  '3000 S. 4th Street',
  'Louisville',
  'KY',
  '40208',
  2019,
  'This was not our first reservation at the Haunted Hotel. We visited this haunt about 4 years ago...',
  'This was not our first reservation at the Haunted Hotel. We visited this haunt about 4 years ago and had so much fun we went through two more times! Luckily they weren’t as busy then as they were this time. We “checked in” fairly early and both the general admission and fast pass lines were already PACKED!!! Surprisingly enough, many of the people in line that we talked to had never been there and really had no idea what they were getting themselves into. Ruh, roh Shaggy!!! r
r
The Haunted Hotel was the first “touching” haunt that both of us had ever experienced… and we were hooked!!! The Haunted Hotel is an extreme, R-rated, full contact haunt so it’s definitely not for everyone, but for the true Haunt Junkie this place is a MUST! You’re not just going to have your hair sniffed and your face stroked… this place BRINGS IT! We’re talking hair pulling, choke holds, slammed against walls, ankle-grabbing scary fun! And if you’re too big to throw around they’ll tickle ya, and according to Vilonte, he’s not sure which is more disturbing. This haunt was definitely the highlight of our Kentucky haunt tour!!!r
r
Their location itself is so killer because you could totally believe that there’s a little bed and breakfast or boutique hotel located on this busy corner of downtown Louisville. What you wouldn’t believe is how much punch this little place packs!r
r
To kick things off, we were snatched up and thrown against the wall of the lobby to be read the rules of the hotel. After the rules, which are basically that you are about to be made their bitch and don’t be a punk about it, we are led to one of our ALL-TIME FAVORITE HAUNT SCENES, the infamous Haunted Hotel elevator! Although we liked our first experience more than this recent one, there are many haunts that have elevators but no one does it like the Haunted Hotel does it!r
r
Sets cohesively flowed carrying the nightmarish hotel theme throughout. From the lobby entrance and elevator to the grimy basement, then upstairs through various hotel rooms where all acts of depravity occurred, and then outside to exit through the sewer. The sights, the sounds, the smells… everything was as it should be with every scene looking, feeling, and smelling exactly as you would expect it to. Not knowing when, if, or who you were going to be grabbed by made moving from room to room an extremely harrowing experience! The anticipation...r
r
The costumes, make-up, and masks used are perfectly petrifying for the finely-tuned characters here. They are even made in-house by their very own mask and prop company Sinister fx! The actors are freaking sadist psychopaths (we say this in the best way possible!) and are more than ready, willing, able, and excited to jack you up as needed. They even tried their hand at a more theatrical approach in one room with an impromptu game of poker, but he was a cheater. With so many people coming through with no idea what to expect we can only imagine the abuse these guys have to deal with on the regular, and we’re sure they take it all in stride. You really have to love what you do to do this!r
r
We found out from the owner they had experienced a fire in June that scorched the front half of the building on all three floors. They only had around 3 months to rebuild these areas of the haunt and they accomplished it with only the use of generators! The power wasn’t restored until only 3 weeks before opening night! If we hadn’t been told, we wouldn’t have had any clue. All of their rooms still looked dirty and old, like they had been there forever, not fresh and new. This crew didn’t miss a beat.r
r
The Haunted Hotel remains a staple in the Louisville haunted house scene and we hold it close to our hearts. Our only wish for this haunt would be to make it longer and we found out there are plans to expand the outdoor area in the near future. Even if you aren’t in Kentucky you should make the trip to check them out. We are certain you won’t be disappointed!  We’ll be back...who’s coming with us?',
  NULL,
  5,
  'https://www.hauntedhotelky.com',
  'https://www.facebook.com/HauntedHotelKY/',
  'https://twitter.com/hauntedhotelky',
  'https://www.instagram.com/thehauntedhotel/',
  'https://www.youtube.com/watch?v=aCO5FdImDKw',
  false,
  '2019-10-17 02:03:11.838448',
  '2022-09-11 08:31:07.009511'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Buford Corn Maze and Haunted Trail 2016',
  '4470 Bennett Road',
  'Buford',
  'GA',
  '30519',
  2016,
  'The Buford Corn Maze is just good ole fashion family fall fun! There are...',
  '<p dir="ltr">The Buford Corn Maze is just good ole fashion family fall fun! There are TONS of things to do! They have a nice size corn maze and relaxing hayride to fulfill all your fall season tradition needs and also feature a cool little haunt called the Haunted Forest. This is a perfect haunt for first-timers or younger children because the actors will scale their performance up or down based on the reaction they are getting. To add to the family fun, there’s also a little playground, bouncy house, animal viewing, a popcorn pillow, pumpkin patch, and other activities. If you are looking to get your full fall/Halloween fix with the family we definitely recommend this place!</p>',
  NULL,
  4,
  'https://bufordcornmaze.com/',
  'https://www.facebook.com/BufordCornMaze/',
  'https://twitter.com/bufordcornmaze?lang=en',
  'https://www.instagram.com/bufordcornmaze/',
  NULL,
  false,
  '2017-09-05 07:09:04.118449',
  '2022-09-11 08:03:03.23436'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Nightmare Dungeon 2017',
  '645 Old Anderson Rd',
  'Greenville',
  'SC',
  '29611',
  2017,
  'This was our first haunt of the 2017 season and we had...',
  '<p>This was our first haunt of the 2017 season and we had such an awesome time!!! We visited this haunt 3 years ago and had a very different experience. In fact, it was a really bad one! What a difference 3 years makes! Nightmare Dungeon has made some serious upgrades. The old farmhouse has almost doubled in size, transforming into a creepy, abandoned barn. They have mastered the art of misdirection and surprise as well as assembled a cast of very committed actors that make it all work.</p><p>The inside of Nightmare Dungeon felt really raw and gritty... in the best way! It was dark and super fogged out making the space&nbsp;feel distorted and other-worldly. In addition, there were a lot of level changes and places where it was necessary to interact with the set. Like walking upstairs, uneven ground, and oddly-shaped passageways. These elements led to this feeling of being slightly unhinged throughout the entire haunt. Not to mention that we were constantly being bombarded on all sides by maniacs and creepy clowns that seriously got all up in our faces! The costuming and makeup fit the setting to a T. We could not tell you how many actors were in there because they seemed to be everywhere! Following us around, hidden in walls, materializing out of&nbsp;complete&nbsp;darkness... How the hell they found their way around in there is a complete mystery to us!</p><p>The sense of invasion and misdirection continued, as there were times when we thought we were looking at an animatronic, only for it to scream and come after us. Or when we would be expecting the scare but it would come completely out of left field and surprise-scare the hell out of us! Plus, there were chainsaws… REAL ONES! The kind where you can feel the heat and smell the gasoline. This just further enforced how authentic this haunt felt, so real! There were a few times when we were surrounded and trapped, feeling like prey with no hope of escape; it was like starring in our own slasher movie!</p><p>We were the only people going through at the time which may have something to do with the added attention. This was great for us, but it does make us wonder how they will manage to keep this up with a full house of patrons or if the inevitable haunt-crud takes a few actors down, but all in all, these guys were phenomenal!</p><p>To sum things up... Nightmare Dungeon is a back-to-basics, old-school style haunt that has figured out a formula that works and successfully runs it on repeat. The owner has a stellar vision and with all of the over-produced, Hollywood-style haunts out there, Nightmare Dungeon feels fresh and innovative. For those of you that aren''t familiar, it is a MUST see!</p>',
  NULL,
  4.5,
  'http://nightmaredungeon.com/',
  'https://www.facebook.com/likenightmaredungeon/',
  'https://twitter.com/nightmardungeon',
  'https://www.instagram.com/nightmaredungeon13/',
  NULL,
  false,
  '2017-09-23 19:35:17.414749',
  '2022-09-11 08:09:59.853166'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Raven''s Cross Haunted Village 2019',
  '907 Mammoth Cave Rd,',
  'Cave City',
  'KY',
  '42127',
  2019,
  'Raven’s Cross Haunted Village was more than just a haunted house attraction, it was an entire...',
  'Raven’s Cross Haunted Village was more than just a haunted house attraction, it was an entire haunted town plus two escape rooms! This place was eerily mesmerizing from the moment we pulled up. There was a hush over the small town as we walked past the supernaturally quiet graveyard up to the quaint yet foreboding row of village shops, storefronts, and cottages. To hear that this spooky village started as the bright and cheerily painted Huckleberry Hill Village was almost unbelievable! We were also told the headless horseman could usually be seen galloping around the pumpkin and scarecrow-filled streets on his steed; but unfortunately for us, we visited on a rainy night so we didn’t have the opportunity to cross his path. r
r
Raven’s Cross is a theatrical interactive experience that has also managed to successfully incorporate touching, making it a truly rare gem in the haunt world. Visitors have the option to opt out of the touching and are given a glow in the dark necklace. We know touching is not for everyone, but we totally recommend it as it adds that extra scary umph to your adventure! r
r
Set in the 1790s, after the town of Raven’s Cross was ravaged by the Black Plague, the survivors sought refuge in the town of Sleepy Hollow but have only brought the disease, death, and madness with them. Now the townspeople of Sleepy Hollow are all dead, dying, or have been driven mad with fear and bloodlust! After this brief intro we were sent on our way with an ominous “God be with you...” r
r
The back-story and theme are very well-developed. They are successfully carried throughout the haunt with Colonial period-appropriate set design and costuming. The town has this otherworldly yet familiar quality as you travel through its streets, shops, and homes. There are very few animatronics and a limited number of the customary special effects because the scares at Raven’s Cross rely so heavily on their actors…. And with good reason! The actors here are really incredible! Consistently managing the action, there were no scenes that felt like they dragged on for too long; in fact, there were a few characters we encountered that we wish we could have spent more time with! The talent at Raven’s Cross ranges from small children to older adults and all of their crew played a major part in making this haunt such an awesome experience!r
r
This haunt definitely brings the scares but not in the typical psychotic, chainsaw-wielding clowns way.  We suspect this crew knows when to dial it up and dial it down depending on their audience, making it a great family haunt... even for the Haunt Junkie Jrs out there! Despite multiple haunt owners in Kentucky saying that there was a shortage of people wanting to work as actors, Raven’s Cross seemed to have an abundance of actors with scares at every turn!r
r
Raven’s Cross Haunted Village is located on a fairly large piece of land so we expect some growth from them… and we are HERE FOR IT! We would definitely recommend incorporating more scents; you expect rooms filled with rotted corpses and decaying bodies to smell bad. They are already hitting every other sense so add smell to that! Also, please add a cushion at the bottom of the swamp for Vilonte, he pulled a muscle in his gluteus maximus. Hahaha!!!r
r
Interactive/immersive haunts can be really tough to successfully pull off because of the reliance needed on your most unreliable haunt resource, people! But Raven’s Cross is truly a labor of love and family affair with nearly everyone getting involved with the business. We spoke to one of the actors who was the mother of one of the owners. She was wearing a beautiful, hand-painted cape of her own design and turns out she was also the mastermind behind most of the costume design and set decoration. She explained the long days designing the themes and we started to see how meticulous the creators of Raven’s Cross were and you could definitely see it throughout the house!r
r
From the acting, set and costume design, to the service at the ticket booth and gift shop - this was an all-around AMAZING, one-of-a-kind haunt experience! We highly recommend that you go check out Raven’s Cross Haunted Village in Cave City, KY this year!!!',
  NULL,
  4.5,
  'http://ravenscrosshauntedvillage.com/',
  'https://www.facebook.com/MyRavensCross/',
  'https://twitter.com/@myravenscross',
  'https://www.instagram.com/Ravenscrossky/',
  'https://www.youtube.com/channel/UC3mzVKZNJnU_iYghkWhj1Nw',
  false,
  '2019-10-15 01:30:34.670632',
  '2022-09-11 08:21:05.939319'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Hidden Escape (Escape Room) 2019',
  '6867 S Sweetwater Rd',
  'Lithia Springs',
  'GA',
  '30122',
  2019,
  '*Cave of Wonder voice* “Seek ye out the diamond in the roughhh…”',
  '*Cave of Wonder voice* “Seek ye out the diamond in the roughhh…” Well, we have found it! (And just saw the new live-action Aladdin) On the backstreets of Lithia Springs, GA lies The Hidden Escape. While the location does not lend itself to the usual random drive by, it’s definitely worth the trip!r
r
The Hidden Escape features two escape rooms, Orion and Year of the Roommate, with a new, third room currently in the works. Orion is the office of Professor Eisenstein, a renowned astronomer and treasure hunter, who is looking for an apprentice. You are his newest recruit but must pass his test to prove you are worthy to continue his legacy. In Year of the Roommate you are a college freshman who is suspicious of your roommate and have to snoop around your dorm room to figure out what he’s up to.r
r
We decided to take on Professor Eisenstein’s test in the Orion room. Once that door closed, armed with the provided dry erase board, we were immersed in the office of Professor Eisenstein. The theming is so spot-on that it almost felt like an invasion of privacy trying to unlock and dig through desk drawers and read private journals. The quantity, quality, and variety of the puzzles in this room is mind-boggling! Letter- and number-sequence combination locks, hidden compartments, geography and astronomy challenges, and just when you think you are nearing the end of this test, Professor Eisenstein has a little surprise in store.r
r
Thank goodness for our game master! We ended up tackling this room by ourselves, which we do not recommend for anyone else! Due to the number and complexity of the puzzles in this room a divide and conquer methodology is definitely required. The game master skillfully offered clues that never completely gave anything away but got us on the right track and allowed us to continue working through the puzzles ourselves. While we definitely experienced some forehead slapping moments, there were a few puzzles that there was no way we were figuring out without his help.r
r
Do you know what our favorite part was? Unfortunately, because it was just the two of us we weren’t able to escape in time; but the game master allowed us to finish up the few remaining puzzles, so we didn’t feel completely defeated.r
r
Based on our experience with not just the Orion room but the staff at The Hidden Escape we will absolutely be returning to test our skills on Year of the Roommate and are super excited to see what the minds behind Containment Haunted House have in store for the upcoming room.r
r
Grab your friends, co-workers, or just some smart strangers and head to The Hidden Escape in Lithia Springs, GA!',
  NULL,
  4,
  'https://www.thehiddenescape.com/',
  'https://www.facebook.com/thehiddenescapeatlanta/',
  'https://twitter.com/hidden_escape',
  'https://www.instagram.com/thehiddenescapeatlanta/?hl=en',
  NULL,
  false,
  '2019-09-26 06:00:06.245967',
  '2022-09-11 08:30:41.513107'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Nightmare''s Gate Haunted House 2016',
  '4179 Vansant Rd',
  'Douglasville',
  'GA',
  '30135',
  2016,
  'What are your nightmare’s made of? Clowns, spiders, enclosed spaces, darkness, feeling lost… ',
  '<p dir="ltr">What are your nightmare’s made of? Clowns, spiders, enclosed spaces, darkness, feeling lost… Nightmare’s Gate has it all and became one of our new favorites! Their variety of effects and use of those effects were freaking amazing! Strategically placed fog and strobe lights created an extreme sense of disorientation and dislocation, claustrophobia bags that went on a little further than was comfortable, lots of floor level transitions kept us feeling constantly off balance, and texture changes everywhere - floors and walls that felt hard and unforgiving in certain areas and disgustingly squishy in others. There were even places where you had to crawl to get through which really immerses you in the environment. There were a couple of scenes that blew us away, the sewer and the swamp, where not only the set design but the actors in it were out of this world. Pretty much all of the actors, the costumes, and makeup were on point. Super scary monsters of all types and sizes, eerie scenes, and mazes came together to make a really scary haunt. Can’t wait to check them out next year!</p>',
  NULL,
  4,
  'http://nightmaresgate.com/',
  'https://www.facebook.com/nightmaresgatehauntedhouse/',
  'https://twitter.com/nightmaresgate?lang=en',
  'https://www.instagram.com/nightmaresgatehauntedhouse/?hl=en',
  NULL,
  false,
  '2017-09-05 07:11:32.166837',
  '2022-09-11 18:58:00.645768'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Netherworld Haunted House 2016',
  '6624 Dawson Blvd.',
  'Norcross',
  'GA',
  '30093',
  2016,
  'O Netherworld… how we love thee! There is really nothing better than having a...',
  '<p dir="ltr">O Netherworld… how we love thee! There is really nothing better than having a juggernaut in the haunt industry as your hometown haunt. This will be their final season in the current location which they have held down for 20 years! That’s AMAZING!!! &nbsp;Netherworld is, by far, the most elaborate haunted attraction not just in GA but damn near anywhere! From the moment you step foot on their property, you are greeted with fear! Props setup for photo ops, actors galavanting the premises scaring inattentive victims, and giant sized animatronics to keep your attention in between both haunts.<br>If the museum themed line isn’t enough to freak you out, &nbsp;don’t fret, there is sooo much more in store! With EXTREMELY detailed themes, original characters, and a finely tuned balance of live actors and animatronics, they are a must see every single year. Their themes change annually and consistently deliver a scary good time. The addition of a short escape room based on their original characters was genius! Being that we are also “escape room junkies” always down, we were able to escape and got a cool little sticker to show for it! The one thing we worry about with Netherworld is that they are getting lost in their Hollywood-style sets and losing sight of the true essence of the scare. Sometimes you just need to get back to the basics. Hopefully, that will come with the relocation; but as usual, they are one of the best!</p><p dir="ltr">Being that we are true haunt junkies we went back for their Christmas and Valentine’s Day events. Neither of us know what says “Season’s greetings” or “I love you” more than a good scare. Surprisingly, both were like soooooo much better than at Halloween!</p><p dir="ltr">For Christmas, we were put in groups of 6 and given a rope to hold that was led by a guide, Netherspawn! This ugly cloaked creature led the group and maintained the pace of your visit. This was an awesome concept because the Netherspawn knew when to slow us down to maximize the effect of a scare and when we could pass through an area more quickly.</p><p dir="ltr">For Valentine’s Day we were each given a little LED candle to take through. The whole attraction was damn near pitch black so without that little candle you would not have been able to walk through. Because it was so dark, monsters could stand practically in the open but still be undetected. When they scared you they would simultaneously turn on a flashlight they held right under their faces. This was an extremely creepy effect. &nbsp;</p>',
  NULL,
  4,
  'http://fearworld.com',
  'https://www.facebook.com/NetherworldHauntedHouse/',
  'https://twitter.com/hauntedatlanta?lang=en',
  'https://www.instagram.com/netherworldhauntedhouse/?hl=en',
  NULL,
  false,
  '2017-09-06 21:19:02.532648',
  '2022-09-11 08:01:45.457556'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Wicked World Scaregrounds 2019',
  '5817 Tates Creek Road',
  'Nicholasville',
  'KY',
  '40356 ',
  2019,
  'Wicked World Scaregrounds near Lexington, KY features 3 attractions - an indoor haunted house, a laser shoot, and...',
  'Wicked World Scaregrounds near Lexington, KY features 3 attractions - an indoor haunted house, a laser shoot, and an indoor/outdoor haunted trail. These attractions are all unique, have totally unrelated stories and completely different vibes!r
r
First up was Nightmare Haunted House, where we were escorted to the front row of a wonderfully dreadful little theater to watch a short movie. It was the story of Sarah Johnson, an abused girl who had the power to bring her dreams to life. Unfortunately, all of Sarah’s dreams were twisted nightmares and we were about to enter them! We love haunts with a backstory and this one was really good and presented in a SUPER DOPE way, but we felt it was a little anticlimactic and drawn out. We were waiting for an unexpected scare but then the movie just ended and the screen disappeared into the ceiling, revealing the entrance to the haunt… now that was pretty cool!r
r
We then ventured into Sarah’s dreamworld turned reality and this poor girl is nuts! There were tons of super creepy monsters and a few of them we recognized from the film! The uneven floors throughout this nightmare kept us off balance and unsteady feeling as if we were walking through a dream.r
r
The next haunt was The Hunted. If you like shooter video games or laser tag this is the haunt for you! It was a CRAZYYYYYY FUN, high intensity zombie laser shoot. The zombies, failed experiments of a mad scientist bent on creating the ultimate soldier, re-animated no matter where or how many times we shot them and were relentless! These psycho killers were coming at us from every angle! We didn’t even have time to really check out the sets because we were under constant attack and working our hardest to make it out alive. We think they were good…? r
r
The actors in this attraction were DEDICATED AF - sacrificing the shit out of their bodies, running at full speed, throwing themselves against walls, and collapsing on floors. They really sold the story and we were truly scared!r
r
The laser gun was set-up to automatically reload, which was a nice touch… less to think about when you are running and shooting for your lifeeee! We just wish the gun kept score of the number of kills and deaths… we’re a competitive bunch. r
r
The 3rd and final attraction was the outdoor trail, Valley of the Dead, where we met Earl in his mechanic shop. He instructed us on how to make it through his forest to “get to the other side.” After meeting Earl we were then told that he was, in fact, dead (did the Dixie Chicks get him???) so getting to the other side took on a whole new meaning. The actors in this haunt had a much more theatrical approach than in The Nightmare. We spent more time in each scene interacting with the actors, becoming further and further engulfed in their underworld. Valley of the Dead had an almost ethereal feel, making our grasp of the real world more tenuous. There were a lot of transitions between areas without scares that in some ways felt like missed opportunities but in other ways felt like an unsettling build-up. A cemetery on the shores of an extremely realistic yet fake lake became a relaxing midnight stroll. This haunt featured less jump-type scares and had just a frighteningly unnatural vibe, more unsettling than full-on scary.r
r
Overall, The Wicked World Scaregrounds was a well-rounded haunted experience ramping up with the mildly scary haunted house, to the high energy zombie shoot, to the eerily relaxing stroll through the underworld. The sets and costuming were decent but could be taken up a few notches. The Nightmare could use some more animatronics to help with theming and scares. The house and scenes were too big to rely so heavily on actors. But we did like Sarah Johnson. Girl, you crazy.r
r
As they continue to grow and evolve we would love to see them incorporate more of a midway area. Concessions, games, fire pits, etc. to go along with the DJ they had out there… nice touch! If you’re looking for a wickedly fun time, be sure to check out Wicked World Scaregrounds!',
  NULL,
  4,
  'https://www.wickedworldscaregrounds.com/',
  'https://www.facebook.com/WickedWorldScaregrounds/',
  'https://twitter.com/wickedworldsg',
  'https://www.instagram.com/wickedworldsg/',
  'https://www.youtube.com/channel/UCE4rJSlWnNRWC_YxpQvIEDw/videos',
  false,
  '2019-10-16 01:19:02.348041',
  '2022-09-11 08:27:58.364287'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Lake Joy Trail of Terror 2017',
  '428 Lake Joy Rd',
  'Kathleen',
  'GA',
  '31047',
  2017,
  'Lake Joy Trails of Terror was a haunted adventure! It was...',
  '<p>Lake Joy Trails of Terror was a haunted adventure! It was the perfect fall haunt because it''s setup mostly outdoors plus...THEY BRING THE SCARES!!! Finding this diamond in the rough was an adventure in and of itself but that only added to the anticipation. It''s easy to miss but DON''T MISS THIS ONE!<br><br>This haunt had us weaving in and out of seemingly endless, dark trails through the woods, tunnels, and enclosed sets. We’ve probably said it before, but the indoor/outdoor mixes are our favorite! The paths were not perfect so we had to focus on where we were stepping, staying on the path, AND the scares going on around us. This led to a really engaging scare-sperience.<br><br>They have really diverse scenes that flow surprisingly well thanks to the use of some really creative and creepy transitions. These transitions managed to control the variety without it feeling disjointed. They featured original characters and incorporated a few horror movie references that their actors TOTALLY NAILED! They have a Jason scene that will chill you to the core. And kids... they have kids! Insanely disturbing, tiny people actors who did a phenomenal job!<br><br>Effects... WOW! Really cool stuff! Their use of the outdoor spaces, the lighting, the sound... just so effective and well done.<br><br>This haunt is pretty long; it took us about 40 minutes to walk through, so wear comfortable shoes!&nbsp;While we never recommend pre-haunt drinking (it dulls the senses instead of intensifying them) this is definitely not a haunt to come to tipsy. You will bust your ass!</p><p>They have so much land out there, we hope next year they incorporate some fall activities (at least a bonfire) and create a type of midway with concessions and some photo ops.</p><p>Lake Joy Trails of Terror was such a great experience! Really passionate people and it showed in their haunt... true Haunt Junkies! Bravo!</p>',
  NULL,
  4.5,
  'http://www.lakejoytrailsofterror.com/',
  'https://www.facebook.com/Lake-Joy-Trails-of-Terror-124836354281676/?rc=p',
  NULL,
  'https://www.instagram.com/lake_joy_trails_of_terror/',
  NULL,
  false,
  '2017-09-28 17:29:51.911281',
  '2022-09-11 08:13:14.817762'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Gates Of Misery 2017',
  '174 Chatillon Rd.',
  'Rome',
  'GA',
  '30161',
  2017,
  'Pulling up to Gates of Misery we had no idea of what to expect..',
  '<p>Pulling up to Gates of Misery we had no idea of what to expect. The building facade and surrounding property are very unimpressive. You wouldn''t even know you were at a haunt except for the sign and the lone, cliche "guy with chainsaw."<br><br>Boy, can looks be deceiving!!! The length of this haunt blew our minds! We have no clue how they fit so much into the building! This is not a huge commercial haunt with a bunch of bells and whistles, but what this haunt lacks in terms of flashy effects and production it more than makes up for in creativity and psychological scares. There are two equally terrifying attractions and, don''t short yourself, you have to do both! Although our favorite was the museum!<br><br>Both haunts were very interactive. We had to pull open doors, push curtains aside, and move low hanging props out of our way, never knowing what we would find on the other side. The sets utilized repetition in the most effectively creepy way, but this was the only element of consistency. What we expected was never what it was; a lot of misdirection kept us guessing through both attractions.<br><br>Gates of Misery has a very different (and brilliant) approach with its actors. Most are dressed to blend in with their environment and aren''t meant to be seen. This camouflage allows them to remain undetected until the perfect moment for the scare arises. The flexibility with the timing was pretty incredible plus the mixture of hidden and exposed actors made it so things never got old or predictable.<br><br>This small town haunt packs big-time scares! Gates of Misery is one to see and one to watch, folks. Our only concern is their ability to expand... and we want them to grow. Give us more! They have the vision and we are expecting greatness from them throughout this season and for years to come!</p>',
  NULL,
  4.5,
  'http://gatesofmisery.com/',
  'https://www.facebook.com/GatesOfMisery/',
  'https://twitter.com/gatesofmisery',
  'https://www.instagram.com/gatesofmiseryhauntedhouse/',
  NULL,
  false,
  '2017-09-28 15:23:28.583102',
  '2022-09-11 08:13:57.609531'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Madworld Haunted Attraction 2017',
  '147 Country Manor Rd',
  'Piedmont',
  'SC',
  '29673',
  2017,
  '“150 actors”… Say whatttt?!!! When we saw this advertised on Madworld’s website we were...',
  '<p>“150 actors”… Say&nbsp;whatttt?!!! When we saw this advertised on Madworld’s website we were extra amped and dying to check them out! One of our biggest complaints is when a haunt doesn''t have enough people because there are times when an animatronic just cannot replace the real thing.</p><p>Madworld definitely made us feel like we stepped into another little world. The midway was spacious, yet enclosed with a nice bonfire where you can warm up and watch the big screen, a gift shop, eerie lighting, and monsters wandering around created a very anticipatory and scary setting. They have also started doing friendly tours and day-time events geared towards families and Haunt Junkie Jrs. which is a pretty cool concept and fun for everyone!&nbsp;</p><p>The inside of this haunt felt massive! Room after room of well-designed, detailed sets that nicely transitioned into outdoor spaces (which we love!). Indoor and outdoor scenes incorporated animated props and creatively implemented lighting and effects with its actors. There were a couple of rooms that completely blew our minds and some that were so scary we hesitated before walking through! Sorry, no more details… NO SPOILERS!!! But there were also areas that lacked cohesion, and a few rooms and locations where the set, placement of props, and actors made it difficult to navigate. There was even a time when we tried to crawl through a backdrop, which would have been awesome... if it wasn''t a backdrop.</p><p>Madworld has started to include elements of an immersive haunt, which is GREAT! The more you interact with not only the characters but the environment, the more emotionally invested you become in the haunt, but it is not quite up to par yet. The first two actors were out-of-this-world, the hotel owner and the bell-hop. However, the others did not live up to the same standard set by those first two. This led to a little confusion because we weren’t sure who we would be interacting with and who we wouldn’t be, which left us standing in front of actors like idiots waiting for them to interact with us.&nbsp;</p><p>You will probably never hear us say this about another haunt, but Madworld may have gone overboard with their cast. The make-up, masks, and costuming were well done, but at times, we felt the animated props, effects, and crew were competing against each other instead of complementing one another. The length of the haunt and number of actors started to make scares predictable and less frightening as time went on.&nbsp;</p><p>If you''ve never experienced Madworld plan a trip now! We absolutely love the growth and the commercial appeal they''ve added! Food trucks and DJ''s are always a plus, but for the main attraction, we hope they find a happy medium between actors and props and continue to work out the kinks throughout this season and others to follow!&nbsp;</p>',
  NULL,
  4,
  'https://madworldattractions.com/',
  'https://www.facebook.com/madworldhaunt/',
  'https://twitter.com/madworldhaunt/',
  'https://www.instagram.com/madworld_haunted_attraction/',
  NULL,
  false,
  '2017-09-23 22:02:36.824891',
  '2022-09-11 08:14:29.559198'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Gates of Misery 2018',
  '174 Chatillon Rd.',
  'Rome',
  'GA',
  '30161',
  2018,
  'Gates of Misery was probably the biggest (and best) surprise of the 2017 haunt season and...',
  '<p><span dir="LTR">Gates of Misery was probably the biggest (and best) surprise of the 2017 haunt season and WOW! The growth from last year is evident - bigger builds/props, more detailed sets, new themes, longer; and we are pumped!</span></p><p><span dir="LTR">What we love the most about Gates of Misery is their ability to create the most interesting rooms using atypical themes and make them insanely creepy... all without a Netherworld or Paranoia budget. &nbsp;They are the masters of cerebral set design. This is one of those haunts that does more than just scare you, they make you think and make decisions (usually bad ones because you are terrified and panicking). The rooms here really draw you in and the more time you spend in them the more engulfed you become. Some rooms don’t transition well into the next (ex. pirate ship to bedroom) but each individual room is so well done we are not sure that matters much.&nbsp;</span></p><p><span dir="LTR">Gates of Misery''s sets are more than just artistically</span><span dir="LTR">, brilliantly eerie, they are also super interactive – lots of opening doors, going up and down stairs, across bridges, etc. It is so much more than just walking through a haunted house; it’s a HAUNTED ADVENTURE!</span></p><p><span dir="LTR">One of our favorite aspects of this haunt last year was their unique approach to actors. Instead of actors dressing as scary characters they were dressed to blend in with their environment. It was never a question of “is that prop/person real?” but more so “where are they coming from or what part of this scene is randomly going to move?” So different and so effective! There were a few rooms that still incorporated this and those were our faves.<span dir="LTR">There was one room in particular that referenced a Disney movie (of all things!) that just completely blew us away</span> but there were definitely a lot more character actors this year. Some were awesome while some took away from the room instead of adding to it.&nbsp;</span></p><p><span dir="LTR">Gates of Misery has now become a can’t miss haunt for us. Every year we will be there to support and see what new horrors they have in store. They are definitely on the top of the list for us and should be for you too!</span></p>',
  NULL,
  4.5,
  'http://gatesofmisery.com/',
  'https://www.facebook.com/GatesOfMisery/',
  'https://twitter.com/gatesofmisery',
  'https://www.instagram.com/gatesofmiseryhauntedhouse/',
  NULL,
  false,
  '2018-10-12 04:59:55.342179',
  '2022-09-11 08:16:34.62012'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  '13 Stories Haunted House 2018',
  '320 Temple Ave',
  'Newnan',
  'GA',
  '30263',
  2018,
  'The… Haunted… Pink… Traphouse… r
An urban horror themed haunted house...',
  '<p>The… Haunted… Pink… Traphouse…&nbsp;</p><p>An urban horror themed haunted house is probably the greatest haunt story never told&nbsp;and after The Haunted Pink Traphouse… is still untold.</p><p>13 Stories Haunted House features three attractions - their main attraction, which this year is The Haunted Pink Traphouse, the very unique Sacrifice, and a zombie shoot. We only did the Traphouse this year but have done the others in the past. See our <a href="http://www.hauntjunkies.com/reviews/13%20Stories%20Haunted%20House%202016">previous review</a>.</p><p>We knew this was either going to be EPICCCCC or an EPIC flop; and unfortunately, it was an EPIC flop. Get Out, Tales from the Hood, Leprechaun in the Hood, Snoop Dogg''s Hood of Horror, Blacula, Blackenstein… so many opportunities for really great themes and references but there were none. Or if there were any they must have been so obscure or oddly placed that we didn’t pick up on them. The Haunted Pink Traphouse felt like an already incohesive haunt that decided to play some 2 Chains music in random rooms. This does not make an urban-themed haunted house. Think bloody operating room, aliens and toxic waste, and a white guy with no shirt on waiving a tiny hatchet jumping out and yelling, “Stay out of my traphouse!” The absolute last straw was the random girl shaking her ass on a pole. Really?… Really though? We all love a good stripper and a little sexual innuendo usually mixes well with horror but this just felt wrong and completely out of place.</p><p>We get it. There is a thin line between poking fun at the racial stereotypes and cliches that exist within the horror genre and looking racist, but come onnnnnn! The thought had so much potential! 13 Stories has awesome space and a pretty decent collection of props, but even with an amazing theme to work with, lacks the vision and actor talent to pull it off. This was just disappointing. There were a couple note-worthy actors (SWAT girl, you were great), but most of the haunters had insufficient make-up, costuming, and acting ability to sell their role. At a minimum, could you guys at least cover/hide your step pads?</p><p>We wanted so badly for this to be amazing!&nbsp; After talking to one of the managers, who has experienced some pretty hardcore haunts and reading their website and write-ups on various urban/hip-hop websites and the about section on their <a href="https://13stories2018.ticketleap.com/13-stories-haunted-house-2018/details">TicketLeap</a> website, our hopes were high… too high! All our urban haunt hopes and dreams crushed.</p><p>If you decide to check out The Haunted Pink Traphouse for yourself, we hope that this review sets your expectations more in line with what you are going to experience and not what we were looking forward to.</p>',
  NULL,
  2,
  'https://www.hauntedpinktraphouse.com/',
  'https://www.facebook.com/13Stories/',
  'https://twitter.com/13stories',
  'https://www.instagram.com/13stories/',
  NULL,
  false,
  '2018-10-02 03:40:01.898903',
  '2022-09-11 08:17:39.732773'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Skeleton''s Lair Screampark 2019',
  '48 Locketts Dream',
  ' Scottsville',
  'KY',
  '42164',
  2019,
  'Skeleton’s Lair Scream Park offers a whopping 4 haunted attractions plus a 3-minute escape room. They are also...',
  'Skeleton’s Lair Scream Park offers a whopping 4 haunted attractions plus a 3-minute escape room. They are also celebrating their 20th anniversary this year! Being veterans in the haunt industry for that long is something we could only dream of! With that being said, our expectations were set really high.r
r
Outdoor haunts are our ABSOLUTE FAVORITE, but with the outdoors comes the challenge of the elements and after parking then taking their entrance path deeper into the dark woods, a nice little drizzle had started. We were worried they would shut down, but fortunately for us, they remained open and we were going to get our first fear fix for the evening! Or so we thought...r
r
All 4 haunts led from one to the next. The first attraction was a short 3D walkthrough. The paintings were cool but there were no real scares. We were let out close to the queue line entrance of the second attraction. From the outside, it was the quintessential haunted house. The lighting and thunder effects went perfectly with the rain we were standing in. Inside, there were a variety of twists and turns, tight corridors, and multiple levels that were really well built. Random mannequins littered the rooms and we wondered if some characters were part of a story, but there was no backstory posted anywhere or read to us. There didn''t seem to be any particular theme or rhyme or reason to anything. The house felt like a bunch of random props and cool effects haphazardly strung together without any real purpose or flow. r
r
Both the first and second haunt were light on scares due to a lack of actors. We walked through some rooms that felt a little stale because absolutely nothing was happening! Sad. It felt like they had reached a certain status and became complacent, and this haunt has so much more potential! r
r
Next up was the haunted hayride, which contained no hay, just wet benches. The hayless ride took us through several random scenes including a big top and an oddly placed pirate ship. We stopped for a brief performance in each. Again, no real flow, no scares between scenes, but hey, who doesn''t enjoy a nice ride through the woods on a crisp fall night? r
r
The hayride dropped us off at the final attraction, The Doll Factory... NOW WE KNOW WHERE ALL THOSE RANDOM MANNEQUINS CAME FROM! The scenes were kind of cool and the actors’ costumes blended better, but it was still more of the same.r
r
Having multiple attractions makes for a longer haunt experience and having different themes keeps things fresh. Skeleton''s Lair definitely had both of these covered. All 4 attractions took us about an hour and a half to go through. r
r
A major highlight for us was the multiple slides, although they weren''t scary and served no purpose other than being SUPER FUN and getting our butts SUPER WET!r
r
We recommend that you sign up for their email list to get discounts and buy your tickets online. The ticket booth wasn’t accepting cards when we went so we had to use the on-site ATM and pay with cash. We should have pulled out extra because when we tried to buy a shirt at the end their card reader was MIA, so we couldn’t. This was disappointing.r
r
For haunts this size that provide this many attractions we love to see midway-type areas and Skeleton’s Lair has one in the works! We hope they incorporate fire pits, food vendors, merchandise, and games so people have a place to just hang out and enjoy the atmosphere and season. r
r
We hope they continue to grow and take advantage of their awesome location and look forward to stopping by again sometime in the future… hopefully when it''s not raining!',
  NULL,
  3,
  'https://www.skeletonslair.com/',
  'https://www.facebook.com/skeletonslair/',
  'https://twitter.com/skeletonslair',
  'https://www.instagram.com/skeletonslairscreampark/',
  'https://youtube.com/channel/UCIWBdsZwhJyP0g4jZKxHY7g',
  false,
  '2019-10-16 00:11:13.449061',
  '2022-09-11 08:32:41.507652'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Paranoia Haunted House 2018',
  '2075 Marietta Highway',
  'Canton',
  'GA',
  '30114',
  2018,
  'Ok Paranoia, we were really ...',
  'Ok Paranoia, we were really hard on you guys last year but... you totally redeemed yourselves, in our eyes, this year. r
r
A few of the things that made Paranoia so much better this year:r
1. The addition of the carnival-themed midway! Genius!!! We love a good midway, anything that keeps people hanging out and really enjoying the haunt atmosphere is awesome! There were some creepy characters lurking around, a few fun carnival games, and the gyro machine for the bravest of haunt-goers. Megan tried this out and she''s pretty sure she''s still not quite right.r
r
2. Set designs. While last year''s set designs were more detailed than they were the previous year, they lacked flow and direction. This year''s designs were elaborate yet simple enough to navigate through. They also allowed for better placement of the actors. Another interesting aspect of the set design this year was that the two houses each had completely different feels. One was dark and organic where danger just felt imminent the whole time. Kind of like this humming, while the other was high-energy, slap-you-in-the face bloody, gory, disgusting. And what is a haunt without some chainsaws?! Well... Paranoia had one of the scariest chainsaw clown rooms EVERRRRRRRR!!!r
r
3. Acting. Acting is always a huge variable in this industry. You can catch a great haunt or a great actor on a bad night but overall we felt this area stepped up in a big way. More developed characters, better placement, better timing... all-around better scares.r
r
There are a couple things that Paranoia has always been really good at and continues to be atmosphere and controlling the pace.r
r
Walking up to the gates of Paranoia always feels like stepping into a new, scarier world. You just know you are in for a great experience! Their outside/queue line actors are top-notch and know how to get you in the mood and are always available for that perfect photo op. The new midway is really a great addition to an already amazing atmosphere and another great example of how Paranoia is so creative and effective at controlling the pace of the haunt. They always throw in breaks that are so random and quirky yet perfect.r
r
We still miss the Paranoia of 2016 but we understand and appreciate their vision and where they are going. Paranoia is really becoming one of those full package haunt experiences that really separates the good haunts from the great. They are a can''t miss this year and we always look forward to their Christmas event, so we''ll see you there again in a couple months.',
  NULL,
  4,
  'http://www.paranoiahaunt.com/',
  'https://www.facebook.com/paranoiahaunt/',
  'https://twitter.com/ParanoiaHaunted',
  'https://www.instagram.com/paranoiahauntedhouse/',
  NULL,
  false,
  '2018-10-22 03:08:31.613085',
  '2022-09-11 08:16:05.512167'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Asylum Haunted Screampark 2019',
  '3101 Pond Station Road',
  'Louisville',
  'KY',
  '40272',
  2019,
  'Asylum Haunted Scream Park offers 5 very different haunted experiences. Darkness Falls, Zombie City, ...',
  'Asylum Haunted Scream Park offers 5 very different haunted experiences - Darkness Falls, Zombie City, Xterminate Mutant Attack, Zombie Hunting, and the Carnivale of Lost Souls. We only experienced 2.5 out of the 5.r
r
Darkness Falls is a mile long haunted trail through the woods with various indoor sets along the way. There was no sensible progression, flow, or story being told. Despite several really interesting scenes, overall this attraction sucked. We’re sorry to say it, but it’s true! Characters, sets, and props were just disparately thrown together in weird and sloppy mash-ups. Costumes and make-up were NOT hitting, It looked like everyone got in the mirror 10 minutes before opening and did their own thing. No scares, not just a few, NONE! Dr. Mortis is the one who sent us out into the woods but somewhere the story got lost.r
r
Zombie City had a completely different feel. This was a fully immersive, interactive haunt where our group was trying to escape a city that had been overrun by zombies and a dangerous militant faction named SCUZ. We navigated our way through assorted scenes with the help of a guide, meeting all types of odd characters like a weird religious cult and a guy that carried a rubber chicken attached to a plunger and stuck it to his belly. Rubber chicken guy would have been some awesome, clutch comic relief if we had actually been super scared before getting to him! We REALLY wanted to like this one, but everything felt drawn out due to the lack of actual scares and quality set design. We just couldn’t fully buy into the story. The actors did the best they could with what they were given and were very enthusiastic, but also lacked decent costuming and make-up. This was a bummer...r
r
Xterminate Mutant Attack is a laser shoot. We bought tickets for this attraction as well but after wasting almost 2 hours between the slow moving line at Darkness Falls, going on that mile long hike (at least we got some exercise), and then escaping Zombie City which took about half an hour, we decided to cut our losses. We ended up giving those tickets away to some guys in the line at the Haunted Hotel.r
r
Zombie Hunting is a paintball shoot. We’ve done our fair share of these and are never impressed. Asylum’s version offered nothing new so we decided to forego this attraction. Not our thing, but if you enjoy them… GO FOR IT!r
r
Wondering where that 0.5 mentioned at the beginning came from? This is it...The Carnivale of Lost Souls is basically the whole area outside of the actual attractions. It’s a free family-friendly midway that features live entertainment, games, food and drinks, and specialty vendors and artists. About halfway through our wait at Darkness Falls, a fire performer came to entertain us in line. We LOVE features and areas like this and wish more haunts had them. Halloween/fall is our favorite, so it’s nice to have a place to chill, take in the haunt vibes, and enjoy the season. We were just in such a rush to get to the next scheduled haunt we didn’t get a chance to really appreciate this area or grab the BBQ. It smelled delicious. r
r
The owners of Asylum have teamed up with the owners of the previous 7th Street Haunt to create a new haunted attraction called American Horrorplex. This was also on our tour list, but unfortunately we ran out of time. We’re sure a lot of energy was diverted to this new haunt being it’s the first year… maybe taking away from here? r
r
If you are looking for a full night of the Halloween experience and entertainment in one spot this is your place, just don’t expect to be scared. Hopefully, in the years to come the “scream” will be put back into Asylum Haunted Scream Park!',
  NULL,
  2.5,
  'https://asylumhaunts.com',
  'https://www.facebook.com/asylumhaunts',
  'https://twitter.com/asylumhaunts',
  'https://www.instagram.com/asylumhaunts/',
  'https://www.youtube.com/user/AsylumHaunts/featured',
  false,
  '2019-10-18 01:06:30.367698',
  '2022-09-11 08:23:02.675187'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Devils Attic 2019',
  '647 West Hill Street',
  'Louisville',
  'KY',
  '40208',
  2019,
  'For the past few years, we have been hearing the whispers of The Devil’s Attic and were...',
  'For the past few years, we have been hearing the whispers of The Devil’s Attic and were dying to know what evils dwelled within… Well, this year we finally got our chance! Doesn’t the name just evoke visions of hidden terrors lying in shadowy wait? One can only imagine what horrors the Devil would store in his attic, AND IT WAS TIME TO FIND OUT! MWAHAHA...r
r
The Devil’s Attic is located in Downtown Louisville just a few blocks from the University of Louisville… which was so evident by looking at their line. Several of Satan’s servants roamed the queue line and haunt grounds, while a one man freak show performed the most cringe-worthy feats. This guy was one crazy sword swallowing, skin stapling SOB! Eek! They also had a small concession table with the perfect mix of munchies and hot cocoa to enjoy while you wait.r
r
We stopped to pose for a final picture near the entrance before climbing the stairs to become lost souls in the attic. The Devil himself greeted us before we ventured in to explore. This place was filled with every BLOOD-CURDLING thing that goes bump in the night. We encountered an entire monster menagerie - everything from your traditional scary characters like vampires and werewolves, to iconic movie monsters, and even mythological creatures! r
r
Each monster had its own devilishly detailed movie-quality set. The sounds, smells, and lighting in the scenes were designed to accentuate and intensify every frightening detail. All of the ungodly characters and their lairs in The Devils Attic were horrifying! The costuming and make-up here was top-notch! So intricate, so realistic! These were not just people in masks and make-up, these actors WERE the creatures! The vampire girls and Medusa were dangerously alluring and Bloody Mary reminded us why we would never say her name 3 times! OMG Hellraiser! r
r
It’s hard to make a haunt with such different theming from room to room make sense and feel cohesive, but The Devil’s Attic totally NAILED IT! There wasn’t so much as a flow between the scenes, each one was its own satanic smack to the face, yet felt perfectly placed. Each new environment showcased a new atrocity. Some scenes were just walkthroughs, some interactive, and in some we were stopped for a dreadful demonstration of some type. We got wet, we got separated, WE GOT SCARED! They also employed some very creative and very unexpected transitions... Tricky Devil. r
r
On October 27, 2019, for one night only, The Devil’s Attic will present CHAOS, a full contact experience and BOYYYYY, do we wish we could make it back for this event!!! We were told this is R-rated, you must be at least 18 to enter, a signed waiver is required, and you will be grabbed, bitten, licked, and violated. If that doesn’t sound like a good time we don’t know what is. We just wish this was an option every night!r
r
Even for Haunt Junkies like ourselves who have become desensitized and are constantly looking for that next fear fix... This is one of the scariest non-touch haunts we’ve been to without a doubt! It feels great to have met the Devil himself and “LIVE the nightmare”! Anytime we are in Louisville during haunt season there is no doubt we will stop by The Devil’s Attic and so should you!',
  NULL,
  4.5,
  'http://thedevilsattic.com',
  'https://www.facebook.com/dattic/',
  'https://twitter.com/thedevilsattic',
  'https://www.instagram.com/thedevilsattic',
  'https://www.youtube.com/watch?v=o7rXqp2UxSw',
  false,
  '2019-10-16 02:57:44.082088',
  '2022-09-11 08:20:00.242093'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Dent Schoolhouse 2019',
  '5963 Harrison Ave.',
  'Cincinnati',
  'OH ',
  '45248',
  2019,
  'The Dent Schoolhouse was definitely a bucket list, must-see haunt for us and please believe they did not ...',
  'The Dent Schoolhouse was definitely a bucket list, must-see haunt for us, and please believe they did not disappoint! We had not planned to visit them during our 2019 haunt tour, but since we kicked off on a Thursday and only 1 haunt was open in Kentucky, we decided to check what others were open in the surrounding area. When we realized we were only a 2 hour drive from Cincinnati and The Dent Schoolhouse, it was a done deal! AND WE WERE SOOO LIT!r
r
Pulling up to the front, all we could see was the massive 3-story schoolhouse that deceptively concealed how much more there was to come. As we approached the entrance we were greeted by Charlie, the infamous janitor, who looked way more sinister in person than in pictures. We then made our way around to the side of the school to the queue line… and it was nothing short of stellar! It was set up like a frightful fall festival that featured some of your favorite carnival games but with a creepy twist. There were some really great photo ops too!r
r
We''re not sure who on their team has OCD but everything about the Dent Schoolhouse is the epitome of execution. This was such a fully immersive haunted experience, we legit felt like we were transported back to school to witness our worst nightmares! And these nightmares were way worse than that one where you show up to class in nothing but your underwear! r
r
THE SETS WERE FREAKING AMAZING AND INCREDIBLY REALISTIC!!! The fact that they are located in an actual old schoolhouse only added to the authenticity and gave them the ability to expound upon this theme in every way. Every room was horrifically impeccable with no detail too minor and not a spiderweb out of place. Their mix of static props, world class animatronics, and live actors kept our heads on a swivel. The placement, timing, and theming was so on point! There was never a second that we felt like a room was lacking action or needed ANYTHING. The makeup and costuming were equally flawless!  Although this isn’t a full contact haunt, none of the actors were afraid to invade our personal space. The whole crew was phenomenal and true professionals! r
r
Jump scares, unnerving, and psychological scares were plenty as we cautiously traversed the haunted locker-filled hallways, gut wrenching cafeteria, and classrooms from hell. With each room seamlessly transitioning into the next, we moved throughout the school, basement, and ended in the chainsaw filled school yard. Two highlights for us were the jack-o-lantern room and the entire basement! ABSOLUTE PERFECTION!r
r
If there was some type of haunted house formula that you could bottle up and sell, this team has discovered it! EVERYONE should have the pleasure of experiencing The Dent Schoolhouse. With roots as a home haunt, they have catapulted themselves to juggernaut status in the haunt industry. They are now #1 on Megan''s haunt list!',
  NULL,
  5,
  'https://frightsite.com/',
  'https://www.facebook.com/thedentschoolhouse/',
  'https://twitter.com/dentschoolhouse',
  'https://www.instagram.com/thedentschoolhouse/',
  'https://www.youtube.com/watch?time_continue=49&v=DcNOM6AGdAo',
  false,
  '2019-10-13 22:21:08.037093',
  '2022-09-11 08:20:18.895231'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Black Orchard Haunted House 2019',
  '704 Kentucky Street',
  'Shelbyville',
  'KY',
  '40065',
  2019,
  'Black Orchard was exactly what we were expecting from a haunted house in Kentucky...',
  'Black Orchard was exactly what we were expecting from a haunted house in rural Kentucky - rednecks… redneck hillbillies... redneck cannibal hillbillies… in a barn. Yee haw partners, WE’S FIXIN’ TO GET SCARED!r
r
Black Orchard was our third and final stop on that rainy Friday night. We arrived at about 1:50am. They close at 2am, but you would have thought they had just opened. These actors were PUMPED! What an amazing, aggressive, in-your-face performance! BRAVO!r
r
First, we met Silas Black; this barn was his meat packing business. He talked to us about all the different kinds of meats offered in his plant but failed to mention where those cuts of meat came from and to beware of today’s specials!r
r
“What’s in the barn?” We’ll tell you what’s in the barn - a bunch of pig people and deranged hillbillies murdering folks, and if we didn’t move quickly enough we were going to be next. Chop, chop! This place was EXTREMELY INTENSE! Displays of physical and verbal abuse, body slamming, scene jumping, victims screaming, hillbillies killing, Black Orchard pretty much covered it. We were constantly dodging chainsaws, meat cutters, and blunt objects as redneck butchers came at us from everywhere! r
r
The sets here were really organic - dirty, grimy, and BLOODY! Blood, guts, and gore were the motif in most scenes. They definitely had the feel of an old school haunt with minimal usage of animatronics and special effects. Any animatronics used were HUGE and usually popping out of walls to push us up against one another. This haunt had a CRAZY ORIGINAL set-up that we’ve never experienced. Scenes didn’t just transition into one another they were literal continuations. We’d see a victim get thrown into a room, not knowing that room was the next one we would be in, then we’d see the attacker follow to continue the abuse. JUST WOW...r
r
Costuming consisted of lots of jeans, overalls, butcher aprons, wife beaters, and plaid shirts, exactly as it should be. The characters were just as bloody, dirty, and GRIMY as the sets. Not many masks were used but those that were depicted animals. This little piggy is going to KILL you!r
r
Even though we got a super scary show, the actors will tone it down when the words “Monster, be good” are spoken, making this haunt a little more kid-friendly.r
r
Black Orchard is in their 3rd year and part of a larger network called Louisville Halloween. In addition to the haunt, there is a 3-minute escape room called the Silo that’s a lot of fun. You wouldn’t believe how quickly 3 minutes goes by so be fast! Both the haunt and escape room are a part of Danger Run (a haunt scavenger hunt played in the car) along with their sister haunt, The Legend at Pope Lick, and their escape game.r
r
With the intensity that this haunt is already bringing in its 3rd year, we can only imagine that it is just going to get better and BETTER… as long as Silas Black and the Black family don’t get caught! GREAT JOB TEAM! r
r
If you’re looking for a down-home scare, a gritty haunt you can really sink your teeth into, Black Orchard is the haunt for you!',
  NULL,
  4.5,
  'http://www.blackorchardhaunt.com',
  'http://www.facebook.com/blackorchardhaunt',
  NULL,
  'http://www.instagram.com/blackorchardhaunt',
  'https://www.youtube.com/watch?v=0gOxZpDc4tc',
  false,
  '2019-10-17 23:50:21.815907',
  '2022-09-11 08:22:33.34265'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Grim Trails Haunted Attraction 2019',
  '12009 Rehl Road',
  'Jeffersontown',
  'KY',
  '40299',
  2019,
  'Grim Trails is a ¾ mile haunted trail that explores everyone’s favorite...',
  'Grim Trails is a ¾ mile haunted trail that explores everyone’s favorite fairy tales and folklore, but with a twist. They REALLY know how to set the stage! The banners on the light posts in the parking lot made us feel like we just arrived at the theme park of haunts! We’re so accustomed to driving on dirt roads and parking in fields; although, those have a special quality all their own too. The music being pumped through the speakers made it sound as if we were about to embark on an epic fantasy quest. When we reached ye olde ticket booth, we were super excited to hear that they had had a record-breaking night and were ready to venture in ourselves.r
r
Walking down the paved pathway to the queue, the epic quest music slowly began to fade away and was replaced by a chorus of creepy whispers coming from the woods surrounding us. It was dark, scary dark, and the whispers continued incessantly as we anxiously waited in line. And then things took a turn for the worst, at no real fault of the haunt’s...r
r
It was the end of night and there were 5 other people in line behind our 4. Instead of taking the 9 of us in two separate groups, we were all grouped together to go through. While the others in our group were super cool people, they talked to each other… they talked to us… and talked some more… through every single scene. UGHHH!!! And then the sin of all haunt sins was committed... when walking through a terrifying pitch black corridor, a cell phone was pulled out for light. NOOOOOOOOO!!! We quickly squashed that but still... come on.r
r
PSA - Please for the love of all things unholy and scary, treat haunted attractions as you would going to the movies. Silence your phones and no talking!!! Especially when you are placed in a group with people you do not know. Appropriate scared outbursts, expletives, and screams are acceptable going through the haunt but, other than that, we have all the time in the world to talk after we get out. Now back to your regularly scheduled review.r
r
Because this haunt is all about twisted fairy tales and scary folklore, the scenes and sets varied widely. Grim Trails had everything from pirates to snakes to creepy dolls to Alice in Wonderland., but they all looked equally amazing! This set up works best with haunted trails because there’s usually dead spaces in between scenes that give your brain a chance to reset, making a completely new theme not seem entirely random.r
r
Every new tale was incredibly detailed and themed to an absolute T! Lighting, sound, and set design were all ON POINT! Although most scenes were appropriately themed, distressed, and lighted, there were a few that confused us. Like the peaceful waterfall with a tiki mask and Buddha statue; we’re still not sure what exactly was happening there, but it looked like a great place to meditate. Some scenes were set up to seamlessly blend with the wooded environment, using the dark forest and trees as the backdrop, while others had their own dedicated house. The indoor/outdoor combination was well thought out and placed strategically among the timbers that we could hardly ever see the next scene ahead of us making each new scene like it’s own hidden secret and our own private discovery. r
r
The characters here were super creative, creeped-out versions of some of your favorite childhood fictional characters. Every character was easily recognizable because the costuming and make-up was so perfect, and a lot of quality masks and full heads were used. The Alice in Wonderland theme was madly maniacal! That Mad Hatter though! r
r
While the make-up and costuming were all amazing, unfortunately most of the actors really didn’t do their respective characters justice. A large portion of them just tried to scream us to death and that gets old, fast. When it is necessary, scream, but not just for no apparent reason  Especially when the scenes and woods set more of a menacing, dark undertone. Screaming is not scary… unless you’re a victim.r
r
We really wish we could have gotten the full experience here, but can definitely see the potential for scares. We would totally recommend that some of their more seasoned haunters take the newbies under their wing to teach them the art of the scare. But the ambiance, setting, and scenes alone make this haunt a very worthwhile trip. Come take a trip down the rabbit hole at Grim Trails!',
  NULL,
  4,
  'http://www.grimtrails.com/',
  'https://www.facebook.com/GrimTrails/',
  'https://twitter.com/grimtrails',
  'https://www.instagram.com/grimtrails/',
  'https://www.youtube.com/watch?v=cP28lbBz-3Q',
  false,
  '2019-10-17 23:39:32.136346',
  '2022-09-11 08:31:36.005698'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Netherworld Haunted House 2017',
  '2076 W Park Pl. Blvd',
  'Stone Mountain',
  'GA',
  '30087',
  2017,
  'We love you Netherworld, really; but in all seriousness...',
  '<p>We love you Netherworld, really; but in all seriousness, rated the #1 scariest haunted attraction in the US!??? Hardly!... They aren''t even the scariest in GA!</p><p>Netherworld is a GIANT in the haunt game and always offers a good time, but definitely pack snacks or shell out the extra $55 for the speed pass, because their lines are INSANE! We''re talking 3 - 4 hour wait times insane. At least they give you a lot to keep you entertained while you wait. Netherworld has absolutely THE BEST characters you will experience with the entire outside being one gigantic scare zone. The knee-sliders get us every time!&nbsp;</p><p>The exterior and queue line only offer a glimpse of the level of detail you''ll see inside. Netherworld features two haunts, their main house and a smaller second house a "monster museum," which is an interior continuation of the line for the main haunt that leads you through a menagerie of monster memorabilia and oddities.&nbsp;</p><p>We love their sets! These are Hollywood caliber sets, people. We "ooh" and "ahh" at the massive animatronics and every creative detail but at this point, that is really all they''re giving us. It''s like taking a tour through a movie set. The scares are just not there. It''s not the actors'' fault. Despite their detailed costumes and make-up they seem to be an afterthought to the larger-than-life animatronics and over-the-top sets. There are a few strategically placed actors who offer some great surprise scares but there is pretty much zero interaction or dialogue as you move throughout both haunts.&nbsp;</p><p>This year we say farewell as the Netherworld closes its last season in their Norcross location. They are moving to a bigger space in Stone Mountain complete with escape rooms. We cannot wait to see what else they have in store! See you in Stone Mountain, GA in 2018!</p>',
  NULL,
  4,
  'http://fearworld.com',
  'https://www.facebook.com/NetherworldHauntedHouse/',
  'https://twitter.com/hauntedatlanta?lang=en',
  'https://www.instagram.com/netherworldhauntedhouse/?hl=en',
  NULL,
  false,
  '2017-10-06 02:43:28.919306',
  '2022-09-11 08:50:21.747937'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Nightmare''s Gate Haunted House 2018',
  '3931 Longview Dr.',
  'Douglasville',
  'GA',
  '30135',
  2018,
  'We absolutely love Nightmare''s Gate... the "went twice the last two years" kind of love...',
  '<p>We absolutely love Nightmare''s Gate... the "went two times each of the last two seasons" kind of love; but this was their first year in their new location, and they are definitely experiencing moving/growing pains.<br><br>They only had about 4 months to completely rebuild their incredible haunt. We are impressed by what they were able to accomplish in such a short amount of time but also disappointed; because, understandably so, the sets just weren''t up to their usual par.<br><br>We missed the iconic rooms and features of Nightmare''s Gate (the tunnel - tried but not quite, the gas chamber, the crawling, the indoor/outdoor transitions) but, again, limited time and new space. We hope they are able to get these incorporated again next year. We were excited to see some completely new rooms and themes. They are really pushing the boundaries from more than just scary to downright disturbing.<br><br>The new location brings with it some improvements and also challenges. They have sooooo much more square footage to work with which is awesome (the more Nightmare''s Gate the better!) but this is also a challenge for a haunt whose signature features embraced super small, enclosed spaces. This extra space includes high ceilings that are going to require some extra builds and lighting adjustments. They have already begun to take advantage of the ability to be multi-level, and we absolutely cannot wait to see how far they are going to run with that new potential.<br><br>Anything that was lacking in set design was made up for by the actors. Boy, do they have a dedicated crew! Crawling, contorting, climbing, jumping, in-your-face acting! These guys went all in, and we love them for it! There were a couple interactions that felt like they went on a little longer than they should have but were still enjoyable.<br><br>Their original location was in more of a natural setting while this new location is attached to a bowling alley. More exposure and visibility... awesome! Less authentic locale... sad. We sure are going to miss the old spot, but hope this new location brings with it a new crowd. Maybe people who have never experienced a haunt before will be encouraged to give it a try.<br><br>Overall, the 2018 season Nightmare''s Gate is a good haunt worth seeing, but not great. We trust in their vision and know that the 2019 season will bring greatness. If you are a frequent visitor of Nightmare''s Gate go visit the new location and support them. If you''ve never been, check them out and just know that next Halloween they will be even better!</p>',
  NULL,
  3,
  'http://nightmaresgate.com/',
  'https://www.facebook.com/nightmaresgatehauntedhouse/',
  'https://twitter.com/nightmaresgate?lang=en',
  'https://www.instagram.com/nightmaresgatehauntedhouse/?hl=en',
  NULL,
  false,
  '2018-10-24 06:15:30.491537',
  '2022-09-11 18:57:38.717844'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Legend at Pope Lick Haunted Woods 2019',
  '4002 S Pope Lick Road',
  'Louisville',
  'KY',
  '40299',
  2019,
  'The Legend at Pope Lick Haunted Woods was the final haunt of our 2019 haunt tour. They are the...',
  'The Legend at Pope Lick Haunted Woods was the final haunted attraction of our 2019 haunt tour. They are the sister haunt of Black Orchard and after our experience there, we were really excited to see what scares The Legend at Pope Lick had in store! They are an outdoor haunted trail, and the location is a little different; their trail is set up in the woods of Pope Lick Community Park. Like Black Orchard, it is also a part of this year’s Danger Run (a haunt scavenger hunt played in the car).r
r
The Legend at Pope Lick is unique in that its story was not just made up specifically for the haunt, but a local urban legend shrouded in truth. “In every urban legend, there is a cornerstone of truth, and every true story has a beginning—” It’s been told that back in the1930’s a circus train ran off the tracks and crashed into the forest, killing most of the crew. Among the traveling troupe was the Goat Man, a disfigured man raised in captivity by the circus as their main attraction. Finally set free by the crash, it took revenge on the survivors by ripping them to bloody shreds. The Goat Man continues to pray on the local livestock and lures people to their deaths on the train tracks to this very day. r
r
A very spooky scene was set; a thick layer of fog had settled over the park and soccer fields as we started the long walk down to the woods. And when we say long, we mean LONGGG! Then out of the tranquil darkness rose the bright lights and the sound of... dance music?! This queue line was LIT! r
r
For the people who are not from the area or familiar with the local lore, you are introduced in the queue line where old newspaper articles had been blown up and printed on banners for you to read while you wait. They also had an old-school black and white horror flick playing on a large projection screen. r
r
Before venturing into the woods, we were given a flashlight to help us navigate. The path was not lit and marked only by a thin string between the trees in some areas, so it’s really easy to lose your way... and with the Goat Man lurking somewhere out there, you DEFINITELY want to stay on the path! The flashlight was a little too bright for our liking, being Haunt Junkies, so we kept it turned off or shielded to add an extra layer of fear! r
r
All of the sets at The Legend at Pope Lick looked like they had been in that forest for a long time, weathered and worn and becoming one with the woods. The way the sets are scattered you can almost imagine that this is how those circus cars landed after derailing and falling off the train trestle all those years ago. Each scene was a familiar circus or sideshow act… They even had an old fashioned, carnival-style haunted house that featured all of the classic movie monsters!  A few other themes that you’d expect to run into in the Kentucky woods were sprinkled in - scared campers, some hillbillies, a cult full of dark and malicious intent, and, of course, the Goat Man. The scenes were plentiful leaving little dead space between them.r
r
This circus had a lot more than just creepy clowns, even though they definitely had those, there were also circus freaks of all kinds and carnies galore! Make-up and costuming ranged from super minimal make-up and regular-looking, blood-stained clothes on the scared campers to full masks and bodysuits on the circus acts. The circus freaks all looked...well, freakish... but the dog-face man was probably the scariest and our favorite. The other costumes were appropriately carnival themed, but some of the characters looked a little fresher than they should have been after spending years in the woods.r
r
Being in the forest of a community park probably makes running a ton of electricity difficult as there were minimal sounds, animatronics, or pneumatic props. There was a super cool peep show that really scared us, some harmonizing ghosties, and a few others; but overall, they had to rely on their locale, legend, and mostly actors for the scares. There were some really great ones and some really not-so-great ones, but walking through the cold, dark woods late at night had a disquiet all its own.r
r
The Legend at Pope Lick also features a 3-minute escape game, Camp Capricorn. Like their sister haunt, we also tried our hand at this one. 3 minutes goes by SUPER fast, guys; but it’s still definitely worth doing!r
r
The sets, story, and locale really set this haunt apart from others. Looking back at this haunted experience we really appreciate the level of storytelling, nothing random, everything coming full circle. If you’re looking to indulge in some local lore and enjoy the outdoors on a super creepy trail, you GOTTA check out The Legend at Pope Lick! Watch out for the Goat Man! He’s trying to lure you to the tracks...',
  NULL,
  4,
  'http://www.legendatpopelick.com/',
  'https://www.facebook.com/legendatpopelick',
  NULL,
  'https://instagram.com/legendatpopelick/',
  'https://www.youtube.com/watch?v=1qnqCqYGE58&t=1s',
  false,
  '2019-10-18 00:07:11.466856',
  '2022-09-11 08:35:58.115251'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Sinister Suites: Hotel Of Horror 2017',
  '132 W Solomon St',
  'Griffin',
  'GA',
  '30223',
  2017,
  'We didn’t plan on hitting Sinister Suites this year because of ...',
  '<p>We didn’t plan on hitting Sinister Suites this year because of our past experiences, but after our scheduled haunt closed due to the threat of rain, we added them to our route. And we are glad we did!! They''ve improved considerably!&nbsp;</p><p>They are located in a huge, old hotel that was built in 1910. This is one of the best locations because the building is so creepy and intimidating! From the outside, this place looks like it is going to be MASSIVE, but they haven''t utilized all of the space they have with many doors and hallways blocked off. In their previous seasons, the blockades were not very clear making it incredibly hard to navigate. In fact, each group was assigned a guide who pretty much ruined the entire experience! "Turn left. Go right. Stop there." Geez, dude!!! While it is still a little hard to get around and the guide still exists, we were thrilled that he now walks behind the group. This time he only spoke up when we headed in the wrong direction. This works soooo much better!</p><p>While the guide was definitely our number one issue in the past, we also were never impressed by the actors. Make-up, costuming, and character development were all lacking, but they have really stepped their game up this year! Initially, when we saw the characters on their website we weren’t excited, but everything actually looked good in person. They tend to take on original characters and that works really well here! Our number one scene still is the girl on the swing!</p><p>We also noticed a lot changes in their sets. They''ve incorporated one of our favorites - an area of complete darkness. Whatever our imaginations can conjure up is probably 10 times scarier than anything most haunts could execute. They captured that feeling really well! The creepy hotel rooms and long dark corridors are great architectural features that provide some seriously eerie backdrops. Another thing we noticed is that they left some areas without actors... and it totally worked! In a building like this that already has a genuinely frightening ambiance, sometimes less is more!</p><p>It seems like Sinister Suites'' creative team took a lot of the feedback they received to heart and came out swinging this year. We think they are still playing it very safe, but the changes and improvements are definitely moving them in the right direction. We really wish they would take more risks. They have some ideas that are soooo close to greatness plus the coolest venue with a ton of potential! If you''ve liked them in the past then you will love them this year, if you were less than impressed now is a good time to give them another look!</p>',
  NULL,
  3,
  'http://sinistersuites.com/',
  'https://www.facebook.com/SinisterSuites/',
  'https://twitter.com/sinistersuites?lang=en',
  'https://www.instagram.com/sinistersuites/?hl=en',
  NULL,
  false,
  '2017-10-08 22:09:38.702699',
  '2022-09-11 08:07:33.298317'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Shocktober 2017',
  '601 Catoctin Cir NE',
  'Leesburg',
  'VA ',
  '20176',
  2017,
  'First stop on our DMV haunt schedule was Shocktober in Leesburg, VA. It is located in...',
  '<p>First stop on our DMV haunt schedule was Shocktober in Leesburg, VA. It is located in an old "manor" in the middle of a picturesque school campus. This is another haunt where we had absolutely no idea what to expect because 1. It is a charity haunt and 2. The "...these are PG-13 scares..." sign posted at the ticket window. In our minds, these two factors together meant watered down for teens; so needless to say, we did not have very high expectations. Well...<br><br>When we have ever mentioned that a haunt was lacking a cohesive theme, that haunt should "relax and take notes" from Shocktober. Cohesive?... NAILED IT! From the sets, to the smells (oh the smells!), the sounds, the actors, everything felt "on purpose." No random or oddly placed scares here. <br><br>Detail, detail, detail... so much detail. Their characters and props were perfectly placed in these super elaborate sets. Everything just flowed so deliberately from one well-designed room to the next. We were amazed that they were able to utilize most, if not all, of the house, plus they added the basement as a carnival-themed second attraction this year.<br><br>The actors were phenomenal! They managed to be scary with actual words and dialogue. This season we have encountered a lot actors who simply scream, grunt, or moan at us. Ummm... sorry, not scary. Their make-up and costuming ranged from simple to over-the-top but always fit where they were placed.<br><br>There weren''t a ton of surprise scares here; this was more of an immersive, psychological experience where all of our senses were fully engaged. We truly felt transported into this world they created. First, being cursed by a voodoo witch doctor all the way through our souls being lost in a clown-filled afterlife.<br><br>The proceeds from this haunt go to The Arc of Loudoun at Paxton Campus, a nonprofit organization that helps children and adults with disabilities. What a great cause! We got there only 20 minutes after opening and the line was already wrapped around the manor. Spend that extra money for the speed pass! You''ll save a ton of time, plus it''s for charity. They also have a tent set up selling adult beverages, homemade baked goods, merchandise, and food. Visiting Shocktober will make you feel good and get scared! This is definitely not one to miss!</p>',
  NULL,
  4.5,
  'http://www.shocktober.org/',
  'https://www.facebook.com/Shocktober',
  'https://twitter.com/shocktoberhaunt',
  'https://www.instagram.com/shocktoberhaunt/',
  NULL,
  false,
  '2017-10-14 14:59:37.889383',
  '2022-09-11 08:08:22.370464'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Laurel''s House of Horror 2017',
  '935 Fairlawn Ave',
  'Laurel',
  'MD',
  '20707',
  2017,
  'The owners of Laurel''s House of Horror are geniuses! Taking an old...',
  '<p>The owners of Laurel''s House of Horror are geniuses! Taking an old movie theater, working with the existing features and architecture, and turning it into really cool escape rooms and a haunt is just amazing!!! They have 4 horror-themed escape rooms that are open throughout the year and in the fall they host their haunted attraction.<br><br>Tucked in the back corner of a shopping center, Laurel''s House of Horror took over a 6-screen theater and have really made it work! They''ve done a phenomenal job with the interior build; aside from one scene (probably our fave) and a really well-done and detailed interior queue line featuring the theater''s original concession counter, you would never even guess you were in a movie theater. They''ve managed to incorporate lots of level changes, chopped up the space to make enclosed rooms, and created some very dynamic pathways. We had to crawl in a pretty tight space for longer than most haunts would dare. This could have sent a serious claustrophobic into a panic attack. We, however, thought it was AWESOME!!!<br><br>This haunt played upon its theater roots by transforming some of those pre-existing spaces into scenes. They also delved into phobias. We moved from room to room exploring different sets that exposed a multitude of psychoses. Through the use of some creative transitions... "Feed the clown"... the different rooms were all tied together well.</p><p>They had some REALLY great actors and some not so great but definitely not due to a lack of enthusiasm or desire to be scary. These guys were passionate, but there were certain areas where the sets out-shined them. Make-up and costuming were pretty good but, because there aren''t many props and they rely heavily on their actors for scares, it could use a little more focus.&nbsp;</p><p>They were crowded when we arrived and even more packed when we left so you can enjoy some music and a movie while you wait or buy the fast pass. They had one of our favorite scary movies playing on the screen in the outside queue line, The Conjuring, plus they had a DJ. This seemed to be a common theme in the DMV area, playing popular music instead of scary music. We kinda missed the scary stuff... it really helps set the tone for us.<br><br>Although we aren''t the biggest fans of drinking and haunting, Laurel''s House of Horror partners with a local tavern to do a cool haunt tour. It starts at Manor Hill Tavern and then transports you on a private bus to The Nevermore Haunt, Laurel''s House of Horror, then back to the tavern. You receive fast pass entrance into both haunts as well as three beer selections from Manor Hill Brewery.<br><br>This was a super fun haunt with tons of room to grow. We would love to see them continue to really develop the interior queue line with the theater theme and add some actors in there and outside to create additional scare zones. They are definitely one to visit this season and to look out for in the years to come!</p>',
  NULL,
  4,
  'https://laurelhaunt.com/',
  'https://www.facebook.com/mdscariesthauntedhouse',
  'https://twitter.com/laurelhaunt',
  'https://www.instagram.com/laurelshouseofhorror/',
  NULL,
  false,
  '2017-10-14 15:06:32.278021',
  '2022-09-11 08:12:21.898268'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Field Of Screams - Maryland 2017',
  '4501 Olney Laytonsville Rd',
  'Olney',
  'MD',
  '20832',
  2017,
  'Field of Screams is a massive, multiple attraction scream-park with two...',
  '<p>Field of Screams is a massive, multiple attraction scream-park with two haunted trails, a haunted hayride, plus their house. Walking up you are welcomed by a huge midway/common area where we found tons of yummy concessions and cozy fire pits for marshmallow roasting. This seemed to be the hot spot where dozens of groups of teens and tweens were gathered listening to music from a local radio station. We kind of wish there was scary music being pumped through those speakers instead of hip hop. Nothing says Halloween like Lil Uzi Vert...</p><p>We love outdoor trails, especially when the weather is a little chilly and their two trails more than fit the bill. They were super long and actually covered a lot of difficult uneven terrain. We felt like we went on haunted HIKES not haunted trails! While there were some scares featured in randomly-spaced enclosed sets, the areas between them were lacking, just feeling like a brisk hike through the woods instead of a haunted attraction. We hope they utilize this dead space in the future by creating more scare zones and hiding some surprise scares in the surrounding environment and nature.</p><p>Hades Hayride featured a lot of neon, blacklight paint that had a deranged rave feeling. Their use of color was super trippy and mesmerizing but not very scary. We usually enjoy when actors invade our personal space, please make us uncomfortable, but do it with purpose. The actors here were overly invasive and the scares unoriginal. It all amounted to a lot of day-glow, zombie-ish looking teenagers screaming, grunting, and moaning in our face. It got real old, real quick.</p><p>The Slaughter Factory was just that... lots of blood, body parts, and chainsaws. This theme pretty much carried throughout the house with a few other random themes haphazardly tossed in. Same as the other attractions, the actors here are young and inexperienced though not lacking enthusiasm.&nbsp;</p><p>Overall, Field of Screams MD has a great vibe and is super fun but the haunts are all seriously lacking in scares. The midway is definitely their best feature, so bring your bonfire provisions, come hungry, grab some food, and just kick it and enjoy the fall feeling.</p>',
  NULL,
  2.5,
  'http://www.screams.org/home.html',
  'https://www.facebook.com/fieldofscreamsmaryland/',
  'https://twitter.com/FieldofScreamMD?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',
  'https://www.instagram.com/fieldofscreamsmaryland/',
  NULL,
  false,
  '2017-10-14 15:11:06.089682',
  '2022-09-11 08:14:20.319673'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Bennett''s Curse 2017',
  '7875A Eastpoint Mall',
  'Baltimore',
  'MD',
  '21224',
  2017,
  'Words cannot describe how excited we were to visit...',
  '<p>Words cannot describe how excited we were to visit Bennett''s Curse! All of the promotion we had seen over the years had us pumped! They were one of the DMV''s largest and longest running haunted attractions until they were forced to shut down and relocate under some pretty shady bureaucratic circumstances. This was their first year back after a one-year hiatus. They only recently acquired their new location and had a mere 6 weeks to set up shop. What they managed to accomplish in those few short weeks was nothing short of astounding!<br><br>This was a haunt known for its 4 separate attractions and larger than life props and animatronics. In order to adapt to their new smaller space, they picked the best and scariest elements from their previous attractions (the ones that could fit) and squeezed them all into one, so continuity was a little lacking. But every scene looked stunning! The 3D was pretty cool too! It made it really hard to believe they managed to assemble this haunt in only 6 weeks!<br><br>It was pretty obvious they were still working on adjusting to the smaller space. Lighting was really bright in some places as if the lights were made for bigger rooms. They tried to compensate for the lack of space by creating tighter, more intimate scares but there were some areas that just felt crowded and disproportionate. There were also some spaces that were so confined that even the actors had a hard time fitting in. The flow and timing of some scares were a little off due to this.<br><br>The costuming and makeup were just as detailed as we can imagine they were in their prime and the creatures were terrifying! The sets and props were top-notch Hollywood quality. We absolutely love the medieval theme! &nbsp;<br><br>We''re sad that we didn''t get to experience this haunt in all of its previous glory but we are glad they are back!!! The owners have managed to make the best of a bad situation and are determined to retake the throne. We wish them all the success in the world and hope they become even bigger and better than before!</p>',
  NULL,
  3.5,
  'http://bennettscurse.com/',
  'https://www.facebook.com/bennettscurse',
  'https://twitter.com/bennettscurse',
  'https://www.instagram.com/bennettscurse/',
  NULL,
  false,
  '2017-10-14 15:18:26.713961',
  '2022-09-11 08:15:28.953994'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Nightmare''s Gate Haunted House 2017',
  '3931 Longview Dr',
  'Douglasville',
  'GA',
  '30135',
  2017,
  'This was our 2nd year in a row visiting Nightmare''s Gate and...',
  '<p>This was our 2nd year in a row visiting Nightmare''s Gate and they did not disappoint! They tap into your deepest fears by offering more than just your typical surprise scares. Their rooms engage all of your senses by forcing you to interact with the environment and push you to your psychological limits. You will crawl on your knees, shimmy through the tightest of spaces, and probably get lost, but that is all part of it.<br><br>From the moment you pull up to Nightmare''s Gate, the scene is set. There is a deranged patient, his even more psychotic nurse, and a few other memorable characters. We had soooo much fun interacting with these people! They never break character (the true sign of good acting).&nbsp;</p><p>Once we journeyed into this haunt, (seriously, it feels like a journey), the imagery was very visceral. We began operating on sheer animal instinct. The fight or flight instinct is strong with this one! There is one room in particular that is probably the scariest thing we have ever experienced. We do not want to spoil it for you with details but trust us... you NEED to experience this haunt for yourself!!!<br><br>Despite a few opening night kinks and missing actors, Nightmare''s Gate is still everything your nightmares are made of. And that is really impressive! Keep up the scare-tastic work!!!</p>',
  NULL,
  4.5,
  'http://nightmaresgate.com/',
  'https://www.facebook.com/nightmaresgatehauntedhouse/',
  'https://twitter.com/nightmaresgate?lang=en',
  'https://www.instagram.com/nightmaresgatehauntedhouse/?hl=en',
  NULL,
  false,
  '2017-09-23 22:05:15.060762',
  '2022-09-11 18:58:19.383274'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Attic (at Perry Haunted Barn) 2015',
  '** Nevermore Hills Haunted Trail ** 1942 Heritage Blvd',
  'Warner Robins',
  'GA',
  '31098',
  2015,
  'The Attic is not your typical haunted attraction. It is a pitch-black...',
  '<p dir="ltr">*** New location at Nevermore Hills Haunted Trail ***</p><p dir="ltr">&nbsp;The Attic is not your typical haunted attraction. It is a pitch-black maze designed to take your fear of the dark and enclosed spaces to a whole other level as well as test your mental endurance. You go on a journey crawling through complete darkness in a space only about as wide as your shoulders so once inside there’s no turning back! Feeling your way along the twists, turns, and what seem to be dead-ends will push you to the brink of hysteria. Even if you’ve never thought of yourself as being claustrophobic, this attraction may have you reconsidering. This is not for the faint of heart. Enter at your own risk! When we attended it was located at Perry Haunted Barn in Perry, GA. After PHB was closed, The Attic moved to Nevermore Hills Haunted Trail in Warner Robins, GA.</p>',
  NULL,
  5,
  'http://www.museumofaviation.org/moaevents/nevermore-hills-haunted-trail/',
  'https://www.facebook.com/Perry-Haunted-Barn-134348119926693/',
  NULL,
  NULL,
  NULL,
  false,
  '2017-09-05 06:57:15.737698',
  '2022-09-11 07:52:14.003698'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The 13th Gate 2017',
  '832 St Phillip St.',
  'Baton Rouge',
  'LA',
  '70802',
  2017,
  'Living in the Atlanta area with Netherworld in our backyard, we thought they were...',
  '<p>Living in the Atlanta area with Netherworld in our backyard, we thought they were killing the haunt game in terms of set design... We were wrong. The sets at The 13th Gate not only rival Netherworld but in some scenes are crushing them.&nbsp;</p><p>The 13th Gate features an indoor haunt, an outdoor walk-through, Necropolis, plus several 5-minute escape rooms. We visited 13th Gate on a dark and stormy night, but even with the crappy weather people turned out in droves. We purchased the VIP pass to skip the lines and would recommend the same to anyone who has the money to spend.</p><p>The VIP pass got us right to the front of the line to the indoor haunt and then boom... we embarked on a journey into 13 different realms on our way to hell. This place was HUGE! 40,000 square feet of hyper-realistic sets. The sets, the makeup, the costuming, the acting were all Hollywood-caliber. The way they seamlessly integrated real elements in with props and sets kept us constantly asking each other, "is that real?" &nbsp;All we are going to say is snakes. If you suffer from ophidiophobia this is not the haunt for you. They were even able to incorporate the outdoors by blowing the roof out in some areas. Having the real, kinda stormy night sky as the backdrop to some scenes made their already authentic sets feel even more convincing. The 13th Gate is pretty interactive, lots of level and ceiling height changes required us to duck, shimmy, and even crawl into some seriously unnerving situations.</p><p>While the stormy weather added to the spooky atmosphere, it worked against us when trying to check out their outdoor attraction, Necropolis. It was open, then closed, then opened again but the line just continued to grow and grow despite the weather conditions. The VIP pass that got us quickly to the front of the indoor attraction line only got us into the VIP <em>line&nbsp;</em>at Necropolis which was damn near as long as the regular line. When you are a Haunt Junkie in need of your next fix, waits longer than 30 minutes just will not do. So long story short, we didn''t go through Necropolis and unfortunately, the escape rooms were closed</p><p>We were really disappointed to not have been able to experience all of the attractions at The 13th Gate but what we did see was spectacular. Definitely worth the trip and another one in the future to see what we missed this time around.&nbsp;</p><p><br></p>',
  NULL,
  4.5,
  'http://midnightproduction.com/',
  'http://www.facebook.com/13thgate',
  'http://twitter.com/#!/13thgate',
  'https://www.instagram.com/13thgatehauntedhouse/',
  NULL,
  false,
  '2017-10-20 17:36:16.806595',
  '2022-09-11 08:06:26.524798'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Trail of Terror 2020',
  '3760 Friendship Cir',
  'Buford',
  'GA',
  '30519',
  2020,
  'Trail of Terror is a newer haunt, only in its 3rd season, and this was our first time visiting...',
  'Trail of Terror is a newer haunt, only in its 3rd season, and this was our first time visiting. We were SUPER excited because haunted trails are our absolute favorite! We arrived a little late, in true Haunt Junkies fashion, which actually worked in our favor because we missed the huge crowd of haunt-goers that were lined up all the way to their parking lot earlier!r
r
A thick layer of fog enveloped the clearing in the woods as we approached. The heavy metal music that pumped through the speakers, coupled with the dark woods sprawled menacingly around us set a very unnerving atmosphere. As we made our way into the clearing that held the queue line, we stopped at a little snack truck to get our tickets. We passed through a picnic area with seating around a cozy bonfire and a few photo ops, but didn’t stop because it was late, and we were eager to see what this trail had to offer!r
r
At the entrance to the woods, we were greeted by a carnie of sorts who warned us about the terrors we would face on the trail and that we may not be make it out alive. This cinematic intro added to our anticipation (and dread) so through the black curtain we went! We were surprised to find ourselves in a pitch-black, enclosed space instead of the expanse of woods we expected. As we navigated our way through the blackness, we realized we were in a small claustrophobia-inducing tunnel. Fear of the unknown set in as we blindly felt our way along, wondering who or what may be lurking in the tunnel with us! There were definitely scares in there and in the next tunnel that followed that was a completely different feel yet equally as scary.r
r
After the tunnels that seemed to be portals into this haunted forest, we continued along the mile of haunted trail through dense, dark trees. The way they incorporated lighting to keep us on the trail without compromising the engulfing darkness was really awesome! The different scenes were pretty spread out along the trail leaving quite a few dead spaces but walking through the woods at night can be an unsettling experience in and of itself! With the exception of the few truly terrifying tunnels, most of the scenes were not elaborate structural builds but instead cleverly used the woods as their backdrop. r
r
The first half of this trail easily gets 5 ghosts; but unfortunately, it started to go downhill the further along we went. Costuming and make-up were generally appropriate in each scene, but not super detailed or elaborate. There were a couple characters that really stood out (or blended in) that scared the hell out of us in the woods, but only a couple. The bulk of the actors were teenagers who did more screaming than scaring. This works in some cases, but because Trail of Terror lacks the sets, props, and/or animatronics to supplement, the responsibility for scares lies solely with these actors. Haunting ain’t easy and is even more difficult with that level of dependency on actors, so being on you’re A-game is a must! We could easily tell the few who were more experienced haunters; they were creepy as hell and knew how to use their surrounding environment. For the newbies, the overall desire to be scary is definitely there, just not the know-how… yet. We’re looking forward to these new haunters getting more seasoned!r
r
We really appreciated their enforcement of COVID-19 safety protocols. Trail of Terror requires guests to sign waivers and have their temperatures checked prior to entry. The use of face masks is recommended but not required as the vast majority of this haunt is outdoors.r
r
Trail of Terror is located on a HUGE piece of land, so they definitely have the room for growth and development, and we are HERE FOR IT!!! It seems like they have the vision, and we can definitely see the potential, now it’s just learning how to execute. We would love to see a larger midway area, more elaborate/detailed sets and scenes, and bigger, enclosed builds along the trail. With that said, this is certainly a haunt to watch! Be sure to take your very own scary stroll down the Trail of Terror this haunt season!',
  NULL,
  3,
  'https://bufordtrailofterror.com/',
  'https://www.facebook.com/trailofterror187/?hc_ref=ARSBXYBRQwyg1Gzo0HS8nwJi0HtDeh1E-K_Lk5ltJ0rSUWSDuqu_INtxyqqdSb-Wokw',
  NULL,
  'https://www.instagram.com/trail.of.terror/?hl=en',
  NULL,
  false,
  '2020-10-03 20:16:18.07714',
  '2022-09-11 08:32:05.128264'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Scarehouse Of The South 2015',
  '58 GA-56',
  'Soperton',
  'GA',
  '30457',
  2015,
  'We had been wanting to visit Scarehouse of the South for the past 2 years...',
  '<p dir="ltr">We had been wanting to visit Scarehouse of the South for the past 2 years because of the “only R rated haunt in GA” label advertised on their website. The scene here was cool; the attraction, a derelict country-looking house, was the backdrop for the line which was packed with late teen and twenty-somethings. The rules/warnings were prominently displayed amping you up even further for an extreme experience... that justtttt missed the mark. We mean like by just a little bit, so close. This haunt was loud, fast-paced, lots of inbred-looking rednecks chased us with big chainsaws, plus they had some really innovative effects - trap doors set into ceilings and dead-end walls that didn’t expose the way out until the very last minute are just a couple examples. Again, we don’t like to give too much away.</p><p dir="ltr">Despite the cool effects and chainsaws, we think they were trying so hard to live up to the R rating that they kind of forgot to actually be scary. There were a lot of scenes that were just crazy inappropriate that will have you feeling like “WTF did I just watch?!” and definitely deserve an R rating, but there’s really nothing scary about watching a guy masturbate for a few minutes. It all amounted to a haunted attraction that felt like being in a B horror movie. You know the ones where girls with big boobs run from monsters in white t-shirts in the rain. There’s a lot of potential with this one. We recommend they watch Rob Zombie movies to really figure out how to merge sex with a scare. It can be done and you guys could do it.</p>',
  NULL,
  3,
  'http://scarehouseofthesouth.com/',
  'https://www.facebook.com/SCAREHOUSEoftheSOUTH?fref=ts',
  'https://twitter.com/SCAREHOUSESOUTH',
  NULL,
  NULL,
  false,
  '2017-09-05 07:12:45.04354',
  '2022-09-11 07:52:39.502296'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Terror Mills Haunted House 2016',
  '801 Mount Vernon Church Road',
  'Jackson',
  'GA',
  '30233',
  2016,
  'We have to admit, initially when we found out Terror Mills was a first...',
  '<p dir="ltr">We have to admit, initially when we found out Terror Mills was a first-year haunt we were not expecting much, but, WOOOW!!! They just plain GET IT! The vision this crew has is AMAZING and after the first 5 minutes or so it isn’t hard to see what we mean! The actors vary in age from children to adults and they all do an exceptional job! You can definitely tell that they love what they do. One thing that stood out for us was the use of lighting and effects coupled with the location. Tight, dimly lit corridors made us feel threatened, changes in elevation hidden by fog caught us off guard, and strobes strategically placed keeping the actors hidden created some serious disorientation and tension. To sum it up, this haunt was so well done… so scary, and super personal! We just can''t say enough good things about them and can’t wait to see what they do next year in their new location!!!</p>',
  NULL,
  4,
  NULL,
  'https://www.facebook.com/terrormills/',
  'https://twitter.com/terrormills',
  'https://www.instagram.com/terror_mills/?hl=en',
  NULL,
  false,
  '2017-09-05 07:04:28.803673',
  '2022-09-11 07:56:42.385803'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Six Flags Fright Fest - Georgia 2016',
  '275 Riverside Parkway Southwest',
  'Austell',
  'GA',
  '30168',
  2016,
  'What can you say about Fright Fest? It combines two of our...',
  '<p dir="ltr">What can you say about Fright Fest? It combines two of our favorite things in the world - roller coasters and haunted attractions! It’s monsters walking around everywhere; it’s a spooky atmosphere; it’s small scary walk-through haunts; it’s just fun!!! Some of the costumes and walk-throughs may be a little much for younger kids but overall we would still consider it family-friendly. In true theme-park-turned-haunted-attraction fashion, people are funneled through the haunts at a rate that the scare-factor tends to get lost. You are either missing the scare completely or watching the person ahead of you or behind you get it. Also, we were super frustrated because there was a problem with the legend on the printed maps and none of the larger park maps had been updated for the event making it difficult to find the haunted attractions. Hopefully, Six Flags can step up their execution in the future.</p>',
  NULL,
  3,
  'https://www.sixflags.com/overgeorgia/special-events/fright-fest-night',
  'https://www.facebook.com/sixflagsovergeorgia/',
  'https://twitter.com/sfovergeorgia?lang=en',
  'https://www.instagram.com/sixflagsovergeorgia/',
  NULL,
  false,
  '2017-09-05 07:00:33.256986',
  '2022-09-11 07:57:08.552078'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Paranoia Haunted House 2016',
  '2075 Marietta Highway',
  'Canton',
  'GA',
  '30114',
  2016,
  'Paranoia was AWESOME!!! Who else can make a person in a bunny costume...',
  '<p dir="ltr">Paranoia was AWESOME!!! Who else can make a person in a bunny costume super scary? They had two houses, Torture, and The Cellar, with a school bus that blasts heavy metal music to transport you between the two. Torture was more of a psychological scare - dark and foggy, more about what you can’t see than what you can, while The Cellar was full of super-detailed, gory scenes. There was so much to see and multiple scares in each room that kept us on edge the entire time. &nbsp;The actors were AMAZING and could and would touch you. That is a deal breaker for some people but from our experience, the idea of it is scarier than the actual touching itself! Overall this haunt is extremely well done and features creative, over-the-top effects that we have never seen done before. We don’t want to give too much away, but, if you enjoy haunts this is a MUST SEE! Easily one of our top three of 2016!</p><p dir="ltr">We had such an incredible experience at Halloween that when we found out they were doing a “Scary Christmas” we had to go! The Christmas-themed haunt was full of creepy little elves, a horrific Santa Claus, and the one and only GRINCH! Again, we were not disappointed! It was a holly, jolly, scary good time.</p>',
  NULL,
  5,
  'http://www.paranoiahaunt.com/',
  'https://www.facebook.com/paranoiahaunt/',
  'https://twitter.com/ParanoiaHaunted',
  'https://www.instagram.com/paranoiahauntedhouse/',
  NULL,
  false,
  '2017-09-05 07:01:47.100487',
  '2022-09-11 07:59:08.933362'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Fear The Woods 2016',
  '3565 GA-155 N',
  'Stockbridge',
  'GA',
  '30281',
  2016,
  'Fear the Woods was one of our top 3 haunts in GA for...',
  '<p dir="ltr">Fear the Woods was one of our top 3 haunts in GA for 2016. It has the perfect combination of scary, fun, action… well… EVERYTHING! We have visited them for the past 3 years and every year they get better and better! Originally you took a hayride out to a haunted trail with the option of walking through a small haunted barn with little to no actors afterward. Now, the revamped haunted barn is where the line starts and is full of scares, mazes, and creatures! &nbsp;If you have a phobia they probably tap into it! After the barn, you take a “terror transport” into the woods and get dropped off on the haunted trail which is definitely one of the best! &nbsp;It goes between indoor and outdoor sets and takes advantage of the landscape and eerie atmosphere the Yule Forest provides! Last year they added Pandemic, a super fun haunted combat mission (think Resident Evil), where you and a partner team up and hunt down zombies. Definitely one of the most intimate, original, and well-executed zombie shoots we’ve had the opportunity to experience. To top it off, &nbsp;they have a fun pumpkin shoot, fire eaters, and a reptile exhibit for the family. This not just a haunted attraction but a full Halloween experience!</p>',
  NULL,
  4,
  'http://fearthewoods.com/',
  'https://www.facebook.com/FearTheWoods/',
  'https://twitter.com/fearthewoods',
  'https://www.instagram.com/fearthewoods/?hl=en',
  NULL,
  false,
  '2017-09-05 07:02:59.780824',
  '2022-09-11 08:00:07.508844'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  '13 Stories Haunted House 2016',
  '320 Temple Ave',
  'Newnan',
  'GA',
  '30263',
  2016,
  'We’ve been to 13 Stories a few times and keep...',
  '<p dir="ltr">We’ve been to 13 Stories a few times and keep expecting it to get better but… no such luck. There are three different attractions - the main haunt, a zombie laser tag, and an experience called Sacrifice. The haunt is well constructed with fairly detailed scenes; however, where this haunt misses the mark is with costuming. The costumes consist of items like hospital gowns over street clothes… no, we’re not joking! Something about seeing jeans and sneakers under a bloody hospital gown kind of kills the vibe no matter how convincing the actor is. Hardly any masks are used and faces have minimal makeup. There is just an overall lack of character development. The actors are mostly younger kids which is great, but also contributes to the feeling of an amateur haunt when they don’t deliver and aren’t in character.</p><p dir="ltr">The laser tag could be fun, but it’s just not organized enough. The actors aren’t scary and they are all just floundering around in a big, mostly open space. It feels more like a flopping humans shoot than a zombie shoot.</p><p dir="ltr">Sacrifice is such a unique experience that it makes up a little for the rest. Your hands are tied, you are blindfolded, then separated from the people in your group. &nbsp;They also have the ability to touch you and take advantage of that using their hands and various objects like feathers. Kinda weird but cool. They had a kind of finale that you could opt out of if you weren’t up for the challenge.</p>',
  NULL,
  2.5,
  'http://www.13storieshauntedhouse.com/',
  'https://www.facebook.com/13Stories/',
  'https://twitter.com/13stories',
  'https://www.instagram.com/13stories/',
  NULL,
  false,
  '2017-09-05 07:14:36.810882',
  '2022-09-11 08:03:56.406747'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Nightmare Asylum 2017',
  '1350 Rumble Rd',
  'Forsyth',
  'GA',
  '31029',
  2017,
  'The Nightmare Asylum is an extremely small haunt put on by a local...',
  '<p>The Nightmare Asylum is an extremely small haunt put on by a local mechanic shop. We have visited this haunt in the past and we must first say that we really respect and admire what they do! &nbsp;</p><p>They have a really original concept of incorporating escape room elements into the haunt. They were doing it way before everyone started jumping on the escape room bandwagon in the past few years. Don''t get us wrong, we love escape rooms almost as much as we love haunts so it''s okay with us if more haunts continue to jump onboard.&nbsp;</p><p>In addition to the escape room aspects, they mix in a lot of winning ingredients - ducking for extended amounts of time under low ceilings, darkness, small spaces, feeling trapped, cool animatronics - but are still figuring out that perfect recipe.</p><p>This haunt was done on a budget very unlike your Netherworlds and Paranoias out there. The sets weren''t very detailed and costuming was very basic. Also, there is a lot of silence, and not the type of silence that fills you with a sense of impending dread... just silence. Lighting seemed to be lacking in areas where it was actually needed, especially when trying to use a lock mechanism, making already difficult tasks much harder. Then there were brighter areas that should have been darker to disguise the surrounding environment.&nbsp;</p><p>In most of the puzzle rooms, we did not even have time to realize we were in a puzzle room before the actor in that room started directing us. Damn... give us a chance to get to the door, see the lock, and discover the clues ourselves.&nbsp;</p><p>This small haunt really has the potential to be amazing with a few adjustments to their execution. With some added lighting in those puzzle rooms to highlight the locks and a little more thought into the clues and how the actors should interact (or not) with the people in those rooms could go a LONG way in increasing the scare factor. We sincerely hope they continue doing what they do and improving every year!</p>',
  NULL,
  2,
  'http://thenightmareasylum.com/',
  'https://www.facebook.com/The-Nightmare-Asylum-Haunted-House-649838305087038/',
  'https://twitter.com/tnahauntedhouse',
  NULL,
  NULL,
  false,
  '2017-10-08 22:07:02.938278',
  '2022-09-11 08:05:03.725429'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Nevermore Haunt 2017',
  '450 Mott St',
  'Baltimore',
  'MD',
  '21202',
  2017,
  'The Nevermore Haunt has the most amazing piece of...',
  '<p>The Nevermore Haunt has the most amazing piece of real estate in Old Town Baltimore. When parking things come off a bit sketchy, but as soon as we walked around the corner, it was like "WOW! What a location!!!" You cannot manufacture that kind of ambiance. Mostly abandoned storefronts lined both sides of the street with the haunt being one of the few occupied spaces nestled among them. This place felt like a legit ghost town. It is really authentic, unique, and special!<br><br>We had so much fun and enjoyed the historic theme. It was hard to believe this was only their 2nd year! The actors were very interactive, the sets were original, rooms featured unexpected twists, and they had some seriously cool props! They have found the perfect balance of props vs. people and surprise vs. psychological scares. It was really a great mix that kept things interesting.<br><br>The actors were awesome and seemed like professionals! They were invasive and scary, getting all in our space without touching us... wellllll, maybe a little. We have really enjoyed the acting aspect of haunted attractions this season. Having a great crew makes all the difference. Good actors can take a "meh" haunt and make it marvelous! In this case, they took a great haunt and made it extraordinary! &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br>An important note... don''t just show up! There are no lines because they don''t sell tickets; they sell time slots <span data-term="goog_1829658969" tabindex="0">in 15-minute</span> intervals. While this isn''t convenient for haunt hoppers like us (we hit 4 attractions that night) it really does help control the timing and flow, which is one of the most important things when it comes to execution.</p><p>Although we aren''t the biggest fans of drinking and haunting, The Nevermore Haunt partners with a local tavern to do a cool haunt tour. It starts at Manor Hill Tavern and then transports you on a private bus to Laurel''s House of Horror, The Nevermore Haunt and back to the tavern. You receive fast pass entrance into both haunts as well as three beer selections from Manor Hill Brewery.</p><p>There is so much potential at Nevermore our twisted minds were reeling with the possibilities. We would love to see the&nbsp;entire strip taken over with Halloween and horror-themed concessions, shops, and other attractions! If you live in the surrounding area or are planning a trip to the DMV during the Halloween season, be sure to pay these guys a visit!</p>',
  NULL,
  4,
  'https://thenevermorehaunt.com/',
  'https://www.facebook.com/thenevermorehaunt/',
  'https://twitter.com/nevermorebmore',
  'https://www.instagram.com/nevermore.baltimore/',
  NULL,
  false,
  '2017-10-14 17:16:11.482266',
  '2022-09-11 08:06:02.794389'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Terror Mills Haunted House 2017',
  '801 Mt Vernon Church Rd',
  'Jackson',
  'GA',
  '30233',
  2017,
  'Last year was Terror Mills'' first year but they didn''t feel at all...',
  '<p>Last year was Terror Mills'' first year but they didn''t feel at all like a first-year haunt and completely blew us away. *See 2016 review. This year was their first year in their new, MUCH BIGGER location... but they felt like a first-year haunt this time.<br><br>This team really has a talent for creating unnerving sets with the kind of themes that haunt your nightmares. Their scenes were detailed, creative, and have some cool lighting effects but still felt a little empty. &nbsp;Background music/sounds and more actors and/or animatronics will definitely take them to the next level.<br><br>Actors were out of place during our first walk through due to a malfunction. They reset and let us come through again. The second go-round was better but the actors were still nothing like the ones we experienced last year. This is the element that created our previous amazing experience. The "hillbilly" at the beginning who read the rules was so incredible and set a high bar the rest of the cast this year just couldn''t quite reach.<br><br>Costuming was moderate but appropriate with the themes.<br><br>Even though we didn''t have the same jaw-dropping experience this year, we still believe this crew has the vision!!! We are excited about them being in this HUGE permanent location. This is definitely a haunt to watch! We have a feeling they are going to BRING IT next year and only get better and better in years to come.<br><br>Lastly a word of advice to the actors... Have fun!!! Don''t be so worried about messing up lines or missing a queue, just stay in character and wing it!</p>',
  NULL,
  2.5,
  'https://www.facebook.com/terrormills/',
  'https://www.facebook.com/terrormills/',
  'https://twitter.com/terrormills',
  'https://www.instagram.com/terror_mills/?hl=en',
  NULL,
  false,
  '2017-10-06 02:41:50.999194',
  '2022-09-11 08:06:56.350918'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Paranoia Haunted House 2017',
  '2075 Marietta Highway',
  'Canton',
  'GA',
  '30114',
  2017,
  'Paranoia was our #1 rated haunt in GA last year. This year...',
  '<p>Paranoia was our #1 rated haunt in GA last year. This year not even close!! This was not just a fall from grace... it was a plummet! How? Why?<br><br>The sets were all new and really well done, but did not incorporate any of the scariest elements from last year which made it our fave. They also lacked a cohesive flow. It felt like we were walking into the scenes and not in a scary, immersive way but more like an "is this the way we''re supposed to be going?" kind of way.<br><br>The length of both houses was similar to last year, but with all of the new set design, it seems they have forgotten about the actors. The costuming and character development just wasn''t there. Regular clothes with blood-splatters do not make for a very good costume, especially when that''s pretty much all you see. Not very creative, definitely not what we were expecting from them.<br><br>Like many of the haunts we''ve visited this year, Paranoia tried to incorporate more immersive elements but did not execute this very well. The bus ride experience that was so unique, fun, and scary last year was a complete bus-t. What happened?!<br><br>Overall, it sucks to say, but our most anticipated haunt of this season... was very disappointing. You guys need to go back to the drawing board and come back strong next year!&nbsp;</p>',
  NULL,
  3.5,
  'http://www.paranoiahaunt.com/',
  'https://www.facebook.com/paranoiahaunt/',
  'https://twitter.com/ParanoiaHaunted',
  'https://www.instagram.com/paranoiahauntedhouse/',
  NULL,
  false,
  '2017-09-28 17:43:24.827578',
  '2022-09-11 08:08:59.758578'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Camp Blood 2014',
  '2277 Whooping Creek Rd',
  'Carrollton',
  'GA',
  '30116',
  2014,
  'Camp Blood has such a great vibe and a lot of potential. The atmosphere feels very ...',
  '<p dir="ltr">Camp Blood has such a great vibe and a lot of potential. The atmosphere feels very much like an overnight summer camp (think Camp Crystal Lake). There’s a cozy bonfire surrounded by what looks like bunkhouses, canoes, hot chocolate, marshmallow roasting, and other concessions. Sadly, the trail did not further reinforce the theme and just didn’t deliver. The costuming, effects, and actors were all lacking and the scares just weren’t there. Also, it was very obvious that they needed more actors to fill the dead areas, which is a common problem at haunts. This is such a great theme that can go so far. We hope to see them take advantage of this in the future because it could truly be something special and worth attending every year.</p>',
  NULL,
  2,
  'http://www.campblood.com/',
  'https://www.facebook.com/camp.blood.haunt?ref=hl',
  NULL,
  NULL,
  NULL,
  false,
  '2017-09-05 06:55:39.808008',
  '2022-09-11 08:48:49.156817'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Fear the Woods 2021',
  '3565 GA-155 N',
  'Stockbridge',
  'GA',
  '30281',
  2021,
  'We’ve been visiting Fear the Woods almost every year since 2013 but, sadly, missed the last two years...',
  'We’ve been visiting Fear the Woods almost every year since 2013 but, sadly, missed the last two years. COVID kept them closed last year and 2019 was a really rainy haunt season in GA. Being that Fear the Woods is mainly an outdoor attraction, they were closed due to the rain a lot that year, and we just couldn’t seem to catch them open. Needless to say, we were SUPER STOKED to restore our tradition and check them out in 2021!r
r
Fear the Woods offers 3 separate attractions – the haunted house, a laser zombie shoot called Infestation, and the Terror Transport that takes you down to the final attraction, the haunted trail. But before you experience any of these attractions, you enter into a midway area that puts down the fall vibes hard. There are games, concessions, a pumpkin patch, and a stage that features some great entertainment, like fire dancers.r
r
First up, as always, was the haunted house. While they’ve made improvements over the years, we still love the original bones of this house. Tight corridors, interesting and uneven floors, low areas that require ducking, dark spaces – all features that require you to not just walk through the attraction but interact with it. r
r
When exiting the house, you’re back in the midway area again and get to enjoy the atmosphere and entertainment, before taking a little fall stroll down to Infestation. We were REALLY excited to see that they’d added a lot to the zombie shoot since our last visit! They’ve created a much more immersive environment by adding building facades in the corn field that the zombies can hide in and that you sometimes get to walk through. We really LOVE how video gamey their whole experience feels! We’re still sold that Fear the Woods offers one of the BEST zombie shoots we’ve ever done!r
r
After an exhilarating survival adventure of killing zombies in the corn stalks, we boarded the Terror Transport to take us to the last attraction of our 2021 GA Haunt Tour, the Fear the Woods haunted trail. Unfortunately, the “Terror” Transport was more like a party bus with dance music blasting and laser lights illuminating the interior. We remember past experiences on this bus being really fun and serving up additional scares on the way to the haunted trail. This time we felt like we just stepped into a mobile rave that no one wanted to attend. We love the idea of the bus ride, but we really hope in the future they’ll continue the Halloween/haunted attraction atmosphere during this short trip.r
r
The haunted trail at Fear the Woods has always been their main attraction and with good reason. The trail is long, a good 20-minute trek, and features multiple detailed sets built along the way. r
r
We have a feeling that Fear the Woods was experiencing the same issues that many haunts complained about this year including lack of actors. There was a lot of dead space throughout both the house and the trail, and the majority of the actors we did encounter were simply not scary - no jump scares, no creepy banter, just a lot of screaming. The actors’ costuming and make-up were always scene appropriate, but nothing really stood out or wowed us. r
r
There were a few new things they instituted this year including timeslot ticketing and very strict hours. When they say last tour at 11:30, they mean it! Don’t show up 4 minutes late even with a purchased ticket and expect to get in. Also, groups of 8-10. We understand needing to stay within the confines of the timeslots, but for a haunt of their size there is absolutely no way a group of 8-10 people is going to have the best experience that Fear the Woods usually offers. We’re not sure if they will continue with these policies next year or if they were due to COVID.r
r
This year, Fear the Woods just did not live up to our expectations, and we left feeling disappointed. For a haunt that we have watched evolve over the years and have always been huge fans of, it just wasn’t the same. The environment didn’t have the usual energy, and most importantly, the scares just weren’t there for us. r
r
Despite our personal feelings, Fear the Woods still serves up a full haunted fall experience. Their three very different attraction experiences plus the midway provide a full night of Halloween fun for the whole family!',
  NULL,
  4,
  'https://fearthewoods.com/',
  'https://www.facebook.com/FearTheWoods/',
  'https://twitter.com/FeartheWoods',
  'https://www.instagram.com/fearthewoods/',
  'https://www.youtube.com/channel/UCPU6NRh3OAtgjMnd9llfTfw',
  false,
  '2021-12-11 06:30:29.643894',
  '2023-08-06 03:06:38.115222'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Lake Joy Trails of Terror 2021',
  '428 Lake Joy Rd',
  'Kathleen',
  'GA',
  '31047',
  2021,
  'We left Lake Joy Trails of Terror covered in fake blood and glitter and it was… AMAZING! ',
  'We left Lake Joy Trails of Terror covered in fake blood and glitter and it was… AMAZING! r
r
We were super excited, remembering how much fun we had on our previous visits, as we drove down the long, winding dirt road that leads to Lake Joy Trails of Terror. It had been a while since we’d last checked out this haunt, and we were really looking forward to seeing their new additions. As the haunt grounds came into view a monster came running across the field at our car, only to be stopped by the low fence surrounding the property. We could also see a stage set-up, and there was a live band performing! Even at the late hour we arrived, they had a great turnout for opening weekend and what better way to keep the masses entertained than with a live band… nice touch!r
r
We got out of the car and walked towards the ticket booth. We noticed among the offerings an option for an “extreme” experience, so of course, we had to go with that. They gave us some glowing wrist bands and handed us our souvenir t-shirts. “We would rather grab these on our way out,” we politely requested (so we wouldn’t have to walk through the haunt carrying t-shirts) but we were quickly informed that we needed to put them on… right now.   Ohhh… kayyyy… ??? We obediently obliged and headed for the queue line that thoughtfully wound its way back and forth in front of the stage while the speakers pumped out the band’s metal version of songs like Lady Gaga’s Bad Romance.r
r
The haunt started in true Lake Joy fashion, a winding path through dark woods with claustrophia-inducing tunnel structures and terrifying rooms built along the way. Lake Joy uses no animatronics or super fancy expensive props in their builds. Their sets are built using mostly everyday-type items in the most interestingly twisted ways – think plastic tarp, mattress toppers, and pool noodles. This team really “gets” scary, and we think they could deliver up the fear with just about anything. Scare MacGuyvers!r
r
Lake Joy Trails of Terror doesn’t really follow a cohesive storyline throughout the entire experience (except for a few consistent characters) but instead gives you separate mini stories with transitioning tunnels between each. It’s incredible what they do, and these guys do it EVERY YEAR, completely re-designing their trails and theming for each haunt season. Impressive!r
r
We went through the first few rooms with minimal interaction with the scare actors. They really weren’t touching or engaging us more than the usual well-placed jump scare and creepy bantering. For the haunt-goers who didn’t brave the extreme experience, they’re getting a great show, but we were starting to wonder what this whole “extreme” experience was all about…. When all of a sudden, we were both snatched up, our wrists duct taped together, and were led to every girl’s nightmare, the quintessential “rape van.” We were both thrown in the back and given a shower of fake blood while the van violently whipped us back and forth over the uneven terrain. Wowwwwwww… if that wasn’t enough to send a true haunt lover into a haunt-gasm we don’t know what is... but it didn’t stop there. r
r
We faced several torture cages and restraining devices along the way where we basically got to become a part of the show while other guests walked by us, probably wondering what type of insane people enjoyed what was happening to us.r
r
Costuming ranged from minimal make-up to one extremely detailed mummy, and the actors at Lake Joy are top-notch, dedicated scare pros! r
r
Lake Joy is an extremely fun, scary, well-executed haunted trail that is a must-see! Whether you decide to endure their extreme experience or not, you’re going to leave this haunt feeling exhilarated from this terrifying trek through the woods.',
  NULL,
  5,
  'http://www.lakejoytrailsofterror.com/',
  'https://www.facebook.com/OfficialLakeJoyTrailsofTerror',
  NULL,
  'https://www.instagram.com/lakejoy_trails_of_terror',
  NULL,
  false,
  '2021-10-04 14:58:07.504259',
  '2023-08-06 03:07:22.728441'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Haunted Montrose 2021',
  '1728 2nd St',
  'Montrose',
  'GA',
  '30165',
  2021,
  'We can still remember our first time visiting Haunted Montrose - the fire...',
  'We can still remember our first time visiting Haunted Montrose - the fire from the silo shooting into the sky, the hayride between attractions, and the pitch-black attraction The Raven. A lot has changed over the years, the things we remember most from our first visit are gone now but their mainstays - the asylum, Havoc, and the Old Slaughterhouse (rebuilt in 2017) remain. On this visit, we were excited to see all their new additions.r
r
Haunted Montrose features 5 separate haunted attractions – the asylum, Havoc, Rave, the cornfield, and the classic Old Slaughterhouse. There’s no cohesive story tying them all together, except for the infamous Pigman who seemed to make an appearance everywhere, but each attraction is themed to perfection.r
r
The asylum features some incredibly detailed sets and tons of disturbed patients lurking all over the rooms of this hospital. There was one utterly disgusting bathroom scene. If they added some stink pods it would be so much nastier and more believable!r
r
Havoc is definitely one of the best 3D haunts we’ve ever experienced. This attraction is floor-to-ceiling INCREDIBLE! The art in here is insane and ranges from clowns, shrooms, skulls, consciousness, and everything in between. They have some really cool floors in there that we absolutely LOVE! While the art is spectacular (we could walk through every day and never get bored with it) the music on the other hand… could use a revamp. It’s been the same ever since we’ve been going.r
r
Rave usually feels like a post-apocalyptic dystopia where the air is so thick that you can’t see your hand in front of your face, and the hard-core punk music is playing so loud you can’t hear yourself think. You have to feel around to find your way out while MadMax-esque actors reach at you through the fog.  Unfortunately, this time the fog wasn’t heavy enough to provide the sensory deprivation/overload contrast this haunt requires to be successfully scary. Not only could you see where you were going but you could also see everyone else filing through too. Weaving around the fenced in corrals just became very tedious, making us feel like we were in a mamba line. While mamba-ing through Rave, we’d caught up with the group in front of us and the group that was behind us caught up as well. Now our newly formed mass of people ended up in a single file line, exiting out into corn field.r
r
It was nice and dark outside, and the weather was perfect for a corn maze. There was a thin path carved out through the tall stalks, and our single file line continued to file through. There weren’t many actors in the corn but because of our huge group, the actors that were out there weren’t very effective. The ground was surely uneven, and we love the idea of being off balance trying to escape the corn field, but they are much scarier in smaller, more isolated groups.r
Just when we thought things couldn’t get worse, the biggest haunt-foul happened when the guy in front of us pulled out his phone to light the way. Noooooo… r
r
Managing the flow of people is critical when you get to be as big as Haunted Montrose. It’s great to have hundreds of people show up to your haunt, but you must properly manage that volume to ensure everyone gets through and your customers, especially your avid haunt-goers, have the best experience possible. In our previous visits, we recall being stopped in between the haunts, which really helped with crowd control, but now you just flow from one into the next. r
r
The acting was lackluster, even though in many cases, it was because of the mamba line and not the actors’ fault. Pigman kept just randomly appearing, storming past us like Pyramid Head from Silent Hill or Nemesis from Resident Evil. r
r
Overall, our experience this year didn’t live up to our expectations, but it would still be very hard for us not to recommend Haunted Montrose. Their sets are spectacular, their costumes and make-up look great, and you get a lot of scare for your buck with five attractions in one. With just a few small tweaks, their show will get back on track, so we’re sure if you go later this season, you’ll have a very different and much better experience. ',
  NULL,
  4,
  'https://hauntedmontrose.com',
  'https://www.facebook.com/pigman.hauntedmontrose',
  'https://twitter.com/hauntedmontrose',
  'https://www.instagram.com/hauntedmontrose',
  'https://www.youtube.com/user/HauntedMontrose',
  false,
  '2021-10-04 15:09:12.704515',
  '2023-08-06 03:09:10.036407'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Nightmare''s Gate Haunted House 2021',
  '3931 Longview Dr',
  'Douglasville',
  'GA',
  '30135',
  2021,
  'Nightmare’s Gate Haunted House is another local GA haunt we’ve been visiting for yearsss, ever since...',
  'Nightmare’s Gate Haunted House is another local GA haunt we’ve been visiting for yearsss, ever since their previous location. We were heartbroken when they were forced to move a few years back, but we are fans and visited them the first year in their new space. They were still getting acclimated, and we wanted to give them some time before checking them out again, so it had been a while since our last visit. The Nightmare’s Gate team has definitely settled into their new space… just in time to move again! They’ve found another new location and will be moving out of their current spot attached to the bowling alley and into their own building. This one will be their permanent, forever home…. And we are SUPER excited for them! r
r
This year Nightmare’s Gate featured not one but TWO separate attractions – their classic haunted hospital PLUS the newly added Terror Falls which is in their new building. Luckily, this new building is just right across the street from their current space, so it made experiencing both haunts convenient and will hopefully make this move a little easier on them.r
r
Nightmare’s Gate has always done a really great job of immersing you in their psychotic world. Their sets are extremely detailed and just make sense! This is the cohesive type of haunt we love to see! As you descend into the belly of the hospital, the boiler room FEELS like a boiler room, and every other inch of the hospital is just as meticulously designed. We seriously have no idea how they were able to so thoroughly transform a space next to a freaking bowling alley into a hospital ward. You can’t even hear any trace of the crash of pins! It’s almost sad they are going to have to rip everything down and rebuild... yet again…r
r
The actors at Nightmare’s Gate are seasoned pros and SUPER engaging and interactive! These guys don’t have to only rely on jump scares to terrify you… everything they say and every move they make has been carefully crafted to bring their character to nightmarish reality. Not sure if it was because they had to staff two attractions this year or if Covid was still affecting their show, but there seemed to be less actors and more dead space than usual which resulted in a less scary visit for us this time. There are also some mainstay characters, the Nurse and the patient, Lannister, that we look forward to seeing every visit. But this time our buddy Lannister wasn’t there! We always enjoy his deranged banter, so his presence was definitely missed… even though we got to spend some quality time with the Nurse!r
r
Because these characters’ personalities have been so thoughtfully honed, it’s a tall order to match makeup and costuming to ensure they are really brought to life, but the Nightmare’s Gate makeup team is up for the challenge! They use a great mix of makeup and masks and ensure everything is appropriate to the character and their space.r
r
After the original haunted hospital experience, we travelled across the street into their new building and new attraction Terror Falls! Despite having only gotten started in June, Terror Falls featured a set design element SOOO spectacular that we can’t even put it into words!!! Trust us… you need to see this one for yourselves! We will say this though, it’s not called Terror Falls for nothing! Although this addition was awesome, the haunt undoubtedly had the feeling of a work in progress but was still impressive given the amount of time they had to work on it. Overall, it felt like a preview of what’s to come versus a full attraction, but we can see where it’s going, and we are HERE FOR IT!!!r
r
A REALLY DOPE bonus about this trip to Nightmare’s Gate was that we ran into a group of people who follow us on social media! It’s so rewarding to meet fellow Haunt Junkies and get to compare notes. We are truly thankful for all our followers and love to hear that people checked out haunts based on our recommendations… and Nightmare’s Gate and Terror Falls are definitely haunts worth checking out! While we will continue to miss the old location and experience, this incredible team surely isn’t lacking vision, so we are really looking forward to seeing what’s to come in their new building!',
  NULL,
  3.5,
  'https://nightmaresgate.com/',
  'https://www.facebook.com/nightmaresgatehauntedhouse?ref=hl',
  'https://twitter.com/nightmaresgate',
  'https://instagram.com/nightmaresgatehauntedhouse',
  'https://www.youtube.com/channel/UCNei6rhyMXUjQi8ShQkfnHw',
  false,
  '2022-05-23 08:07:33.447614',
  '2023-08-06 03:10:06.219144'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Paranoia Haunted House 2021',
  '2075 Marietta Hwy',
  'Canton',
  'GA',
  '30114',
  2021,
  'Paranoia put on a production unlike any other! It all began with their opening ceremony complete with fireworks, through their high intensity queue lines, and even the "carn-evil" midway. The best part is that their attractions...',
  'Paranoia put on a production unlike any other! It all began with their opening ceremony complete with fireworks, through their high intensity queue lines, and even the "carn-evil" midway. The best part is that their attractions totally lived up to the anticipation and hype that was built up outside.r
r
When we arrived at Paranoia it was PAAACCCKKKEDDDDD!!! Heavy metal music was blasting, columns of fire were shooting into the night sky, and the energy was intense and infectious! The queue line actors, as always, were putting on an incredible show. Some were lurking around just being creepy while others tossed candy into the crowd. There was one actor, we’ll call her “the traveler” who was really nailing creepy. Her costume featured so many disturbing details that we discovered something new every time we looked at her.r
r
Photo ops were EVERYWHERE, and they weren’t only for the haunt go-ers. There were platforms for the haunt actors to strike their scariest poses too. It felt like we were waiting in line to get into the town’s most lit nightclub not a haunted attraction. r
r
It’s a good thing Paranoia keeps their queue lines jumping, because you’re going to be in them for a while… we’re talking an hour plus in the Fast Pass line! So be prepared to make a night of it, wear comfortable shoes and weather appropriate clothing.r
r
Paranoia has two attractions, separated by midway. The Void and Suffering, each with a very different feel. The Void is high energy with lots of in-your-face actors and scares while Suffering has a more toned down, eerie vibe. r
r
The Void is a high-tech laboratory where there’s been some crazy human experimentation going on. This haunt is a serious assault on the senses. There’s so much to look at, it’s loud, and scares are coming at you from every angle.r
r
The two haunts are separated by a midway that offers a vast contrast from the headbanging-inducing death metal from the queue line. We stepped back outside after The Void into a dance party! There were free carnival games including darts, a free-throw, ball toss, all with a Paranoia twist, of course. The metal music was replaced by a DJ playing popular party music. “Who’s trying to get their Cupid Shuffle on before the next haunt?” Best part of the midway this year was that we ran into Tyler effin West, owner of ScurryFace. Shout out to the whole ScurryFace team!r
r
Now that our guard was down and we’ve had some fun, we finished off with Suffering. Again, a much different feel from The Void. From a high-tech lab to a run-down house in the woods. This haunt is definitely going for the psychological scare. It’s more about what you think may be lurking in the darkness than what you can actually see.r
r
Both haunts feature spectacular set design, really well-developed theming and characters, and a great mix of animatronic and actor scares.r
r
Unlike all the other haunts we visited this year, Paranoia was not hurting when it came to the number of actors. They were all over the place - outside keeping the waiting customers wentertained and inside hanging from the ceilings, crawling on the floors, and hiding in the shadows.r
r
Despite Paranoia becoming “Hollywood-level” they haven’t lost sight of the main reason people go to haunted attractions…  the scare!!! Our only criticism here is that… we want more! We wish the haunts were longer.r
r
Paranoia was the Halloween season’s scary party that everyone wanted to get an invite to, and guess what? Everyone is invited! So go get your scare and party on with Paranoia!',
  NULL,
  5,
  'http://paranoiahaunt.com/',
  'https://www.facebook.com/paranoiahaunt/',
  'https://twitter.com/paranoiahaunt13',
  'https://www.instagram.com/paranoiahauntedhouse/?hl=en',
  'https://www.youtube.com/user/ParanoiaHaunt',
  false,
  '2021-12-11 06:19:53.571259',
  '2023-08-06 03:11:41.020864'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Terror Mills Haunted House 2021',
  '801 Mt Vernon Church Rd',
  'Jackson',
  'GA',
  '30233',
  2021,
  'Terror Mills Haunted House holds a special place in our hearts; they’re the ...',
  'Terror Mills Haunted House holds a special place in our hearts; they’re the first haunt we visited under the name Haunt Junkies. But despite this nostalgia and being in our home state, we had not visited for a while. We were lucky enough to experience this haunt in their very first season when they were in a large, old chicken coop. We enjoyed them so much we went the next year, but they had moved into their current location. Now they are in their 6th year! Wow… time flies! We absolutely could not wait to see how this team had grown into their newer space over the past 4 years. And grow they did!r
r
In addition to nearly completely filling up their building space, Terror Mills also added a ¼ mile haunted trail to their attraction this year. What a GREAT addition! If we’ve said it once, we’ve said it a thousand times… we absolutely LOVE haunted trails! Nothing says spooky season more than walking through the woods at night, fall smells wafting through the air, the dead leaves crunching under your feet… and under the feet of whatever else is lurking out there in the shadowy dark…r
r
Now, despite their growth, Terror Mills has still remained a more old school-style haunt, which we were really happy to see. You won’t find any pricey animatronic or pneumatic props here, just a husband and a wife, their team, a deep love for and understanding of all things scary, plus A LOT of hard work creating incredibly creepy sets and themes. Every set feels so real because it is. Most of Terror Mills themes center around real-life backdrops - broken down houses, dirty kitchens, eerie old circus tents, the woods - and then suddenly something other-worldly or shockingly gruesome smacks you in the face.r
r
The first part of Terror Mills haunted house was about Nightmares and we encountered many sleep-deprived characters who warned us about someone who would get us in our sleep. Freddy? we wondered. Nope, even worse, an evil killer clown! After watching the dream clown slaughter a poor girl, he lured us into a dark and sinister Wonderland. Our trip (pun intended) into Wonderland started with a mushroom-infused 3D blacklight experience, included all your favorite characters with a psychotic twist, and ended with the Queen of Hearts, well… doing her thing!r
r
The Trail at Terror Mills is another perfect example of less is more. We were the only ones out there, so it was eerily quiet. The absolute darkness was only sparingly interrupted by strategically placed lighting that didn’t really illuminate anything around us but more so acted as a guide, so we didn’t lose our way… Gooo towards the lighttt…This did not stop our dumb asses from venturing off the path a few times and running into some real-life spiderwebs! This is not a joke with the giant Joro spiders taking over GA right now!!!r
r
There were minimal actors hiding in the darkness, which may have been on purpose or may have been due to the big homecoming game that many of their high-school actors chose to go to instead of scaring the bajeezus out of people. Nevertheless, it totally worked for us! The trail featured several small but creepy vignettes along the way and a few larger structures that we walked through. Again, first year for the trail so we would love to see them continue to build upon it, but what little they did have, we really enjoyed!r
r
Costuming and make-up, while not elaborate or over-the-top, fit in well with their theming and had us thoroughly immersed in the whole haunted experience. The white rabbit was one of our favorites. Their actors’ skill levels widely ranged, because as we mentioned before, Terror Mills features a lot of younger haunters just getting started… and scaring ain’t easy! We’re sure they’ll all grow into their characters as the season progresses and with the guidance from some of their more seasoned actors.r
r
Another addition this year was the High Falls Wing Depot food truck... er… bus. Their decked-out school bus offered everything from cheese nachos to their famous “ghetto” burger and nasty dog. We had a long drive ahead of us, so we just grabbed some quick onion rings, but they were FIRE! We recommend showing up to Terror Mills hungry and grab you some delicious food bus grub. You’ll thank us! r
r
The owners of Terror Mills have an amazing vision, and we had a scary fun time! We’re looking forward to visiting them again and again and watching them continue to grow! r
',
  NULL,
  4,
  'http://www.terrormills.com/',
  'https://www.facebook.com/terrormills/',
  NULL,
  'https://www.instagram.com/terror.mills/',
  NULL,
  false,
  '2021-10-04 15:21:06.469849',
  '2023-08-06 03:11:49.319129'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Village Haunted Experience 2021',
  '6905 Virlyn B. Smith Road',
  ' Fairburn',
  'GA',
  '30213',
  2021,
  'This was the first year the grounds of the GA Renaissance Festival were transformed into the outdoor haunted experience, The Village. This production was...',
  'This was the first year the grounds of the GA Renaissance Festival were transformed into the outdoor haunted experience, The Village. This production was put on by 13 Stories Haunted House and when we heard that, we were a little concerned because our previous experiences at 13 Stories have been less than amazing. But, come on, the GA Renaissance grounds?! Just the space alone has massive potential, but unfortunately, as expected… it was a flop! r
r
The theming was all over the place even though the grounds lent themselves to a number of themes that would have translated extremely well – Resident Evil’s The Village, the Black Death, or even just solid renaissance/Middle Ages theming, but instead we got what felt like 13 Stories in a different location – non-cohesive theming, basic and bland costuming… like actors with hospital gowns thrown over their street clothes aimlessly wandering around… IN THE MIDDLE AGES!r
r
The acting was uninspiring, and the set-up didn’t do much to help in that department. The grounds of the festival are sprawling and very open making it difficult for actors to hide or sneak up on someone, so the tried-and-true jump scare was pretty much out of the question in most places.r
r
There was one actor who gets MAJOR props from us! She was a one-person show out there! She kept popping up everywhere and did a great job of keeping us interested and engaged with spooky banter and creepy antics. Maybe she could hear our consistent complaints as we traversed the festival grounds and tried to single-handedly save the haunt. Either way… BRAVO!r
r
The length of the trail was amazing, but unfortunately, it felt more monotonous than exciting. We found ourselves wondering how much longer it was going to be instead of eager to see what was coming up next.r
r
Luckily, The Village has a lot more to offer than just a lackluster haunted attraction. There are mobile escape rooms, a zombie shoot, foam party, and tons of food concessions including the Renaissance Festival staple, turkey legs. There were also many of the fun games you are accustomed to seeing during the festival like archery and axe throwing. This area has an AMAZING VIBE and that alone makes a trip to The Village a very worthwhile fall experience.r
r
We realize this review is much shorter than most of the reviews we write, but this was a tough one. There really was little worth mentioning so instead of just slandering the haunt, we’re rolling with “if you don’t have anything nice to say, don’t say anything at all.”r
r
The Renaissance Festival deciding to turn their grounds into a haunted attraction during their “off-season” is an absolutely BRILLIANT idea, but not sure if 13 Stories was the right haunt to partner with to make it a success. Maybe they now understand the challenges of the space and will be ready to tackle and solve them in the years to come…  Only time will tell…',
  NULL,
  2.5,
  'https://www.13storieshauntedhouse.com/village',
  'https://www.facebook.com/thevillageatlanta',
  NULL,
  'https://www.instagram.com/thevillageexp',
  NULL,
  false,
  '2022-05-23 04:54:39.604806',
  '2023-08-06 03:12:49.775637'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Trail of Terror 2021',
  '3760 Friendship Cir,cle',
  'Buford',
  'GA',
  '30519',
  2021,
  'This was our 2nd year visiting the Trail of Terror and their continued...',
  'This was our 2nd year visiting the Trail of Terror and their continued improvement and growth was evident. Even the ticket booth got a major upgrade this year! They have a huge piece of land, so they definitely have the space to continue building, and we are HERE FOR IT!r
r
Trail of Terror sits on this amazing property that fog settles on like a scene from The Mist. The queue line laces back and forth through the hazy open field where broken-down cars are strewn about. If you’re lucky, you may get to see Sweettooth go all Evil Knievel and jump over those cars on his minibike. People waiting in the line also get a full view of the guests before them hauling ass out of the woods screaming!r
r
The trail is about a 25-30-minute hike through some very uneven and heavily wooded terrain. It gets really dark out there and they don’t do much to light the path, in the best way though! We LOVE how they incorporate strobe lighting along the trail creating this sense of movement in the tall, looming trees. To add even more to the darkness, they’ve built lots of fully enclosed tunnels through the woods along with their open-air sets. These are our favorite!r
r
Trail of Terror doesn’t have any particular storyline as you wander through their dark woods - just a bunch of scary randomness. The sets range in subject matter as their characters do, but they always make sense together. You’re going to encounter hillbillies, cults, scarecrows, and lots of clowns, just to name a few. This crew takes a lot of pride in developing their characters, and the costumes have more detail than you can really appreciate in the darkness.r
r
The sets are not super detailed, and their overall construction is incredibly simple; but they are SO EFFING EFFECTIVE! Some plywood, tarp, fog machines, and strobe lights are all Trail of Terror needs to terrify you! There is one thing this haunt does and does EXTREMELY well, sensory deprivation! They utilize this technique often in the enclosed tunnels on the trail either enclosing you in pitch black or enveloping you in thick fog. Then they throw in a crazy-ass clown (or a few) banging on tunnel walls, taunting you, reminding you that they are out there just waiting. It is the most disorienting feeling to be stuck in those tunnels only to come out into dark woods potentially face-to-face with one of those psychos! You lose all sense of direction and feel incredibly unsettled as you begin walking along the open trail again. r
r
Trail of Terror has an amazingly dedicated cast of characters. Despite the still wet and muddy conditions from a few days of rain, these guys were rolling through the mud all over the trail, hanging from bungee cords in the trees, and climbing all over the sets. Their characters are interactive, fun, extreme, and most importantly scary! We really appreciate that even the youngest of their scare actors knows that just screaming your head off at people isn’t the way to go!r
r
“This ain’t Netherworld.” Trail of Terror is not a haunt to visit just to be entertained. They arer
focused on FEAR and want nothing more than to scare the crap out of you! You are definitely going to want to check them out, but only if you’re ready…r
',
  NULL,
  4.5,
  'https://bufordtrailofterror.com/',
  'https://www.facebook.com/trailofterror187/',
  NULL,
  'https://www.instagram.com/trail.of.terror/?hl=en',
  NULL,
  false,
  '2021-10-11 00:15:57.474732',
  '2023-08-06 03:12:58.771795'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Zombie Farms 2021',
  '568 Smithonia Road',
  'Winterville',
  'GA',
  '30683',
  2021,
  'Zombie Farms has been practically in our backyard for years, but this was our first time checking them out. WTF!...',
  'Zombie Farms has been practically in our backyard for years, but this was our first time checking them out. WTF! When we arrived, we had no idea what to expect… it felt like we were visiting old friends as we pulled into what looked like a driveway and drove up to the family home. As we continued past the house down the rutted driveway, we realized that this family home was nestled on a HUGE piece of property! We were led to a parking area in a field, and it was packed!  r
r
It had been raining pretty hard in GA for the past few days, but tonight the weather was clear and beautiful… perfect for an outdoor trail! As we walked down the entrance path, we stopped to talk to several of the groups that had just experienced the haunt and they all had one thing in common – EXTREMELY muddy shoes. One group had worn their Jordans and they were DESTROYED. You gotta know better than to wear your fly J’s to a haunted attraction, especially an outdoor one!r
r
The path led into a little midway area centered around a giant old tree all decked out for the Halloween season, and the whole space was glowing with green light to match the Zombie Farms logo. They also had a building selling snacks and merchandise. We were directed to the queue line that snaked back and forth up to their ticket booth. The line was bordered by picnic tables on both sides, and they also had an inviting fire-pit. Zombie Farms was putting out the fall vibes hard!r
r
The first attraction was a rope maze. This was literally a rope pulled between posts leading through dense trees. The rope path would break off and lead in different directions forcing us to choose which way to go. There wasn’t anything out there in those woods - just us, the trees, and well, the rope… until we started running into other people. We saw people on other parts of the rope path that said they’d been lost out there for at least an hour. Luckily, we mastered this maze in less than 20 minutes with only needing to backtrack once. r
r
The rope maze directed us into a small outdoor museum of cursed artifacts, where the very gracious curator told us that we would next be meeting the storyteller. r
r
But before meeting the storyteller, we were led into yet another area, this one with a TV (that turned out to be just one of many). We watched a video that introduced us to Zachary, who needed our help with rescuing a young boy from someone called the Shadow Collector. We were quickly beginning to realize what a production this backyard haunt really was!r
r
After this intro, we got to meet the real storyteller. This is the kind of guy you want telling spooky stories around a fire; he really knew how to pull us in. He eloquently gave us some more detail about Zachary and the Dimension of Shadows that we would have to travel into to rescue the boy. The realms in the Shadow Dimension, the storyteller explained, were memories but like shadows were dark and distorted. r
r
Once we arrived in the Shadow Collector’s domain we traveled through ghost towns, creepy deserted playgrounds, mine shafts, and orphanages. Each of the scenes at Zombie Farms started with a TV monitor that played a quick video of the storyteller telling us a little bit more of the story of Zachary and the boy we were supposed to be rescuing from the Shadow Collector. SUPER COOL!r
r
In addition to these storytelling monitors, the lighting and sound were so detailed you’d expect to see them in an indoor haunted attraction not outside along a trail. The sets were extremely well done even though the most common materials we saw were pallets, tarp, and skeletons. Simple and effective!r
r
The conditions on the trail were muddy, exceedingly muddy in some areas, and that really prevented the actors from moving around or doing much more than attempting to help people through the damn near ankle deep mud. The actors in the enclosed sets were more effective and you could actually see the costuming. They used a lot of familiar characters like the Nun and Interview with a Vampire-style vampires, but also incorporated some original characters and costuming.  r
r
Zombie Farms is no backyard home haunt despite being, well, a haunted trail in a backyard; they are a full-on haunted production! They change their theme and sets every year, many times with their stories carrying over multiple years. This year is the first of their Neverland trilogy. Get it? “Shadow” Collector, lost boy… These guys are INCREDIBLY smart and communicate their story exceptionally well! This ABSOLUTELY is a haunt to see… just make sure to check the weather before going!',
  NULL,
  4,
  'https://www.zombiefarms.com/',
  'https://www.facebook.com/ZombieFarmsOfAthens/',
  NULL,
  'https://www.instagram.com/zombiefarmsofathensga/?hl=en',
  'https://www.youtube.com/user/zombiefarmsofathensg',
  false,
  '2021-10-11 00:17:06.038723',
  '2023-08-06 03:13:06.264572'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'DarkSyde Acres Haunted House 2022',
  '11375 Rowe Rd',
  'Jonesville',
  'MI',
  '49250',
  2022,
  'The drive out to DarkSyde Acres was an experience all on its own. It was freaking scaryyy! We''re talking ...',
  'The drive out to DarkSyde Acres was an experience all on its own. It was freaking scaryyy! We''re talking pitch black, dirt and gravel roads, “did you hear a banjo?”, middle of nowhere scary. Turns out we were in Jonesville, MI to be precise. Makes sense that we would be in farm country, and this haunt is a converted pig farm. r
r
As we walked in, skeletons were putting down the spooky vibes by being used as directional signs pointing the way. And the fall vibes were in full effect as flames from a large bonfire that served as the centerpiece of their midway rose into the dark, country sky. The atmosphere was exactly what you''d expect from a farm haunt, it was the perfect balance of homey and haunting.r
r
After our drive, we were so excited to be amongst civilization again... and a lot of it! DarkSyde Acres was PACKED!!! Even the ticket line was crazy long, so we decided to go with their VIP offering so we could skip those lines.r
r
DarkSyde Acres offers five... that''s right... FIVE attractions! The Catacombs, KlowneTowne, The Rusthole, The Labyrinth, and The Dark Abyss are separately themed haunts that pretty much flow one into the other. These haunts follow a path that is both inside and outside, weaving between the different structures connected by pallet pathways. r
r
Once inside The Catacombs, we came across A LOT of uneven ground. The remnants of the pig farm made a very interesting footprint for the attraction. Grates pretty much dominated the pathways and tended to shift when walking. This kept us on edge and super aware of our footing. The interior spaces were also full of twists and turns as we traveled through the laboratory and then into the catacombs.r
r
Next up was KlowneTowne, and it was exactly what you''d expect from the name - clowns, clowns, and more clowns! KlowneTowne was a blacklight experience with funhouse themed sets. r
r
The Rusthole was the industrial factory Rusthole Industries. This haunt actually used to be a dark maze that they converted a few years ago, and you could tell these sets were newer than the previous. The look was reminiscent of the city of Zion from Matrix Reloaded.  r
r
The indoor haunting ended here as we entered the outdoor pallet maze, the Labyrinth. So many pallets... So many chainsaws!!! These actors were relentless with their slashing! We high-stepped our way through those pallets as fast as we could!r
r
Despite being so packed, they were doing a great job with their timing and crowd-control! The group behind us was nowhere to be seen, and we never caught up to the group in front of us... until we got to The Dark Abyss. This is the only place that got a little bottlenecked, but then we got to sail the seas with a group of pirates, some living and some... not so much.r
 r
The pirate ship led us out to Madam Mayhem and then to their souvenir shop, The Krow''s Nest. The Krow''s Nest featured some awesome DarkSyde merch but also local vendors. There were some very cool water bong... er... bottles and the best smelling candles we''ve ever sniffed!r
r
The rustic, homemade sets coupled with the absence of animatronics make this haunt the epitome of old school! They did utilize lots of pneumatic props like air horns and blasters to provide jump scares but were also super reliant on their actors. The actors at DarkSyde definitely supplied more jump scares than creepy banter and dialogue. r
r
Overall, makeup and costuming were minimal, but the characters in KlowneTowne and The Dark Abyss felt more developed and detailed.r
r
When DarkSyde Acres isn''t busy haunting, they are a rescue, rehabilitation, and care center for german shepherds, especially those who have served in the military or with a police department. What a great cause!!! We love all the puppers!r
r
So if you''re looking for an old school haunt in a naturally beautiful fall setting, look no further than DarkSyde Acres! It''s a lot of Halloween fun for the whole family!',
  NULL,
  3,
  'https://darksydeacres.com/',
  'https://www.facebook.com/p/DarkSyde-Acres-Haunted-House-100064621096667/',
  NULL,
  'https://www.instagram.com/darksydeacres_hauntedhouse/?hl=en',
  'https://www.youtube.com/channel/UC2qiOg6ppds06iAxpF-Vm-w',
  false,
  '2023-08-25 06:26:06.76503',
  '2023-09-24 18:08:58.659783'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Erebus Haunted Attraction 2022',
  '18 S Perry St,',
  'Pontiac',
  'MI',
  '48342',
  2022,
  'Erebus was first-up on our Michigan haunt tour, and we were PUMPED! We’ve been hearing...',
  'Erebus was first-up on our Michigan haunt tour, and we were PUMPED! We’ve been hearing nothing but AMAZING things about this haunt for a very long time, so they’ve been pretty high up on our bucket list. On the way there, we saw a spotlight in the night sky that beckoned us toward it like the Bat signal. Could it be? YES! It was the Erebus haunt signal lighting up the sky!r
r
Erebus is a staple in the Detroit-area haunt scene and has been in business in some form or fashion for a whopping 43 YEARS! From the meager beginnings of haunted trailers to their current location for the last 23 years - a 4-story factory of terror in Pontiac, MI – Erebus is a story of sacrifice and perseverance that clearly paid off in a very big way! They’ve even been featured on the both the Discovery Channel and the Travel Channel which is where we originally heard about them.r
r
As we approached the building, we immediately noticed the huge gargoyles looking down on us and the skeletons scaling the walls. While waiting in the queue line, Erebus had a large scoreboard that displayed some interesting statistics - the number of peed pants and people who didn’t make it through since the beginning of this haunt season and since the beginning of the haunt! Hahaha! We also heard the story about a “shitter” from the owner, Nasty!r
r
The Erebus experience is a ½ mile indoor walk-through and begins with a very immersive failed time-travel experiment. Dr. Colber has unlocked the secrets of time travel, but people sent to different times were recognized like a virus and became sick. Erebus is actually Dr. Colber’s time travel experiment laboratory that he has disguised as a haunted attraction to ensure a never-ending supply of test subjects and funding for his experiments.r
r
Even though, to us, it didn’t seem like the story carried throughout the attraction, the theming that was presented in each section was spot on! First off, let’s talk set design… WOW! Their sets are SUPER IMMERSIVE! There were a lot of areas that required us to interact with the environment including really long (and unnerving!) sections of ducking, shimmying, and squeezing our way through. r
r
Erebus was an early innovator in the haunt industry and unafraid to take risks. This ensured that they not only withstood the test of time, but THRIVED! Erebus features some really original themes and fx we''d never seen before. They had one of the best swamp scenes we’ve experienced thus far! In fact, it’s been said that they were the originators of the modern-day swamp set, with the low laser lights and fog to create the surface of the “water” and waist level air bags to create the feeling of resistance.r
r
In addition to the swamp, a couple of our other favorite themes were a very cool spider area and a really fun, interactive meat grinding section. We were sad to hear that we didn’t get to experience their “buried alive" experience. They had removed it due to Covid and with haunters still going down with the virus, it was best to keep it out of the show for at least another year... bummer.r
r
During our haunt tours, we try to hit as many attractions as possible in a short period of time, so we LOVE when haunts are open on weekdays… even though we understand that we may not get the same level of show on a weeknight versus a weekend. We visited Erebus on a Wednesday night, so there probably weren’t as many actors as there would be on a Friday or Saturday but because a lot of the scares at Erebus are driven by their large props and animatronics it didn’t feel empty. Most of the actors interacted with us and had actual dialogue! We weren’t dealing with a bunch of screaming teenage actors which we appreciate.r
r
Costuming and makeup were minimal but appropriate to each scene. Most characters were other test subjects in some stage of sickness. We could clearly see that some actors at Erebus have an affinity for Jordans... us too... but leave those at home on haunt nights guys, unless they are all black!r
r
While Erebus is not considered a full-contact haunt, that doesn’t mean that you are not getting touched… just not by actors. Erebus features HUGE, in-your-face-props and animatronics that  reach out from the darkness and, in many cases, slam into you!r
r
These guys are OGs in the haunt game, and we are so thankful we got to check them out! In addition to the main attraction, they check a lot of the other haunt experience boxes -  fun photo ops, concessions, and some really awesome merch. They even offer escape rooms around the corner.r
r
You definitely do not want to miss this very fun, spooky, still very relevant piece of iconic haunt history! If you haven''t already, go check them out!',
  NULL,
  4,
  'https://hauntedpontiac.com/',
  'https://www.facebook.com/ErebusHaunt',
  'https://twitter.com/Erebus_Haunts',
  'https://www.instagram.com/erebushaunt/',
  'https://www.youtube.com/channel/UC6m4th_Ne70IAKw8l2kCzwQ',
  false,
  '2023-08-25 06:03:28.98776',
  '2023-09-24 18:09:19.951209'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Awaken Haunted Attraction 2022',
  '4760 Churchill Rd',
  'Leslie',
  'MI',
  '49251',
  2022,
  'The last haunt of our 2022 Michigan haunt tour was Awaken Haunted Attraction in Leslie, MI. Awaken is a unique indoor and outdoor experience with...',
  'The last haunt of our 2022 Michigan haunt tour was Awaken Haunted Attraction in Leslie, MI. Awaken is a unique indoor and outdoor experience with four main attractions! It actually feels like more since all trails lead to and from their OG haunt, Awaken. You start in Awaken which leads into Terror-Phobia, then you''re back inside Awaken, then you head outside into The Forgotten pallet maze, which flows into the trail Tenebrous, briefly back into The Forgotten, to then end where you began in OG Awaken. Phew!r
r
Awaken''s original house opened in 2016, but the team continued building to become the multi-attraction, indoor/outdoor haunt they are today. Awaken also offers an escape room and just added paintball, Dr. Cyclops Escape Room and Dead On Paint Ball! That''s a lot of haunted bang for your buck!r
r
The outside of the building gives no clues as to what lies inside and beyond, but it''s a good thing that most of their queue line is located comfortably inside. On a super busy night you may have to wait outside in their covered overflow line for a little bit. There were no actors roaming either the inside or outside queue area, but they had lots of TVs mounted to keep us entertained while we waited inside.r
r
The Awaken experience began pretty immersively with an intro video about Area 56, the secret government facility we were visiting as test subjects… er… guests. After watching the video, we were ushered into a waiting area with a German doctor who scanned us searching for potential mutations in our DNA. The larger group was separated into smaller test groups and each of us had to nervously wait until the doctor received a call allowing our entry.r
r
After that buildup, Area 56 did not disappoint! There was so much going on in this highly detailed alien test facility! It was a barrage to the senses… the sights, the sounds, the SCARES! r
r
Terror-phobia was next, and this was the only 3D black light experience we had in Michigan. There were no rooms in Terror-phobia, it was a twisting and turning series of hallways that was covered floor-to-ceiling with scary clowns and eyeballs. The artwork was skillfully done but a little repetitive. r
r
We then found ourselves back in the original Awaken house, but this portion was very different than the first. We entered into a very cool, VERY CREEPY attic space! The detailing, fx, and animatronics in this room alone were enough to keep us oohing and aahing for awhile, but we continued on our way. Everything in this house seemed to be alive and malevolent from the clothes hanging in the closet to the old appliances in the kitchen. r
r
The Forgotten pallet maze felt a little... forgotten. We could hear the sound of pigs but only encountered one boar-person who did not even attempt to scare us. Due to the lack of actors we encountered, this space felt more like a queue line and less like an additional attraction, but that is probably not the norm.r
r
The pallet maze led to Awaken''s outdoor trail, Tenebrous. This trail was supposed to take us through the remnants of an uninhabited town - old buildings, junkyards, graveyards, to name a few scenes - but the best part is there were a few inhabitants left, and these guys were CRAZY! Have you ever seen a horse-cycle? Well, we have and could have bought it for the low, low price of a femur. HAHA! To finish out the haunt, we then ended up back in the building, but this time in an abandoned town then a carnival freak show. r
r
Awaken had a varied cast of characters throughout their attractions. We encountered doctors and scientists, clowns, boar people, and generally crazy people. Our scare actor experiences also ranged. Several were extremely engaging, some were only short interactions, and a few were there only to provide the jump scare, but our favorites were all in Tenebrous! r
r
Costuming, masks, and makeup were all well done, nothing was super elaborate but always appropriate.r
r
Awaken had none other than the Terrifier himself aka Art the Clown, David Howard Thornton, as their celebrity guest the night we visited. He had a table set-up across from Awaken''s merch shop and was taking pics and signing autographs. We took a moment to say "hi" especially since he had recently been a guest on our friend''s podcast, Pillar of Thriiler.r
r
In addition to regularly having special guests during haunt season, Awaken also hosts off-season events. On Dec. 9th and 10th (2022), Awaken will present their Christmas event, Jingle Hells. Evil elves, Krampus, and a "somewhat adequate Santa"?!!! Sign us up! Also, you can be married by the original Michael Myers! Did you know that Tony Moran is an ordained minister? Well, he is and you can be married by him, in his Michael Myers costume, and in front of Awaken''s Myers family''s front porch facade!r
r
Go visit Awaken for the Hollywood sets and fx in the haunt, for its side attractions, off-season events, to get an autograph from a horror industry celebrity, or, hey, get married! Awaken has a little something for all horror fans!',
  NULL,
  4,
  'https://awakenhaunt.com/',
  'https://www.facebook.com/awakenhaunt',
  NULL,
  'https://www.instagram.com/awakenhaunt',
  'https://www.youtube.com/channel/UCFoqgKL9lZBSph3OnS2Db2g',
  false,
  '2023-08-25 06:11:42.565895',
  '2023-09-24 18:08:31.439884'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Azra Chamber of Horrors Haunted House 2022',
  '1401 John R Rd, Bldg 2',
  'Madison Heights',
  'MI',
  '48071',
  2022,
  '"Wait... was that it?" Not sure how we missed the gigantic dragon out front, but...',
  '"Wait... was that it?" Not sure how we missed the gigantic dragon out front, but we totally passed Azra Chamber of Horrors as we drove through Madison Heights, MI. Once we entered though, it was "Welcome to Club Azra!" r
r
No… Azra isn’t a club, but this haunted attraction definitely brought a party vibe! The energy in their covered and heated queue line was infectious as the DJ and his “sidekick” played, not creepy tunes or death metal but, a bunch of hip-hop and pop hits. Streams of sparks shot up into the night sky, and the fire dancers had us mesmerized! Azra’s queue line was more lit than some clubs we’ve been to!r
r
Azra started differently than most haunts who add escape rooms after a few years in business; they STARTED with escape rooms! We got a sneak peek at one of their rooms and holy shit, we felt like we had just stepped onto a set for the latest movie in the Mummy series! But when Escape Room Zone (Azra''s sister company) found themselves with an empty laser tag arena, Azra Chamber of Horrors Haunted House was born! Escape Room Zone also offers Axe Throwing and Rage Rooms! They have several locations throughout the metro-Detroit area. We wish we had more time in Michigan to check it all out! r
r
The 2022 season was surprisingly only their 5th year!  This definitely did not feel like a haunt only 5 years young. In continuing with what seemed to be the Michigan norm, Azra’s sets were gorgeous! They were elaborately dressed, super detailed, and immersive. Their swamp scene didn’t just look like a swamp, it felt like one as we were sprayed with water, and we could feel “spider webs” hitting our face as we walked through a spider-infested area. The topography left by the laser tag arena created a haunted attraction that featured lots of changes in elevation as we ventured through Azra’s “chambers”.r
r
There’s no continuous story line or theme at Azra, just one incredibly creepy room after another. They had some really unique themes and definitely tried to hit on every phobia and fear. Azra Chamber of Horrors featured scenes with everything from bee hives, clowns, deranged doctors, and even the devil. They had a beautifully eerie jack-o-lantern room that we really enjoyed as well!r
r
Even with having a multitude of themes, Azra managed to ensure each actor had the appropriate costuming for their room. There was never any bleed over between scenes or random characters. We loved how often they utilized quality masks versus makeup too!r
r
The actors at Azra were AMAZING and did an incredible job portraying their characters!  These guys were scaling walls, hanging from ceilings, contorting, and just sacrificing their bodies overall! They were SUPER interactive too! Almost everyone had original dialogue instead of the unoriginal “get out” or just screaming their heads off. Actors played off one another so well, and we thoroughly appreciated the banter! We could tell they were having just as much fun as we were! r
r
Azra has a huge entertainment factor, and the additional offerings at Escape Room Zone only sweeten the deal! We got to chat with one of the owners (the other was busy living his best life as the DJ’s hype man) and heard some of their upcoming plans. Azra is going to continue pushing the limits on the club vibe. We''re accustomed to haunts deciding to go the more family-friendly route so catering to the adult (21+) crowd is a new concept to us, and we LOVE it! We can’t wait to see their plans come to fruition and how they’re received by Michigan haunt-goers. This is definitely a haunt that is only going to get better with time; we are HERE FOR IT and you should be too! Sidenote… Azra has the DOPEST t-shirt designs! It was hard for us to choose just one! So be prepared when you visit them, because you are definitely going to want to cop some wearable Azra merch!r
',
  NULL,
  4,
  'https://azrahaunt.com/',
  'https://www.facebook.com/AzraChamberofHorrors/',
  NULL,
  'https://www.instagram.com/azrahauntedhouse/?hl=en',
  NULL,
  false,
  '2023-08-25 05:38:20.935259',
  '2023-09-24 18:08:46.880754'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Eloise Asylum 2022',
  '30712 Michigan Ave.',
  'Westland',
  'MI',
  '48186',
  2022,
  'Where technology meets history… Eloise Asylum is located in an actual abandoned asylum that is said to truly be haunted. In its prime....',
  'Where technology meets history… Eloise Asylum is located in an actual abandoned asylum that is said to truly be haunted. In its prime, Eloise Psychiatric Hospital in Westland, MI consisted of 78 buildings on 902 acres and housed 10,000 patients along with 2,000 staff members. It was the largest psychiatric facility in the United States. Today, only five of the original 78 buildings and the adjacent Eloise Cemetery remain. They have converted 30,000 square ft of the old asylum into their haunted attractions, but Eloise Asylum also offers paranormal investigations, a history/photography tour, and an escape room! Cold spark pyrotechnic simulators, a Tesla coil, advanced projection mapping technologies…Eloise Asylum is implementing state-of-the-art, Disney-level technology in their haunted attraction walk-throughs. r
r
There are two attractions, The Asylum and The Basement. Although they are separate, the asylum theming continues from one to the other but gets… crazier! Now, we’ve seen our fair share of haunts that incorporate asylum theming and even visited other asylums turned haunted attractions, but none have NAILED IT the way Eloise does! The Asylum sets were an asylum to a T and clearly designed with scares in mind! There were so many hidey holes and doors that offered places for “patients” to jump out from, and Eloise had actors popping out from EVERYWHERE! They did a masterful job of balancing their jump scares with animatronics, fx, and just an overall creepy atmosphere. They definitely kept us on our toes, wondering where the next scare was coming from!r
r
The descent into The Basement also felt like a mental descent… WE WERE GOING CRAZY!  Strobe lights got more intense, the flooring starting moving under our feet, sets had a distorted look, everything just gave us this feeling of becoming progressively more unbalanced and unhinged until the experimentation went completely off the rails!r
r
What both of Eloise’s attractions did really well was stick to their theme without it getting old. You might expect going through two attractions with the same theme to start feeling repetitive, but the way they represented an asylum was so much more then just the typical hospital hallways, patient rooms, and padded cells. They incorporated incredibly disturbing scenes of controversial and experimental treatments like a brainwashing theater, lobotomy lab, and even gene-splicing in The Basement!r
r
Costuming and make-up were simple throughout The Asylum, because all the scare actors were either patients or doctors. But what we really loved was that they weren''t just wearing hospital gowns or lab coats over their visible street clothes. They weren''t wearing new Nikes with their grungy gowns but were actually barefoot or had on socks or hospital booties, while the doctors wore simple shoes or Crocs. These small touches are actually really huge when it comes to keeping you fully immersed in the haunt. Character design got a little more complex in The Basement as the patients became experiments and some were in failed stages of transformation.r
r
Eloise Asylum also featured a surprisingly large midway area. They had all the classic carnival foods like french fries, funnel cakes, and so much more. There was even a stage where freak show act Reverend B. Dangerous was performing some extremely cringe-inducing feats.r
r
After Halloween, Eloise hosted a special event we wish we could have experienced called High Intensity. They explained this experience as “your own personal nightmare, very real nightmare” where you are asked to perform certain activities to move forward in the attraction. Right up our alley!r
r
Eloise is one of the newer Michigan haunts, and what a great addition they’ve made to the scene! It fits in perfectly with the movie-quality set standard that all the haunts we visited had, and also like the other haunts, brings its own unique vibe. All of the technology they’ve incorporated is going to make it extremely easy for them to provide a scalable and consistent customer experience. This is a must see haunt, and we look forward to seeing their continued growth!',
  NULL,
  5,
  'http://www.eloiseasylum.com/',
  'https://www.facebook.com/TheEloiseAsylum/',
  'https://twitter.com/EloiseAsylum',
  'https://www.instagram.com/eloise.asylum/',
  NULL,
  false,
  '2023-08-25 06:47:24.056979',
  '2023-09-24 18:09:09.561127'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Hush Haunted Attraction 2022',
  '37550 Cherry Hill Rd',
  'Westland',
  'MI',
  '48185',
  2022,
  'Happy Anniversary, Hush!!! Hush Haunted House in Westland, MI was celebrating 10 years of scares...',
  'Happy Anniversary, Hush!!! Hush Haunted House in Westland, MI was celebrating 10 years of scares in the 2022 haunt season. They outgrew their previous location and have only been in their current one since 2019, but they have more than settled into the new space. r
r
Housed in a MASSIVE 40,000 square ft building, Hush features 3 separate attractions, yet they are all unified by the Louisiana motif. Belly of the Beast, Louisiana Catacombs, and Rosecliff Hall Haunted Mansion each flow one into the other for a seamless experience. That is... unless you get the Bar Creep Pass and break them up by visiting one of the 3 hidden bars... but we''ll get to that in a second.r
r
When we stepped into Hush for the first time our jaws dropped! Their queue line is a legit Bourbon Street-style block! The city of Hush Falls is complete with a City Hall and fountain, storefronts including a bookstore, barbershop, hotel, bar, and more! WOOWWW! Just standing in their gorgeous queue line was an experience in itself. The views were floor-to-ceiling incredible! Plus, there were a few beasties roaming the "streets" interacting with us.r
r
The haunt that kicked things off was Belly of the Beast. It began in the grand Hush Falls Hotel lobby which was absolutely breathtaking! We truly felt transported into 19th century Bourbon Street with the beautiful antique furniture, finishes, and sophisticated period clothing. This was a very welcome change after getting boogers blown on us in the queue line. Haha! This is also where we had our first photo op experience. r
r
We took the service elevator down into the "belly" of the hotel. It began with usual hotel things like a laundry room, spider-infested corridors, but quickly progressed to the more arcane - ancient temples and burial chambers. Hush Falls Hotel was constructed on top of a dark lord’s domain! And the Hollywood quality builds continued! r
r
Louisiana Catacombs took us on an eerie stroll through graveyards, mausoleums, and, of course, catacombs. It was amazing how they made this enclosed space feel outdoors through set dressings and the masterful use of lighting.r
r
The last haunt, Rosecliff Hall Haunted Mansion, was ominous and foreboding from the moment we were greeted at the entrance by the home’s caretaker. He explained that once we met the owner we were going to have to fight our way out. And it wasn''t just the owner... EVERY “resident” we encountered meant us harm, and they were coming at us from all angles!r
r
The actors at Hush were INCREDIBLE! They gave us all the haunt “feels” - they were creepy, made us jump, and made us laugh. There were a few actors who totally had us fooled! The way they moved combined with how they were placed in the scene... we genuinely could not tell if they were real people or an animatronic, and we looked harddd! Makeup, costuming, and masks were all well done, and kept us fully immersed in the story. r
r
Now, back to the bars as promised... Hush provided a haunted adventure unlike anything we''ve ever experienced! There were hidden bars set-up between the haunts! We''re not really drinkers and are usually not supporters of drinking and haunting, but we absolutely LOVED Hush’s bar experience! Expedition Basecamp and Von Rose Distillery were the perfect intermissions between attractions, and Voodoo Blues felt like a super exclusive speak-easy. Staying in line with the haunt sets, the bars were beautifully themed down to the 2 speciality drinks offered. A huge bonus for us was that each bar we entered was filled with the most interesting group of strangers to talk to! r
r
In addition to their usual walkthrough, Hush also hosts specials events. They have Kid’s Hours with a lights on tour, a monster meet and greet, and candy for the Haunt Junkie Jrs who may feel the regular attraction is too intense. They also offer a lights out event where your group is forced to navigate all 3 haunts with only one glow stick!r
r
An important fact we’d like to highlight is that there is an incredible comradery between the Michigan haunts, and we absolutely love it! Each one opens during the week to give the owners and workers at other haunts the opportunity to come and enjoy! How amazing is that?! We were lucky enough to visit Hush on one of those nights and got to meet one of Exit 13’s owners and a few of their scare actors, plus a big crew from Nightmares from Hell!r
r
This is a haunt that should NOT be kept quiet! Hush is extremely well thought out and executed. Their timing is impeccable, and the way the actors and props complement the animatronics and effects (and vice versa) is just so well done!  They are masters of distraction - making you look left before a scare hits you from the right! So, whether you roll with the Bar Creep Pass for the hidden bar adventure or enjoy all 3 haunts uninterrupted, you’ll definitely be wow’ed by the sets and have an incredible time at Hush! Laissez les bons temps rouler! Or should we say… les effrayant temps…',
  NULL,
  5,
  'https://hushhauntedattractions.com',
  'https://www.facebook.com/hushdetroit/',
  'https://twitter.com/HushHaunt',
  'https://www.instagram.com/hushhaunt/?hl=en',
  'https://www.youtube.com/@hushhauntedattraction',
  false,
  '2023-08-18 04:58:20.918822',
  '2023-09-24 18:09:30.694346'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Nightmare Realm Kalamazoo 2022',
  '23492 Red Arrow Hwy.',
  'Mattawan',
  'MI',
  '49071',
  2022,
  'The Nightmare Realm experience begins unlike any haunt we''ve ever visited. Your haunt tour actually starts off-site… about 10-15 minutes away! They have ...',
  'The Nightmare Realm experience begins unlike any haunt we''ve ever visited. Your haunt tour actually starts off-site… about 10-15 minutes away! They have limited parking, so they''ve partnered with the local high school to have their patrons park there and  be bused over to the haunt. This fully immersive bus ride is where you become a part of the Nightmare Realm story. You are on the bus with some local real estate agents who are trying to sell you property in the town of Cypress Hollow. Anyone else getting Texas Chainsaw Massacre (2022) vibes here?r
r
When we arrived, the entry/midway area of Nightmare Realm set a beautiful yet eerie tone - corn stalks, string lights, and some large hand-crafted props created the perfect space to pull up a seat at one of the many benches and enjoy some pizza, donuts, cider, or hot chocolate. We were super happy to see the Haunters Against Hate banner proudly displayed on their fencing! There was also an outdoor screen where a classic horror movie played and some super fun photo ops.r
r
We enjoyed some very fun banter with several characters stalking the midway while attempting to avoid one in particular with a cattle prod… she was pretty generous with doling out those shocks!r
r
But now it was time to enter Cypress Hollow… we had heard the tragic story of Trista. She knew she was different. She had heard the voices all her life. The people of Cypress Hollow thought she was crazy, but when a portal to another realm… a nightmare realm… opens in the town, the residents soon realized they were very wrong.r
r
We beared witness to the destruction of the village and its people as the story continued to unfold during our trek through Cypress Hollow. Even though Nightmare Realm presents Retribution did not have the same budget as some of the other Michigan haunts we visited, every scene was purposefully crafted and intricately detailed. One of our favorites sets was their library… it was so elegantly damaged. The spiral (portal) pattern was repeated over and over again in very creative, Junji Ito-esque fashion. r
r
This haunt is fueled by its nightmarish creatures and tragically transformed Cypress Hollow inhabitants, and they were EVERYWHERE! They were roaming the high school parking lot, the midway area of Nightmare Realm, and of course, throughout the haunt. Costuming and makeup were EXTREMELY detailed! Masks, prosthetics, and elaborate makeup were all masterfully executed! We appreciated how the story was so thoughtfully presented through character design, development, and dialogue. r
r
Because Retribution centers around its story, scare actors were responsible for much more than just surprise jump scares. They provided connection and additional pieces of the story that kept us engaged in the horrific goings-on in Cypress Hollow. We met members of Trista’s family, her friend, classmates, and townspeople who knew her and clearly regretted what they had done. The believable characters coupled with the organic sets kept us fully immersed in Trista’s story!r
r
There was an intense creepiness and palpable ebb and flow to the whole experience that all culminated in an epically gruesome final scene! We came face-to-face with the infamous Trista and got to experience her retribution with her. Trista’s poor mother…r
r
The 2022 haunt season was only Nightmare Realm’s second year as a pro haunt, and we were impressed to say the least. They aren’t new to the game though; Nightmare Realm had been operating as a home haunt for several years before making the switch to pro, and the owner has been haunting since his high school days. What a dope backstory and what a dope haunt! r
r
The Nightmare Realm team is also trying their hand at a Christmas show this year with Project Jingle Hell, for ONE NIGHT ONLY! As if the residents of Cypress Hollow didn’t have it bad enough at Halloween, Santa decided they were very naughty this year and is bringing Krampus and his HELLves to visit. We can only imagine the terror that will ensue. r
r
We talk about vision a lot, you either have it or you don’t… and this crew has it! We can’t wait to see what this passionate cast and crew come up with next! Do NOT miss this one, folks!',
  NULL,
  4,
  'http://www.nightmarerealmkalamazoo.com/',
  'http://www.facebook.com/nightmarerealmkalamazoo',
  'https://twitter.com/NR_Kalamazoo',
  'http://www.instagram.com/nightmarerealmkalamazoo',
  'https://www.youtube.com/channel/UC5KfJ7cAu9ZnyPYS4KL7zdg',
  false,
  '2023-08-25 06:36:20.183413',
  '2023-09-24 18:09:40.114288'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Rotten Manor 2022',
  '13245 Dixie Hwy.',
  'Holly',
  'MI',
  '48442',
  2022,
  'It was a cold, fall night and we were visiting the first outdoor attraction of our Michigan haunt tour.  Rotten Manor in Holly, MI features so many attractions, both outdoor and indoor, you could ...',
  'It was a cold, fall night and we were visiting the first outdoor attraction of our Michigan haunt tour.  Rotten Manor in Holly, MI features so many attractions, both outdoor and indoor, you could spend hours experiencing everything here!! They have The Rotten Hayride, The Rotten Forest, Rotten Paintball, Rotten Manor (are you noticing a theme here?), and the newly added Rotten Theater. In their newly added vintage-style theater, they feature a variety of horror-themed performances including the story of Mr. and Mrs. Rotten. There''s also a sizable midway with carnival games, food, smaller attractions like a quick vortex tunnel and maze, and lots of vendors selling everything from candles to glass pipes. We didn''t do everything, but we did do the hayride, forest, and manor!r
r
The facade of Rotten Manor and surrounding midway grounds are SPECTACULAR! Rotten Manor felt less like a Hollywood set and more... REAL! There was definitely a more organic look than the other Michigan haunts we''d visited so far. Rotten Manor was gritty, grimy, and appeared to have naturally aged and become dilapidated.r
r
First, was The Hayride. Fall temperatures in Georgia are nowhere near Michigan temps, so the small fire was very welcoming during our wait for the previous riders to return. The hayride was a nice, long tractor ride through the woods with several stops along the way. Chainsaw wielding hillbillies, aggressive fish mongers, and screaming villagers jumped on and off the tractor. The sets looked great, and the acting was decent - the interactions were fun but not really scary. Megan got “fish juice” in her eye and kissed a skunk! r
r
Next up, The Forest. After the hayride, we did not have very high expectations; but this was our first trail experience in Michigan, so we were looking forward to it nonetheless. Plus, we love haunted trails! r
r
Rotten Forest''s trail was physically challenging and SOOO MUCH FUN! This didn’t feel like a relaxing evening stroll through the woods by any means!  All of the structures we encountered were extremely interactive and different than anything we''ve ever experienced on a haunted trail! We went down into a swamp, snuck into then broke out of an insane asylum, escaped the witch from Hansel and Gretel, ran from a man-pig, crawled into a church... we were truly blown away by the level of immersion and interactiveness the sets in this forest provided. What a FREAKING ADVENTURE!!! r
r
After The Rotten Forest, we were STOKED to check out The Manor! But when we got to the front things looked oddly… closed. They had shut down the house while we were on the trail!!!  We were forced to have to come back to experience the house. UGHHHHHH!r
r
When we made it back to Rotten Manor a couple days later, we headed directly to the house like junkies on a mission! Rotten Manor began with the telling of the house''s story. Apparently, we had died and this house was like a way station for lost souls. Wonder if this ties into the Rotten Theater show? After the intro, one of the first things we heard was a snippet from a Twilight Zone episode and that pretty much set the tone for the entirety of Rotten Manor. There was this underlying surreal and bizarre feeling throughout. r
r
The sets were just as organic and grimy feeling as the exterior facade we were greeted with upon entering the grounds. They featured some familiar movie themes mixed with original designs and were all incredibly detailed and immersive. We had to interact with scenes by opening doors, crawling, ducking, feeling or squeezing our way through, and escaping through some extremely unique tunnels!r
r
Scare actors were actually few and far between in both the forest and the manor, but neither attraction seemed empty. We''re not sure if this was on purpose or due to the times we went through, but it totally worked for us! We were so engulfed in these experiences that nothing felt missing! The actors we did experience were very theatrical and engaging instead of just being there to provide a jump scare. r
r
One thing to note, with all of the attractions and the size of the midway, we would expect to have seen some actors roaming the grounds. We didn''t see any, so again, not sure if this was due to the times we were there.r
r
Costuming and makeup were minimal but always appropriate to their scene. During our adventures at Rotten Manor, we were met with hillbillies, storytellers, doctors, patients, preachers, and more! And despite that variety, it all actually made sense and flowed well together. r
r
Based on some feedback we’ve hear about this haunt, we would recommend that you go during "off" times. It gets deservedly packed out there, and going through with too many people or being rushed through would definitely be a huge disservice to the experience.r
r
Rotten Manor also hosts a Christmas event. This year A Rotten Christmas Nightmare will open Dec. 2-3, 9-10, and 16-17. With everything that Rotten Manor has to offer, the whole family can have a night out full of fall fun and with a Christmas Nightmare... a winter one too! Overall, Rotten Manor is an old-school haunt that''s an all-out adventure! Be sure to check them out!',
  NULL,
  4.5,
  'http://www.rottenmanor.com/',
  'https://www.facebook.com/RottenManor/',
  'https://twitter.com/rottenmanor',
  'https://www.instagram.com/rottenmanor/?hl=en',
  NULL,
  false,
  '2023-08-25 06:41:33.806066',
  '2023-09-24 18:09:53.295613'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Exit 13 Haunted House 2022',
  '6069 Saginaw St.',
  'Flint',
  'MI',
  '48505',
  2022,
  'We are HUGE fans of full contact haunts! Exit 13 in Mt Morris, MI was the only “touch” haunt on our 2022 tour. And after meeting some of ...',
  'We are HUGE fans of full contact haunts! Exit 13 in Mt Morris, MI was the only “touch” haunt on our 2022 tour. And after meeting some of the cast and the owner of Exit 13 during our visit at Hush, we were CRAZY excited to check them out!r
r
Exit 13 is legitimately off exit 13! I-475 in Michigan. 2022 was their 10th season of scares! Both the haunt and their queue line are entirely indoors which is a big deal in Michigan since it can get pretty cold by the time spooky season rolls around. The Michigan haunts take a lot of security precautions, including some that don''t allow purses/bags at all and at Exit 13 they utilized metal detection equipment.r
r
We excitedly put our glowsticks around our necks, which signals to the actors that they can touch us, and entered the queue line. Although it was comfortably heated, the whole area set a very uncomfortable, anticipatory tone. The red lighting and subtle pulsing undertones had their exact desired effect. In fact, Exit 13 utilized a really unconventional yet extremely effective soundtrack throughout their haunt.r
r
Exit 13 is another attraction that follows what seems to be the Michigan standard of INCREDIBLE sets! Did all the owners here get together and create some unspoken rule or something?! Every room had it''s own theme, a few were recognizable from movies but most were original. All offered up extremely detailed eye candy! There were also some very immersive designs. There were times we had to crawl or shimmy our way through, plus a section where they split us up! That was SUPER unnerving! What''s even more impressive than the sets themselves is the fact that they change every year! This team works hard to bring you fresh, new terrors each season!r
r
There is no cohesive story or theme that runs throughout the haunt. Exit 13 is a random collection of horror-themed scenes, but that totally works for them; especially, considering that they are rebuilding every single year! Swamp, circus, school hallways, a doll room, and a breathtaking library scene are just a few examples of the sets we experienced. Some sets featured very cool, hidden exits that would make you feel trapped with whatever psychotic scare actor was in that room. But don''t worry, they would push you in the right direction... after they were finished tormenting you. r
r
The Exit 13 scare actors were fun and engaging. We truly appreciate haunt actors who take the time to develop their characters and are able to offer more than just screaming. We exchanged banter with quite a few and even had our bird tarot cards read... Megan was an owl and Vilonte a crow... which is actually pretty spot on!r
r
Makeup and costuming ranged from minimal to full body suits. No matter whether the actor had simple makeup or elaborate prosthetics or masks, they always looked just right with their scene. The cymbal monkey in the playroom was hands down our favorite costume of the 2022 season! We sincerely hope that cymbal monkey is an Exit 13 staple and remains with every year''s changes!r
r
After you come running out of the haunt, you end up in the Exit 13 concession and merch area. In addition to the Exit 13 themed merch, they have a ton of other random spooky items for sale. Their midway area is just outside this and has a ton of fun photo ops! Whether you want a pretty fall themed backdrop or prefer the more macabre they have a photo op for you! There are also some additional concessions outside. These concessions sell more than just hot cocoa and cider... you can grab a beer (or a frew brews) before or after your walkthrough.r
r
This was the haunt we were looking forward to the most because of the contact; and while we had an AWESOME time, it was not the experience we were expecting. Their element of contact was pretty minimal except for a paddling we both received. Our asses stung for the rest of the haunt... IT WAS GREAT! But overall, we didn''t get the intensity we were sooo anticipating. Every haunt in Michigan has its own “thing” so we think Exit 13 could really lean into their options as a touch haunt. Especially since they are offering a "hands-off" experience. You just don''t receive a glowstick to wear.r
r
Whether you enjoy full contact haunts, are not sure but want to give it a try, or need the characters to keep their hands to themselves, Exit 13 is like a crazy detour on a twisted route through an assortment of your worst fears. This haunt is definitely worth the trip!',
  NULL,
  4,
  'http://www.exit13hauntedhouse.com/',
  'https://www.facebook.com/Exit13HauntedHouse/',
  'https://twitter.com/Exit13_Haunt',
  'https://www.facebook.com/Exit13HauntedHouse/',
  NULL,
  false,
  '2023-08-25 06:31:18.132696',
  '2023-09-24 18:10:10.856462'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Camp Blood 2023',
  '2277 Whooping Creek Rd',
  'Carrollton',
  'GA',
  '30116',
  2023,
  'Even though our official 2023 haunt tour is in North Carolina this year, after visiting Camp Blood in Carrolton, GA for the first time in many, many years… geez… probably close to 10… we felt they...',
  'Even though our official 2023 haunt tour is in North Carolina this year, after visiting Camp Blood in Carrolton, GA for the first time in many, many years… geez… probably close to 10… we felt they deserved a proper review.r
r
Let’s begin with the drive to Camp Blood… it’s dark, country roads for miles with the final leg of the trip becoming an extremely bumpy, claustrophobia-inducing narrow dirt road. This place is in the COUNTRY country and drives like this always add to the overall spooky experience. Especially for Vilonte, he is always paranoid about being black in rural places like this… HAHA!r
r
When you step foot on the grounds of Camp Blood, it definitely feels like you’ve just become a camper at a questionable overnight summer camp. The banjo music playing created an oddly foreboding atmosphere despite the inviting bonfire, the concessions (mess) cabin, and surrounding wooden structures that housed a palm reader and carnival games that benefit Children’s Healthcare.r
r
We were given poker chips and told to wait until the letter on our chips was called. We took the time to explore the concession cabin and play some games. The concession cabin was filled with more than just snacks, there was Camp Blood merch and vendors selling candles and Halloween-themed tumblers. This is also where we purchased our tickets to play the carnival games. We love these kind of games, even more so when the proceeds go to a cause as worthy as Children’s Healthcare of Atlanta. While Crazy Cathy laughed hysterically at us, we felt the sensation of being watched and looked over to see none other than Michael Myers lurking in the shadows.r
r
Before he had a chance to attack, an enthusiastic hellbilly called us to the entrance as if we had been chosen as the next contestants on The Fright is Right, and we embarked on the 1/2 mile long trail through the hellbilly-infested woods.r
r
As we traversed through the straight, slanted and very tight corridors, actors engaged with us from within their pallet prisons… or so we thought. No sooner would we walk past a monster taunting us and reaching at as through the slats, then that same monster would emerge from their set to sneak up behind us to chase us to the next scene. We absolutely loved this! The scares were non-stop! We never knew if they were going to come from in front of us or behind us!r
r
There’s no specific story being told at Camp Blood, but there was a collection of random horror themes. We walked through a swamp and slaughterhouse… hellbillies and deadnecks were pretty prevalent out there… as they should be, a scary clown-filled funhouse, and a cemetery to name a few. There were also several familiar 80’s horror monsters that we came in contact with too. Our favorite encounter had to be Jason!r
r
This was definitely an old-school haunt. The tight, oddly shaped spaces with uneven footing were constructed with the creative use of pallets, tarp, carpet, mattresses, and pvc pipes. The angled walls and squishy floors felt especially unnerving when we were being chased by chainsaw-wielding hellbillies, scary clowns, and movie monsters. We also noticed a few well-placed Spirit Halloween animatronics sprinkled in, but they weren’t the main focus, it was clearly up to the actors to deliver the scares here, and they did just that!r
r
Most characters sported full masks instead of heavy sfx makeup, and costuming was minimal but always fitting. In fact, these actors were so much in character, they couldn’t turn it off! Even after the masks had been removed and the actors were heading to their cars to go home after a long night of haunting, they were still trying to scare us!r
There is more scary fun on the way with the addition of a new glow-in-the-dark zombie paintball experience as the season progresses, which makes sense considering that in the off-season, Camp Blood transforms into it’s less scary counterpart, Lowell Paintball.r
r
Camp Blood proves low budgets can still deliver big scares and big fun! We totally recommend that you enjoy all their summer camp-inspired festivities and the new zombie paintball this Halloween season!',
  NULL,
  4,
  'https://www.campblood.com/',
  'https://www.facebook.com/camp.blood.haunt/',
  NULL,
  'https://www.instagram.com/campbloodhauntedattraction/',
  NULL,
  false,
  '2023-09-24 18:07:27.185154',
  '2023-09-24 18:10:44.784595'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Kersey Valley Spookywoods 2023',
  '1615 Kersey Valley Rd',
  'Archdale',
  'NC',
  '27263',
  2023,
  'The last stop of our 2023 NC Haunt Tour was another North Carolina OG attraction, Kersey Valley Spookywoods in Archdale, NC. They have an incredible...',
  'The last stop of our 2023 NC Haunt Tour was another North Carolina OG attraction, Kersey Valley Spookywoods in Archdale, NC. They have an incredible 39 years in the business of scares!r
r
Spookywoods is a multi-haunt attraction beginning with their newest haunted trail, Icons; then their cornfield, Harvest of Fear; then their mainstay trail with 11 separately themed houses - Sanitarium, Vampire Crypt, Town of Kersey Valley, Depths of Despair, Agony’s Embrace, Bloodmoon Ridge, Whispering Pines Funeral Services, Decimation District, Inferno, and  Photons of Fear. Plus, they have the Midway of Mayhem, Endora’s Witch House, and their Dark Ride Fright Trams that transport you between all the different attractions.r
r
Their midway featured tons of food, adult beverages, and a live DJ spinning a variety of tunes to keep the vibes going all night long. We loved how they even themed out their concessions by incorporating their mainstay characters… everyone has to try one of Endora’s Brews!r
r
Instead of your typical hayride, Spookywoods has custom-built trams similar to those that you might catch in a theme park parking lot to transport you through the vast darkness between the attractions. Their Fright Trams are necessary since Kersey Valley is a sprawling 92-acre farm, and they have widely spread their scares throughout the woods. You board the tram glowing in the iconic Spookywoods green, but as you enter the woods it all… goes… dark… Monsters are lurking and sometimes they jumped on and off our tram as we traveled.r
r
Icons was the first stop and their newest attraction. It was easy to tell we had arrived, the letters I-C-O-N stood at least 20 feet tall and glowed bright red in the darkness of the woods. We walked through the gigantic O and began our journey into iconic horror cinema.r
r
Not only were these sets themed after each of their respective movies, but the characters also acted out a scene from the movie. We’ve seen lots of Nightmare on Elm Street and Friday the 13th themes and even more random Freddies and Jasons, but never have we ever seen Freddy vs Jason. There was also Megan’s fave Scream, Halloween, and others.r
r
This haunt is R-rated because they play actual snippets of dialogue from the movies and some contain expletive language. We loved recognizing those bits of script as we approached the next house and guessing what we were walking into!r
r
After Icon, we boarded a Fright Tram and were transported to Spookywood’s cornfield, Harvest of Fear. Harvest of Fear is one of the most original cornfields we’ve ever been through. How do you make a cornfield different?, you ask. Spookywoods utilized a lot of lighting effects at Harvest of Fear including lightning and the laser light and fog swamp effect throughout their cornfield, creating a murky layer of lighted fog from our waist down. This allowed actors to hide right underneath our noses.r
r
The cornfield let us out right in front of the first haunt on the next trail, Sanitarium. It was lit with a very cool vine lighting effect. Again, this second trail features 11 separately themed houses, but to describe each in any detail would make for a very long review. Overall, Spookywoods are masters of light and sound. They use both of these elements to really bring their sets to life. The lake they constructed complete with docks and cabins over the water for Freddie vs Jason was also super impressive!r
r
The actors are also a huge part of what Kersey Valley Spookywoods does. They provide a really great mix of jump scares and interaction. r
r
Costuming and makeup ranged between the multiple sets. Nothing was over the top but always appropriate for their environment. Masks were heavily utilized especially (and understandably) in the Icons section.r
r
Spookywoods definitely has some… spooky woods, and they’re really great at using them to further immerse you in the experience. Walking through those dark woods sometimes felt like a break, allowing just enough time for our sense of security to set back in before we hit another house, but conversely also sometimes felt super ominous and foreboding. We occasionally encountered a victim running towards us on the trail asking us for help, and just like a horror movie… we just continued to head towards the danger. r
r
Spookywoods has so much to offer, so grab the fam and go spend a full night of fall fun at Kersey Valley Spookywoods in Archdale, NC!',
  NULL,
  4.5,
  'https://www.spookywoods.com/',
  'https://www.facebook.com/spookywoods/',
  'https://twitter.com/spookywoods?lang=en',
  'https://www.instagram.com/spookywoods/?hl=en',
  'https://www.youtube.com/channel/UCH_eWKOSAgZlkyFN_1ANYzw',
  true,
  '2023-10-16 06:26:06.574734',
  '2023-11-13 05:16:17.775069'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Lake Hickory Haunts 2023',
  '520 Carolina Ave',
  'Hickory',
  'NC',
  '28601',
  2023,
  'Lake Hickory Haunts was another haunt we visited on the first night of our 2023 haunt tour which was Friday the 13th, and their...',
  'Lake Hickory Haunts was another haunt we visited on the first night of our 2023 haunt tour which was Friday the 13th, and their busiest night of the season so far! Before we get into reviewing this attraction… we’d like to mention that Lake Hickory Haunts was, by far, the best bathroom experience Megan has ever had at a haunted attraction! This was not your typical port-a-potties, folks. They had super clean, fresh-smelling public restrooms! r
r
r
After the quick bathroom break, we walked down the hill and into the Midway of Mayhem. It’s really not even fair to call what Lake Hickory Haunts has a “midway”, it is far too expansive for that. In fact, Lake Hickory Haunts is so big that when you arrive, they give you a map! Literally, a tri-fold map like you get at Six Flags or Universal… which makes sense, since they do call themselves a haunted theme park!r
r
r
The Midway of Mayhem has everything you’d expect at a theme park and more! Axe throwing, an escape room, and a 4D experience are just a few of the activities you can enjoy while waiting for your turn to enter the haunts. If you go with the VIP experience like we did, you also get access to a pretty swanky outdoor lounge.r
r
r
And yes we said.. er wrote… haunts! How many you ask? 12!!! 12 freaking attractions in one place for your haunting pleasure! And it’s technically 14 since the Big Top Circus is actually three in one!r
r
r
Lake Hickory Haunts is located on a piece of property with some very interesting topography, and they have used every bit of it to their advantage. And it’s not just a cool name, Lake Hickory Haunts is located on an actual lake, and they have brilliantly incorporated the lake into their haunt stories and builds. In fact, there are three attractions centered around the lake: Voodoo Bayou, Shipwrecked 2.0, and Aquaphobia which takes you on docks over the lake. We even saw a family of ducks enjoying the haunt with us. In addition to the lake, Lake Hickory Haunts also has the good fortune of having their very own cave, and their attraction Descent is located in this underground cave, because… of course.r
r
r
The experience kicked off with their first haunt Nightmare Factory. A nurse told us we would meet Dr. Death after being administered their newest truth serum, and that we might not make it to the end. Needless to say she was wrong and we continued our the journey through the  remaining 11 haunts Lake Hickory has to offer. Although each haunt is its own separate experience, there is an underlying cohesive story linking them all together. It was really impressive to see a story executed on this scale. The spaces between the haunts were like mini intermissions but could provide a great way to further communicate the connection.r
r
r
Our favorite was the Big Top Circus! It had been totally redesigned for the 2023 season and the story, theming, and set design were all SUPER original! Cotton candy covered walls, sweet smells, a plethora of unique antique clown memorabilia, and a laboratory under the big top all tickled our coulrophobia in ways we’d never imagined.r
r
r
The lake, cave, and original Big Top Circus were all just parts of the AMAZING sets at Lake Hickory Haunts! They had a great combination of fully enclosed, partially enclosed, and outdoor spaces. The fact that many of the spaces were so open affected the scares a little, but we’ve never scene such level of detail in open air sets! We also loved seeing the juxtaposition of materials. Spirit Halloween props, cleverly used household items, and pool noodles coexisted harmoniously with Hollywood-level props and effects… almost a nod to simpler beginnings. What we didn’t like were the visible step pads, but we understand the limitations being in open, outdoor environments creates.r
r
r
Lake Hickory had a ton of actors roaming the grounds of their enormous midway and lurking in every corner of each attraction! Varying degrees of makeup, prosthetics, and masks transformed the Lake Hickory actors into pirates, zombies, cave-dwelling monsters, clowns… lots of clowns… and more! Aquaphobia had some incredibly unique alien sea creatures bent on world domination. No costuming faux pas here. Despite being in natural environments, all costuming including footwear blended very well with each set.r
r
r
Being from Georgia, we compare Lake Hickory Haunts to “Netherworld on water”. What an amazing value for a full night of Halloween fun! Lake Hickory Haunts definitely had the sprawling feel of a theme park with an awesome mix of entertainment… plus fantastic restrooms… haha!  This is absolutely a must see attraction and for those of you lucky enough to live in North Carolina, you should incorporate Lake Hickory into your yearly Halloween routine!',
  NULL,
  4.5,
  'https://www.lakehickoryhaunts.com/',
  'https://www.facebook.com/LakeHickoryHaunts',
  'https://twitter.com/LakeHickoryHnts',
  'https://www.instagram.com/lakehickoryhaunts/',
  'https://www.youtube.com/channel/UC_oNhMxoJrtee4v9U3mxq4g',
  true,
  '2023-10-16 05:54:42.132253',
  '2023-10-20 04:16:33.952841'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Haunted Pyramids 2023',
  '2745 Toney Rd',
  'Lawndale',
  'NC',
  '28090',
  2023,
  'The Haunted Pyramids in Lawndale, NC was not in our original haunt tour plans but because of their proximity to our previous haunt and...',
  'The Haunted Pyramids in Lawndale, NC was not in our original haunt tour plans but because of their proximity to our previous haunt and later operating hours we decided to add them to the list!r
r
They have a whopping 6 attractions - the Monster Mill; their namesake, The Haunted Pyramids, The Abandoned; the Carnival of Terror; the newly added Dr. Venom’s Snake Pit which is not a haunt but a walkthrough reptile exhibit including lots of very big snakes, turtles, a cute caiman, and other creepy crawlies; and their Munster’s themed escape room, 1313 Mockingbird Lane. The escape room is not included with your general admission ticket but is only an extra $5. Since it was so late we didn’t get to do this one, but we do love escape rooms!r
r
When we arrived at the Haunted Pyramids, after walking past an awesome Ectomobile from the movie Ghostbusters, we checked out their midway area. They had a concession shack called the Coroner’s Cafe with the most spooktacularly named foods - frankenburgers, halloweenies, blood nuggets, and chili sneeze fries are just a few of our favorites - and there were picnic tables set up for you to enjoy your spooky snacks.r
r
Unlike many North Carolina haunts, The Haunted Pyramids is all indoors making it a great option on rainy October nights when a lot of other attractions have to close. We were also super excited to find out that this haunt offers a full contact option! So put on your glow-in-the-dark necklace and be prepared for their actors to kick things up a few notches!r
r
Super random, but we ran into one of our haunt industry friends, the famous… or infamous… set design guru, Bryce Alexander! If you don’t know this guy, look him up! He’s freaking phenomenal! More on this encounter to come…r
r
The sets in all the Haunted Pyramid attractions were low tech with lots of tight spaces, smells that we couldn’t tell if they were manufactured or organic, and planked flooring that felt like it could cave in at any moment. The names of the haunts did not provide any clue into what types of scenes we’d expect to see, which is probably because this crew spends the off-season switching things up to bring fresh sets and scares each year. They had some really original uses of every day items like arcade machines and port-a-potties being incorporated into scenes. There were also some very interesting choices of music that were unexpectedly unnerving and creepy.r
r
The Haunted Pyramids had a mix of original characters. recognizable horror icons and some unique twists on usually not-so-scary individuals… have you ever been attacked by a deranged, chainsaw-wielding Ronald McDonald? He was awesome, and we had a blast with the clowns with dreadlocks too! This was an enthusiastic and dedicated group of actors bringing an in-your-face experience! Again, it was past closing time and these guys were still on level 100 after a long night of haunting!r
r
All of The Haunted Pyramids’ attractions are designed in a way to allow for a single actor to be able to move around unseen to scare in multiple places. Some actors provided a well-timed jump scare while others interacted with us. They were fun sports too, allowing Bryce and his cowboy hat crew to join in on the fun! We were behind their group going through the haunt and each time we caught up with them, these guys had inserted themselves into a set and were either planning a group photo or partying with the monsters… haha! r
r
The Haunted Pyramids hosts all kinds of special guests and even bands throughout the haunt season. In fact, there was a whole metal fest going on that Friday the 13th weekend with over 10 bands performing!!! Can’t believe we missed out! Make sure to check out their gift shop too! Instead of being filled with only haunted attraction merch, theirs had all kinds of useful Halloween supplies like masks, costumes, and tons of spider web. r
r
With their multiple attractions, special events, special guests, yummy concessions, and Halloween supply gift shop, The Haunted Pyramids offers a ton of spooky season fun! And to top it off, they stay open til midnight most evenings so that is clutch for haunt-hopping Haunt Junkies like us!r
r
If you’re craving a late night, old school haunt in the backwoods of North Carolina, “get your fix” at The Haunted Pyramids!',
  NULL,
  3,
  'http://www.hauntedpyramids.com/',
  'http://www.facebook.com/thehauntedpyramids',
  NULL,
  'https://www.instagram.com/thehauntedpyramids',
  NULL,
  true,
  '2023-10-16 05:58:18.550656',
  '2023-10-24 01:15:30.372131'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Woods Of Terror 2023',
  '5601 N Church St',
  'Greensboro',
  'NC',
  '27455',
  2023,
  'They’re an OG, they’re massive, and it’s really just not fair to compare them to other haunted attractions...',
  'They’re an OG, they’re massive, and it’s really just not fair to compare them to other haunted attractions. Woods of Terror in Greensboro, NC has been around for 31 years of scares, and it shows! They are located on a massive piece of land called McLaurin Farms that was previously a working farm, but when the McLaurin family decided to focus less on farming and more on fun, Woods of Terror and other seasonal events were born.r
r
In addition to Woods of Terror, McLaurin Farms also has a pumpkin patch during the fall season, and they have really created the quintessential festive fall environment. As we drove in, we were enveloped in the warm colors of the season with string lights crisscrossing overhead and bales of hay, cornstalks, and of course pumpkins everywhere! r
r
Those autumn warm and fuzzies quickly changed into dark and pricklies as we entered the realm of Woods of Terror. Globe string lights still adorned the grounds but now spooky, scary skeletons were hanging from them throughout the… “midway”…??? Woods of Terror’s Monster Midway is its own little town! Tons of concessions, multiple gift shops, bars, side attractions like a hellevator ride, ax throwing and other games, and so much more!r
r
Woods of Terror has so much to keep their massive crowds entertained while they’re waiting, including their own band! The Woods of Terror band’s front man, Bone Daddy, is none other than the owner himself! r
r
In all of our years of visiting haunted attractions, we’ve never attended an opening ceremony before, and let’s just say… the Woods of Terror opening ceremony is definitely one to see! It all begins with the Monster Parade where the Woods of Terror characters flood the streets of the midway while Bone Daddy and the Woods of Terror band perform their rendition of the National Anthem. But the monsters get really fired up when the band plays their very own Woods of Terror theme song, then they have a surprise in store for the spectators. We won’t ruin it for you…r
r
After the opening ceremony we went directly to the queue line, and believe us… if you have it to spend, the VIP pass is a MUST here. Even though you will find plenty to keep you entertained, the lines are crazy! Despite our VIP passes and getting in the line right after the opening ceremony, there was still a line.r
r
With a whopping 15… yes… 15 individually themed haunts, what Woods of Terror offers simply cannot be beat. Phobia House, Jack’s Revenge, Hardwired, 3D Euphoria, Eleven’s Nightmare, The Mortuary, Awakening, Horrorwood Cinema Grande, Pirate’s Cove - The Voodoo Lagoon, Miner’s Massacre, Texas House, The Purge – Inmate processing and reprogramming center, Sensory Overload, Brookhaven Memorial Hospital, and The Scrubber each offer their own different experiences and scares. r
r
The sets at Woods of Terror are freaking out of this world INSANE!!! Floor to ceiling detail, fully themed out, entirely immersing, so much eye candy, so much going on! This review would be 20 pages long if we attempted to even briefly explain to you the level of detail, effects, and theming of each of these 15 haunts, so here’s the Cliff notes of our faves. Hardwired had some seriously twisted human/robot mashup, the pop music in 3D Euphoria was oddly disconcerting, Eleven’s Nightmare was everything a Stranger Things fan has ever dreamed of, The Nightmare on Elm Street portion of Horrorwood Cinema was pure perfection, and the sheer number of chainsaws in the Texas House fueled our gas-powered nightmares!r
r
These movie-quality sets only created a backdrop for the absolute pro actors at Woods of Terror! The midway monsters are improv and interaction specialists while the haunt actors know their roles and play them well… there was literally an actual violinist playing in the Pirate’s Cove! It’s also pretty easy to believe these characters when their costuming and makeup look so good! The demogorgans in Eleven’s Nightmare were straight out of the Upside Down and every other house and the midway featured equally realistic costumes, masks, and sfx makeup. r
r
Did we mention that we ran into the homie Stitches in the midway?! As if Woods of Terror didn’t already have enough entertainment, Stitches’ crew Dead City Circus Sideshow was performing as well! We were going through the haunts during their sideshow, so sadly, we missed it.r
r
Woods of Terror runs like the finely tuned machine you’d expect after over 3 decades of shows. Because of the massive crowds, they have to filter people through their attractions much like Universal Studios Hollywood Horror Nights versus spaced out groups but both the actors and all of the animatronics are timed extremely well to ensure everyone gets to experience a piece of the scares.   r
r
Woods of Terror is a MUST SEE!!! Like schedule a trip to Greensboro, NC to visit Woods of Terror as soon as possible! With its 15 houses, the Monster Midway, live music, games, food, and shops, Woods of Terror has something for everyone! Check them out and then make sure to let us know which part was your favorite!',
  NULL,
  5,
  'http://www.woodsofterror.com/',
  'https://www.facebook.com/WoodsOfTerror/',
  'https://twitter.com/woodsofterrornc?lang=en',
  'https://www.instagram.com/thewoodsofterror/?hl=en',
  'https://www.youtube.com/channel/UCjxYX1_W4oCaD58Ub0RcxOw',
  true,
  '2023-10-16 06:23:19.70549',
  '2023-11-13 04:19:26.393106'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Nightmare Factory 2023',
  '29 Park Ln',
  'Havelock',
  'NC',
  '28532',
  2023,
  'Nightmare Factory in Havelock, NC features a quartet of interconnected haunts within the main attraction...',
  'Nightmare Factory in Havelock, NC features a quartet of interconnected haunts within the main attraction - Dead Zone, Clowns in 3D, Haunted Factory, and Psych Ward. Nightmare Factory opens its doors at 7pm on most nights, but the real thrills begin at 9pm when they offer their R-rated show.r
r
Our expectations were blown away from the moment we pulled up! We’ve been to haunts located in strip malls and storefronts before, but this was definitely different! Nightmare Factory had taken over several buildings/storefronts in their strip mall location plus they had a large, well-developed outdoor midway complete with eerie lighting, creepy vignettes, yummy concessions, a gorgeous gift shop, and even a stage! There are extreme sideshow acts and other performances that take place on that stage nightly adding that extra layer of spooky fun!r
r
There was an ever-multiplying number of monsters lurking around the midway too. Some were in the relentless search of new victims while others were just plain entertaining… shout out to the zombie stumbling incoherently around in the tiny cemetery!r
r
As we anxiously awaited our turn, the story of Albert Knight''s Factory played on a large projection screen, recounting the horrifying history of this place. The factory truly manufactured “nightmares” in the form of an assortment of torture devices in the early 1900s. We learned that these nightmarish products were tested on the very workers who were making them, and it was rumored that those who died were fed to the others in the cafeteria. They eventually rose up against Albert Knight and his factory, setting it ablaze in an act of fiery revenge. This was a really well done video production, it legit felt like we were watching a documentary on the History Channel.r
r
The journey began outside in the factory’s zombie infested loading dock, Dead Zone. There was evidence of the horrendous past with items like electric chairs and boxes labeled with the names of other torture devices strewn about. From the loading area, we entered Nightmare Factory’s 3D blacklight experience, Clowns in 3D which was filled with… you guessed it… crazy clowns. After escaping the madness and honking clown horns we entered the Haunted Factory where we encountered a bloody butcher scene and wondered if he was the one cooking up and serving the factory’s dead workers… Last up was the Psych Ward filled with the victims who weren’t lucky enough to be killed by their experimentation.r
r
In addition to the four haunts in their main attraction, Nightmare Factory has yet another haunted attraction! The Narrows Dark Maze was new for the 2023 season. This standalone haunt was, without a doubt, our favorite experience at Nightmare Factory! We were welcomed by one of our newest favorite characters “Brains”. We’re not sure if that’s his name or not but we could see his so that’s what we’re calling him. Pitch black, super narrow, and very twisty and turny, we were forced to keep our hands in front of us to feel our way along The Narrows. As we navigated through the darkness, we were confronted with loud banging, different textures along the walls, and just the right amount of physical contact was the cherry on top.  r
r
At the Nightmare Factory, there are no animatronics to be found, but that doesn’t mean they are low tech. Movie quality sound, detailed sets, flash-crackers, loud alarms, and even louder actors bring the scares at this haunt!r
r
Because this haunt is so driven by their actors, they’ve got to look good, right? Nightmare Factory uses incredibly thorough makeup techniques on all their characters! Not only are they fully covered but most actors even wear contacts that further enhance their looks. Even after a long night of haunting, that makeup hadn’t budged and it wasn’t going anywhere. We must confess… we touched some faces to verify. Costuming was all perfectly on point as well.r
r
We’ve been to many R-rated, full contact haunts, and although what we experienced wasn''t quite the R-rating we are accustomed to, it was still an incredible show and great time! r
r
With its 4 interconnected haunts, additional attractions, eerie atmosphere, and passionate actors, this attraction delivers an all-around amazing experience! Nightmare Factory also has a year-round rage room called Unleash, so check out all the haunts and then go take out your frustration and break some shit!',
  NULL,
  4,
  'https://www.nightmarefactorync.com/',
  'https://www.facebook.com/NightmareFactoryNC',
  'https://twitter.com/NightFactory',
  'https://www.instagram.com/nightmarefactorync/',
  'https://www.youtube.com/NightmareFactoryNC',
  true,
  '2023-10-16 06:20:05.70191',
  '2023-11-09 04:55:24.785515'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'The Haunted Farm 2023',
  '624 Townsend Rd',
  'Hendersonville',
  'NC',
  '28792',
  2023,
  'A haunted attraction with a name like The Haunted Farm conjures images of a low tech haunt, full of pallets, tarp, and barns… but...',
  'A haunted attraction with a name like The Haunted Farm conjures images of a low tech haunt, full of pallets, tarp, and barns… but that could not be further from the truth for The Haunted Farm in Hendersonville, NC. r
r
r
The Haunted Farm was the first stop on our 2023 North Carolina haunt tour that, so appropriately, began on Friday the 13th! Plus, it was their 13th year in business! Celebrate 13 years of scares on Friday the 13th? Yes please!r
r
r
The drive up to The Haunted Farm was exactly what you’d expect in rural North Carolina, a gravel road with long forgotten, dilapidated country homesteads that each could have been a haunted house in their own right.r
r
r
When we arrived at this real, working cattle farm, the vibe was super chill. Their new midway area was situated in front of one of the farm’s large barns which was framed beautifully against the night sky with string lights, cozy fire pit, and photo ops galore… but what really caught our eye was just to the left of that barn… their newly built Texas Chainsaw Massacre house facade!r
r
r
Despite getting there right at opening, the general admission line was already packed, so paying extra for their fast pass option was totally worth it! Although, you do have front row seats to live entertainment from the general admission queue line. A large platform was built elevated in the trees, where a band was playing popular songs to keep everyone entertained while they waited. The queue lines are constructed of towering log walls, which makes sense considering that this haunt’s neighbor is basically a logging farm.r
r
r
The haunt begins as a lantern-lit trail through their forest with trees so tall and dense they almost blocked out the clear night sky. Once we passed through the gaping mouth of a giant, wooden skeleton head, we began entering fully built structures along the trail. The Haunted Farm did an amazing job of strategically placing spooky lighted vignettes and camouflaged actors along the trail to remind us that this wasn’t some leisurely stroll through the woods.r
r
r
Sets became more and more detailed and varied as we progressed. Some of our favorites were the voodoo shack, hillbilly house, mine, asylum, homicidal dentist, and a sewer complete with running water just to name a few. Chances are, if you think it’s scary, more than likely The Haunted Farm has it. Touching everything (the way we do) we were surprised to constantly be feeling real building materials like solid brick walls instead of faux panels, and real rebar protruding from cement. The sets were super interactive, forcing us to climb up steep inclines, crouch through low ceilinged spaces, feel our way through narrow pitch black spaces, and blindly push through doors into the next room. The set lighting was so well done too, both on the trail and in the structures, they knew exactly what to highlight and when.r
r
r
The Haunted Farm has a full cast of original characters filling their spaces, although we did see Mr. Vorhees himself, probably to commemorate Friday the 13th. The actors were a perfect blend of jump scares, interactive, and just plain creepy. The clicking contortionist in the bedroom really stands out at being incredibly unnerving without directly interacting with us. There were tons of spaces for actors to hide in until the perfect moment. Megan was the victim of more than a few well-timed scares!r
r
r
The seamlessly applied masks, super detailed makeup with prosthetics, and costuming that was on point from head-to-toe made these characters become true extensions of their environments and that much more believable.r
r
r
We read the story of the blood feud between the Lively and Tate families on their website, but it didn’t really play out through the haunt. There were definitely a few references to the story like a long hallway of missing posters, and the asylum for the bride-to-be who went crazy when her groom’s body was discovered. But these sets and actors were so incredible that we became fully immersed in every scene we stepped into. With the variety of themes and effects we experienced it truly felt like an adventure!r
r
r
The Haunted Farm squeezes a lot of action-packed haunted fun into their 30+ minute walkthrough! They used every tool you’d find in a haunter’s toolbox without it feeling disjointed, too busy, or overdone.r
r
We feel honored to have been able to experience this haunt on their 13th anniversary on Friday the 13th but would highly recommend them any time! This is the type of haunt where you can feel the love in every detail! You definitely do not want to miss The Haunted Farm!',
  NULL,
  4.5,
  'https://www.nchauntedfarm.com/',
  'https://www.facebook.com/NCHauntedFarm/',
  'https://twitter.com/nchauntedfarm',
  'https://www.instagram.com/thehauntedfarm/',
  'https://www.youtube.com/c/TheHauntedFarmHendersonville',
  true,
  '2023-10-16 05:50:43.359915',
  '2023-10-20 03:18:47.47286'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Extreme Fear ScareGrounds 2023',
  '401 Fairgrounds Rd',
  'Kinston',
  'NC',
  '28504',
  2023,
  'We finally did it! We found another black haunt owner!!! It makes our...',
  'We finally did it! We found another black haunt owner!!! It makes our spooky hearts so happy and made The Extreme Fear Scaregrounds in Kinston, NC a must-see on our 2023 North Carolina haunt tour! Shout out to the honorary mom manning the ticket booth for the words of wisdom and encouragement too!r
r
Extreme Fear Scaregrounds is located on the Lenoir County Fairgrounds, and they’ve been doing their thing for 3 years now. Despite being a newer haunt and having the challenge of taking down and putting their sets back up year after year, they have done an incredible job! These temporary sets were extremely detailed and immersive.r
r
There are 3 themed attractions that flow continuously one into the other - Nixon Asylum, Insanity, and Mayhem 3D. Their midway called Midway Madness features concessions, carnival games, a gift shop, photo-ops, and roaming midway monsters. This is also where you can find The Basement, a 5 minute escape room.r
r
The attraction begins with Nixon Asylum. Upon entering the asylum’s check-in area, we watched an immersive video of Dr. Nixon documenting the results of some of his experiments that had gone wrong. Despite these failed tests and the deranged patients we knew were inside, we went on. Aside from the typical padded patient rooms you’d expect to see in an asylum, there were some really original sets like administrative offices, therapy rooms, and when we got to an examination room we actually ran into the same Dr. Nixon from the intro video himself. This just further enforced the cohesive storyline of Nixon Asylum.  r
r
We guess the asylum made us a little crazy, because once we escaped, we entered Insanity, the second haunt. This fog-filled, chainlink fence maze is full of twists, turns, and dead-ends. The actors were climbing all over the fences, leading us in the wrong directions, and kept us completely distracted and unfocused, making it that much more difficult to navigate the maze and escape the insanity.r
r
And what scaregrounds would be complete without clowns? The final attraction, Mayhem 3D, is a clown-filled 3D blacklight experience. We donned our 3D glasses and entered the big top. The walls of Mayhem were filled with trippy, drippy evil clown art and other eye-popping designs and misdirections are everywhere as the actors do their best to blend in seamlessly with the props and sets.r
r
There is an underlying tone of madness from beginning to end and the actors do an excellent job of selling it! The actors in all three attractions were SUPER interactive and fun! We were forced to sing in the Music Therapy Room in Nixon Asylum, the actors in Insanity kept us confused with constant creepy chatter, and the rebellious clowns in Mayhem 3D engaged us in some sinister banter. They also have some young haunters in the mix, and we absolutely love to see kids getting involved! Kids are freaking creepy!r
r
Extreme Fear Scaregrounds utilized both masks and simple makeup in their costuming. The only monsters here are people so no real elaborate transformations, but everyone and everything fit in with their theming. Nothing seemed out of place or broke the immersion. r
r
This 15-minute walkthrough brought terrific sets and great acting and is totally worth a visit whether you’re taking in the Lenoir County Fair or not! There is a great vision here, and we look forward to this haunt continuing to grow and refine their show! Go a little crazy at The Extreme Fear Scaregrounds!',
  NULL,
  3.5,
  'http://www.extremefearscaregrounds.com/',
  'http://www.facebook.com/ExtremeFearKinston',
  NULL,
  'http://www.instagram.com/extremefearsg',
  'https://www.youtube.com/channel/UCgidhS1-JQls7cDrEGFjFdw',
  true,
  '2023-10-16 06:12:47.732268',
  '2023-11-04 22:00:48.4498'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Hollerin Haunts Hayride 2023',
  '2914 Bud Johnson Rd',
  'Clinton',
  'NC',
  '28328',
  2023,
  'It was the second night of our 2023 North Carolina haunt tour, and the night was crisp and clear. The first haunt on our list for the night was Hollerin Haunts Hayride in Clinton, NC, and the...',
  'It was the second night of our 2023 North Carolina haunt tour, and the night was crisp and clear. The first haunt on our list for the night was Hollerin Haunts Hayride in Clinton, NC, and the vibe out there was DOPE!!!r
r
First, we entered into their midway area which had a very young and fresh feel to it, almost like an outdoor lounge. A cool mix of pop, country, and dance music was being pumped through the speakers and a variety of actors were roaming the open grounds - tall creatures, all kinds of clowns, and none other than Freddy Krueger himself. But this Freddy wasn’t anything like the Freddy of our nightmares, this Freddy was the most dancin-est Freddy we’ve ever seen … out there getting it! Go Freddy, go Freddy… sooo much fun!r
r
Hollerin Haunts Hayride features 3 separate attractions - The Darkness, NC Zombie Hunt paintball, and their main attraction and namesake, the Hayride. In addition to the 3 main attractions, their midway features tons of games and activities to keep you vibing all night long! There’s a stage for live performances, putting green and basketball shootaway games, concessions with all your fall carnival faves, plus a couple side activities including the newly added Last Ride which is a simulated coffin ride in the back of a hearse and two 5-minute escape rooms. r
r
We decided to do the hayride first, but you can experience the attractions in any order you choose. From the moment we got on, we realized this was a hayride unlike any we’ve ever been on! We were seated on the actual bales of hay, which we LOVE!… you’d be surprised how many “hay”rides don’t actually utilize hay… but here’s what made it so different - there were no protective guard rails on the cart, and we were seated facing OUTWARD! Instead of the usual two rows of people facing inward towards a center aisle or everyone just piled in with no aisle, the two rows sat back-to-back! And since there were no guard rails, there was absolutely nothing separating us from the environments or the characters! We felt so exposed and vulnerable, and the actors definitely take advantage of this! r
 r
The tractor took us through multiple sets covering a range of themes - slaughterhouse, vampire castle, asylum, clowns, spiders, haunted house, Camp Crystal Lake, toxic dump. No cohesive theme connects the sets, but Hollering Haunts Hayride most certainly has all your creepy, traditional Halloween subjects covered! r
r
These facades and building interiors were incredibly detailed! The castle was probably our favorite! But despite the incredible set eye-candy, the focus on this ride is definitely the actors! The number of actors ranged per set but they would divide and conquer as each worked their way around the wagon, giving every rider some personal attention. Sometimes the number of actors wasn’t enough to keep us entertained, so the stops felt a little too long.r
r
The costuming always matched the theme, and there was a mix of masks and makeup but nothing over-the-top.r
r
The trail between buildings was lined with corn stalks so tall and so close that they brushed against our knees as we bumped along, and they filled these in-between spaces with some gigantic-scale prop scares and interesting lighting along the way. Sometimes the actors would follow us down the trail away from their scene too!r
r
We exited the hayride and were directed to another new addition, an optional haunted trail. With original characters like Carnie Carnivore and recognizable ones too, this trail was a chainsaw filled mix of indoor and outdoor spaces. It was a great way to travel back to the midway area for more scares! We’re looking forward to them continuing to build out this trail to maybe be its own separate attraction and level up the scares on it!r
r
Next up, was The Darkness, and it delivers exactly what you’d expect from the name. The Darkness is a pitch black maze that forces you to feel your way along super tight passageways, while ducking, squeezing, and shimmying through. Flashcrackers and loud speakers were strategically placed to really throw you off guard!r
r
Of course, because we are about that haunt hopping life, we didn’t hang out to do the paintball, but you definitely should! We noticed that, just like the hayride, Hollerin Haunts took a familiar concept and kicked it up a notch! The zombie-hunting paintball vehicle is a double decker! Talk about having the high ground advantage! The vehicle is equipped with a whopping 36 paintball guns and lit with black lights, so it glows in the night.r
r
Hollerin Haunts Hayride was the only hayride we did on our 2023 North Carolina haunt tour and what a great experience it was! Hollerin Haunts Hayride is a much newer attraction than the others in NC, but there is great vision out there, so we cannot wait to see this haunt continue to grow! Hollerin Haunts Hayride will definitely have you hollerin’, so bring the whole family and make it a full night of Halloween fun by experiencing everything HHHR has to offer! It may even take you two trips to do it!',
  NULL,
  4,
  'http://www.hollerinhauntshayride.com/',
  'https://www.facebook.com/hollerinhaunts/',
  'https://twitter.com/vht1098',
  'https://www.instagram.com/hollerinhaunts/',
  'https://www.youtube.com/channel/UC8OZIajsukQl9BA7efD1bHw',
  true,
  '2023-10-16 06:04:48.477886',
  '2023-10-31 01:42:14.16948'
);

INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'Marr Branch Haunted House 2023',
  '2289 Garner Chapel Rd',
  'Mt Olive',
  'NC',
  '28365',
  2023,
  'Marr Branch was the wildest Redneck Revival we’ve ever been to! These guys are loud, crazy, inappropriate, and kunnnnntryyy… ',
  'Marr Branch was the wildest Redneck Revival we’ve ever been to! These guys are loud, crazy, inappropriate, and kunnnnntryyy… and we LOVE IT! They are located on a real working farm in the absolute middle of nowhere… also known as Mt Olive, North Carolina.r
r
Similar to our McCloud Manor, Marr Branch Redneck Revival is a family-run attraction where every member of the family plays a vital role, from taking tickets to actively participating in the scares. It started as a single house 14 years ago and has continued to grow every year since. Marr Branch is “not your local pumpkin patch”, folks – it''s an extreme, high-energy, and sensory-overloading adventure!r
r
When we arrived on the Marr Branch farm grounds, after driving along the long, dark country roads that lead there, we immediately noticed how packed their queue line was despite the remote location. Spend the extra money and get the fast pass, it’s totally worth it! Because they do not have a traditional midway area with games, we headed directly to the line. They do have merchandise for sale and yummy food, but we recommend you wait until the end for both. You’ll lose anything you buy and work up an appetite running from rednecks all night!r
r
We didn’t see any characters roaming the grounds except for one, but he was all that was needed! “Jimmy Dean” gave a rousing performance that seriously pumped up the waiting masses! When it was our turn, we entered through the front door of the old country house and were met by grandpa, Reverend Jericho and his pet. He provided an intro and some backstory to a guitar solo. In fact, the whole haunt has a very interesting soundtrack - a little country, a little rock, and some metal mixed in. But from this intro, we were fully immersed and knew we were in for a show at this attraction! r
r
Marr Branch is a blended indoor and outdoor experience with three distinct houses and a cornfield. The sets were exactly what you’d expect with a theme like Redneck Revival. There was a real grungy, organic, old-school feel but with a few strategically placed animatronics and other effects clearly designed to keep you on edge. We journeyed through the rooms of that first old country house into the trash-strewn yard and into another house. There was a brief moment of reprieve before we went through the corn maze and then we encountered a blacklight-lit trailer that evoked the atmosphere of a disturbing meth lab, complete with the unsettling sensation of a contact high. The walls of all the houses were filled with graffiti that we couldn’t help but to read as we traversed from room to room adding an extra layer of chaos.r
r
All of their actors wore typical redneck attire to blend in perfectly with the sets and theming. We saw lots of jeans, overalls, plaid shirts, plain white tees and tank tops that had been both dirtied and bloodied. Most characters were hiding their true identities behind grotesque masks. There were pig masks, Purge-type masks, and masks reminiscent of Leatherface. r
r
Changes in elevation and footing kept us off balance and on guard, and we nearly died almost falling into the fire-blasting pit! If you are a veteran or have any kind of PTSD, Marr Branch is probably not the haunt for you. With simulated gunfire galore, we found ourselves constantly ducking and dodging non-existent bullets and yelling out “THEY SHOOTIN’!!!!!!!!!” And of course, no hillbilly adventure is complete without chainsaws!r
r
While they are not a full contact haunt… (pssttt… you guys should totally offer that as an option)… there was a lot of our personal space invaded and some slight touching, like ankle grabbing that made the overall scare experience that much more intimate.r
r
Marr Branch Redneck Revival also does a great job of pacing. This was the only haunt we visited where we didn’t end up running into the group in front of us nor did the group behind us ever catch up to us. This really ensures the highest level of actor interaction and scares.r
r
The theatrical intro and immersive sets were amazing, but what truly makes Marr Branch an incredible experience are the actors. Many with backgrounds in theater and performing arts, they brought boundless energy to their roles. These guys had us running for our lives as they chased us, pounded on walls, and shouted threats of bodily harm. Their immersive and dynamic approach created super fun, unforgettable encounters.r
r
Marr Branch Redneck Revival will have you feeling like the livestock as they push your boundaries and immerse you in their world! Prepare to be scared, thrilled, and thoroughly entertained!',
  NULL,
  4,
  'http://marrbranchhauntedhouse.com/',
  'https://www.facebook.com/Marr-Branch-Haunted-House-169234476489444/',
  NULL,
  'https://www.instagram.com/marrbranch_hauntedhouse/?hl=en',
  'https://www.youtube.com/channel/UCzbxpEcMB3zn6EOWgPnf1IQ',
  true,
  '2023-10-16 06:11:04.6746',
  '2023-11-09 01:09:21.54859'
);

-- After adding the INSERT statements above, run this verification query:
-- SELECT COUNT(*) as total_reviews,
--        COUNT(CASE WHEN featured = true THEN 1 END) as featured_reviews,
--        MIN(created_at) as oldest_review,
--        MAX(created_at) as newest_review
-- FROM reviews;
