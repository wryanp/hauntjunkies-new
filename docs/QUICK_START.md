# ⚡ Haunt Junkies - Quick Start Guide

> Get up and running in 5 minutes

<div align="center">

| Step | Time | Difficulty |
|:----:|:----:|:----------:|
| **Setup** | 5 min | Easy |
| **Deploy** | 10 min | Easy |
| **Total** | 15 min | ⭐⭐ |

**Prerequisites:** Node.js 22+

</div>

---

## 🚀 Option 1: With mise (Recommended)

### Setup

```bash
# 1️⃣ Install mise (if needed)
curl https://mise.run | sh

# 2️⃣ Navigate to project
cd /path/to/hauntjunkies-new

# 3️⃣ Install Node.js and dependencies
mise install
mise run install

# 4️⃣ Start development server
mise run dev
```

### ✅ Done!

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Option 2: Manual Setup

### Setup

```bash
# 1️⃣ Check Node.js version (need 22.12.0+)
node --version

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start development server
npm run dev
```

### ✅ Done!

Visit: [http://localhost:5173](http://localhost:5173)

---

## 📊 Common Commands

<div align="center">

| Task | mise | npm |
|:-----|:-----|:----|
| **Start dev server** | `mise run dev` | `npm run dev` |
| **Build production** | `mise run build` | `npm run build` |
| **Preview build** | `mise run preview` | `npm run preview` |
| **Type check** | `mise run check` | `npm run check` |
| **Format code** | `mise run format` | `npm run format` |

</div>

---

## 🗄️ Set Up Database (Supabase)

<table>
<tr>
<th>Step</th>
<th>Action</th>
</tr>
<tr>
<td><strong>1️⃣</strong></td>
<td>Create account at <a href="https://supabase.com">supabase.com</a></td>
</tr>
<tr>
<td><strong>2️⃣</strong></td>
<td>Create new project, wait ~2 minutes</td>
</tr>
<tr>
<td><strong>3️⃣</strong></td>
<td>Go to <strong>Settings → API</strong>, copy URL and anon key</td>
</tr>
<tr>
<td><strong>4️⃣</strong></td>
<td>Go to <strong>SQL Editor</strong>, run <code>supabase-schema.sql</code></td>
</tr>
<tr>
<td><strong>5️⃣</strong></td>
<td>Create <code>.env</code> file with credentials</td>
</tr>
</table>

### .env File

```bash
# Copy example file
cp .env.example .env
```

**Edit `.env`:**

```env
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhb...

# Optional
PUBLIC_SHOPIFY_DOMAIN=
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
```

---

## 🚢 Deploy to Vercel

<div align="center">

### Step-by-Step

| # | Action | Time |
|:-:|--------|:----:|
| **1️⃣** | Push code to GitHub | 2 min |
| **2️⃣** | Import to Vercel | 1 min |
| **3️⃣** | Add environment variables | 2 min |
| **4️⃣** | Deploy | 2 min |

**Total:** ~7 minutes

</div>

### 1️⃣ Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2️⃣ Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New" → "Project"**
3. Import your GitHub repo
4. Vercel auto-detects SvelteKit ✅

### 3️⃣ Add Environment Variables

**Before deploying**, add these in Vercel:

```env
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhb...
```

Apply to: **Production**, **Preview**, **Development**

### 4️⃣ Deploy

Click **"Deploy"** → Wait ~2 minutes → Done! 🎉

---

## 📁 Key Files Reference

<table>
<tr>
<th>File</th>
<th>Purpose</th>
</tr>
<tr>
<td><code>src/routes/+page.svelte</code></td>
<td>Homepage</td>
</tr>
<tr>
<td><code>src/routes/reviews/+page.svelte</code></td>
<td>Reviews listing</td>
</tr>
<tr>
<td><code>src/routes/haunt/+page.svelte</code></td>
<td>McCloud Manor page</td>
</tr>
<tr>
<td><code>supabase-schema.sql</code></td>
<td>Database schema</td>
</tr>
<tr>
<td><code>tailwind.config.js</code></td>
<td>Brand colors</td>
</tr>
<tr>
<td><code>static/</code></td>
<td>Logo, images, favicon</td>
</tr>
</table>

---

## 🎨 Customize Branding

### Colors

**Edit `tailwind.config.js`:**

```javascript
colors: {
  'haunt-orange': '#FC7403',  // Primary orange
  'haunt-red': '#a41214',     // Primary red
}
```

### Images

| Asset | Location | Purpose |
|-------|----------|---------|
| **Logo** | `static/logo-url.png` | Site logo |
| **Background** | `static/bg.jpg` | Parallax hero |
| **Favicon** | `static/favicon.png` | Browser icon |

---

## 🛠️ Tech Stack Overview

<div align="center">

| Layer | Technology | Why |
|:------|:-----------|:----|
| **Frontend** | SvelteKit | Fast & modern |
| **Styling** | Tailwind CSS | Utility-first |
| **Database** | Supabase | Free PostgreSQL |
| **Hosting** | Vercel | Free & auto-scaling |

</div>

---

## 📚 Need More Help?

<table>
<tr>
<th>Document</th>
<th>Purpose</th>
</tr>
<tr>
<td><a href="../README.md">README.md</a></td>
<td>Complete project overview</td>
</tr>
<tr>
<td><a href="LOCAL_DEVELOPMENT.md">LOCAL_DEVELOPMENT.md</a></td>
<td>Detailed setup instructions</td>
</tr>
<tr>
<td><a href="DEPLOYMENT.md">DEPLOYMENT.md</a></td>
<td>Full deployment guide</td>
</tr>
<tr>
<td><a href="PROJECT_SUMMARY.md">PROJECT_SUMMARY.md</a></td>
<td>Technical details</td>
</tr>
</table>

---

## ⚡ Quick Commands Cheat Sheet

### Development

```bash
# Start development
mise run dev              # Start dev server
npm run dev               # Alternative

# Build
mise run build            # Build for production
mise run preview          # Test production build
```

### Code Quality

```bash
# Type checking
mise run check            # Run type checker
mise run check:watch      # Watch mode

# Formatting
mise run format           # Auto-format code
mise run lint             # Lint code
```

### Database

```bash
# Use Supabase web interface
# → https://supabase.com/dashboard
# → SQL Editor for queries
# → Table Editor for data
```

---

## 🎯 First Tasks After Setup

<div align="center">

### ✅ Setup Checklist

| # | Task | Status |
|:-:|------|:------:|
| 1 | Get dev server running | [ ] |
| 2 | Create Supabase project | [ ] |
| 3 | Run database schema | [ ] |
| 4 | Add environment variables | [ ] |
| 5 | Add test review in Supabase | [ ] |
| 6 | Deploy to Vercel | [ ] |
| 7 | Migrate production data | [ ] |
| 8 | Point DNS to Vercel | [ ] |

</div>

---

## 💡 Pro Tips

<table>
<tr><td>💾 <strong>Restart dev server</strong></td><td>After changing <code>.env</code></td></tr>
<tr><td>🔍 <strong>Check browser console</strong></td><td>For Supabase errors</td></tr>
<tr><td>🗄️ <strong>Use Table Editor</strong></td><td>Easiest way to manage data</td></tr>
<tr><td>🚀 <strong>Vercel auto-deploys</strong></td><td>On every git push to main</td></tr>
<tr><td>📊 <strong>Enable analytics</strong></td><td>In Vercel dashboard</td></tr>
</table>

---

## 🔍 Troubleshooting

### "fetch failed" Errors

```bash
# Fix: Update .env with real Supabase credentials
# Then restart dev server
```

### Build Fails

| Issue | Solution |
|-------|----------|
| Missing env vars | Add to Vercel settings |
| Type errors | Run `npm run check` locally |
| Node version | Use Node.js 22+ |

### Images Not Loading

<table>
<tr><td>✅ Check Supabase Storage buckets are <strong>public</strong></td></tr>
<tr><td>✅ Verify image URLs are complete</td></tr>
<tr><td>✅ Check CORS settings in Supabase</td></tr>
</table>

---

## 💰 Cost Estimate

<div align="center">

| Service | Tier | Monthly Cost |
|:-------:|:----:|:------------:|
| **Supabase** | Free | $0 |
| **Vercel** | Free | $0 |
| **Shopify** | Basic | $29 (optional) |

**Total:** **$0/month** for typical traffic 🎉

</div>

---

## 📖 External Resources

<table>
<tr>
<th>Resource</th>
<th>URL</th>
</tr>
<tr>
<td><strong>SvelteKit</strong></td>
<td><a href="https://kit.svelte.dev">kit.svelte.dev</a></td>
</tr>
<tr>
<td><strong>Supabase</strong></td>
<td><a href="https://supabase.com/docs">supabase.com/docs</a></td>
</tr>
<tr>
<td><strong>Tailwind CSS</strong></td>
<td><a href="https://tailwindcss.com">tailwindcss.com</a></td>
</tr>
<tr>
<td><strong>Vercel</strong></td>
<td><a href="https://vercel.com/docs">vercel.com/docs</a></td>
</tr>
</table>

---

<div align="center">

**🎃 You're All Set! 🎃**

**The site is production-ready and costs $0/month**

---

### Quick Links

[📖 Full README](../README.md) • [🔧 Setup Guide](LOCAL_DEVELOPMENT.md) • [🚀 Deploy Guide](DEPLOYMENT.md) • [📊 Tech Details](PROJECT_SUMMARY.md)

---

**Last Updated:** October 23, 2025

</div>
