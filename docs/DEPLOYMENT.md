# Deployment Guide - Haunt Junkies

This guide will walk you through deploying your new Haunt Junkies website.

## Prerequisites

Before deploying, you need:

1. A GitHub account
2. A Supabase account (free tier)
3. A Vercel account (free tier)
4. (Optional) A Shopify store

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - Name: `hauntjunkies`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

### 1.2 Run the Database Schema

1. Once your project is created, go to the SQL Editor (in left sidebar)
2. Open the file `supabase-schema.sql` from your project
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click "Run" to execute the schema

This will create all necessary tables, indexes, and Row Level Security policies.

### 1.3 Get Your Credentials

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

You'll need these for Vercel environment variables.

### 1.4 Create an Admin User (Optional)

For the admin panel (when implemented):

1. Go to Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password for your admin account

## Step 2: Push to GitHub

1. Initialize git in your project:
   ```bash
   cd /Users/williampoindexter/code/hauntjunkies-new
   git init
   git add .
   git commit -m "Initial commit - Modern Haunt Junkies website"
   ```

2. Create a new repository on GitHub:
   - Go to [github.com/new](https://github.com/new)
   - Name: `hauntjunkies-new` (or your preferred name)
   - Make it Private
   - Do NOT initialize with README, .gitignore, or license
   - Click "Create repository"

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hauntjunkies-new.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect SvelteKit - no configuration needed

### 3.2 Add Environment Variables

Before deploying, click "Environment Variables" and add:

| Name | Value | Where to Find |
|------|-------|---------------|
| `PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase → Settings → API |
| `PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase → Settings → API |
| `PUBLIC_SHOPIFY_DOMAIN` | your-store.myshopify.com | (Optional) Shopify admin |
| `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Your storefront token | (Optional) Shopify → Apps → Develop apps |

Make sure to add these for all environments (Production, Preview, Development).

### 3.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete (1-2 minutes)
3. Your site will be live at `your-project.vercel.app`

## Step 4: Set Up Custom Domain (Optional)

1. In your Vercel project, go to Settings → Domains
2. Add your domain (e.g., `hauntjunkies.com`)
3. Follow the DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Step 5: Shopify Setup (Optional)

If you want to use the shop page:

### 5.1 Create a Shopify Store

1. Go to [shopify.com](https://shopify.com)
2. Start a free trial
3. Set up your store

### 5.2 Get Storefront API Access

1. In Shopify admin, go to Apps → Develop apps
2. Click "Create an app"
3. Name it "Haunt Junkies Website"
4. Go to Configuration → Storefront API
5. Select the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
6. Click "Save"
7. Go to API Credentials
8. Copy the "Storefront API access token"

### 5.3 Add to Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Add/update:
   - `PUBLIC_SHOPIFY_DOMAIN` = `your-store.myshopify.com`
   - `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` = (the token you copied)
3. Redeploy your site

## Step 6: Add Content

### 6.1 Add McCloud Manor Info

1. Go to your Supabase project → Table Editor → `mccloud_info`
2. Click the edit icon on the single row
3. Update the information:
   - Title, description, dates, hours, pricing, address
4. Click "Save"

### 6.2 Add Photos to McCloud Manor

1. First, upload images to Supabase Storage:
   - Go to Storage → Create bucket: `mccloud-photos` (make it public)
   - Upload your photos
   - Copy the public URLs

2. Then add to database:
   - Go to Table Editor → `mccloud_photos`
   - Click "Insert row"
   - Add `image_url` (the Supabase Storage URL)
   - Add `display_order` (0, 1, 2, etc.)
   - Click "Save"

### 6.3 Add Reviews

1. Upload review cover images to Supabase Storage:
   - Create bucket: `review-images` (public)
   - Upload images

2. Add reviews:
   - Go to Table Editor → `reviews`
   - Click "Insert row"
   - Fill in all fields:
     - name, slug (URL-friendly, e.g., "awesome-haunt-2024")
     - address, city, state, zip
     - year, description, review_text
     - ratings (0-5 scale)
     - cover_image_url (from Storage)
     - social URLs
     - featured (true/false)
   - Click "Save"

## Ongoing Maintenance

### Updating Content

- **Reviews**: Add/edit directly in Supabase Table Editor
- **Comments**: Moderate in `review_comments` table (set `approved` to true)
- **Ticket Requests**: View in `ticket_requests` table
- **Contact Submissions**: View in `contact_submissions` table

### Deploying Updates

When you make code changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically deploy the changes.

### Monitoring

- **Vercel Analytics**: Enable in Vercel dashboard for traffic insights
- **Supabase Logs**: Monitor database queries and errors
- **Error Tracking**: Consider adding Sentry for error monitoring

## Costs

With your expected traffic:

- **Supabase Free Tier**: 500MB database, 1GB file storage
- **Vercel Free Tier**: 100GB bandwidth
- **Total**: $0/month (stays free with low traffic)

During Halloween spike, you should still stay within free tiers unless you get massive traffic.

## Troubleshooting

### Build Fails on Vercel

- Check that all environment variables are set
- Review build logs for specific errors
- Ensure Node.js version is 20 or 22

### Database Errors

- Check Supabase logs
- Verify Row Level Security policies
- Ensure environment variables are correct

### Images Not Loading

- Check that Supabase Storage buckets are public
- Verify image URLs are correct
- Check CORS settings in Supabase

## Support

- **SvelteKit**: [kit.svelte.dev](https://kit.svelte.dev)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Tailwind**: [tailwindcss.com](https://tailwindcss.com)

## Next Steps

Consider implementing:

1. **Admin Panel** - Build password-protected admin pages for easier content management
2. **Email Notifications** - Set up Supabase Edge Functions to send emails for ticket requests/comments
3. **Analytics** - Add Google Analytics or Plausible
4. **SEO** - Add sitemap.xml and robots.txt
5. **Image Optimization** - Use Vercel Image Optimization
