# 🎃 Haunt Junkies - Modern Website Rebuild

> A modern, performant website for Haunt Junkies - your trusted source for haunted attraction reviews and home of McCloud Manor.

<div align="center">

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

### 🚀 Project Status

| Build | Deployment | Cost | License |
|:-----:|:----------:|:----:|:-------:|
| ✅ Passing | 🟢 Ready | $0/mo | Private |

**Quick Links:** [📖 Docs](#-documentation) • [⚡ Quick Start](docs/QUICK_START.md) • [🚀 Deploy](docs/DEPLOYMENT.md) • [💬 Support](#-support)

</div>

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Development Commands](#-development-commands)
- [Database Setup](#-database-setup)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Customization](#-customization)
- [Cost Breakdown](#-cost-breakdown)
- [Documentation](#-documentation)
- [Support](#-support)

---

## 🚀 Tech Stack

<div align="center">

| Layer | Technology | Purpose | Why Chosen |
|:------|:-----------|:--------|:-----------|
| **Frontend** | SvelteKit | Web framework | 50-70% less JavaScript than React |
| **Styling** | Tailwind CSS | Utility-first CSS | Rapid development, tiny bundle |
| **Database** | Supabase | PostgreSQL + APIs | Free tier, auto-scaling |
| **Storage** | Supabase Storage | Image hosting | Integrated with database |
| **Hosting** | Vercel | Serverless platform | Free tier, zero config |
| **Types** | TypeScript | Type safety | Catch bugs at compile time |
| **Shop** | Shopify Buy SDK | E-commerce | Optional integration |

</div>

---

## ✨ Features

<details open>
<summary><strong>🌐 Public Pages (Click to collapse)</strong></summary>

<table>
<tr>
<th>Page</th>
<th>Route</th>
<th>Features</th>
</tr>
<tr>
<td>🏠 <strong>Homepage</strong></td>
<td><code>/</code></td>
<td>Parallax hero • Featured reviews • CTAs</td>
</tr>
<tr>
<td>📚 <strong>Reviews</strong></td>
<td><code>/reviews</code></td>
<td>Search • Filter • Sort • Ratings</td>
</tr>
<tr>
<td>📖 <strong>Review Details</strong></td>
<td><code>/reviews/[slug]</code></td>
<td>Full review • Gallery • Comments</td>
</tr>
<tr>
<td>🏚️ <strong>McCloud Manor</strong></td>
<td><code>/haunt</code></td>
<td>Event info • Gallery • Ticket form</td>
</tr>
<tr>
<td>🎫 <strong>Tickets</strong></td>
<td><code>/tickets</code></td>
<td>Purchase tickets • Calendar • Capacity</td>
</tr>
<tr>
<td>📧 <strong>Contact</strong></td>
<td><code>/contact</code></td>
<td>Contact form • Validation</td>
</tr>
<tr>
<td>🛍️ <strong>Shop</strong></td>
<td><code>/shop</code></td>
<td>Shopify integration • Products</td>
</tr>
<tr>
<td>ℹ️ <strong>About</strong></td>
<td><code>/about</code></td>
<td>About the site</td>
</tr>
</table>

</details>

<details>
<summary><strong>🔐 Admin Panel (Click to expand)</strong></summary>

| Feature | Status | Description |
|---------|:------:|-------------|
| **Admin Dashboard** | ✅ Complete | Overview & quick links |
| **McCloud Management** | ✅ Complete | Edit haunt content & gallery |
| **Ticket Management** | ✅ Complete | View & manage ticket purchases |
| **Review Management** | ⚠️ In Progress | CRUD operations for reviews |
| **Comment Moderation** | ⚠️ In Progress | Approve/delete comments |
| **Analytics** | 📋 Planned | Site performance tracking |

</details>

### 🌟 Key Features

<table>
<tr><td>✅ <strong>Server-side rendering (SSR)</strong></td><td>Faster initial page loads</td></tr>
<tr><td>✅ <strong>Responsive design</strong></td><td>Mobile-first, works on all devices</td></tr>
<tr><td>✅ <strong>Search & filtering</strong></td><td>Find reviews by name, location, year</td></tr>
<tr><td>✅ <strong>Comment system</strong></td><td>With moderation for spam prevention</td></tr>
<tr><td>✅ <strong>Photo galleries</strong></td><td>Multiple images per review</td></tr>
<tr><td>✅ <strong>Ticket system</strong></td><td>Date selection with capacity tracking</td></tr>
<tr><td>✅ <strong>Email notifications</strong></td><td>Confirmations & admin alerts</td></tr>
<tr><td>✅ <strong>Horror quotes</strong></td><td>Random spooky quotes on pages</td></tr>
</table>

---

## 📦 Getting Started

### Prerequisites

<div align="center">

| Requirement | Version | Why Needed |
|:------------|:-------:|:-----------|
| **Node.js** | 22.12.0+ | JavaScript runtime |
| **npm** | Latest | Package manager |
| **Supabase Account** | Free tier | Database & backend |
| **Shopify Store** | Optional | E-commerce (optional) |

</div>

---

### ⚡ Quick Start with mise (Recommended)

If you have [mise](https://mise.jdx.dev) installed:

```bash
# 1️⃣ Install Node.js and dependencies
mise install

# 2️⃣ Install npm packages
mise run install

# 3️⃣ Start development server
mise run dev
```

**✅ Done!** Visit [http://localhost:5173](http://localhost:5173)

---

### 🔧 Manual Installation

<details>
<summary><strong>Step-by-step manual setup (Click to expand)</strong></summary>

#### 1️⃣ Install Node.js 22.12.0+

**Option A: Download from nodejs.org**

Visit [nodejs.org](https://nodejs.org) and download the installer

**Option B: Use nvm**

```bash
nvm install 22.12.0
nvm use 22.12.0
```

**Option C: Use mise**

```bash
curl https://mise.run | sh
mise install
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Set Up Supabase Database

**Quick Setup (5 minutes):**

| Step | Action |
|:----:|--------|
| 1️⃣ | Create account at [supabase.com](https://supabase.com) |
| 2️⃣ | Create new project (wait ~2 minutes) |
| 3️⃣ | Go to **Settings → API** |
| 4️⃣ | Copy **Project URL** and **anon key** |
| 5️⃣ | Open **SQL Editor** in dashboard |
| 6️⃣ | Copy contents from `supabase-schema.sql` |
| 7️⃣ | Paste and execute in SQL Editor |

> 💡 **Need detailed instructions?** See [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md)

#### 4️⃣ Configure Environment Variables

```bash
# Copy example file
cp .env.example .env
```

**Edit `.env` with your credentials:**

```env
# Supabase (Required)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Optional - for notifications)
RESEND_API_KEY=your-resend-api-key

# Shopify (Optional - only if using shop)
PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-token-here

# Admin (Optional - for admin panel)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

#### 5️⃣ Run the Development Server

```bash
npm run dev
# Or with mise: mise run dev
```

🎉 **Visit** [http://localhost:5173](http://localhost:5173)

</details>

---

## 🛠️ Development Commands

<div align="center">

### Using mise (Recommended)

| Command | Action | Description |
|:--------|:-------|:------------|
| `mise run dev` | 🚀 Start dev server | With hot reload at localhost:5173 |
| `mise run build` | 🏗️ Build production | Compile for deployment |
| `mise run preview` | 👁️ Preview build | Test production build locally |
| `mise run check` | ✅ Type check | Run TypeScript checks |
| `mise run format` | 💅 Format code | Auto-format with Prettier |
| `mise run lint` | 🔍 Lint code | Check code quality |

### Using npm Directly

| Command | Action |
|:--------|:-------|
| `npm run dev` | 🚀 Start development server |
| `npm run build` | 🏗️ Build for production |
| `npm run preview` | 👁️ Preview production build |
| `npm run check` | ✅ Run type checking |
| `npm run check:watch` | 👀 Watch mode for types |

</div>

---

## 🗄️ Database Setup

The database schema is defined in `supabase-schema.sql`

### 📊 Database Tables

<details open>
<summary><strong>Core Tables (Click to collapse)</strong></summary>

<table>
<tr>
<th>Table</th>
<th>Purpose</th>
<th>Key Fields</th>
</tr>
<tr>
<td><code>reviews</code></td>
<td>Haunted attraction reviews</td>
<td>name, slug, ratings, location</td>
</tr>
<tr>
<td><code>review_images</code></td>
<td>Gallery images for reviews</td>
<td>review_id (FK), image_url</td>
</tr>
<tr>
<td><code>review_comments</code></td>
<td>Visitor comments</td>
<td>review_id (FK), approved</td>
</tr>
<tr>
<td><code>mccloud_info</code></td>
<td>McCloud Manor info (single row)</td>
<td>title, dates, hours, pricing</td>
</tr>
<tr>
<td><code>mccloud_photos</code></td>
<td>Photo gallery</td>
<td>image_url, display_order</td>
</tr>
<tr>
<td><code>ticket_dates</code></td>
<td>Available ticket dates</td>
<td>date, capacity, is_available</td>
</tr>
<tr>
<td><code>ticket_purchases</code></td>
<td>Completed purchases</td>
<td>date, tickets, customer_info</td>
</tr>
<tr>
<td><code>ticket_requests</code></td>
<td>Legacy ticket requests</td>
<td>name, email, status</td>
</tr>
<tr>
<td><code>contact_submissions</code></td>
<td>Contact form entries</td>
<td>name, email, message</td>
</tr>
<tr>
<td><code>hero_message</code></td>
<td>Homepage banner (optional)</td>
<td>message, is_active</td>
</tr>
<tr>
<td><code>horror_quotes</code></td>
<td>Random spooky quotes</td>
<td>quote, author</td>
</tr>
</table>

</details>

### 🔒 Row Level Security (RLS)

<table>
<tr>
<th>Access Level</th>
<th>Permissions</th>
</tr>
<tr>
<td>🌐 <strong>Public Read</strong></td>
<td>Approved content, featured reviews</td>
</tr>
<tr>
<td>✍️ <strong>Public Write</strong></td>
<td>Comments, ticket requests, contact forms</td>
</tr>
<tr>
<td>🔐 <strong>Authenticated</strong></td>
<td>Full CRUD access (admins)</td>
</tr>
<tr>
<td>🛡️ <strong>Service Role</strong></td>
<td>Server-side operations bypass RLS</td>
</tr>
</table>

> 📖 **Learn more:** [DATABASE-SAFETY-MEASURES.md](DATABASE-SAFETY-MEASURES.md)

---

## 🚀 Deployment

### Vercel (Recommended)

<div align="center">

| Step | Action | Time |
|:----:|--------|:----:|
| 1️⃣ | Push code to GitHub | 2 min |
| 2️⃣ | Import to Vercel | 1 min |
| 3️⃣ | Add environment variables | 2 min |
| 4️⃣ | Deploy | 2 min |

**Total:** ~7 minutes 🚀

</div>

<details>
<summary><strong>Detailed deployment steps (Click to expand)</strong></summary>

#### 1️⃣ Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

#### 2️⃣ Deploy to Vercel

1. 🌐 Go to [vercel.com](https://vercel.com) and sign in
2. ➕ Click **"New Project"**
3. 📁 Import your GitHub repository
4. ⚙️ Vercel auto-detects SvelteKit ✅
5. Add environment variables from `.env`
6. 🚀 Click **"Deploy"**

</details>

> 💡 **Need more help?** See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Other Platforms

<table>
<tr><td>🌊 <strong>Netlify</strong></td><td>Alternative serverless platform</td></tr>
<tr><td>☁️ <strong>Cloudflare Pages</strong></td><td>Edge network deployment</td></tr>
<tr><td>📦 <strong>AWS Amplify</strong></td><td>AWS integration</td></tr>
<tr><td>🖥️ <strong>Node.js hosting</strong></td><td>Any VPS or container platform</td></tr>
</table>

---

## 📂 Project Structure

<details>
<summary><strong>Complete file structure (Click to expand)</strong></summary>

```
hauntjunkies-new/
├── 📁 src/
│   ├── 📁 lib/
│   │   ├── 📁 components/
│   │   │   ├── Navigation.svelte       # Responsive navigation
│   │   │   ├── Footer.svelte           # Site footer
│   │   │   ├── ParallaxHero.svelte     # Parallax hero component
│   │   │   └── QuoteSection.svelte     # Horror quotes display
│   │   ├── types.ts                    # TypeScript definitions
│   │   ├── supabase.ts                 # Supabase client
│   │   └── email.ts                    # Email utilities
│   ├── 📁 routes/
│   │   ├── +layout.svelte              # Global layout
│   │   ├── +layout.server.ts           # Server-side layout
│   │   ├── +page.svelte                # Homepage
│   │   ├── +page.server.ts             # Homepage data
│   │   ├── 📁 reviews/                 # Reviews section
│   │   │   ├── +page.svelte            # Reviews list
│   │   │   ├── +page.server.ts         # Fetch reviews
│   │   │   └── 📁 [slug]/
│   │   │       ├── +page.svelte        # Review detail
│   │   │       └── +page.server.ts     # Fetch review + comments
│   │   ├── 📁 haunt/                   # McCloud Manor
│   │   ├── 📁 tickets/                 # Ticket purchase
│   │   ├── 📁 contact/                 # Contact form
│   │   ├── 📁 shop/                    # Shopify integration
│   │   ├── 📁 about/                   # About page
│   │   └── 📁 admin/                   # Admin panel
│   │       ├── 📁 mccloud/             # McCloud management
│   │       ├── 📁 tickets/             # Ticket management
│   │       ├── 📁 comments/            # Comment moderation
│   │       └── 📁 reviews/             # Review management
│   └── app.css                         # Global styles + Tailwind
├── 📁 static/
│   ├── logo-url.png                    # Site logo
│   ├── bg.jpg                          # Parallax background
│   ├── favicon.png                     # Favicon
│   └── 📁 videos/                      # Video assets
├── 📁 migrations/                      # Database migrations
├── 📁 docs/                            # Documentation
│   ├── DEPLOYMENT.md                   # Deployment guide
│   ├── LOCAL_DEVELOPMENT.md            # Setup guide
│   ├── PROJECT_SUMMARY.md              # Technical overview
│   └── QUICK_START.md                  # Quick start
├── supabase-schema.sql                 # Database schema
├── .env.example                        # Environment template
├── svelte.config.js                    # SvelteKit config
├── tailwind.config.js                  # Tailwind config
├── vite.config.ts                      # Vite config
├── package.json                        # Dependencies
└── README.md                           # This file
```

</details>

---

## 🎨 Customization

### 🌈 Branding Colors

**Edit `tailwind.config.js`:**

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'haunt-orange': '#FC7403',  // Primary brand color
        'haunt-red': '#a41214',     // McCloud Manor theme
      }
    }
  }
}
```

### 🖼️ Visual Assets

<table>
<tr>
<th>Asset</th>
<th>Location</th>
<th>Purpose</th>
<th>Recommended Size</th>
</tr>
<tr>
<td><strong>Logo</strong></td>
<td><code>static/logo-url.png</code></td>
<td>Site logo in navigation</td>
<td>300x100px (transparent)</td>
</tr>
<tr>
<td><strong>Background</strong></td>
<td><code>static/bg.jpg</code></td>
<td>Homepage parallax hero</td>
<td>1920x1080px minimum</td>
</tr>
<tr>
<td><strong>Favicon</strong></td>
<td><code>static/favicon.png</code></td>
<td>Browser tab icon</td>
<td>32x32px or 64x64px</td>
</tr>
<tr>
<td><strong>Videos</strong></td>
<td><code>static/videos/</code></td>
<td>Background videos</td>
<td>MP4, optimized</td>
</tr>
</table>

### 🎭 Typography

- **System font stack** (no external fonts for speed)
- Reference to `Goudymedieval` font (can be added if needed)

---

## 🛍️ Shopify Integration

<details>
<summary><strong>Complete Shopify setup guide (Click to expand)</strong></summary>

### 1️⃣ Create a Shopify Store

If you don't have one, sign up at [shopify.com](https://shopify.com)

### 2️⃣ Get Storefront API Access

1. Go to **Apps → Develop apps** in your Shopify admin
2. Click **"Create an app"**
3. Name it "Haunt Junkies Website"
4. Go to **Configuration → Storefront API**
5. Enable these scopes:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
6. Click **"Save"**
7. Go to **API Credentials**
8. Copy the **Storefront API access token**

### 3️⃣ Add Credentials to `.env`

```env
PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxx
```

### 4️⃣ Configure Products

Edit `src/routes/shop/+page.svelte` to add your product IDs

</details>

---

## 💰 Cost Breakdown

<div align="center">

### 💸 Expected Monthly Costs

| Service | Free Tier | Usage Estimate | Actual Cost |
|:-------:|:---------:|:--------------:|:-----------:|
| **Supabase** | 500MB DB<br>1GB storage<br>2GB transfer | ~50MB DB<br>~200MB storage | **$0** ✅ |
| **Vercel** | 100GB bandwidth<br>Unlimited functions | ~5GB/month | **$0** ✅ |
| **Resend** | 3,000 emails/month | ~100/month | **$0** ✅ |
| **Shopify** | N/A | Optional | $29/mo ⚪ |

### 🎉 Total Cost: **$0/month** (without shop)

</div>

### When You'd Need to Pay

<table>
<tr>
<th>Service</th>
<th>Free Tier Limit</th>
<th>Paid Plan</th>
</tr>
<tr>
<td><strong>Supabase</strong></td>
<td>500MB DB, 1GB storage</td>
<td>Pro: $25/month (8GB DB, 100GB storage)</td>
</tr>
<tr>
<td><strong>Vercel</strong></td>
<td>100GB bandwidth/month</td>
<td>Pro: $20/month (1TB bandwidth)</td>
</tr>
<tr>
<td><strong>Resend</strong></td>
<td>3,000 emails/month</td>
<td>Pro: $20/month (50K emails)</td>
</tr>
</table>

💡 **Reality:** You'll stay free for years with typical haunted attraction traffic!

---

## 📚 Documentation

<div align="center">

### 📖 Available Guides

| Document | Purpose | Read Time |
|:---------|:--------|:---------:|
| [⚡ Quick Start](docs/QUICK_START.md) | Get running in 5 minutes | 5 min |
| [🔧 Local Development](docs/LOCAL_DEVELOPMENT.md) | Detailed setup guide | 15 min |
| [🚀 Deployment](docs/DEPLOYMENT.md) | Deploy to production | 20 min |
| [📊 Project Summary](docs/PROJECT_SUMMARY.md) | Architecture overview | 30 min |
| [🔐 Database Safety](DATABASE-SAFETY-MEASURES.md) | Security measures | 15 min |
| [⚠️ Remaining Work](REMAINING-WORK.md) | Known issues & TODOs | 10 min |

</div>

---

## 🔄 Migration from Old Site

To migrate data from the old Rails site:

<table>
<tr>
<th>Step</th>
<th>Action</th>
<th>Tools</th>
</tr>
<tr>
<td>1️⃣</td>
<td><strong>Export data</strong> from PostgreSQL</td>
<td><code>pg_dump</code></td>
</tr>
<tr>
<td>2️⃣</td>
<td><strong>Transform</strong> to match new schema</td>
<td>SQL scripts, custom tooling</td>
</tr>
<tr>
<td>3️⃣</td>
<td><strong>Import</strong> via Supabase SQL or API</td>
<td>Supabase SQL Editor</td>
</tr>
<tr>
<td>4️⃣</td>
<td><strong>Migrate images</strong> to Supabase Storage</td>
<td>Supabase Storage UI or API</td>
</tr>
</table>

---

## 🆘 Support

### Need Help?

<table>
<tr>
<th>Resource</th>
<th>Link</th>
</tr>
<tr>
<td>📖 <strong>SvelteKit Docs</strong></td>
<td><a href="https://kit.svelte.dev">kit.svelte.dev</a></td>
</tr>
<tr>
<td>📖 <strong>Supabase Docs</strong></td>
<td><a href="https://supabase.com/docs">supabase.com/docs</a></td>
</tr>
<tr>
<td>📖 <strong>Tailwind Docs</strong></td>
<td><a href="https://tailwindcss.com/docs">tailwindcss.com/docs</a></td>
</tr>
<tr>
<td>📖 <strong>Vercel Docs</strong></td>
<td><a href="https://vercel.com/docs">vercel.com/docs</a></td>
</tr>
<tr>
<td>💬 <strong>GitHub Issues</strong></td>
<td>Open an issue on your repository</td>
</tr>
</table>

### Community

- 💬 [SvelteKit Discord](https://svelte.dev/chat)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐦 [Tailwind Twitter](https://twitter.com/tailwindcss)

---

## 🎯 Performance

<div align="center">

### ⚡ Built-in Optimizations

| Optimization | Status | Benefit |
|:-------------|:------:|:--------|
| **Server-side rendering** | ✅ Enabled | Faster first paint |
| **Code splitting** | ✅ Automatic | Smaller bundles |
| **Lazy loading** | ✅ Images | Faster page loads |
| **Tailwind purging** | ✅ Production | Tiny CSS files |
| **Edge CDN** | ✅ Vercel | Global delivery |
| **Image optimization** | ✅ WebP | Reduced bandwidth |

### 🎯 Performance Targets

| Metric | Target | Expected |
|:-------|:------:|:--------:|
| **Lighthouse Score** | 90+ | 95+ |
| **First Contentful Paint** | <1.5s | ~1.2s |
| **Time to Interactive** | <3.0s | ~2.5s |

</div>

---

## 📄 License

**Private** - All rights reserved

---

<div align="center">

## 🎃 Built with Love by Haunt Junkies 🎃

*Bringing the thrills of haunted attractions to the web*

---

### Quick Links

[⚡ Quick Start](docs/QUICK_START.md) • [🔧 Setup](docs/LOCAL_DEVELOPMENT.md) • [🚀 Deploy](docs/DEPLOYMENT.md) • [📊 Tech Details](docs/PROJECT_SUMMARY.md)

---

**Last Updated:** October 23, 2025

**Made with** SvelteKit • Supabase • Tailwind CSS • TypeScript

</div>
