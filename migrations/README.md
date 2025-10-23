# 🗄️ Database Migrations

> SQL migration files for the Haunt Junkies database schema

---

## 📋 Main Schema

The complete database schema is in the root directory:

```
../supabase-schema.sql
```

This file contains:
- ✅ All table definitions
- 🔒 Row Level Security (RLS) policies
- 🚀 Indexes for performance
- ⚡ Triggers and functions
- 🔄 Default data

---

## 📁 Migration Files

Execute these migrations in your Supabase SQL Editor as needed:

### 🔴 **Core Functionality** (CRITICAL)

| File | Description | Priority |
|------|-------------|----------|
| `migration-purchase-tickets-function.sql` | **REQUIRED** Atomic ticket purchase function with race condition protection | 🔴 CRITICAL |
| `migration-ticket-requests.sql` | Updates to ticket_requests table structure | 🟡 Medium |
| `create-contact-submissions-table.sql` | Contact form submissions table | 🟢 Optional |

> ⚠️ **IMPORTANT**: `migration-purchase-tickets-function.sql` **MUST** be executed before ticket sales go live!

### 📊 **Data Migrations**

| File | Description | Purpose |
|------|-------------|---------|
| `add-quotes.sql` | Initial horror quotes setup | Creates table + adds quotes |
| `add-more-horror-quotes.sql` | Additional horror quotes | Adds more quotes to existing table |
| `insert-quotes-only.sql` | Quote data only | Data only (no table creation) |

### 🧪 **Development/Testing**

| File | Description |
|------|-------------|
| `check-dates.sql` | Query to check ticket dates and availability |

---

## 🔢 Execution Order

If setting up a **fresh database**:

### Step 1: Core Schema
```sql
-- Execute in Supabase SQL Editor
-- Copy and paste from: ../supabase-schema.sql
```
Creates all tables, RLS policies, indexes, and triggers

### Step 2: Critical Functions
```sql
-- Execute: migration-purchase-tickets-function.sql
```
Enables atomic ticket purchasing with race condition protection

### Step 3: Optional Data
```sql
-- Choose ONE:
-- Option A: add-quotes.sql (creates table + adds quotes)
-- Option B: insert-quotes-only.sql (data only, if table exists)
```
Adds horror quotes for homepage

### Step 4: Additional Migrations
```sql
-- Execute as needed:
-- - migration-ticket-requests.sql
-- - create-contact-submissions-table.sql
-- - etc.
```

---

## ✅ Best Practices

### Before Running Migrations

- [ ] **Test** migrations in a development environment first
- [ ] **Backup** your database before executing
- [ ] **Review** the SQL to understand what changes will be made
- [ ] **Check** if migration is already in main schema file

### Migration Guidelines

- ✅ Use `CREATE OR REPLACE` for functions
- ✅ Use `IF NOT EXISTS` for tables/indexes
- ✅ Make migrations **idempotent** (safe to run multiple times)
- ✅ Add comments explaining complex logic
- ⚠️ Test with sample data before production use

---

## 🔍 Checking Migration Status

To verify if a migration has been applied:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'your_table_name'
);

-- Check if function exists
SELECT EXISTS (
  SELECT FROM pg_proc
  WHERE proname = 'your_function_name'
);

-- Check if RLS policy exists
SELECT * FROM pg_policies
WHERE tablename = 'your_table_name';
```

---

## 📝 Notes

- 🔄 Some migrations may already be incorporated into `supabase-schema.sql`
- 🧪 Always test in development before production
- 💾 Keep backups before running any migration
- 📊 Monitor query performance after adding indexes
- 🔐 Verify RLS policies are working as expected

---

## 🆘 Need Help?

- 📖 [Supabase SQL Documentation](https://supabase.com/docs/guides/database)
- 📖 [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- 📧 Check the main [README.md](../README.md) for support resources

---

<div align="center">

**Database Migrations for Haunt Junkies** 🎃

</div>
