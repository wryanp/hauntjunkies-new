# 🔧 Local Development Setup

> Complete guide to setting up your Haunt Junkies development environment

<div align="center">

| Option | Setup Time | Best For |
|:------:|:----------:|:--------:|
| **☁️ Supabase Cloud** | 5 minutes | Most developers |
| **🖥️ Supabase Local** | 15 minutes | Offline work |

**Recommended:** ⭐ **Supabase Cloud** for fastest setup

</div>

---

## 📋 Table of Contents

1. [Option 1: Supabase Cloud](#-option-1-supabase-cloud--recommended)
2. [Option 2: Supabase Local CLI](#-option-2-supabase-local-cli)
3. [Comparison](#-comparison)
4. [Managing Your Data](#-managing-your-data)
5. [Troubleshooting](#-troubleshooting)

---

## ☁️ Option 1: Supabase Cloud ⭐ RECOMMENDED

### Why Choose This Option?

<table>
<tr><td>✅ <strong>5 minute setup</strong></td><td>Get started immediately</td></tr>
<tr><td>✅ <strong>Free forever</strong></td><td>500MB database, 1GB storage</td></tr>
<tr><td>✅ <strong>No additional tools</strong></td><td>Just your browser and code editor</td></tr>
<tr><td>✅ <strong>Same as production</strong></td><td>Eliminate environment differences</td></tr>
<tr><td>✅ <strong>Built-in GUI</strong></td><td>Visual table editor, SQL editor, logs</td></tr>
<tr><td>✅ <strong>Automatic backups</strong></td><td>Never lose your data</td></tr>
</table>

### Setup Instructions

#### 1️⃣ Create Supabase Account

Go to [supabase.com](https://supabase.com) and sign up (free)

#### 2️⃣ Create a New Project

| Step | Action | Details |
|------|--------|---------|
| 1 | Click **"New Project"** | |
| 2 | Choose a name | e.g., "hauntjunkies-dev" |
| 3 | Generate database password | Use a strong password - save it! |
| 4 | Select region | Choose closest to you |
| 5 | Wait for provisioning | ⏱️ ~2 minutes |

#### 3️⃣ Get Your Credentials

**Location:** Settings → API

<table>
<tr>
<th>Credential</th>
<th>Example</th>
<th>Use</th>
</tr>
<tr>
<td><strong>Project URL</strong></td>
<td><code>https://xxxxx.supabase.co</code></td>
<td><code>PUBLIC_SUPABASE_URL</code></td>
</tr>
<tr>
<td><strong>anon/public key</strong></td>
<td><code>eyJhb...</code> (long string)</td>
<td><code>PUBLIC_SUPABASE_ANON_KEY</code></td>
</tr>
</table>

#### 4️⃣ Update Your `.env` File

**Create environment file:**

```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Optional (leave empty for now)
PUBLIC_SHOPIFY_DOMAIN=
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
```

#### 5️⃣ Run the Database Schema

<details>
<summary><strong>Step-by-step SQL execution (Click to expand)</strong></summary>

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Open `supabase-schema.sql` from your project
3. Copy the **entire contents**
4. Paste into SQL Editor
5. Click **"Run"** (or press `Cmd+Enter` / `Ctrl+Enter`)

✅ **Expected result:** `Success. No rows returned`

This creates all tables, RLS policies, indexes, and triggers.

</details>

#### 6️⃣ Start the Dev Server

```bash
# Using mise (recommended)
mise run dev

# Or using npm
npm run dev
```

#### 7️⃣ Visit Your Site

🎉 Open [http://localhost:5173](http://localhost:5173)

**Done!** The fetch errors will be gone and you can start developing.

---

## 🖥️ Option 2: Supabase Local CLI

> **Use this if:** You need offline development or want everything running locally

### Requirements

<table>
<tr><td>✅ <strong>Docker Desktop</strong></td><td>Must be installed and running</td></tr>
<tr><td>✅ <strong>Homebrew</strong></td><td>(macOS) For installing Supabase CLI</td></tr>
<tr><td>✅ <strong>4GB+ RAM</strong></td><td>For Docker containers</td></tr>
</table>

### Setup Instructions

#### 1️⃣ Install Supabase CLI

**macOS:**

```bash
brew install supabase/tap/supabase
```

**Linux/WSL:**

```bash
npm install -g supabase
```

#### 2️⃣ Initialize Supabase in Your Project

```bash
cd /path/to/hauntjunkies-new
supabase init
```

This creates a `supabase/` directory with configuration files.

#### 3️⃣ Start Local Supabase

```bash
supabase start
```

This will:
- 📥 Download Docker images (~2GB first time)
- 🚀 Start local PostgreSQL database
- 🎨 Start Supabase Studio (web UI)
- 🔐 Start Auth service
- 📁 Start Storage service

⏱️ **First time:** 5-10 minutes | **Subsequent starts:** ~30 seconds

#### 4️⃣ Get Your Local Credentials

```bash
supabase status
```

**Output:**

```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
anon key: eyJhb...
service_role key: eyJhb...
```

#### 5️⃣ Update Your `.env` File

```env
PUBLIC_SUPABASE_URL=http://localhost:54321
PUBLIC_SUPABASE_ANON_KEY=<the anon key from supabase status>
PUBLIC_SHOPIFY_DOMAIN=
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
```

#### 6️⃣ Apply Migrations

**Copy schema to migrations folder:**

```bash
cp supabase-schema.sql supabase/migrations/00001_initial_schema.sql
```

**Apply it:**

```bash
supabase db reset
```

This creates all tables, policies, and data.

#### 7️⃣ Start the Dev Server

```bash
mise run dev
# Or: npm run dev
```

#### 8️⃣ Access Supabase Studio

🎨 Open [http://localhost:54323](http://localhost:54323)

This gives you the same GUI as Supabase Cloud.

### Stopping Local Supabase

```bash
# Stop all services
supabase stop

# Stop and remove all data
supabase stop --no-backup
```

---

## 📊 Comparison

<div align="center">

| Feature | ☁️ Supabase Cloud | 🖥️ Supabase Local |
|:--------|:-----------------:|:------------------:|
| **Setup time** | 5 minutes | 15 minutes |
| **Internet required** | ✅ Yes | ❌ No |
| **System resources** | Minimal | Medium (Docker) |
| **Data persistence** | Cloud backup | Local only |
| **GUI included** | ✅ Yes | ✅ Yes |
| **Best for** | Most developers | Offline work |
| **Cost** | Free tier | Free (local) |
| **Storage limits** | 1GB | Unlimited |
| **Automatic backups** | ✅ Yes | ❌ No |

</div>

---

## 💡 Recommendation

### Use Supabase Cloud Unless...

✅ **Use Supabase Cloud if:**
- You want the fastest setup
- You have stable internet
- You want automatic backups
- You want same environment as production

❌ **Use Local CLI if:**
- You need offline development
- You want unlimited local storage
- You prefer everything local
- You're on a plane frequently

### Free Tier is Perfect For

The Supabase free tier (500MB DB, 1GB storage, 50K MAU) is perfect for:

- ✅ Local development
- ✅ Testing
- ✅ Small production sites
- ✅ This entire project

💰 **You'll never hit the limits** with Haunt Junkies traffic levels.

---

## 🗄️ Managing Your Data

### Accessing the Database

<table>
<tr>
<th>Method</th>
<th>Supabase Cloud</th>
<th>Supabase Local</th>
</tr>
<tr>
<td><strong>Web GUI</strong></td>
<td><a href="https://supabase.com/dashboard">Supabase Dashboard</a></td>
<td><a href="http://localhost:54323">http://localhost:54323</a></td>
</tr>
<tr>
<td><strong>SQL Editor</strong></td>
<td>Dashboard → SQL Editor</td>
<td>Studio → SQL Editor</td>
</tr>
<tr>
<td><strong>Table Editor</strong></td>
<td>Dashboard → Table Editor</td>
<td>Studio → Table Editor</td>
</tr>
</table>

### Common Tasks

#### ➕ Add a Test Review

1. Go to **Table Editor → `reviews`**
2. Click **"Insert row"**
3. Fill in fields:

| Field | Example Value |
|-------|---------------|
| `name` | "Test Haunted House" |
| `slug` | "test-haunted-house-2024" |
| `city` | "Salem" |
| `state` | "MA" |
| `year` | 2024 |
| `overall_rating` | 4.5 |
| `featured` | true |

4. Click **"Save"**

#### ✅ Approve a Comment

1. Go to **Table Editor → `review_comments`**
2. Find the comment
3. Set `approved` to `true`
4. Click **"Save"**

#### 📸 Add McCloud Manor Photos

**Step 1: Upload to Storage**

1. Go to **Storage → Create bucket: `mccloud-photos`**
2. Make bucket **public**
3. Upload your images
4. Copy the public URL

**Step 2: Add to Database**

1. Go to **Table Editor → `mccloud_photos`**
2. Click **"Insert row"**
3. Add:
   - `image_url`: (from step 1)
   - `display_order`: 0, 1, 2, etc.
4. Click **"Save"**

---

## 🔍 Troubleshooting

### "fetch failed" Errors

<table>
<tr>
<th>Cause</th>
<th>Solution</th>
</tr>
<tr>
<td>Placeholder values in <code>.env</code></td>
<td>Replace with actual Supabase credentials</td>
</tr>
<tr>
<td>Environment not loaded</td>
<td>Restart dev server after updating <code>.env</code></td>
</tr>
<tr>
<td>Wrong credentials</td>
<td>Double-check URL and anon key in Supabase dashboard</td>
</tr>
</table>

### "punycode deprecation" Warning

```
(node:12345) [DEP0040] DeprecationWarning: The `punycode` module is deprecated
```

✅ **This is harmless** - comes from a dependency, can be safely ignored

### Supabase Local Won't Start

| Issue | Solution |
|-------|----------|
| **Docker not running** | Start Docker Desktop |
| **Insufficient RAM** | Give Docker at least 4GB RAM in settings |
| **Port conflicts** | Stop services using ports 54321-54323 |
| **Containers stuck** | `docker ps -a` then `docker rm -f <container>` |

**Reset everything:**

```bash
supabase stop
docker system prune -a
supabase start
```

### Can't Connect to Supabase Cloud

<table>
<tr><td>✅ Check your internet connection</td></tr>
<tr><td>✅ Verify credentials in <code>.env</code> are correct</td></tr>
<tr><td>✅ Make sure you copied the <strong>full</strong> anon key (very long)</td></tr>
<tr><td>✅ Check for typos in the URL</td></tr>
<tr><td>✅ Restart dev server after changing <code>.env</code></td></tr>
</table>

### Tables Not Found After Running Schema

**If you see "relation does not exist" errors:**

1. Go to Supabase SQL Editor
2. Check if tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

3. If empty, re-run `supabase-schema.sql`
4. Check for SQL errors in the output

---

## 🎯 Next Steps After Setup

<details open>
<summary><strong>Development Workflow Checklist</strong></summary>

### Initial Setup ✅
- [x] Get dev server running with database
- [x] Verify site loads at http://localhost:5173
- [ ] Add a test review in Supabase
- [ ] Test the site navigation
- [ ] Make a code change and see hot reload

### Development Commands

```bash
# Start development
mise run dev              # Start dev server

# Code quality
mise run check            # Type check
mise run format           # Format code

# Build for production
mise run build            # Build
mise run preview          # Test production build
```

### Recommended Next Steps
1. ✅ Explore the codebase structure
2. ✅ Read [../README.md](../README.md) for project overview
3. ✅ Add test data to Supabase
4. ✅ Make small changes and see live reload
5. ✅ Review [DEPLOYMENT.md](DEPLOYMENT.md) for going live

</details>

---

## 📚 Additional Resources

### Documentation

| Resource | Link |
|----------|------|
| **SvelteKit** | [kit.svelte.dev/docs](https://kit.svelte.dev/docs) |
| **Supabase** | [supabase.com/docs](https://supabase.com/docs) |
| **Tailwind CSS** | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| **Supabase CLI** | [supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli) |

### Quick Links

- 🏠 [Main README](../README.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 📊 [Project Summary](PROJECT_SUMMARY.md)
- ⚡ [Quick Start](QUICK_START.md)

---

<div align="center">

**🎃 Happy Coding! 🎃**

**Your development environment is ready to go!**

---

**Last Updated:** October 23, 2025

</div>
