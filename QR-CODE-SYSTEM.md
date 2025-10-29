# One-Time Use QR Code System

## Overview

The ticket confirmation system now includes secure, one-time use QR codes for ticket validation at entry. Each ticket email contains a unique QR code that can only be scanned once, preventing ticket fraud and duplicate entries.

## How It Works

### For Customers

1. **Purchase Ticket**: Customer completes ticket purchase on the website
2. **Receive Email**: Confirmation email includes ticket details and a QR code
3. **Entry**: Customer presents QR code at McCloud Manor entrance
4. **Validation**: Staff scans QR code, system validates and marks as used
5. **Status**: Admin dashboard shows ticket as "Scanned"

### Technical Flow

```
Ticket Purchase → Generate QR Token → Store in DB → Email QR Code
                                                           ↓
Customer Arrives → Scan QR → API Validates → Mark Used → Show Confirmation
```

## Database Schema

### ticket_qr_codes Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `ticket_request_id` | UUID | Foreign key to ticket_requests |
| `qr_token` | VARCHAR(64) | Unique 256-bit token (hex) |
| `used_at` | TIMESTAMP | When QR was scanned (NULL = not used) |
| `created_at` | TIMESTAMP | When QR was generated |
| `expires_at` | TIMESTAMP | Optional expiration (currently NULL) |

### Security Features

- **Unique Tokens**: 64-character hex strings (32 bytes = 256 bits of entropy)
- **Row Locking**: PostgreSQL `FOR UPDATE` prevents concurrent scans
- **One-Time Use**: Once `used_at` is set, QR cannot be reused
- **Atomic Operations**: `validate_qr_code()` function handles validation in single transaction

## Setup Instructions

### 1. Run Database Migration

Execute the migration to create the QR code tracking table:

```bash
# In Supabase SQL Editor
psql < migrations/add-qr-code-tracking.sql
```

Or copy/paste the contents of `migrations/add-qr-code-tracking.sql` into Supabase SQL Editor.

This creates:
- `ticket_qr_codes` table
- `validate_qr_code(p_qr_token)` function
- Indexes for fast lookups
- Row Level Security policies

### 2. Verify Installation

Check that the table and function were created:

```sql
-- Check table exists
SELECT * FROM ticket_qr_codes LIMIT 1;

-- Check function exists
SELECT proname FROM pg_proc WHERE proname = 'validate_qr_code';
```

### 3. Test QR Code Generation

Purchase a test ticket through the website. The confirmation email should include:
- QR code image displayed under "Please review your event details below"
- "Scan at entry" text below the QR code

### 4. Test QR Code Validation

Scan the QR code with a phone camera. It should navigate to:

```
https://hauntjunkies.com/api/validate-qr?token=<64-char-hex>
```

**First Scan Response (Success)**:
```json
{
  "valid": true,
  "used_at": "2025-10-29T12:34:56.789Z",
  "ticket": {
    "confirmation_number": "MCM-20251029-A1B2",
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2025-10-31",
    "time": "8:00 PM - 11:00 PM",
    "tickets": 2
  }
}
```

**Second Scan Response (Already Used)**:
```json
{
  "valid": false,
  "error": "QR code has already been used",
  "used_at": "2025-10-29T12:34:56.789Z"
}
```

## Admin Dashboard

### Viewing QR Scan Status

Navigate to `/admin/tickets` to view all ticket requests.

**Status Indicators**:
- 🟢 **Confirmed** - Ticket purchased, not yet scanned
- 🔵 **✓ Scanned** - QR code has been used for entry

**Stats Dashboard** shows:
- **Total Requests**: All ticket purchases
- **Confirmed**: Tickets ready for entry
- **Scanned**: Tickets that have been validated at entry
- **Total Tickets**: Sum of all tickets sold

## API Endpoints

### GET /api/validate-qr

Validates and marks a QR code as used.

**Query Parameters**:
- `token` (required): 64-character hex QR token

**Success Response** (200):
```json
{
  "valid": true,
  "used_at": "2025-10-29T12:34:56Z",
  "ticket": {
    "confirmation_number": "MCM-20251029-A1B2",
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2025-10-31",
    "time": "8:00 PM - 11:00 PM",
    "tickets": 2
  }
}
```

