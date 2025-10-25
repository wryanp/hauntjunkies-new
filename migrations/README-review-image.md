# Add Review Image Column Migration

## What This Does

Adds the `review_image` column to the `reviews` table. This column stores the URL for the social media share thumbnail image (used for og:image meta tags when sharing reviews on social media).

## Why This Is Needed

The application code expects a `review_image` field for social media sharing, but this column was missing from the original database schema. Without this column:
- Social media share thumbnails won't display properly
- The "Social Media Share Image" field in the admin panel has nowhere to store data
- Reviews will fall back to using `cover_image_url` or a default image

## How to Apply

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `add-review-image-column.sql`
5. Click **Run**

### Option 2: Supabase CLI

```bash
supabase db execute -f migrations/add-review-image-column.sql
```

## After Running

Once this migration is applied:
1. The `review_image` column will be available in the reviews table
2. You can upload social media share images via the admin panel
3. When sharing review links, the proper thumbnail will display on social platforms
4. The fallback chain is: `review_image` → `cover_image_url` → `/og-review-default.jpg`

## Verification

To verify the migration was successful, run this query in SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reviews' AND column_name = 'review_image';
```

You should see one row with `review_image` as a `text` column.
