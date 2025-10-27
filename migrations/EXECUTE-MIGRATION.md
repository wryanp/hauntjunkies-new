# 🚀 Execute Heroku to Supabase Migration

**READ THIS FIRST** before executing the migration!

## ⚠️ IMPORTANT WARNINGS

1. **This will DELETE all existing reviews in Supabase**
2. **Make sure you have backed up any data you want to keep**
3. **This action cannot be undone**
4. **The migration will import 90 reviews from Heroku**

## ✅ Pre-Flight Checklist

Before starting, make sure:

- [ ] You have access to your Supabase project dashboard
- [ ] You have backed up existing Supabase data (if any)
- [ ] You have `migrations/import-heroku-reviews.sql` file ready
- [ ] You have `migrations/migration-log.md` open to track progress

## 📋 Step-by-Step Execution Guide

### Step 1: Access Supabase SQL Editor

1. Go to https://supabase.com
2. Open your HauntJunkies project
3. Click on "SQL Editor" in the left sidebar
4. Click "+ New query" button

### Step 2: Check Current State (Optional but Recommended)

Before migration, run this query to see what currently exists:

```sql
SELECT COUNT(*) as current_review_count FROM reviews;
```

**Record the result in `migration-log.md` under "Phase 2.1"**

### Step 3: Copy the Migration Script

1. Open `migrations/import-heroku-reviews.sql` in your text editor
2. Select ALL content (Cmd+A / Ctrl+A)
3. Copy to clipboard (Cmd+C / Ctrl+C)

### Step 4: Paste and Execute

1. In Supabase SQL Editor, paste the entire script
2. **DOUBLE-CHECK** you pasted the complete file
3. Look for these markers:
   - Starts with: `-- Migration Script: Import Reviews from Heroku to Supabase`
   - Contains: `DELETE FROM reviews;`
   - Contains: Many `INSERT INTO reviews` statements (90 total)
   - Ends with: Verification query (commented out)

4. Click the "▶ Run" button (or press Cmd+Enter / Ctrl+Enter)

### Step 5: Monitor Execution

Watch for:
- **Green success message**: "Success. No rows returned"
- **Red error message**: If you see this, STOP and note the error
- **Execution time**: Should be 10-60 seconds

### Step 6: Verify Migration Success

Run these verification queries ONE AT A TIME:

#### 6.1 Count Total Reviews
```sql
SELECT COUNT(*) as total_reviews FROM reviews;
```
**Expected**: 90
**Actual**: _____

#### 6.2 Check Featured Reviews
```sql
SELECT COUNT(CASE WHEN featured = true THEN 1 END) as featured_count
FROM reviews;
```
**Expected**: 8-10
**Actual**: _____

#### 6.3 Check Date Range
```sql
SELECT
  MIN(created_at) as oldest_review,
  MAX(created_at) as newest_review,
  MIN(year) as earliest_year,
  MAX(year) as latest_year
FROM reviews;
```
**Expected**: 2016-2023 range
**Results**: _____

#### 6.4 Sample Reviews
```sql
SELECT
  name,
  city,
  state,
  year,
  rating_overall,
  featured,
  LENGTH(review_text) as review_length
FROM reviews
ORDER BY created_at DESC
LIMIT 5;
```
**Results**: Should show 5 recent reviews with data

### Step 7: Update Migration Log

1. Open `migrations/migration-log.md`
2. Fill in all the [TO BE FILLED BY USER] sections under:
   - Phase 2: Pre-Migration Verification
   - Phase 3: Migration Execution
   - Phase 4: Post-Migration Verification
3. Record any errors or issues in Phase 5
4. Update the Migration Summary statistics
5. Change status from "IN PROGRESS" to "COMPLETED"
6. Sign off at the bottom

## 🎯 What to Do After Migration

### Immediate Tasks:

1. **Test a review page** on your website:
   - Go to `/reviews` to see list
   - Click on a review to view detail page
   - Check if images load (they may not - see next step)

2. **Note image issues**:
   - Heroku images may use old Paperclip URLs
   - You'll need to migrate images to Supabase Storage
   - Update `cover_image_url` fields accordingly

3. **Check for NULL slugs**:
```sql
SELECT id, name FROM reviews WHERE slug IS NULL;
```
   - Generate slugs for these reviews

### Optional Enhancements:

4. **Add review dates** (when each haunt was visited)
5. **Add captions** for social sharing
6. **Configure awards** for Golden Ghost winners
7. **Add detailed ratings** (scares, atmosphere, value)

## 🆘 Troubleshooting

### Error: "uuid_generate_v4() does not exist"

**Solution**: Run this first:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
Then re-run the migration.

### Error: "syntax error at or near..."

**Cause**: Script may not have pasted completely
**Solution**:
1. Clear the SQL editor
2. Re-copy the ENTIRE script
3. Make sure you got all 3,320 lines
4. Try again

### Error: "relation reviews does not exist"

**Cause**: Reviews table hasn't been created yet
**Solution**: Run the `supabase-schema.sql` first to create all tables

### Some reviews have weird characters

**Cause**: Encoding issue during paste
**Solution**: Make sure you're using UTF-8 encoding when opening the SQL file

### Migration completed but count is less than 90

**Cause**: Some INSERT statements may have failed silently
**Solution**:
1. Check Supabase logs for errors
2. Identify which reviews failed
3. Run those specific INSERT statements individually

## 📞 Need Help?

If you encounter issues:

1. **Check the migration log** for specific error messages
2. **Screenshot the error** in Supabase
3. **Note which step failed** (Step 1-7 above)
4. **Check if partial data imported** (run count query)

## ✅ Success Criteria

Migration is successful when:

- ✅ All 90 reviews imported (count matches)
- ✅ No SQL errors in Supabase
- ✅ Featured reviews properly marked
- ✅ Sample reviews have complete data
- ✅ Review pages load on website (even if images are broken)

---

**Ready to begin?** Follow Steps 1-7 above and good luck! 🍀

**Remember**: Update `migration-log.md` as you go!