**Error Responses**:

| Status | Error | Reason |
|--------|-------|--------|
| 400 | Missing QR token | No `token` parameter provided |
| 400 | Invalid QR code | Token not found in database |
| 400 | QR code has already been used | Token already scanned |
| 400 | QR code has expired | Token past expiration date |
| 500 | Failed to validate QR code | Database error |

## Entry Validation Workflow

### Using QR Scanner at Entry

1. **Scan QR Code**: Use phone camera or dedicated QR scanner
2. **View Response**: Check JSON response on screen
3. **Verify Identity**: Match name on ticket to customer ID
4. **Grant/Deny Entry**:
   - ✅ `"valid": true` → Allow entry
   - ❌ `"valid": false` → Deny entry, check error message

### Handling Edge Cases

**Customer Claims QR Not Working**:
1. Check if QR already scanned (`used_at` timestamp)
2. Look up ticket in admin dashboard by confirmation number
3. If legitimately not scanned, manually mark as used in database:
   ```sql
   UPDATE ticket_qr_codes
   SET used_at = NOW()
   WHERE ticket_request_id = (
     SELECT id FROM ticket_requests
     WHERE confirmation_number = 'MCM-XXXXXXXX-XXXX'
   );
   ```

**Customer Lost Email**:
1. Look up ticket by name/email in admin dashboard
2. Verify identity with ID
3. Manually validate entry using SQL command above

## Security Considerations

### Token Generation
- Uses Node.js `crypto.randomBytes(32)` for secure random generation
- 256 bits of entropy (2^256 possible combinations)
- Tokens are unique and unpredictable

### Database Security
- Service role key required for validation (not exposed to client)
- Row Level Security policies protect data
- `FOR UPDATE` locking prevents race conditions

### Network Security
- HTTPS required for validation endpoint
- No sensitive customer data in QR code itself
- Tokens stored securely in database

## Troubleshooting

### QR Code Not Generated in Email

**Check**:
1. Is `ticketRequestId` being passed to `sendTicketConfirmation()`?
2. Is the QR token being stored in database?
   ```sql
   SELECT * FROM ticket_qr_codes ORDER BY created_at DESC LIMIT 5;
   ```
3. Check server logs for QR generation errors

### QR Code Scan Returns 500 Error

**Check**:
1. Is the `validate_qr_code()` function installed?
2. Are Supabase credentials correct in environment variables?
3. Check API endpoint logs: `vercel logs`

### Admin Dashboard Not Showing "Scanned" Status

**Check**:
1. Is the join query working?
   ```sql
   SELECT
     tr.*,
     qr.used_at
   FROM ticket_requests tr
   LEFT JOIN ticket_qr_codes qr ON tr.id = qr.ticket_request_id
   ORDER BY tr.created_at DESC
   LIMIT 5;
   ```
2. Refresh browser cache
3. Check browser console for errors

## Future Enhancements

Potential improvements to the QR code system:

1. **Mobile Scanner App**: Dedicated app for entry staff with offline validation
2. **Expiration Dates**: Auto-expire QR codes after event date
3. **Analytics Dashboard**: Track entry times, scan patterns, fraud attempts
4. **Email Resend**: Allow customers to resend QR codes if lost
5. **Print-Friendly Version**: Generate printable tickets with QR codes
6. **Bulk Validation**: Scan multiple tickets for group entries
7. **Webhook Notifications**: Alert admins of suspicious activity (multiple scan attempts)

## Support

For issues or questions about the QR code system:
1. Check this documentation
2. Review server logs: `vercel logs`
3. Check Supabase logs for database errors
4. Test with a new ticket purchase

## Files Modified

- `migrations/add-qr-code-tracking.sql` - Database schema
- `src/lib/email.ts` - QR token generation and email template
- `src/routes/tickets/+page.server.ts` - Pass ticket ID to email function
- `src/routes/api/validate-qr/+server.ts` - Validation endpoint
- `src/routes/admin/tickets/+page.server.ts` - Fetch QR scan status
- `src/routes/admin/tickets/+page.svelte` - Display scan status
