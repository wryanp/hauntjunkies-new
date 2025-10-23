# Review Organization & Inline Images Guide

This guide explains the new review organization features and how to add strategic inline images to review text.

## Overview of New Features

1. **Reviews organized by State and Year** - Reviews are now grouped hierarchically
2. **Review Date tracking** - Track the actual date a haunt was visited (separate from when the review was posted)
3. **Inline Reviewer Photos** - Add photos of yourselves visiting the haunt directly within the review text

## Database Migration

Before using these features, run the migration SQL in your Supabase SQL Editor:

```bash
# The migration file is located at:
migration-review-enhancements.sql
```

This migration adds:
- `review_date` column to the `reviews` table
- New `reviewer_photos` table for inline images
- Indexes for performance optimization
- RLS policies for security

## How Reviews Are Now Organized

### On the Reviews Listing Page (/reviews)

Reviews are displayed in a hierarchical structure:

```
Georgia
  └─ 2024
      ├─ Haunt A (Oct 29)
      ├─ Haunt B (Oct 15)
  └─ 2023
      ├─ Haunt C (Oct 31)

North Carolina
  └─ 2024
      ├─ Haunt D (Oct 20)
```

### Filtering

Three filter options are available:
- **Search** - Filter by haunt name, city, or state
- **State Filter** - Show only reviews from a specific state
- **Year Filter** - Show only reviews from a specific year

### Ordering

Reviews are ordered by:
1. **Primary**: `review_date` (the date you actually visited the haunt)
2. **Fallback**: `created_at` (for reviews without a review_date)
3. Within each state/year group, reviews appear in reverse chronological order (newest first)

## Adding a New Review with Review Date

When creating a review in Supabase, set the `review_date` field:

```sql
INSERT INTO reviews (
  name,
  slug,
  state,
  city,
  year,
  review_date,  -- NEW FIELD
  description,
  review_text,
  rating_overall,
  cover_image_url,
  featured
) VALUES (
  'Netherworld Haunted House',
  'netherworld-2024',
  'Georgia',
  'Stone Mountain',
  2024,
  '2024-10-29',  -- The date you actually visited
  'One of the most intense haunted attractions in the Southeast...',
  'Walking up to Netherworld...',
  4.8,
  'https://your-storage-url/netherworld-cover.jpg',
  true
);
```

## Adding Inline Reviewer Photos

### Step 1: Upload Your Photos to Supabase Storage

1. Go to Supabase Dashboard → Storage
2. Create a bucket called `reviewer-photos` (or use an existing public bucket)
3. Upload your photos (e.g., photos of you at the haunt entrance, with actors, etc.)

### Step 2: Add Photos to the reviewer_photos Table

```sql
-- Get the review ID first
SELECT id FROM reviews WHERE slug = 'netherworld-2024';

-- Insert reviewer photos
INSERT INTO reviewer_photos (review_id, image_url, caption, alt_text, display_order) VALUES
('your-review-id-here', 'https://your-storage-url/us-at-entrance.jpg', 'Outside the entrance to Netherworld', 'Haunt Junkies team at Netherworld entrance', 1),
('your-review-id-here', 'https://your-storage-url/with-actor.jpg', 'Meeting one of the terrifying actors', 'Team photo with haunted house actor', 2),
('your-review-id-here', 'https://your-storage-url/queue-line.jpg', 'The massive queue line on opening night', 'Photo of the opening night crowd', 3);
```

### Step 3: Use Placeholders in Your Review Text

Write your review text with placeholders where you want images to appear:

```sql
UPDATE reviews
SET review_text = 'Walking up to Netherworld, we could already feel the intensity. The facade is absolutely massive and incredibly detailed.

[REVIEWER_PHOTO:1]

The wait time was about 45 minutes, but the queue line entertainment kept everyone engaged. We met some of the actors in the outdoor area who were already in character.

[REVIEWER_PHOTO:2]

Once inside, the production value is immediately apparent. Every room is meticulously designed...

The animatronics are some of the best we''ve seen. The timing and realism are incredible.

[REVIEWER_PHOTO:3]

Overall, Netherworld continues to set the bar for haunted attractions. This is a must-visit!'
WHERE slug = 'netherworld-2024';
```

