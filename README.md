# Haunt Junkies - Modern Website Rebuild

A modern, performant website for Haunt Junkies - your trusted source for haunted attraction reviews and home of McCloud Manor.

## Tech Stack

- **Frontend**: SvelteKit + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **E-commerce**: Shopify Buy Button
- **Hosting**: Vercel (recommended)

## Features

### Public Pages
- **Homepage** - Parallax hero, featured reviews, McCloud Manor CTA, shop CTA
- **Reviews** - Browse all haunt reviews with search and filtering
- **Review Details** - Individual review pages with ratings, images, and comments
- **McCloud Manor (/haunt)** - Home haunt info, photo gallery, ticket request form
- **Contact** - Contact form for inquiries
- **Shop** - Shopify merchandise integration

### Admin Panel (Coming Soon)
- Review management (CRUD operations)
- Comment moderation
- McCloud Manor content management
- Ticket request management
- Image uploads

## Getting Started

### Prerequisites
- Node.js 22+ and npm (or use mise/asdf - see below)
- A Supabase account (free tier available)
- (Optional) Shopify store for merchandise

### Quick Start with mise (Recommended)

If you have [mise](https://mise.jdx.dev) installed:

```bash
mise install        # Installs Node.js 22.12.0
mise run install    # Installs npm dependencies
mise run dev        # Starts development server
```

### Manual Installation

1. **Install Node.js 22.12.0+**
   - Download from [nodejs.org](https://nodejs.org)
   - Or use nvm: `nvm install 22.12.0 && nvm use 22.12.0`

2. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase** (required for database)

   **Quick setup (5 minutes):**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Get credentials from Settings → API
   - Run schema in SQL Editor (copy from `supabase-schema.sql`)

   **Full instructions:** See [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md)

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com (optional)
   PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-token (optional)
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # Or with mise: mise run dev
   ```

   Visit [http://localhost:5173](http://localhost:5173)

## Development Commands

### Using mise (Recommended)
```bash
mise run dev        # Start development server
mise run build      # Build for production
mise run preview    # Preview production build
mise run check      # Run type checking
mise run format     # Format code with Prettier
mise run lint       # Lint code
```

### Using npm directly
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run check       # Run type checking
```

## Database Setup

The database schema is defined in `supabase-schema.sql`. This includes:

### Tables
- `reviews` - Haunted attraction reviews
- `review_images` - Gallery images for reviews
- `review_comments` - Visitor comments (with moderation)
- `mccloud_info` - McCloud Manor information (single row)
- `mccloud_photos` - McCloud Manor photo gallery
- `ticket_requests` - Ticket reservation requests
- `contact_submissions` - Contact form submissions

### Row Level Security (RLS)
- Public read access for approved content
- Public write access for comments, ticket requests, contact forms
- Authenticated users (admins) have full access to manage content

## Deployment

### Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Import your repository at [vercel.com](https://vercel.com)
   - Add environment variables from your `.env` file
   - Deploy!

### Other Platforms
This SvelteKit app can also be deployed to:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Any Node.js hosting

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Navigation.svelte
│   │   ├── Footer.svelte
│   │   └── ParallaxHero.svelte
│   ├── types.ts          # TypeScript types
│   └── supabase.ts       # Supabase client
├── routes/
│   ├── +layout.svelte    # Root layout
│   ├── +page.svelte      # Homepage
│   ├── reviews/
│   │   ├── +page.svelte  # Reviews listing
│   │   └── [slug]/
│   │       └── +page.svelte  # Review detail
│   ├── haunt/
│   │   └── +page.svelte  # McCloud Manor
│   ├── contact/
│   │   └── +page.svelte  # Contact form
│   └── shop/
│       └── +page.svelte  # Shopify integration
├── app.css               # Tailwind + custom styles
static/
├── logo-url.png          # Logo
├── bg.jpg                # Parallax background
└── favicon.png           # Favicon
```

## Customization

### Branding Colors
Edit `tailwind.config.js` to change the color scheme:
```js
colors: {
  'haunt-orange': '#FC7403',
  'haunt-red': '#a41214',
}
```

### Parallax Background
Replace `static/bg.jpg` with your own image

### Logo
Replace `static/logo-url.png` with your logo

## Shopify Integration

To enable the shop:

1. **Create a Shopify store** (if you don't have one)
2. **Get Storefront API access**:
   - Go to Apps → Develop apps
   - Create a new app
   - Enable Storefront API
   - Copy the Storefront access token
3. **Add credentials to `.env`**
4. **Configure products** in `src/routes/shop/+page.svelte`

## Admin Panel (Next Steps)

The admin panel is not yet implemented. To add it:

1. Create admin routes in `src/routes/admin/`
2. Use Supabase Auth for login
3. Build CRUD interfaces for:
   - Reviews management
   - Comment moderation
   - McCloud Manor content
   - Ticket requests

## Cost Breakdown

- **Supabase**: Free tier (500MB DB, 1GB storage, 50K MAU)
- **Vercel**: Free tier (100GB bandwidth, unlimited projects)
- **Shopify**: Starts at $29/month (only if using shop)

**Total for low traffic**: $0/month (without shop)

## Migration from Old Site

To migrate data from the old Rails site:

1. Export data from PostgreSQL
2. Transform to match new schema
3. Import via Supabase SQL or API
4. Migrate images to Supabase Storage

## Support

For issues or questions:
- Check the [SvelteKit docs](https://kit.svelte.dev)
- Check the [Supabase docs](https://supabase.com/docs)
- Open an issue on GitHub

## License

Private - All rights reserved
