# Heroku to Supabase Reviews Migration

This directory contains the migration script to import all reviews from your Heroku Postgres database to Supabase.

## 📊 Migration Summary

- **Source**: Heroku Postgres (`hauntjunkies` app)
- **Destination**: Supabase Reviews Table
- **Total Reviews**: 90 reviews
- **Migration Type**: Full replacement (deletes existing Supabase data)

## 📋 What Was Migrated

### Fields Mapped from Heroku → Supabase

| Heroku Field | Supabase Field | Notes |
|--------------|----------------|-------|
| `id` | `id` | New UUIDs generated |
| `name` | `name` | Direct mapping |
| `address1` + `address2` | `address` | Concatenated |
| `city` | `city` | Direct mapping |
| `state` | `state` | Direct mapping |
| `zip` | `zip` | Direct mapping |
| `year` | `year` | Converted to INTEGER |
| `description` | `description` | Direct mapping |
| `article` | `review_text` | Direct mapping |
| `slug` | `slug` | Direct mapping |
| `rating` | `rating_overall` | Direct mapping |
| `url` | `website_url` | Direct mapping |
| `facebook` | `facebook_url` | Direct mapping |
| `twitter` | `twitter_url` | Direct mapping |
| `instagram` | `instagram_url` | Direct mapping |
| `youtube` | `youtube_url` | Direct mapping |
| `featured` | `featured` | Direct mapping |
| `created_at` | `created_at` | Direct mapping |
| `updated_at` | `updated_at` | Direct mapping |

### New Supabase Fields (Not in Heroku - Set to NULL)

These fields exist in Supabase but didn't exist in the Heroku database, so they are set to `NULL` or defaults:

- `review_date`
- `caption`
- `review_image`
- `tiktok_url`
- `view_count`
- `last_viewed_at`
- `rating_scares`
- `rating_atmosphere`
- `rating_value`
- `award_best_actors_year`
- `award_best_makeup_year`
- `award_best_set_design_year`
- `award_best_story_year`
- `award_scariest_year`
- `award_best_overall_year`

### Heroku Fields Not Migrated

These fields existed in Heroku but are not used in Supabase:

- `review_photo_file_name`, `review_photo_content_type`, `review_photo_file_size`, `review_photo_updated_at`
- `phone`
- `latitude`, `longitude`
- `featured_order`, `featured_link_to_review`
- `by`, `string`
- `award` (boolean)

## 🚀 How to Run the Migration

### ⚠️ IMPORTANT: Backup First!

This migration will **DELETE ALL existing reviews** in your Supabase database!

Before running the migration:

1. **Backup your Supabase reviews table** (if you have any data you want to keep)
2. **Export any images** from existing reviews if needed

### Steps to Execute

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Copy the Migration Script**
   - Open `migrations/import-heroku-reviews.sql`
   - Copy the entire contents

3. **Paste and Run**
   - Paste into the Supabase SQL Editor
   - Click "Run" to execute

4. **Verify the Migration**
   ```sql
   SELECT COUNT(*) as total_reviews,
          COUNT(CASE WHEN featured = true THEN 1 END) as featured_reviews,
          MIN(created_at) as oldest_review,
          MAX(created_at) as newest_review
   FROM reviews;
   ```

   Expected results:
   - `total_reviews`: 90
   - `featured_reviews`: ~8-10 (varies)
   - Date range: 2016-2023

## 📁 Files Included

- `import-heroku-reviews.sql` - Complete migration script with 90 INSERT statements
- `README-HEROKU-MIGRATION.md` - This file (documentation)
- `heroku-reviews-data.sql` - Raw export from Heroku (backup/reference)
- `heroku-backup.dump` - Full Heroku database dump (backup)

## 🛠️ Regenerating the Migration

If you need to regenerate the migration script:

```bash
node scripts/convert-heroku-reviews.cjs
```

This will:
1. Read `heroku-reviews-data.sql`
2. Parse the PostgreSQL COPY format data
3. Generate INSERT statements with proper SQL escaping
4. Update `migrations/import-heroku-reviews.sql`

## 🎨 Post-Migration Tasks

After running the migration, you may want to:

1. **Update Images**
   - Review images may reference old URLs
   - Upload images to Supabase Storage
   - Update `cover_image_url` fields

2. **Add Missing Data**
   - Populate `review_date` for each review
   - Add `caption` for social media sharing
   - Set `review_image` thumbnails

3. **Configure Awards**
   - Review which haunts won Golden Ghost Awards
   - Set appropriate `award_*_year` fields

4. **Add Ratings**
   - If you have detailed ratings, populate:
     - `rating_scares`
     - `rating_atmosphere`
     - `rating_value`

5. **Generate Slugs**
   - Some reviews may have NULL slugs
   - Generate URL-friendly slugs for those reviews

## 🐛 Troubleshooting

### Issue: "uuid_generate_v4() does not exist"

**Solution**: Enable the UUID extension in Supabase:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Issue: Some reviews have NULL slugs

**Cause**: Heroku database had some reviews without slugs

**Solution**: Generate slugs manually:
```sql
UPDATE reviews
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
```

### Issue: SQL syntax errors

**Cause**: Special characters in review text

**Solution**: The conversion script should handle this, but if you see errors, check for unescaped quotes in the problematic INSERT statement.

## 📞 Need Help?

If you encounter any issues with the migration:

1. Check the verification query to see if data was partially imported
2. Review the Supabase logs for specific error messages
3. Try running individual INSERT statements to identify problematic reviews
4. Contact support with the specific error message

## ✅ Migration Checklist

- [ ] Backup current Supabase reviews table
- [ ] Backup Supabase Storage images (if any)
- [ ] Review the migration script (`import-heroku-reviews.sql`)
- [ ] Run migration in Supabase SQL Editor
- [ ] Verify count (should be 90 reviews)
- [ ] Spot-check 5-10 random reviews for data accuracy
- [ ] Update image URLs to Supabase Storage
- [ ] Populate missing fields (review_date, ratings, etc.)
- [ ] Test reviews display on website
- [ ] Configure awards if applicable

---

**Migration Generated**: 2025-10-26
**Reviews Migrated**: 90
**Heroku App**: hauntjunkies
**Supabase Project**: [Your project name]
