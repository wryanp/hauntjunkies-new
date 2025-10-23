# 🚀 Deployment Guide - Haunt Junkies

> Complete step-by-step guide to deploying your Haunt Junkies website to production

<div align="center">

| Platform | Cost | Status |
|:--------:|:----:|:------:|
| **Supabase** | Free | ✅ Recommended |
| **Vercel** | Free | ✅ Recommended |
| **Shopify** | $29/mo | ⚪ Optional |

**Estimated Setup Time:** 30-45 minutes

</div>

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Step 1: Set Up Supabase](#-step-1-set-up-supabase)
3. [Step 2: Push to GitHub](#-step-2-push-to-github)
4. [Step 3: Deploy to Vercel](#-step-3-deploy-to-vercel)
5. [Step 4: Custom Domain](#-step-4-set-up-custom-domain-optional)
6. [Step 5: Shopify Setup](#-step-5-shopify-setup-optional)
7. [Step 6: Add Content](#-step-6-add-content)
8. [Ongoing Maintenance](#-ongoing-maintenance)
9. [Troubleshooting](#-troubleshooting)

---

## 🎯 Prerequisites

Before you begin, make sure you have:

<table>
<tr><td>✅ <strong>GitHub account</strong></td><td><a href="https://github.com/join">Create one</a> (free)</td></tr>
<tr><td>✅ <strong>Supabase account</strong></td><td><a href="https://supabase.com">Sign up</a> (free tier)</td></tr>
<tr><td>✅ <strong>Vercel account</strong></td><td><a href="https://vercel.com/signup">Sign up</a> (free tier)</td></tr>
<tr><td>⚪ <strong>Shopify store</strong></td><td>Optional - only if using shop</td></tr>
<tr><td>⚪ <strong>Custom domain</strong></td><td>Optional - can use vercel.app subdomain</td></tr>
</table>

---

## 🗄️ Step 1: Set Up Supabase

### 1️⃣ Create a Supabase Project

| Step | Action |
|------|--------|
| 1 | Go to [supabase.com](https://supabase.com) and sign in |
| 2 | Click **"New Project"** |
| 3 | Choose your organization |
| 4 | Fill in project details |
| 5 | Click **"Create new project"** |

**Project Details:**

```yaml
Name: hauntjunkies
Database Password: [generate a strong password]
Region: [choose closest to your users]
```

⏱️ **Wait ~2 minutes** for provisioning to complete

### 2️⃣ Run the Database Schema

<details>
<summary><strong>Step-by-step instructions (Click to expand)</strong></summary>

1. Once your project is created, navigate to **SQL Editor** (left sidebar)
2. Click **"New query"** button
3. Open the file `supabase-schema.sql` from your project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **"Run"** (or press `Cmd+Enter` / `Ctrl+Enter`)

✅ **Expected result:** `Success. No rows returned`

</details>

**What this creates:**

- ✅ All database tables (reviews, comments, tickets, contact, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers and constraints

### 3️⃣ Get Your Credentials

**Location:** Settings → API

| Credential | Where to Find | Used For |
|------------|---------------|----------|
| **Project URL** | Under "Project URL" | `PUBLIC_SUPABASE_URL` |
| **anon/public key** | Under "Project API keys" | `PUBLIC_SUPABASE_ANON_KEY` |

💾 **Save these** - you'll need them for Vercel environment variables

### 4️⃣ Create an Admin User (Optional)

For the admin panel (when implemented):

1. Go to **Authentication → Users**
2. Click **"Add user" → "Create new user"**
3. Enter email and password for your admin account

---

## 📦 Step 2: Push to GitHub

### 1️⃣ Initialize Git Repository

```bash
cd /path/to/hauntjunkies-new
git init
git add .
git commit -m "Initial commit - Modern Haunt Junkies website"
```

### 2️⃣ Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Configure repository:

```yaml
Repository name: hauntjunkies-new
Visibility: Private
Initialize: Do NOT check any boxes
```

3. Click **"Create repository"**

### 3️⃣ Push Your Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/hauntjunkies-new.git
git branch -M main
git push -u origin main
```

✅ **Verify:** Refresh GitHub - your code should appear

---

## ☁️ Step 3: Deploy to Vercel

### 1️⃣ Import Project

| Step | Action |
|------|--------|
| 1 | Go to [vercel.com](https://vercel.com) and sign in |
| 2 | Click **"Add New" → "Project"** |
| 3 | Import your GitHub repository |
| 4 | Vercel will auto-detect SvelteKit ✅ |

### 2️⃣ Add Environment Variables

⚠️ **IMPORTANT:** Before deploying, add these environment variables:

<table>
<tr>
<th>Variable Name</th>
<th>Value</th>
<th>Where to Find</th>
</tr>
<tr>
<td><code>PUBLIC_SUPABASE_URL</code></td>
<td>https://xxxxx.supabase.co</td>
<td>Supabase → Settings → API</td>
</tr>
<tr>
<td><code>PUBLIC_SUPABASE_ANON_KEY</code></td>
<td>eyJhb...</td>
<td>Supabase → Settings → API</td>
</tr>
<tr>
<td><code>PUBLIC_SHOPIFY_DOMAIN</code></td>
<td>store.myshopify.com</td>
<td>⚪ Optional - Shopify admin</td>
</tr>
<tr>
<td><code>PUBLIC_SHOPIFY_STOREFRONT_TOKEN</code></td>
<td>shpat_xxxxx</td>
<td>⚪ Optional - Shopify API</td>
</tr>
</table>

**Apply to all environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

### 3️⃣ Deploy

1. Click **"Deploy"**
2. ⏱️ Wait 1-2 minutes for build
3. ✅ Your site will be live at `your-project.vercel.app`

---

## 🌐 Step 4: Set Up Custom Domain (Optional)

### Add Your Domain to Vercel

| Step | Action |
|------|--------|
| 1 | In Vercel project, go to **Settings → Domains** |
| 2 | Add your domain (e.g., `hauntjunkies.com`) |
| 3 | Follow DNS configuration instructions |
| 4 | Wait for DNS propagation (up to 48 hours) |

**DNS Records to Add:**

```dns
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🛍️ Step 5: Shopify Setup (Optional)

<details>
<summary><strong>Complete Shopify integration guide (Click to expand)</strong></summary>

### 1️⃣ Create a Shopify Store

1. Go to [shopify.com](https://shopify.com)
2. Start a free trial
3. Complete store setup

### 2️⃣ Get Storefront API Access

| Step | Action |
|------|--------|
| 1 | In Shopify admin, go to **Apps → Develop apps** |
| 2 | Click **"Create an app"** |
| 3 | Name it "Haunt Junkies Website" |
| 4 | Go to **Configuration → Storefront API** |
| 5 | Enable required scopes (see below) |
| 6 | Click **"Save"** |
| 7 | Go to **API Credentials** |
| 8 | Copy **Storefront API access token** |

**Required Scopes:**

- ✅ `unauthenticated_read_product_listings`
- ✅ `unauthenticated_read_product_inventory`

### 3️⃣ Add Credentials to Vercel

1. Vercel project → **Settings → Environment Variables**
2. Add/update:

```env
PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxxxxxxxxxx
```

3. Redeploy your site

</details>

---

## 📝 Step 6: Add Content

### 1️⃣ Add McCloud Manor Info

**Location:** Supabase → Table Editor → `mccloud_info`

| Field | Example |
|-------|---------|
| **title** | McCloud Manor Haunted House |
| **description** | Experience the terror... |
| **dates** | October 13-31, 2025 |
| **hours** | Friday-Sunday, 7pm-11pm |
| **pricing** | $15 per person |
| **address** | 123 Spooky Lane, Salem, MA |

### 2️⃣ Add Photos to McCloud Manor

**Step 1: Upload to Storage**

1. Supabase → **Storage**
2. Create bucket: `mccloud-photos` (make it **public**)
3. Upload your photos
4. Copy public URLs

**Step 2: Add to Database**

1. Supabase → **Table Editor → `mccloud_photos`**
2. Click **"Insert row"**
3. Add:
   - `image_url`: (Supabase Storage URL)
   - `display_order`: 0, 1, 2, etc.
4. Click **"Save"**

### 3️⃣ Add Reviews

<details>
<summary><strong>Complete review creation guide (Click to expand)</strong></summary>

**Step 1: Upload Cover Image**

1. Supabase → **Storage**
2. Create bucket: `review-images` (make it **public**)
3. Upload cover image
4. Copy public URL

**Step 2: Insert Review**

1. Supabase → **Table Editor → `reviews`**
2. Click **"Insert row"**
3. Fill in all fields:

| Field | Example | Notes |
|-------|---------|-------|
| `name` | "Awesome Haunted Mansion" | Required |
| `slug` | "awesome-haunted-mansion-2024" | Must be unique, URL-friendly |
| `address` | "123 Main St" | Required |
| `city` | "Salem" | Required |
| `state` | "MA" | Required |
| `zip` | "01970" | Optional |
| `year` | 2024 | Required |
| `description` | "A terrifying experience..." | Short description |
| `review_text` | Full review content | Full markdown supported |
| `atmosphere_rating` | 4.5 | 0-5 scale |
| `scare_factor_rating` | 5.0 | 0-5 scale |
| `cast_rating` | 4.0 | 0-5 scale |
| `sets_rating` | 4.5 | 0-5 scale |
| `overall_rating` | 4.5 | 0-5 scale |
| `cover_image_url` | (Storage URL) | From step 1 |
| `featured` | true/false | Show on homepage |

4. Click **"Save"**

</details>

---

## 🔄 Ongoing Maintenance

### Updating Content

| Task | Location | Instructions |
|------|----------|--------------|
| **Add/Edit Reviews** | Supabase Table Editor → `reviews` | Direct editing |
| **Moderate Comments** | Supabase Table Editor → `review_comments` | Set `approved = true` |
| **View Ticket Requests** | Supabase Table Editor → `ticket_requests` | View submissions |
| **View Contact Forms** | Supabase Table Editor → `contact_submissions` | View submissions |

### Deploying Code Updates

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push
```

✅ **Vercel will automatically deploy** on push to main branch

### Monitoring

| Service | Purpose | Access |
|---------|---------|--------|
| **Vercel Analytics** | Traffic insights | Vercel dashboard |
| **Supabase Logs** | Database queries | Supabase dashboard → Logs |
| **Error Tracking** | Application errors | Consider adding Sentry |

---

## 💰 Cost Breakdown

<div align="center">

| Service | Free Tier | When You'd Pay |
|:-------:|:---------:|:--------------:|
| **Supabase** | 500MB DB<br>1GB storage<br>2GB transfer | If exceed limits<br>Pro: $25/month |
| **Vercel** | 100GB bandwidth<br>Unlimited functions | If exceed 100GB<br>Pro: $20/month |
| **Shopify** | N/A | If using shop<br>Basic: $29/month |

**Expected Cost:** **$0/month** for typical haunted attraction traffic 🎉

</div>

---

## 🔍 Troubleshooting

### Build Fails on Vercel

<table>
<tr>
<th>Symptom</th>
<th>Solution</th>
</tr>
<tr>
<td>Missing environment variables</td>
<td>Check all required vars are set in Vercel → Settings → Environment Variables</td>
</tr>
<tr>
<td>Type errors</td>
<td>Run <code>npm run check</code> locally to see errors</td>
</tr>
<tr>
<td>Node version mismatch</td>
<td>Ensure Node.js version is 20 or 22 in Vercel settings</td>
</tr>
</table>

### Database Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "new row violates row-level security" | RLS policy blocking | Use service role key server-side |
| "relation does not exist" | Schema not run | Execute `supabase-schema.sql` |
| "column does not exist" | Schema mismatch | Re-run latest schema |

### Images Not Loading

<table>
<tr><td>✅ Check Supabase Storage buckets are <strong>public</strong></td></tr>
<tr><td>✅ Verify image URLs are complete (include full domain)</td></tr>
<tr><td>✅ Check CORS settings in Supabase Storage</td></tr>
<tr><td>✅ Ensure files uploaded successfully</td></tr>
</table>

---

## 📚 Support Resources

### Official Documentation

| Resource | Link |
|----------|------|
| **SvelteKit** | [kit.svelte.dev](https://kit.svelte.dev) |
| **Supabase** | [supabase.com/docs](https://supabase.com/docs) |
| **Vercel** | [vercel.com/docs](https://vercel.com/docs) |
| **Tailwind CSS** | [tailwindcss.com](https://tailwindcss.com) |
| **Shopify** | [shopify.dev](https://shopify.dev) |

### Community

- 💬 [SvelteKit Discord](https://svelte.dev/chat)
- 💬 [Supabase Discord](https://discord.supabase.com)

---

## 🎯 Next Steps

<details open>
<summary><strong>Post-Deployment Checklist</strong></summary>

### Immediate Tasks
- [ ] ✅ Verify site is live and accessible
- [ ] ✅ Test all pages load correctly
- [ ] ✅ Submit a test contact form
- [ ] ✅ Test ticket request form
- [ ] ✅ Add at least 3 reviews for homepage
- [ ] ✅ Test comment submission

### Short-term (First Week)
- [ ] 📊 Enable Vercel Analytics
- [ ] 📧 Set up email notifications (optional)
- [ ] 🔍 Add Google Analytics or Plausible
- [ ] 📱 Test on multiple devices

### Long-term Enhancements
- [ ] 🔐 Build admin panel for easier content management
- [ ] 📧 Set up email notifications for forms
- [ ] 🔎 Add sitemap.xml for SEO
- [ ] 📈 Set up error monitoring (Sentry)
- [ ] 🛍️ Complete Shopify product catalog

</details>

---

<div align="center">

**🎃 Congratulations! Your site is now live! 🎃**

**Built with modern tech • Zero cost for typical traffic • Auto-scales for Halloween**

---

**Last Updated:** October 23, 2025

</div>
