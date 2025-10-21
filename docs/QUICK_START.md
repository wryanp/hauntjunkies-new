# Haunt Junkies - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Option 1: With mise (Easiest)

```bash
# Install mise if you don't have it
curl https://mise.run | sh

# Navigate to project
cd /Users/williampoindexter/code/hauntjunkies-new

# Install Node.js and dependencies
mise install
mise run install

# Start development server
mise run dev
```

Visit: http://localhost:5173

### Option 2: Manual Setup

```bash
# Make sure you have Node.js 22.12.0 or higher
node --version  # Should show v22.12.0 or higher

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: http://localhost:5173

## 📋 Common mise Tasks

```bash
mise run dev        # Start dev server (localhost:5173)
mise run build      # Build for production
mise run preview    # Preview production build
mise run check      # Type check
mise run format     # Format code
```

## 🗄️ Set Up Database (Supabase)

1. **Create Supabase project**: https://supabase.com
2. **Copy credentials**:
   - Project URL
   - Anon key (from Settings → API)
3. **Run schema**:
   - Open SQL Editor in Supabase
   - Copy contents of `supabase-schema.sql`
   - Paste and run
4. **Add to .env**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

## 🚢 Deploy to Vercel

```bash
# Build locally first (optional)
mise run build

# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Then on Vercel:
# 1. Import from GitHub
# 2. Add environment variables (from .env)
# 3. Deploy!
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/routes/+page.svelte` | Homepage |
| `src/routes/reviews/+page.svelte` | Reviews listing |
| `src/routes/haunt/+page.svelte` | McCloud Manor page |
| `supabase-schema.sql` | Database schema |
| `tailwind.config.js` | Brand colors |
| `static/` | Logo, images, favicon |

## 🎨 Customize Branding

**Colors** (edit `tailwind.config.js`):
```js
colors: {
  'haunt-orange': '#FC7403',  // Primary orange
  'haunt-red': '#a41214',     // Primary red
}
```

**Images**:
- Logo: `static/logo-url.png`
- Background: `static/bg.jpg`
- Favicon: `static/favicon.png`

## 🛠️ Tech Stack Reference

- **Framework**: SvelteKit (like Next.js but faster)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Package Manager**: npm

## 📚 Need More Help?

- **Full guide**: See [../README.md](../README.md)
- **Local development**: See [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Technical details**: See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## ⚡ Quick Commands Cheat Sheet

```bash
# Development
mise run dev          # Start dev server
mise run build        # Build for production
mise run preview      # Test production build

# Code quality
mise run check        # Type checking
mise run format       # Auto-format code
mise run lint         # Lint code

# Database
# → Use Supabase web interface (supabase.com)
# → Or use SQL Editor for direct queries
```

## 🎯 First Tasks After Setup

1. ✅ Get dev server running
2. ✅ Create Supabase project & run schema
3. ✅ Add environment variables
4. ✅ Add one test review in Supabase
5. ✅ Deploy to Vercel
6. ✅ Migrate production data
7. ✅ Point DNS to Vercel

---

**You're all set!** The site is production-ready. 🎃
