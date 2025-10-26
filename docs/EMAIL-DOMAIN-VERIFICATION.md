# 📧 Email Domain Verification Guide

**Required for Production Email Sending**

---

## Overview

Your Haunt Junkies application sends emails for:
- Contact form submissions
- Ticket purchase confirmations
- Admin notifications

**Current Status:**
- ✅ Email library configured (Resend)
- ⚠️ **ACTION REQUIRED:** Domain verification needed for production

---

## Why Domain Verification is Required

Without domain verification:
- ❌ Emails will be rejected by recipient mail servers
- ❌ Your emails may go to spam
- ❌ Resend API calls will fail silently
- ❌ Users won't receive ticket confirmations

**Domain verification proves you own `hauntjunkies.com`** and authorizes you to send emails from that domain.

---

## Current Email Configuration

### Development Mode
```typescript
from: 'Haunt Junkies <onboarding@resend.dev>'
```
- Uses Resend's test domain
- Works immediately (no verification needed)
- ⚠️ Only for testing

### Production Mode
```typescript
from: 'Haunt Junkies <noreply@hauntjunkies.com>'
```
- Uses your custom domain
- ⚠️ **Requires domain verification**
- Must complete setup before production deployment

---

## Step-by-Step Verification Guide

### 1. Log in to Resend Dashboard

