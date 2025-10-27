# Testing the New Review Features

## Quick Test Instructions

### 1. Add Sample Data

Run the sample reviews SQL in your Supabase SQL Editor:

```bash
# File location: sample-reviews.sql
```

This will create:
- ✅ 5 sample reviews across 3 states (Georgia, North Carolina, Tennessee)
- ✅ 2 years (2024, 2023)
- ✅ Review dates for each visit
- ✅ 2 inline photos per review (10 photos total)
- ✅ Realistic haunt review content with `[REVIEWER_PHOTO:1]` and `[REVIEWER_PHOTO:2]` placeholders

### 2. What to Test

#### Reviews Listing Page (`/reviews`)

**State/Year Organization:**
- Reviews should be grouped hierarchically:
  - **Georgia**
    - **2024** → Netherworld, Scarehouse Studios
    - **2023** → The Dungeon of Doom
  - **North Carolina**
    - **2024** → Kersey Valley Spookywoods
  - **Tennessee**
    - **2024** → Nashville Nightmare

**Review Date Display:**
- Each review card should show the visit date in the top-right corner
- Format: "Oct 29", "Oct 15", etc.

**Filtering:**
- **State Filter** - Select "Georgia" to see only Georgia reviews
- **Year Filter** - Select "2024" to see only 2024 reviews
- **Search** - Type "Nashville" to filter by name
- **Combined** - Try filtering by both state AND year

**Ordering:**
- Within each state/year group, reviews should be ordered by `review_date` (newest first)
- Georgia 2024: Netherworld (Oct 29) should appear before Scarehouse (Oct 15)

#### Review Detail Pages

**Test these URLs:**
- `/reviews/netherworld-2024`
- `/reviews/scarehouse-studios-2024`
- `/reviews/spookywoods-2024`
- `/reviews/dungeon-of-doom-2023`
- `/reviews/nashville-nightmare-2024`

**What to Look For:**

1. **Inline Photos Rendering**
   - Photos should appear exactly where `[REVIEWER_PHOTO:1]` and `[REVIEWER_PHOTO:2]` are in the text
   - Each photo should have:
     - Orange border (`border-haunt-orange`)
     - Shadow effect
     - Max width of 672px (2xl)
     - Centered on the page
   - Captions should appear below each image in italic gray text

2. **Review Text Formatting**
   - Text should maintain line breaks (pre-line formatting)
   - Paragraphs should be separated properly
   - No raw placeholder text like `[REVIEWER_PHOTO:1]` should be visible

3. **Photo Quality**
   - Currently using placeholder.com images for testing
   - Replace these with actual team photos from Supabase Storage later

### 3. Expected Results

#### Homepage (`/`)
- Featured reviews (Netherworld, Scarehouse, Spookywoods, Nashville) should appear in the featured section

#### Reviews Listing
- **Total Reviews Shown**: 5
- **States Displayed**: Georgia, North Carolina, Tennessee (alphabetically)
- **Years**: 2024 (4 reviews), 2023 (1 review)

#### State Filter Breakdown
- **Georgia**: 3 reviews (2 in 2024, 1 in 2023)
- **North Carolina**: 1 review (2024)
- **Tennessee**: 1 review (2024)

### 4. Replace Placeholder Images

For production use, replace the placeholder images:

1. **Upload Team Photos to Supabase Storage**
   - Create bucket: `reviewer-photos` (make it public)
   - Upload photos of your team at haunts
   - Get the public URLs

2. **Update the reviewer_photos table**
   ```sql
   UPDATE reviewer_photos
   SET image_url = 'https://your-supabase-url/storage/v1/object/public/reviewer-photos/netherworld-entrance.jpg'
   WHERE caption LIKE '%Netherworld%' AND display_order = 1;
   ```

3. **Update cover images too**
   ```sql
   UPDATE reviews
   SET cover_image_url = 'https://your-supabase-url/storage/v1/object/public/review-images/netherworld-cover.jpg'
   WHERE slug = 'netherworld-2024';
   ```

### 5. Adding Your Own Real Reviews

Follow this pattern:

```sql
-- 1. Insert the review
INSERT INTO reviews (
  name, slug, state, city, year, review_date,
  description, review_text,
  rating_overall, rating_scares, rating_atmosphere, rating_value,
  cover_image_url, featured
) VALUES (
  'Your Haunt Name',
  'your-haunt-2024',
  'Georgia',
  'Atlanta',
  2024,
  '2024-10-31',  -- Actual visit date
  'Brief description...',
  'Full review text here...

[REVIEWER_PHOTO:1]

More text...

[REVIEWER_PHOTO:2]

Final thoughts...',
  4.5, 4.3, 4.7, 4.4,
  'https://your-storage-url/cover.jpg',
  true
);

-- 2. Get the review ID
SELECT id FROM reviews WHERE slug = 'your-haunt-2024';

-- 3. Add the photos
INSERT INTO reviewer_photos (review_id, image_url, caption, alt_text, display_order)
VALUES
  ('your-review-id', 'url-to-photo-1.jpg', 'Caption for photo 1', 'Alt text', 1),
  ('your-review-id', 'url-to-photo-2.jpg', 'Caption for photo 2', 'Alt text', 2);
```

### 6. Troubleshooting

**Photos not showing?**
- Check that review_id matches between reviews and reviewer_photos tables
- Verify placeholder numbers match display_order values
- Check image URLs are publicly accessible
- Look for errors in browser console (F12)

**Reviews not grouping correctly?**
- Ensure state names are consistent (e.g., "Georgia" not "GA")
- Check that year is set as a number
- Verify review_date is in YYYY-MM-DD format

**Filters not working?**
- Clear browser cache and refresh
- Check that state/year values exist in the data
- Open browser console to check for JavaScript errors

### 7. Performance Notes

With just 5 reviews, everything should be instant. As you add more:
- Indexes on `state`, `year`, and `review_date` ensure fast queries
- Client-side filtering happens in memory (fast until you have 100+ reviews)
- Consider server-side filtering if you exceed ~50 reviews

---

**Ready to test?** Run `sample-reviews.sql` in Supabase and navigate to `/reviews`!
