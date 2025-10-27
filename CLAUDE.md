# 🤖 Claude Code Instructions

> Guidance for Claude Code when working with the Haunt Junkies repository

<div align="center">

**Haunt Junkies** - Modern haunted attraction review website

SvelteKit • Supabase • Tailwind CSS • TypeScript

</div>

---

## 📋 Quick Reference

| Command | Action |
|---------|--------|
| `mise run dev` | Start development server |
| `mise run build` | Build for production |
| `npm run check` | Type checking |
| `npm test` | Run tests |

**Live Server:** [http://localhost:5173](http://localhost:5173)

---

## 🎯 Project Overview

Haunt Junkies is a modern haunted attraction review website featuring:

- 📚 **Review Management** - User reviews with ratings and galleries
- 🏚️ **McCloud Manor** - Home haunt showcase with ticket sales
- 📧 **Contact Forms** - Public inquiry submission
- 🎫 **Ticket System** - Direct ticket purchases with capacity management
- 🛍️ **Merchandise** - Shopify integration
- 🔐 **Admin Panel** - Content management dashboard

---

## 🛠️ Development Commands

### Using mise (Recommended)

```bash
mise install        # 📥 Install Node.js 22.12.0
mise run install    # 📦 Install npm dependencies
mise run dev        # 🚀 Start development server (http://localhost:5173)
mise run build      # 🏗️  Build for production
mise run preview    # 👁️  Preview production build
mise run check      # ✅ Run type checking
```

### Using npm Directly

```bash
npm install         # 📦 Install dependencies
npm run dev         # 🚀 Start development server
npm run build       # 🏗️  Build for production
npm run preview     # 👁️  Preview production build
npm run check       # ✅ Run type checking with svelte-check
npm run check:watch # 👀 Watch mode for type checking
```

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | SvelteKit 2.x + TypeScript | Modern reactive framework |
| **Styling** | Tailwind CSS v3 | Utility-first CSS with custom colors |
| **Database** | Supabase (PostgreSQL) | Database with Row Level Security |
| **Auth** | Supabase Auth | Admin authentication |
| **Storage** | Supabase Storage | Image and file hosting |
| **E-commerce** | Shopify Buy SDK | Merchandise sales |
| **Hosting** | Vercel | Serverless deployment |
| **Runtime** | Node.js 22.x | Server runtime |

**Brand Colors:**
- 🟠 `haunt-orange`: `#FC7403` (Primary)
- 🔴 `haunt-red`: `#a41214` (McCloud Manor theme)

---

## 📂 Application Structure

### SvelteKit Routing

```
src/routes/
├── +layout.svelte              # Global layout with nav/footer
├── +layout.server.ts           # Server-side layout logic
├── +page.svelte                # Homepage
├── +page.server.ts             # Homepage data loading
├── reviews/
│   ├── +page.svelte            # Reviews list
│   ├── +page.server.ts         # Reviews data
│   └── [slug]/
│       ├── +page.svelte        # Individual review
│       └── +page.server.ts     # Review data + comments
├── haunt/
│   ├── +page.svelte            # McCloud Manor (⚠️ Note: /haunt not /mccloudmanor)
│   └── +page.server.ts         # Manor data + ticket requests
├── tickets/
│   ├── +page.svelte            # Ticket purchase form
│   └── +page.server.ts         # Ticket processing
├── contact/
│   ├── +page.svelte            # Contact form
│   └── +page.server.ts         # Contact submission
├── shop/
│   └── +page.svelte            # Shopify integration
└── admin/
    ├── dashboard/              # Admin overview
    ├── mccloud/                # McCloud Manor management
    ├── tickets/                # Ticket management
    ├── comments/               # Comment moderation
    └── reviews/                # Review management
```

### Key Route Patterns

| Route | Purpose | Note |
|-------|---------|------|
| `/` | Homepage with featured reviews, parallax hero, CTAs | |
| `/reviews` | List all reviews with search/filter | |
| `/reviews/[slug]` | Individual review detail pages | Slug-based routing |
| `/haunt` | McCloud Manor home haunt page | ⚠️ **Not** `/mccloudmanor` |
| `/tickets` | Direct ticket purchase with capacity check | Uses atomic DB function |
| `/contact` | Contact form | |
| `/shop` | Shopify merchandise | Future admin at `/admin` |
| `/admin/*` | Admin panel routes | Requires authentication |

---

## 🗄️ Database Schema

All tables use **UUID primary keys** and have **Row Level Security (RLS)** policies.

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `reviews` | Main haunt reviews | `slug` (indexed), `rating_overall`, `featured` |
| `review_images` | Gallery images | `review_id`, `image_url`, `display_order` |
| `review_comments` | Visitor comments | `review_id`, `approved`, `author_name` |
| `mccloud_info` | McCloud Manor info | **Single row**, `title`, `story`, `dates` |
| `mccloud_photos` | Manor photo gallery | `image_url`, `caption`, `display_order` |
| `ticket_dates` | Available ticket dates | `date`, `capacity`, `is_available` |
| `ticket_purchases` | Confirmed purchases | `date`, `tickets`, `email`, `purchase_id` |
| `ticket_requests` | Legacy requests | `status`, `date`, `quantity` (old system) |
| `contact_submissions` | Contact forms | `name`, `email`, `message` |
| `hero_message` | Homepage banner | **Single row**, `message` (optional) |
| `horror_quotes` | Random quotes | `quote`, `source` |

### Security Model

| Access Type | Tables | Permissions |
|-------------|--------|-------------|
| **Public Read** | `reviews`, `mccloud_*`, `hero_message`, `horror_quotes` | Approved/featured content only |
| **Public Write** | `review_comments`, `ticket_*`, `contact_submissions` | Via service role key server-side |
| **Admin Full Access** | All tables | Authenticated users only |

---

## 🔄 Data Flow Pattern

### 1️⃣ Page Load

```typescript
// +page.server.ts
export const load = async () => {
  const { data } = await supabase.from('reviews').select('*');
  return { reviews: data };  // ← Passed to page component
};
```

### 2️⃣ Client Access

```svelte
<!-- +page.svelte -->
<script lang="ts">
  let { data } = $props();  // ← Receive from load function
</script>

{#each data.reviews as review}
  <div>{review.name}</div>
{/each}
```

### 3️⃣ Form Handling

```typescript
// +page.server.ts
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const { error } = await supabase.from('table').insert(/*...*/);

    if (error) return fail(400, { error: error.message });
    return { success: true };
  }
};
```

---

## 🔧 Supabase Client Setup

### Browser Client

```typescript
// src/lib/supabase.ts - Singleton browser client
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY  // Public key, respects RLS
);
```

### Server Client (Service Role)

```typescript
// In +page.server.ts files
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

const supabaseAdmin = createServerClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,  // 🔑 Bypasses RLS
  { cookies: {/*...*/} }
);
```

**When to use Service Role:**
- ✅ Public form submissions (contact, tickets, comments)
- ✅ Admin operations
- ✅ Reading data for capacity checks
- ❌ **Never** expose service role key to client

---

## 📝 Type System

**Location:** `src/lib/types.ts`

All database models have corresponding TypeScript interfaces:

```typescript
export interface Review {
  id: string;
  slug: string;
  name: string;
  description: string;
  rating_overall: number;
  rating_scares: number;
  rating_atmosphere: number;
  // ... more fields
}
```

**Best Practice:** Always use these types for type-safe data handling.

---

## 🎯 Important Patterns

### 🔗 Slug-Based Routing

Reviews use slug-based URLs for SEO: `/reviews/awesome-haunt-2024`

```typescript
// ✅ Correct - lookup by slug
const { data } = await supabase
  .from('reviews')
  .select('*')
  .eq('slug', params.slug)
  .single();

// ❌ Wrong - don't use ID in URLs
const { data } = await supabase
  .from('reviews')
  .select('*')
  .eq('id', params.id);
```

**Requirements:**
- Slugs must be **unique** and **URL-friendly**
- Use for lookups, not `id`
- Index on `slug` column for performance

---

### 💬 Comment Moderation

Comments require approval before public display:

```typescript
// Comments default to false
INSERT INTO review_comments (approved, ...)
VALUES (false, ...);

// Only show approved comments
SELECT * FROM review_comments
WHERE review_id = ? AND approved = true;
```

**Workflow:**
1. User submits comment → `approved = false`
2. Admin reviews in admin panel
3. Admin approves → `approved = true`
4. Comment appears on review page

---

### 📝 Form Submission Pattern

Standard SvelteKit form action flow:

```typescript
// 1️⃣ Server action handles submission
export const actions = {
  submit: async ({ request }) => {
    const data = await request.formData();
    // Process data...
    return { success: true };
  }
};
```

```svelte
<!-- 2️⃣ Form posts to same route -->
<form method="POST" action="?/submit" use:enhance>
  <input name="field" />
  <button type="submit">Submit</button>
</form>
```

**Steps:**
1. POST to same route
2. Server action in `+page.server.ts` handles submission
3. Insert data into Supabase
4. Return success/error to client
5. Client displays feedback to user

---

### 🧭 Responsive Navigation

`Navigation.svelte` component features:

- 🖥️ Desktop horizontal menu
- 📱 Mobile hamburger menu (toggle logic built-in)
- 🎃 Logo linking to homepage
- 🔐 Admin link (when authenticated)

---

### 🎨 Parallax Hero Component

`ParallaxHero.svelte` is reusable:

**Props:**
- `backgroundImage` - URL to background image
- `title` - Main heading text
- `subtitle` - Secondary text
- `height` - Custom height (default: `min-h-screen`)

**Features:**
- Uses `background-attachment: fixed` for parallax effect
- Fallback gradient if no image provided
- Dark overlay for text readability

---

## 🔐 Environment Variables

Create `.env` file (see `.env.example`):

```env
# Supabase (Required)
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhb...

# Service Role (Required for server-side)
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# Admin Login (Required for admin panel)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Email (Optional - for ticket confirmations)
RESEND_API_KEY=re_...

# Shopify (Optional - for merchandise)
PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=shpat_...
```

**⚠️ Important:**
- Variables prefixed with `PUBLIC_` are exposed to client-side code
- `SUPABASE_SERVICE_ROLE_KEY` must **never** be exposed to client
- Restart dev server after changing `.env`

---

## 🗄️ Database Setup

### Initial Setup

1. 🌐 Create Supabase project at [supabase.com](https://supabase.com)
2. 📝 Copy `supabase-schema.sql` to SQL Editor
3. ▶️ Execute entire script (creates tables, RLS, indexes, triggers)
4. 🔑 Add credentials to `.env`

### Critical Post-Setup

⚠️ **MUST Execute:** `migrations/migration-purchase-tickets-function.sql`

This creates the atomic ticket purchase function. See [EXECUTE-THIS-SQL.md](EXECUTE-THIS-SQL.md).

---

## 🖼️ Image Handling

### Storage Buckets

Create these buckets in Supabase Storage:

| Bucket | Purpose | Public? |
|--------|---------|---------|
| `review-images` | Review cover images, gallery photos, logos (logos/ subfolder), and social share images (social/ subfolder) | ✅ Yes |
| `mccloud-photos` | McCloud Manor gallery images | ✅ Yes |

**Note:** The `review-images` bucket uses subfolders for organization:
- `logos/` - Review logos displayed on cards and detail pages
- `social/` - Social media share images (og:image)
- Root folder - Review gallery images

### Image URLs

Store **full Supabase Storage URLs** in database:

```
https://xxx.supabase.co/storage/v1/object/public/bucket/image.jpg
```

**Not:**
```
/storage/bucket/image.jpg  ❌
```

---

## 🚀 Deployment

### Vercel (Configured)

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs22.x'  // Node.js 22.x runtime
    })
  }
};
```

**Steps:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Auto-deploys on push to main

---

## 🎨 Key Customization Points

### Branding Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'haunt-orange': '#FC7403',  // Primary brand color
  'haunt-red': '#a41214',     // McCloud Manor theme
}
```

