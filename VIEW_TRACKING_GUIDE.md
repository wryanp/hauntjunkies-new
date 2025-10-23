# View Tracking & Popular Reviews Guide

This guide explains the new view tracking system and popular reviews feature.

## 🎯 What Was Implemented

### 1. **View Counter System**
- Tracks how many times each review has been viewed
- Creates social proof ("500 views" = popular!)
- Automatically increments on each page view

### 2. **Popular Reviews Section**
- Shows top 3 most-viewed reviews on homepage
- Displays with rank badges (#1, #2, #3)
- Highlights trending content

### 3. **Visual Enhancements**
- Eye icon with view count
- Animated entrance effects
- Responsive sizing (sm, md, lg)
- Formats large numbers (1.2K, 1.5M)

---

## 📦 Files Created/Modified

### New Files:
1. **`migration-view-tracking.sql`** - Database migration
2. **`src/lib/components/ViewCounter.svelte`** - Reusable view counter component
3. **`VIEW_TRACKING_GUIDE.md`** - This guide

### Modified Files:
1. **`src/lib/types.ts`** - Added view_count and last_viewed_at fields
2. **`src/routes/+page.server.ts`** - Fetches popular reviews
3. **`src/routes/+page.svelte`** - Shows popular reviews section
4. **`src/routes/reviews/+page.svelte`** - Shows view count on review cards
5. **`src/routes/reviews/[slug]/+page.server.ts`** - Increments view count
6. **`src/routes/reviews/[slug]/+page.svelte`** - Shows view count on detail page

---

## 🚀 Setup Instructions

### Step 1: Run Database Migration

Go to your **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Copy and paste the entire contents of migration-view-tracking.sql
```

This creates:
- `view_count` column (INTEGER, defaults to 0)
- `last_viewed_at` column (TIMESTAMP)
- Index for fast sorting by popularity
- Database function `increment_review_views()` for efficient updates
- Proper permissions for anonymous and authenticated users

### Step 2: Test the Feature

1. **Run the sample data** (if you haven't already):
   ```bash
   # Run sample-reviews.sql in Supabase SQL Editor
   ```

2. **View a review** to increment its count:
   - Go to http://localhost:5173/reviews
   - Click any review
   - The view count increments automatically!

3. **Check the popular section**:
   - Go to http://localhost:5173
   - Scroll to "TRENDING HAUNTS" section
   - Top 3 most-viewed reviews appear here

---

## 🎨 How It Works

### Automatic View Tracking

When someone visits a review detail page:

1. **Server detects page load** (`+page.server.ts`)
2. **Calls database function** to increment view_count
3. **Updates last_viewed_at** timestamp
4. **Returns updated review data** to the page

The increment happens asynchronously (fire-and-forget) so it doesn't slow down page load.

### View Counter Display

The `ViewCounter` component accepts these props:

```svelte
<ViewCounter
  viewCount={123}        // Number of views
  size="md"              // sm | md | lg
  showLabel={true}       // Show "views" text
  animated={true}        // Fade-in animation
/>
```

**Output examples:**
- Small numbers: "42 views"
- Thousands: "1.2K views"
- Millions: "1.5M views"

### Popular Reviews Logic

The homepage fetches the top 3 reviews:

```sql
SELECT * FROM reviews
ORDER BY view_count DESC NULLS LAST
LIMIT 3;
```

Only shows if there are popular reviews with view counts > 0.

---

## 📊 Where View Counts Appear

### 1. Reviews Listing Page (`/reviews`)
- Small view counter below ratings
- Format: 👁️ 42 (no label for compactness)

### 2. Review Detail Page (`/reviews/[slug]`)
- Medium view counter in metadata section
- Format: 👁️ 42 views
- Appears next to location and year

### 3. Homepage - Popular Reviews
- Large prominent display
- Inside highlighted box with star icon
- Shows rank badges (#1, #2, #3)
- Format: 👁️ 1.2K views

---

## 🎯 Customization Options

### Change Number of Popular Reviews

Edit `src/routes/+page.server.ts`:

```typescript
const { data: popularReviews } = await supabase
  .from('reviews')
  .select('*')
  .order('view_count', { ascending: false, nullsFirst: false })
  .limit(3); // Change to 5, 10, etc.
```

### Change ViewCounter Style

Edit `src/lib/components/ViewCounter.svelte`:

```svelte
<!-- Change the eye icon color -->
<svg class="text-haunt-orange/70">  <!-- Change color here -->

<!-- Change size classes -->
const sizeClasses = {
  sm: 'text-xs',  // Modify size
  md: 'text-sm',
  lg: 'text-base'
};
```

### Hide Popular Reviews Section

If you don't want the popular section on homepage:

```svelte
<!-- In src/routes/+page.svelte, wrap it in a condition -->
{#if false}  <!-- Change to false to hide -->
  <section>
    <!-- Popular Reviews -->
  </section>
{/if}
```

---

## 🔧 Advanced Features

### Manual View Count Adjustment

If you need to manually set or adjust view counts:

```sql
-- Set a specific count
UPDATE reviews
SET view_count = 1000
WHERE slug = 'your-haunt-slug';

-- Increment by a specific amount
UPDATE reviews
SET view_count = view_count + 50
WHERE slug = 'your-haunt-slug';

-- Reset all counts
UPDATE reviews SET view_count = 0;
```

### Query Popular Reviews

```sql
-- Top 10 most viewed
SELECT name, view_count, last_viewed_at
FROM reviews
ORDER BY view_count DESC NULLS LAST
LIMIT 10;

-- Reviews with over 100 views
SELECT name, view_count
FROM reviews
WHERE view_count > 100
ORDER BY view_count DESC;

-- Most viewed this week (requires created_at filtering)
SELECT name, view_count
FROM reviews
WHERE last_viewed_at > NOW() - INTERVAL '7 days'
ORDER BY view_count DESC
LIMIT 10;
```

### Prevent View Count Inflation

If you want to prevent the same person from inflating counts:

**Option 1: IP-based tracking** (requires additional code)
**Option 2: Cookie-based tracking** (requires additional code)
**Option 3: Accept all views** (current implementation - simplest)

Current implementation counts all views regardless of who's viewing. This is fine for most use cases and creates accurate "popularity" metrics.

---

## 📈 Analytics Insights

### Popular Content Strategy

Use view counts to:
1. **Feature popular haunts** in social media posts
2. **Understand what readers like** (cities, types, ratings)
3. **Create "Best Of" lists** based on actual engagement
4. **Reach out to popular haunts** for partnerships

### Sample Queries for Insights

```sql
-- Most popular state
SELECT state, SUM(view_count) as total_views
FROM reviews
WHERE state IS NOT NULL
GROUP BY state
ORDER BY total_views DESC;

-- Average views by rating
SELECT
  ROUND(rating_overall) as rating,
  AVG(view_count) as avg_views,
  COUNT(*) as num_reviews
FROM reviews
WHERE rating_overall IS NOT NULL
GROUP BY ROUND(rating_overall)
ORDER BY rating DESC;

-- Reviews with high views but low ratings (might need attention)
SELECT name, rating_overall, view_count
FROM reviews
WHERE view_count > 50 AND rating_overall < 3.0
ORDER BY view_count DESC;
```

---

## 🎉 Benefits of View Tracking

### For You:
- ✅ Understand what content resonates with your audience
- ✅ Identify trending haunts to feature
- ✅ Make data-driven decisions about content
- ✅ Build partnerships with popular venues

### For Visitors:
- ✅ Social proof ("500 people viewed this!")
- ✅ Discover popular haunts quickly
- ✅ See what the community recommends
- ✅ Find trending locations for the season

### For Haunts:
- ✅ Visibility for popular attractions
- ✅ Credibility through view counts
- ✅ Incentive to get more reviews
- ✅ Marketing data to reference

---

## 🐛 Troubleshooting

### Views Not Incrementing

1. **Check the database function exists:**
   ```sql
   SELECT routine_name FROM information_schema.routines
   WHERE routine_name = 'increment_review_views';
   ```

2. **Check permissions:**
   ```sql
   -- Should show anon and authenticated
   SELECT grantee, privilege_type
   FROM information_schema.routine_privileges
   WHERE routine_name = 'increment_review_views';
   ```

3. **Check browser console** for errors when viewing a review

### View Counter Not Showing

1. **Verify data exists:**
   ```sql
   SELECT slug, view_count FROM reviews WHERE view_count > 0;
   ```

2. **Check component import** in the page files

3. **Verify the conditional** `{#if review.view_count && review.view_count > 0}`

### Popular Section Empty

1. **Check if any reviews have views:**
   ```sql
   SELECT COUNT(*) FROM reviews WHERE view_count > 0;
   ```

2. **Generate some test views** by clicking through reviews

3. **Manually set view counts** for testing:
   ```sql
   UPDATE reviews SET view_count = 100 WHERE featured = true LIMIT 3;
   ```

---

## 🔮 Future Enhancements

Potential additions to consider:

1. **Weekly/Monthly Trending** - Track views by time period
2. **Views by Region** - Show local trending haunts
3. **Views Dashboard** - Admin panel with analytics
4. **Share Count** - Track social shares alongside views
5. **Engagement Score** - Combine views, comments, shares, ratings
6. **Related Reviews** - "People who viewed this also viewed..."

---

**Questions or issues?** Check the main CLAUDE.md or create a GitHub issue.

Happy tracking! 🎃👻
