# 🔧 Execute Database Function - Critical Setup

**Status:** ⚠️ REQUIRED BEFORE TICKET SALES

**Time Required:** 5 minutes

---

## Why This Is Needed

The `purchase_tickets()` PostgreSQL function is required for the ticket purchase system to work. Without it:
- ❌ Ticket purchases will fail
- ❌ Race conditions could occur (double-booking)
- ❌ No atomic capacity checking

This function ensures **safe, atomic ticket purchases** with proper locking to prevent overselling.

---

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **Haunt Junkies** project
3. In the left sidebar, click **SQL Editor** (database icon)
4. Click **New query** button (top right)

### 2. Copy the SQL Function

Open the file: `/migrations/migration-purchase-tickets-function.sql`

Or copy this SQL:

```sql
-- PostgreSQL function to safely handle ticket purchases with race condition protection
-- Execute this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION purchase_tickets(
  p_date DATE,
  p_tickets INTEGER,
  p_name TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_confirmation_number TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_date_info RECORD;
  v_tickets_sold INTEGER;
  v_remaining INTEGER;
  v_ticket_id UUID;
BEGIN
  -- Lock the ticket_dates row to prevent concurrent purchases
  SELECT * INTO v_date_info
  FROM ticket_dates
  WHERE date = p_date AND is_available = true
  FOR UPDATE;  -- This locks the row until transaction completes

  -- Check if date exists and is available
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Selected date is no longer available'
    );
  END IF;

  -- Check max tickets per request
  IF p_tickets > v_date_info.max_tickets_per_request THEN
    RETURN json_build_object(
      'success', false,
      'error', format('Maximum %s tickets per request', v_date_info.max_tickets_per_request)
    );
  END IF;

  -- Calculate tickets sold with the lock held
  SELECT COALESCE(SUM(tickets), 0) INTO v_tickets_sold
  FROM ticket_requests
  WHERE date = p_date AND status = 'confirmed';

  v_remaining := v_date_info.capacity - v_tickets_sold;

  -- Check if enough tickets remain
  IF p_tickets > v_remaining THEN
    RETURN json_build_object(
      'success', false,
      'error', format('Only %s tickets remaining for this date', v_remaining)
    );
  END IF;

  -- Insert the ticket request
  INSERT INTO ticket_requests (
    name,
    first_name,
    last_name,
    email,
    date,
    tickets,
    confirmation_number,
    status
  ) VALUES (
    p_name,
    p_first_name,
    p_last_name,
    p_email,
    p_date,
    p_tickets,
    p_confirmation_number,
    'confirmed'
  )
  RETURNING id INTO v_ticket_id;

  -- Return success with ticket ID
  RETURN json_build_object(
    'success', true,
    'ticket_id', v_ticket_id,
    'confirmation_number', p_confirmation_number
  );
END;
$$;
```

### 3. Execute the SQL

1. Paste the SQL into the SQL Editor
2. Click the **Run** button (or press `Ctrl/Cmd + Enter`)
3. Wait for success message: "Success. No rows returned"

### 4. Verify the Function Was Created

Run this verification query:

```sql
-- Check if function exists
SELECT
    proname as function_name,
    pg_get_function_arguments(oid) as arguments
FROM pg_proc
WHERE proname = 'purchase_tickets';
```

**Expected Result:** You should see one row with:
- `function_name`: purchase_tickets
- `arguments`: p_date date, p_tickets integer, p_name text, ...

---

## Alternative: Use the Verification Script

I've created a Node.js script to verify the function exists:

```bash
node scripts/verify-ticket-function.js
```

This will check:
- ✅ Function exists in database
- ✅ Function has correct parameters
- ✅ Function returns expected JSON format

---

## Troubleshooting

### Error: "permission denied for schema public"

**Solution:** Make sure you're using the **service_role** key or logged in as the project owner.

### Error: "function purchase_tickets already exists"

**Solution:** This is fine! It means the function is already created. You can:
- Use `CREATE OR REPLACE FUNCTION` (which the script already does)
- Or skip this step entirely

### Error: "relation ticket_dates does not exist"

**Solution:** You need to run the main database schema first:
1. Execute `supabase-schema.sql` first
2. Then execute this function

---

## Testing the Function

After execution, you can test it manually:

```sql
-- Test the function (this won't actually create a ticket)
SELECT purchase_tickets(
  '2025-10-31'::DATE,  -- date
  2,                    -- tickets
  'John Doe',          -- name
  'John',              -- first_name
  'Doe',               -- last_name
  'test@example.com',  -- email
  'TEST-123'           -- confirmation_number
);
```

**Expected Result:**
```json
{
  "success": true,
  "ticket_id": "uuid-here",
  "confirmation_number": "TEST-123"
}
```

Or if date doesn't exist:
```json
{
  "success": false,
  "error": "Selected date is no longer available"
}
```

---

## What This Function Does

1. **Locks the date row** - Prevents race conditions
2. **Checks availability** - Ensures date exists and is active
3. **Validates capacity** - Calculates remaining tickets
4. **Checks limits** - Ensures request doesn't exceed max per request
5. **Creates ticket** - Inserts confirmed ticket atomically
6. **Returns result** - JSON with success/error

---

## Production Checklist

Before opening ticket sales:

- [ ] Execute this function in Supabase
- [ ] Verify function exists (run verification query)
- [ ] Run test purchase
- [ ] Add real ticket dates to `ticket_dates` table
- [ ] Test purchase form on staging/dev
- [ ] Test email confirmation flow
- [ ] Monitor first few purchases

---

## Status Check

After execution, update `REMAINING-WORK.md`:

Change:
```markdown
### 1️⃣ Database Function Not Executed
**Status:** ⚠️ ACTION REQUIRED
```

To:
```markdown
### 1️⃣ Database Function
**Status:** ✅ COMPLETE
```

---

<div align="center">

**⚠️ This is a critical step!**

*Ticket purchases will not work without this function*

**Execute this before opening ticket sales!**

</div>