### Placeholder Format

- Use `[REVIEWER_PHOTO:N]` where N is the display_order (1, 2, 3, etc.)
- Photos will be inserted inline at that exact position
- If a photo number doesn't exist, the placeholder is left as-is
- Photos are automatically styled with borders and captions

### Strategic Placement Tips

1. **After describing the entrance** - Show yourselves arriving
2. **When mentioning specific scenes** - Include photos from those areas
3. **After discussing actors** - Show team photos with cast members
4. **During queue discussion** - Show the line/atmosphere
5. **After major highlights** - Visual proof of standout moments

## Example Review Structure

```
[Intro paragraph about the haunt]

[REVIEWER_PHOTO:1]  ← Team at entrance

[Paragraph about queue line and atmosphere]

[REVIEWER_PHOTO:2]  ← Queue line photo

[Detailed walkthrough of the haunt experience]

[REVIEWER_PHOTO:3]  ← Inside photo (if allowed)

[Discussion of standout scenes]

[REVIEWER_PHOTO:4]  ← With actors or exit photo

[Final thoughts and rating]
```

## Photo Guidelines

### What Makes Good Reviewer Photos

✅ **DO:**
- Show the team actually at the location
- Capture the atmosphere and scale
- Include photos with permission from haunt staff
- Use good lighting for outdoor shots
- Include captions explaining context

❌ **DON'T:**
- Take photos inside haunts without permission
- Use low-quality or blurry images
- Include photos that spoil scares or surprises
- Overcrowd the review with too many images
- Forget to add captions for context

### Recommended Number of Photos

- **Short review** (< 500 words): 2-3 photos
- **Medium review** (500-1000 words): 3-5 photos
- **Long review** (> 1000 words): 5-8 photos

## Display Behavior

### On the Reviews Listing Page
- Reviews show the review_date (e.g., "Oct 29") in the top-right corner of each card
- Reviews are grouped by State → Year
- Each state has a large orange header
- Each year within a state has a subheader

### On the Review Detail Page
- Inline photos appear exactly where placeholders are placed
- Photos are max-width 2xl (672px) and centered
- Images have an orange border and shadow for visual appeal
- Captions appear in italic gray text below each image
- Review text maintains normal line breaks (pre-line formatting)

## Managing Your Reviews

### Editing Review Text
Simply update the `review_text` field in Supabase:

```sql
UPDATE reviews
SET review_text = 'Your updated text with [REVIEWER_PHOTO:1] placeholders'
WHERE slug = 'your-haunt-slug';
```

### Reordering Photos
Update the `display_order` field:

```sql
-- Swap photo 1 and photo 2
UPDATE reviewer_photos SET display_order = 99 WHERE display_order = 1;
UPDATE reviewer_photos SET display_order = 1 WHERE display_order = 2;
UPDATE reviewer_photos SET display_order = 2 WHERE display_order = 99;
```

### Deleting Photos
Photos are automatically deleted if the review is deleted (CASCADE):

```sql
DELETE FROM reviewer_photos WHERE id = 'photo-id-here';
```

## Performance Considerations

- Indexes have been created on `review_date`, `state`, and `year` for fast filtering
- Reviewer photos are loaded per review (not globally)
- Image placeholders are parsed client-side for flexibility

## Troubleshooting

### Photos Not Appearing
1. Check that `reviewer_photos` records exist for that review_id
2. Verify the placeholder number matches the display_order
3. Ensure image URLs are accessible (public bucket)
4. Check browser console for errors

### Reviews Not Grouping Correctly
1. Verify the `state` field is set and consistent (e.g., "Georgia" not "GA")
2. Ensure `year` is populated
3. Check that `review_date` is in YYYY-MM-DD format

### Photos Appearing in Wrong Order
- The placeholder number `[REVIEWER_PHOTO:N]` should match the photo's `display_order`
- `display_order` is 1-based (starts at 1, not 0)

## Future Enhancements

Potential features for future development:
- Admin panel for easier photo management
- Photo gallery view option
- Image lazy loading for performance
- Thumbnail generation
- Support for video embeds
- Before/after comparisons

---

**Questions or Issues?**
Check the CLAUDE.md file or create an issue in the repository.