Go to: [https://resend.com/domains](https://resend.com/domains)

### 2. Add Your Domain

Click **"Add Domain"** and enter:
```
hauntjunkies.com
```

### 3. Add DNS Records

Resend will provide DNS records to add to your domain. You'll need to add these records to your DNS provider (where you registered hauntjunkies.com):

**Typical Records Required:**

**SPF Record (TXT):**
```
Name: @
Type: TXT
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Record (TXT):**
```
Name: resend._domainkey
Type: TXT
Value: [Provided by Resend - unique to your account]
```

**DMARC Record (TXT):**
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@hauntjunkies.com
```

### 4. DNS Provider Instructions

**Common DNS Providers:**

**Vercel Domains:**
1. Go to https://vercel.com/dashboard
2. Select your domain
3. Click "DNS Records"
4. Add each record provided by Resend

**Cloudflare:**
1. Log in to Cloudflare
2. Select hauntjunkies.com
3. Go to DNS → Records
4. Add each record

**GoDaddy:**
1. Log in to GoDaddy
2. My Products → Domains
3. Select hauntjunkies.com → DNS
4. Add Records

**Namecheap:**
1. Log in to Namecheap
2. Domain List → Manage
3. Advanced DNS tab
4. Add each record

### 5. Verify in Resend

After adding DNS records:
1. Return to Resend dashboard
2. Click "Verify Domain"
3. Wait for DNS propagation (can take up to 48 hours, usually < 1 hour)
4. Once verified, you'll see a ✅ green checkmark

---

## Verification Checklist

Before deploying to production:

- [ ] Domain added to Resend
- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS
- [ ] DMARC record added to DNS (recommended)
- [ ] Domain verified in Resend (green checkmark)
- [ ] Test email sent successfully
- [ ] Production email address configured in environment

---

## Testing Email Sending

### Test in Development

1. Temporarily change email sender in `.env`:
```bash
# Use development domain (no verification needed)
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

2. Submit a contact form
3. Check Resend dashboard for email logs

### Test in Production

After domain verification:

1. Update `.env` for production:
```bash
# Use your verified domain
RESEND_FROM_EMAIL="noreply@hauntjunkies.com"
```

2. Deploy to production
3. Submit test contact form
4. Verify email received at hauntjunkies@gmail.com

---

## Current Implementation

### Contact Form Email (`src/routes/contact/+page.server.ts`)
```typescript
await resend.emails.send({
  from: 'Haunt Junkies <onboarding@resend.dev>',  // Development
  to: 'hauntjunkies@gmail.com',
  subject: `New Contact Form: ${subject}`,
  html: emailHtml,
  replyTo: sanitizedEmail
});
```

### Ticket Confirmation Email (`src/lib/email.ts`)
```typescript
const fromEmail = dev
  ? 'Haunt Junkies <onboarding@resend.dev>'       // Development
  : 'Haunt Junkies <noreply@hauntjunkies.com>';   // Production (needs verification)
```

---

## Troubleshooting

### DNS Records Not Propagating

**Check DNS propagation:**
```bash
# Check SPF record
dig hauntjunkies.com TXT

# Check DKIM record
dig resend._domainkey.hauntjunkies.com TXT

# Check DMARC record
dig _dmarc.hauntjunkies.com TXT
```

**Or use online tool:**
- https://dnschecker.org/

### Emails Going to Spam

After verification, if emails still go to spam:

1. **Check DMARC policy:**
   - Update from `p=none` to `p=quarantine` or `p=reject`

2. **Add Return-Path:**
   ```typescript
   headers: {
     'Return-Path': 'bounces@hauntjunkies.com'
   }
   ```

3. **Warm up your domain:**
   - Send gradually increasing email volume
   - Start with 10-20 emails/day
   - Increase slowly over 2-4 weeks

### Verification Taking Too Long

DNS propagation typically takes:
- **5-15 minutes:** Most DNS providers
- **1-4 hours:** Some providers
- **Up to 48 hours:** Maximum (rare)

**Tips:**
- Clear your local DNS cache
- Use different DNS checker (try 8.8.8.8)
- Wait a bit longer (DNS can be slow)

---

## Email Deliverability Best Practices

### 1. Use Descriptive Subject Lines
```typescript
// ✅ Good
subject: 'Your Haunt Junkies Ticket Confirmation'

// ❌ Bad
subject: 'Confirmation'
```

### 2. Include Unsubscribe Link
For marketing emails (not transactional):
```html
<a href="https://hauntjunkies.com/unsubscribe">Unsubscribe</a>
```

### 3. Monitor Bounce Rates
- Check Resend dashboard for bounces
- Remove invalid email addresses
- Keep bounce rate < 5%

### 4. Include Physical Address
For marketing compliance:
```
Haunt Junkies
[Your Business Address]
```

---

## Production Deployment Checklist

Before launching:

1. ✅ Domain verified in Resend
2. ✅ Test email sent and received
3. ✅ Check spam folder (should NOT be there)
4. ✅ Reply-to address working
5. ✅ Environment variable set:
   ```bash
   RESEND_FROM_EMAIL=noreply@hauntjunkies.com
   ```
6. ✅ Error logging enabled (see `src/lib/logger.ts`)
7. ✅ Monitor Resend dashboard for delivery issues

---

## Cost & Limits

**Resend Free Tier:**
- 100 emails/day
- 3,000 emails/month
- Perfect for starting out

**Upgrade if needed:**
- $20/month for 50,000 emails
- Check current pricing: https://resend.com/pricing

**Current Usage Estimate:**
- Contact forms: ~10-50/month
- Ticket confirmations: ~20-100/month
- Admin notifications: ~10-30/month

**Total:** Well within free tier initially

---

## Support & Resources

**Resend Documentation:**
- Domain verification: https://resend.com/docs/send-with-domains
- SPF/DKIM setup: https://resend.com/docs/knowledge-base/spf-dkim-dmarc

**Email Best Practices:**
- https://resend.com/docs/knowledge-base/deliverability-tips

**Get Help:**
- Resend support: support@resend.com
- Resend Discord: https://discord.gg/resend

---

## Summary

**What You Need to Do:**

1. **Add domain to Resend** → Get DNS records
2. **Add DNS records** to your domain provider
3. **Wait for verification** (usually < 1 hour)
4. **Test sending** before production deployment
5. **Monitor deliverability** after launch

**Time Required:** 15-30 minutes (plus DNS propagation time)

**Difficulty:** Easy (just copy/paste DNS records)

---

<div align="center">

**📧 Email Setup Complete!**

*Once verified, your emails will be delivered reliably to all users*

</div>
