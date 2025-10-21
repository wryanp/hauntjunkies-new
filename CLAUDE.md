# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Haunt Junkies is a modern haunted attraction review website built with SvelteKit, Supabase, and Tailwind CSS. The site features review management, a home haunt showcase (McCloud Manor), contact forms, ticket requests, and Shopify integration for merchandise.

## Development Commands

### Using mise (Recommended)
```bash
mise install        # Install Node.js 22.12.0
mise run install    # Install npm dependencies
mise run dev        # Start development server (http://localhost:5173)
mise run build      # Build for production
mise run preview    # Preview production build
mise run check      # Run type checking
```

### Using npm directly
```bash
npm install         # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run check       # Run type checking with svelte-check
npm run check:watch # Watch mode for type checking
```

## Architecture Overview

### Tech Stack
- **Frontend**: SvelteKit 2.x with TypeScript
- **Styling**: Tailwind CSS v3 with custom haunt-orange (#FC7403) and haunt-red (#a41214) colors
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (for future admin panel)
- **Storage**: Supabase Storage for images
- **E-commerce**: Shopify Buy SDK
- **Deployment**: Vercel with Node.js 22.x runtime

### Application Structure

**SvelteKit Routing**:
- Uses file-based routing in `src/routes/`
- Server-side data loading via `+page.server.ts` files
- Global layout in `src/routes/+layout.svelte`

**Key Route Patterns**:
- `/` - Homepage with featured reviews, parallax hero, CTAs
- `/reviews` - List all reviews with search/filter
- `/reviews/[slug]` - Individual review detail pages
- `/haunt` - McCloud Manor home haunt page (note: not /mccloudmanor)
- `/contact` - Contact form
- `/shop` - Shopify integration (future admin at `/admin`)

### Database Schema

All tables use UUID primary keys and have Row Level Security (RLS) policies.

**Core Tables**:
- `reviews` - Main haunt reviews (slug indexed for lookups)
- `review_images` - Gallery images linked to reviews
- `review_comments` - Visitor comments (moderation via `approved` boolean)
- `mccloud_info` - Single-row table for McCloud Manor information
- `mccloud_photos` - Photo gallery for McCloud Manor
- `ticket_requests` - Ticket reservation requests from haunt page
- `contact_submissions` - Contact form submissions
- `hero_message` - Single-row table for optional homepage hero message

**Security Model**:
- Public read access for approved/featured content
- Public write access for comments, ticket requests, contact forms
- Authenticated users (future admins) have full CRUD access
- RLS policies enforce these rules at database level

### Data Flow Pattern

1. **Page Load**: `+page.server.ts` fetches data from Supabase
2. **Data Passing**: Returned via `load()` function to `+page.svelte`
3. **Client Access**: Data available as `data` prop in Svelte components
4. **Form Handling**: Server actions handle POST requests in `+page.server.ts`

Example:
```typescript
// +page.server.ts
export const load = async () => {
  const { data } = await supabase.from('reviews').select('*');
  return { reviews: data };
};
```

### Supabase Client

**Browser Client**: `src/lib/supabase.ts` exports a singleton browser client
- Uses environment variables: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
- Server-side code should create server clients when needed (see `@supabase/ssr`)

### Type System

**TypeScript Types**: Defined in `src/lib/types.ts`
- All database models have corresponding TypeScript interfaces
- Interfaces include all fields from database schema
- Use these types for type-safe data handling

## Important Patterns

### Slug-Based Routing
Reviews use slug-based URLs (`/reviews/awesome-haunt-2024`). When creating reviews:
- Slugs must be unique and URL-friendly
- Use the `slug` field for lookups, not `id`
- Pattern: `supabase.from('reviews').select('*').eq('slug', params.slug).single()`

### Comment Moderation
Comments require approval before display:
- Comments default to `approved: false`
- Only show comments where `approved = true` on public pages
- Future admin panel should allow toggling `approved` status

### Form Submission Pattern
Forms use SvelteKit form actions:
1. POST to same route
2. Server action in `+page.server.ts` handles submission
3. Insert data into Supabase
4. Return success/error to client
5. Client displays feedback to user

### Responsive Navigation
The `Navigation.svelte` component has:
- Desktop horizontal menu
- Mobile hamburger menu (toggle logic built-in)
- Logo linking to homepage

### Parallax Hero Component
`ParallaxHero.svelte` is reusable:
- Props: `backgroundImage`, `title`, `subtitle`, `height`
- Uses `background-attachment: fixed` for parallax effect
- Fallback gradient if no image provided

## Environment Variables

Required in `.env` (see `.env.example`):
```
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhb...
PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com (optional)
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxx (optional)
```

All variables prefixed with `PUBLIC_` are exposed to client-side code.

## Database Setup

To initialize database:
1. Create Supabase project at supabase.com
2. Run entire `supabase-schema.sql` in SQL Editor
3. Creates all tables, indexes, RLS policies, and triggers
4. Add credentials to `.env`

## Image Handling

**Storage Buckets** (create in Supabase Storage):
- `review-images` - Review cover images and gallery photos
- `mccloud-photos` - McCloud Manor gallery images
- All buckets should be public for direct browser access

**Image URLs**: Store full Supabase Storage URLs in database (e.g., `https://xxx.supabase.co/storage/v1/object/public/bucket/image.jpg`)

## Deployment

Configured for Vercel deployment:
- `svelte.config.js` uses `@sveltejs/adapter-vercel`
- Runtime set to `nodejs22.x`
- Push to GitHub, import to Vercel, add environment variables
- Auto-deploys on push to main branch

## Key Customization Points

**Branding Colors**: Edit `tailwind.config.js`
```javascript
colors: {
  'haunt-orange': '#FC7403',
  'haunt-red': '#a41214',
}
```

**Parallax Background**: Replace `static/bg.jpg`

**Logo**: Replace `static/logo-url.png`

**Shopify Products**: Configure in `src/routes/shop/+page.svelte`

## Known Limitations

- No admin panel yet (content managed via Supabase Table Editor)
- Shopify integration uses Buy Button (requires setup)
- Comments require manual approval in database
- No automated email notifications for forms/tickets

## Common Tasks

**Add a new review**:
1. Upload cover image to Supabase Storage `review-images` bucket
2. Insert row in `reviews` table with slug, ratings, location, etc.
3. Optionally add images to `review_images` table
4. Review appears immediately on `/reviews` (if featured, also on homepage)

**Approve a comment**:
1. Navigate to Supabase Table Editor → `review_comments`
2. Find comment, set `approved = true`
3. Comment now visible on review page

**Update McCloud Manor info**:
1. Supabase Table Editor → `mccloud_info`
2. Edit the single row (title, dates, hours, pricing, etc.)
3. Changes reflect immediately on `/haunt` page

## Debugging Tips

- Use SvelteKit's dev server error overlay for component issues
- Check browser console for Supabase query errors
- Verify RLS policies if queries return empty unexpectedly
- Use Supabase Logs panel to debug database issues
- Check that environment variables are set correctly (restart dev server after changes)
