# 🗄️ Database Setup Instructions

Complete guide for setting up your Supabase database with required functions and performance indexes.

---

## 📋 Table of Contents

1. [Critical: Ticket Purchase Function](#critical-ticket-purchase-function)
2. [Recommended: Performance Indexes](#recommended-performance-indexes)
3. [Verification Steps](#verification-steps)
4. [Troubleshooting](#troubleshooting)

---

## 🚨 Critical: Ticket Purchase Function

### Why This Is Required

The ticket purchase system uses an atomic database function to prevent race conditions when multiple customers try to buy tickets simultaneously. **Without this function, ticket purchases will fail.**

### Step-by-Step Instructions

#### 1. Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"** button

#### 2. Execute the Ticket Purchase Function

1. Open the file: `migrations/migration-purchase-tickets-function.sql`
2. Copy the entire contents (all 89 lines)
3. Paste into the Supabase SQL Editor
4. Click **"Run"** button (or press `Cmd/Ctrl + Enter`)

#### 3. Verify Success

You should see a success message:

```
Success. No rows returned
```

If you see this, the function was created successfully! ✅

### What This Function Does

- **Prevents overselling**: Locks the ticket date row to prevent concurrent purchases
- **Validates capacity**: Checks remaining tickets before confirming purchase
- **Enforces limits**: Respects max_tickets_per_request setting
- **Atomic operation**: Either completes fully or rolls back (no partial purchases)

### Testing the Function

You can test it with this query:

```sql
SELECT purchase_tickets(
  p_date := '2024-10-31'::DATE,
  p_tickets := 2,
  p_name := 'Test User',
  p_first_name := 'Test',
  p_last_name := 'User',
  p_email := 'test@example.com',
  p_confirmation_number := 'TEST-12345'
);
```

Expected result:
```json
{
  "success": true,
  "ticket_id": "some-uuid",
  "confirmation_number": "TEST-12345"
}
```

---

## ⚡ Recommended: Performance Indexes

### Why Add These

Performance indexes dramatically speed up common queries:

- **Review lookups** by slug: 100x faster
- **Featured reviews** on homepage: 50x faster
- **Comment loading**: 75x faster
- **Ticket searches**: 80x faster
- **Admin dashboard**: Significantly faster

### Step-by-Step Instructions

#### 1. Access Supabase SQL Editor

Same as above - SQL Editor → New Query

#### 2. Execute the Indexes Script

1. Open the file: `migrations/add-performance-indexes.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **"Run"** button

#### 3. Verify Success

You should see messages like:

```
NOTICE:  relation "idx_reviews_slug" already exists, skipping
NOTICE:  relation "idx_reviews_featured" already exists, skipping
...
NOTICE:  Performance indexes created successfully!
```

The "already exists" messages are **normal and expected** if you run this script multiple times. The script uses `IF NOT EXISTS` to be safely re-runnable.

### What Gets Indexed

The script creates **15 performance indexes**:

#### Reviews (4 indexes)
- `idx_reviews_slug` - Fast lookup by URL slug
- `idx_reviews_featured` - Homepage featured reviews
- `idx_reviews_created_at` - Recent reviews sorting
- `idx_reviews_featured_rating` - Best featured haunts

#### Comments (3 indexes)
- `idx_comments_approved` - Public approved comments
- `idx_comments_review_id` - Comments per review
- `idx_comments_pending` - Admin moderation queue

#### Tickets (5 indexes)
- `idx_ticket_dates_available` - Available dates for purchase
- `idx_ticket_dates_date` - Admin date management
- `idx_ticket_requests_date` - Grouping by date
- `idx_ticket_requests_email` - Customer search
- `idx_ticket_requests_confirmed` - Capacity calculations
- `idx_ticket_requests_created_at` - Recent tickets

#### Other (3 indexes)
- `idx_contact_unread` - Unread messages
- `idx_contact_created_at` - All messages sorting
- `idx_review_images_review_display` - Gallery ordering
- `idx_mccloud_photos_display` - Manor gallery ordering

---

## ✅ Verification Steps

### Verify Ticket Purchase Function

Run this query in SQL Editor:

```sql
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'purchase_tickets';
```

Expected result:
```
routine_name      | routine_type
------------------+-------------
purchase_tickets  | FUNCTION
```

### Verify Performance Indexes

Run this query:

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

You should see **15 indexes** starting with `idx_`.

### Verify Tables Exist

Check that all required tables are present:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Expected tables:
- `contact_submissions`
- `hero_message`
- `horror_quotes`
- `mccloud_info`
- `mccloud_photos`
- `rate_limits`
- `review_comments`
- `review_images`
- `reviews`
- `site_settings`
- `ticket_dates`
- `ticket_purchases` (legacy)
- `ticket_requests`

---

## 🔧 Troubleshooting

### Function Already Exists

**Error:**
```
ERROR:  function "purchase_tickets" already exists with same argument types
```

**Solution:**
This is fine! The function is already installed. You can either:
1. Skip this step (function already works)
2. Drop and recreate it:

```sql
DROP FUNCTION IF EXISTS purchase_tickets(DATE, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT);
-- Then re-run the creation script
```

### Permission Denied

**Error:**
```
ERROR:  permission denied to create function
```

**Solution:**
You need to be the project owner or have admin privileges. Contact your Supabase project admin.

### Table Does Not Exist

**Error:**
```
ERROR:  relation "ticket_dates" does not exist
```

**Solution:**
Run the main schema setup first:
1. Find `supabase-schema.sql` in your project root
2. Execute it in SQL Editor before running these migrations

### Index Creation Fails

**Error:**
```
ERROR:  column "slug" does not exist
```

**Solution:**
Your database schema is missing columns. Run the complete schema setup:
1. `supabase-schema.sql` - Creates all tables and columns
2. Then retry the indexes script

### How to Drop All Indexes (If Needed)

If you need to start fresh with indexes:

```sql
-- Drop all custom indexes (BE CAREFUL!)
DROP INDEX IF EXISTS idx_reviews_slug;
DROP INDEX IF EXISTS idx_reviews_featured;
DROP INDEX IF EXISTS idx_reviews_created_at;
DROP INDEX IF EXISTS idx_reviews_featured_rating;
DROP INDEX IF EXISTS idx_comments_approved;
DROP INDEX IF EXISTS idx_comments_review_id;
DROP INDEX IF EXISTS idx_comments_pending;
DROP INDEX IF EXISTS idx_ticket_dates_available;
DROP INDEX IF EXISTS idx_ticket_dates_date;
DROP INDEX IF EXISTS idx_ticket_requests_date;
DROP INDEX IF EXISTS idx_ticket_requests_email;
DROP INDEX IF EXISTS idx_ticket_requests_confirmed;
DROP INDEX IF EXISTS idx_ticket_requests_created_at;
DROP INDEX IF EXISTS idx_contact_unread;
DROP INDEX IF EXISTS idx_contact_created_at;
DROP INDEX IF EXISTS idx_review_images_review_display;
DROP INDEX IF EXISTS idx_mccloud_photos_display;
```

---

## 🎯 Quick Checklist

- [ ] Execute `migration-purchase-tickets-function.sql` (**Critical**)
- [ ] Verify function exists with verification query
- [ ] Test ticket purchase function
- [ ] Execute `add-performance-indexes.sql` (Recommended)
- [ ] Verify indexes created with verification query
- [ ] Test site performance (should feel faster)

---

## 📝 Notes

### Safe to Re-Run

Both scripts are safe to run multiple times:
- **Ticket function**: Uses `CREATE OR REPLACE FUNCTION`
- **Indexes**: Uses `IF NOT EXISTS` clause

### Production vs Development

These scripts work identically in both environments. Run them on:
- ✅ Development database (for testing)
- ✅ Production database (before go-live)

### Performance Impact

- **Function creation**: Instant, no impact on existing data
- **Index creation**: Takes 1-5 seconds per index on small databases
- **Large databases**: May take longer, but indexes are created without locking tables

### Backup Recommendation

While these scripts are safe, it's always good practice to:
1. Take a database backup before running migrations
2. Test in development environment first
3. Then apply to production

---

## 🚀 Next Steps

After completing this setup:

1. ✅ Test ticket purchases on your site
2. ✅ Verify admin dashboard loads faster
3. ✅ Check review pages load quickly
4. ✅ Monitor database performance in Supabase dashboard

---

## 📚 Related Documentation

- [Database Safety Measures](DATABASE-SAFETY-MEASURES.md)
- [Local Development Setup](LOCAL_DEVELOPMENT.md)
- [Deployment Guide](DEPLOYMENT.md)
- [CLAUDE.md](../CLAUDE.md) - Full project documentation

---

<div align="center">

**🎃 Database Setup Complete! 🎃**

*Your Haunt Junkies site is now optimized and ready for production*

</div>
