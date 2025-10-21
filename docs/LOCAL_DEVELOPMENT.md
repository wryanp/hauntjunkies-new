# Local Development Setup

This project uses Supabase for the database. You have 2 options for local development.

## Option 1: Supabase Cloud ⭐ RECOMMENDED

**Why this is best:**
- ✅ 5 minute setup
- ✅ Free forever (500MB database, 1GB storage)
- ✅ No additional tools needed
- ✅ Same as production environment
- ✅ Built-in GUI for data management
- ✅ Automatic backups

**Setup:**

1. **Create Supabase account**: Go to https://supabase.com and sign up (free)

2. **Create a new project**:
   - Click "New Project"
   - Choose a name (e.g., "hauntjunkies-dev")
   - Choose a strong database password
   - Select a region close to you
   - Wait ~2 minutes for provisioning

3. **Get your credentials**:
   - Go to Settings → API
   - Copy these values:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon/public key**: `eyJhb...` (long string)

4. **Update your `.env` file**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   PUBLIC_SHOPIFY_DOMAIN=
   PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
   ```

5. **Run the database schema**:
   - In Supabase, go to SQL Editor (left sidebar)
   - Open `supabase-schema.sql` from your project
   - Copy the entire contents
   - Paste into SQL Editor
   - Click "Run" (or press Cmd+Enter)
   - You should see "Success. No rows returned"

6. **Start the dev server**:
   ```bash
   mise run dev
   # Or: npm run dev
   ```

7. **Visit**: http://localhost:5173

**Done!** The fetch errors will be gone and you can start developing.

---

## Option 2: Supabase Local CLI

Run Supabase entirely on your machine. Good for offline development.

**Requirements:**
- Docker Desktop installed and running

**Setup:**

1. **Install Supabase CLI**:
   ```bash
   brew install supabase/tap/supabase
   ```

2. **Initialize Supabase in your project**:
   ```bash
   supabase init
   ```

3. **Start local Supabase**:
   ```bash
   supabase start
   ```

   This will download Docker images and start:
   - Local PostgreSQL database
   - Supabase Studio (web UI)
   - Supabase API
   - Auth service
   - Storage service

4. **Get your local credentials**:
   ```bash
   supabase status
   ```

   You'll see output like:
   ```
   API URL: http://localhost:54321
   DB URL: postgresql://postgres:postgres@localhost:54322/postgres
   Studio URL: http://localhost:54323
   anon key: eyJhb...
   ```

5. **Update your `.env` file**:
   ```env
   PUBLIC_SUPABASE_URL=http://localhost:54321
   PUBLIC_SUPABASE_ANON_KEY=<the anon key from supabase status>
   PUBLIC_SHOPIFY_DOMAIN=
   PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
   ```

6. **Apply migrations**:
   ```bash
   # Copy the schema to migrations folder
   cp supabase-schema.sql supabase/migrations/00001_initial_schema.sql

   # Apply it
   supabase db reset
   ```

7. **Start the dev server**:
   ```bash
   mise run dev
   ```

8. **Access Supabase Studio**: http://localhost:54323

**Stopping local Supabase:**
```bash
supabase stop
```

**Pros:**
- Everything runs locally
- No internet required
- Full Supabase features
- Good for flights/offline work

**Cons:**
- Requires Docker
- Uses more system resources
- More initial setup

---

## Comparison

| Feature | Supabase Cloud | Supabase Local |
|---------|---------------|----------------|
| Setup time | 5 minutes | 15 minutes |
| Internet required | Yes | No |
| System resources | Minimal | Medium (Docker) |
| Data persistence | Cloud backup | Local only |
| Best for | Most developers | Offline work |
| Cost | Free tier | Free (local) |

## Recommendation

**Use Supabase Cloud** unless you specifically need offline development.

The free tier (500MB DB, 1GB storage, 50K MAU) is perfect for:
- Local development
- Testing
- Small production sites
- This entire project

You'll never hit the limits with HauntJunkies traffic levels.

---

## Managing Your Data

### Supabase Cloud
- Use the Table Editor in Supabase dashboard
- Browse to: https://supabase.com/dashboard/project/YOUR_PROJECT/editor

### Supabase Local
- Use Supabase Studio: http://localhost:54323
- Or connect with any PostgreSQL client

### Common Tasks

**Add a test review:**
1. Go to Table Editor → `reviews`
2. Click "Insert row"
3. Fill in fields (name, slug, city, state, etc.)
4. Click "Save"

**Approve a comment:**
1. Go to Table Editor → `review_comments`
2. Find the comment
3. Set `approved` to `true`
4. Click "Save"

**Add McCloud Manor photos:**
1. Upload images to Storage → Create bucket `mccloud-photos`
2. Upload your images
3. Copy the public URL
4. Go to Table Editor → `mccloud_photos`
5. Insert row with the image URL

---

## Troubleshooting

### "fetch failed" errors
- Your `.env` has placeholder values
- Follow Option 1 or 2 above to set up Supabase
- Restart dev server after updating `.env`

### "punycode deprecation" warning
- This is harmless (from a dependency)
- Can be ignored

### Supabase Local won't start
- Make sure Docker Desktop is running
- Check Docker has enough resources (4GB+ RAM recommended)
- Try: `supabase stop && supabase start`

### Can't connect to Supabase Cloud
- Check your internet connection
- Verify credentials in `.env` are correct
- Make sure you copied the full anon key (it's very long)

---

## Next Steps After Setup

1. ✅ Get dev server running with database
2. Add a test review in Supabase
3. Test the site at http://localhost:5173
4. Start building features!

See [../README.md](../README.md) for development commands and [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.
