# 📧 Email Configuration Guide

## Overview

The Haunt Junkies website uses [Resend](https://resend.com) for transactional emails, including ticket confirmations and contact form submissions.

## Current Status

⚠️ **Currently using development email address:** `onboarding@resend.dev`

This is Resend's default testing domain and should be replaced with a custom verified domain before production deployment.

## Setup Instructions

### 1. Verify Your Domain

To send emails from your own domain (e.g., `@hauntjunkies.com`):

1. Log in to [Resend Dashboard](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `hauntjunkies.com`)
4. Add the DNS records provided by Resend to your domain provider
5. Wait for verification (usually takes a few minutes)

### 2. Update Environment Variables

Once your domain is verified, update `.env`:

```env
# Before (development)
RESEND_FROM_EMAIL=onboarding@resend.dev

# After (production)
RESEND_FROM_EMAIL=notifications@hauntjunkies.com
# or
RESEND_FROM_EMAIL=tickets@hauntjunkies.com
```

### 3. Update Email Templates

The email sending logic is in `/src/lib/email.ts`. Update the `from` field:

```typescript
// Before
const { data, error } = await resend.emails.send({
  from: 'Haunt Junkies <onboarding@resend.dev>',
  to: [email],
  subject: emailSubject,
  html: htmlContent,
});

// After
const { data, error } = await resend.emails.send({
  from: 'Haunt Junkies <notifications@hauntjunkies.com>',
  to: [email],
  subject: emailSubject,
  html: htmlContent,
});
```

## Email Types

The system currently sends these types of emails:

| Email Type | Trigger | Template Location |
|------------|---------|-------------------|
| **Ticket Confirmation** | User purchases tickets | `/src/lib/email.ts` - `sendTicketConfirmationEmail()` |
| **Contact Form Receipt** | Contact form submission | Future enhancement |

## DNS Records Required

When you add your domain to Resend, you'll need to add these DNS records:

| Type | Name | Value |
|------|------|-------|
| **TXT** | `@` | `v=spf1 include:resend.com ~all` |
| **CNAME** | `resend._domainkey` | Provided by Resend |
| **MX** | `@` | `feedback-smtp.resend.com` (priority: 10) |

## Testing Email Delivery

### Development Mode

The app automatically detects development mode and may skip email sending or use test credentials:

```typescript
// From src/lib/email.ts
if (dev) {
  // Skip email in development or use test mode
  return { success: true, messageId: 'dev-mode-skip' };
}
```

### Production Testing

1. Use Resend's [Email Logs](https://resend.com/emails) to verify delivery
2. Check spam folders initially
3. Verify all template variables render correctly
4. Test with multiple email providers (Gmail, Outlook, etc.)

## Recommended Email Addresses

Choose meaningful email addresses for different purposes:

- `tickets@hauntjunkies.com` - Ticket confirmations
- `notifications@hauntjunkies.com` - General notifications
- `noreply@hauntjunkies.com` - No-reply messages (less recommended)
- `contact@hauntjunkies.com` - Contact form submissions

## Rate Limits

Resend free tier limits:

- **3,000 emails/month**
- **100 emails/day**

For higher volumes, upgrade to a paid plan.

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key**
   - Verify `RESEND_API_KEY` in `.env`
   - Ensure key has proper permissions

2. **Check Domain Verification**
   - DNS records must be properly configured
   - Allow 24-48 hours for DNS propagation

3. **Check Logs**
   - Review Resend dashboard for errors
   - Check server logs for error messages

### Emails Going to Spam

1. **SPF/DKIM Setup**
   - Ensure all DNS records are correct
   - Use Resend's domain verification tool

2. **Email Content**
   - Avoid spam trigger words
   - Include proper unsubscribe links if applicable
   - Maintain good text-to-image ratio

## Future Enhancements

- [ ] Add email templates with HTML/CSS styling
- [ ] Implement contact form confirmation emails
- [ ] Add email preference management
- [ ] Set up automated ticket reminders
- [ ] Add admin notification emails for new contacts

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Node.js SDK](https://github.com/resendlabs/resend-node)
- [Email Best Practices](https://resend.com/docs/knowledge-base/deliverability-best-practices)

---

*Last Updated: October 26, 2025*