### Visual Assets

| Asset | Location | Purpose |
|-------|----------|---------|
| **Parallax Background** | `static/bg.jpg` | Homepage hero |
| **Logo** | `static/logo-url.png` | Navigation logo |
| **Favicon** | `static/favicon.png` | Browser icon |
| **Videos** | `static/videos/` | Background videos |

### Shopify Products

Configure in `src/routes/shop/+page.svelte`

---

## ⚠️ Known Limitations

| Limitation | Status | Workaround |
|------------|--------|------------|
| Admin reviews page | ⚠️ No server handler | Create `admin/reviews/+page.server.ts` |
| Admin comments page | ⚠️ Using mock data | Create `admin/comments/+page.server.ts` |
| Shop page | ⚠️ Placeholder | Implement Shopify or hide from nav |
| Email domain | 📧 Using dev address | Verify domain in Resend |

See [REMAINING-WORK.md](REMAINING-WORK.md) for full list.

---

## 📋 Common Tasks

### Add a New Review

1. 📤 Upload cover image to Supabase Storage `review-images` bucket
2. 📝 Insert row in `reviews` table:
   - Required: `slug`, `name`, `rating_overall`
   - Optional: `featured` (for homepage), `description`, ratings
3. 🖼️ Optionally add images to `review_images` table
4. ✅ Review appears immediately on `/reviews`
   - If `featured = true`, also shows on homepage

### Approve a Comment

1. 🌐 Navigate to Supabase Table Editor → `review_comments`
2. 🔍 Find comment by review or author
3. ✅ Set `approved = true`
4. 👁️ Comment now visible on review page

### Update McCloud Manor

**Via Admin Panel** (Recommended):
1. 🔐 Login to `/admin/login`
2. 🏚️ Go to McCloud Manor management
3. ✏️ Edit fields: title, story, dates, hours, pricing, etc.
4. 💾 Save changes

**Via Supabase:**
1. 🌐 Supabase Table Editor → `mccloud_info`
2. ✏️ Edit the single row
3. ✅ Changes reflect immediately on `/haunt` page

---

## 🐛 Debugging Tips

| Issue | Solution |
|-------|----------|
| **Component errors** | Check SvelteKit dev server error overlay |
| **Supabase query fails** | Check browser console for errors |
| **Empty query results** | Verify RLS policies allow access |
| **Database issues** | Use Supabase Logs panel |
| **Environment variables** | Restart dev server after changes |
| **Ticket purchases fail** | Ensure `purchase_tickets()` function is executed |
| **Forms blocked** | Check RLS policies, use service role key |
| **Stale data** | Add `invalidateAll()` to form handlers |

---

## 📚 Additional Resources

- 📖 [Full README](README.md) - Complete project documentation
- 🔐 [Database Safety](DATABASE-SAFETY-MEASURES.md) - Security implementation
- ⚠️ [Remaining Work](REMAINING-WORK.md) - TODOs and known issues
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- 🔧 [Local Development](docs/LOCAL_DEVELOPMENT.md) - Detailed setup

---

<div align="center">

**🎃 Happy Coding! 🎃**

*Built with SvelteKit, Supabase, and Halloween spirit*

</div>
