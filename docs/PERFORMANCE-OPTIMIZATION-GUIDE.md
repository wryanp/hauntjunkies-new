# 🚀 Performance Optimization Guide - Haunt Junkies

**Date Created**: October 25, 2025
**Status**: Recommendations for future implementation

This document outlines additional performance optimizations that can be implemented to further improve your site's Core Web Vitals and user experience.

---

## ✅ ALREADY IMPLEMENTED

Great news! The following performance optimizations are **already in place**:

1. **✅ Lazy Loading** - All images below the fold use `loading="lazy"`
2. **✅ Resource Hints** - DNS-prefetch and preconnect for external domains
3. **✅ Structured Data** - JSON-LD for reviews, organization, and item lists
4. **✅ Accessibility** - Alt text added to all images
5. **✅ Async Scripts** - Google Analytics loads asynchronously
6. **✅ Code Splitting** - SvelteKit automatically splits code by route
7. **✅ Minification** - Production builds are minified

---

## 🖼️ IMAGE OPTIMIZATION (HIGH IMPACT)

### Current State
- Images are served as-is from Supabase Storage
- Some images are 2-3MB in size
- No WebP format or responsive images

### Recommended Implementation

#### Option 1: Use Cloudflare Images (Easiest)
If your site is behind Cloudflare, enable [Cloudflare Images](https://www.cloudflare.com/products/cloudflare-images/):
- Automatic WebP/AVIF conversion
- Automatic resizing based on device
- Global CDN delivery
- ~$5/month for 100k images

#### Option 2: Manual Optimization (Free)
Use [sharp](https://sharp.pixelplug.io/) to optimize images during upload:

```bash
npm install sharp
```

```javascript
// Example: Optimize on upload
import sharp from 'sharp';

async function optimizeImage(buffer) {
  return await sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}
```

#### Option 3: Use a CDN Service
Services like [Imgix](https://imgix.com/) or [Cloudinary](https://cloudinary.com/) offer:
- Automatic optimization
- URL-based resizing
- Format negotiation
- Free tiers available

### Implementation Steps

1. **Compress Existing Images**
   ```bash
   npm install -g sharp-cli
   sharp -i input.jpg -o output.jpg -q 80 -f webp
   ```

2. **Add Responsive Images**
   ```svelte
   <img
     srcset="
       image-400.webp 400w,
       image-800.webp 800w,
       image-1200.webp 1200w
     "
     sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
     src="image-800.webp"
     alt="Haunted house"
     loading="lazy"
   />
   ```

3. **Use Picture Element for Art Direction**
   ```svelte
   <picture>
     <source srcset="image.avif" type="image/avif" />
     <source srcset="image.webp" type="image/webp" />
     <img src="image.jpg" alt="Haunted house" loading="lazy" />
   </picture>
   ```

### Expected Impact
- **50-70% smaller file sizes** with WebP
- **1-2 second faster page load** on mobile
- **Better Core Web Vitals** (LCP improvement)

**Time Estimate**: 4-6 hours initial setup + ongoing compression

---

## 📴 SERVICE WORKER FOR OFFLINE SUPPORT (NICE TO HAVE)

### What It Does
- Caches static assets for offline viewing
- Faster repeat visits
- Progressive Web App (PWA) capabilities

### Implementation with Workbox

1. **Install Dependencies**
   ```bash
   npm install -D @vite-pwa/sveltekit
   ```

2. **Update svelte.config.js**
   ```javascript
   import { sveltekit } from '@sveltejs/kit/vite';
   import { SvelteKitPWA } from '@vite-pwa/sveltekit';

   export default {
     plugins: [
       sveltekit(),
       SvelteKitPWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'Haunt Junkies',
           short_name: 'Haunt Junkies',
           theme_color: '#FC7403',
           icons: [
             {
               src: '/icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             },
             {
               src: '/icon-512.png',
               sizes: '512x512',
               type: 'image/png'
             }
           ]
         },
         workbox: {
           runtimeCaching: [
             {
               urlPattern: /^https:\/\/.*\.supabase\.co\/.*/,
               handler: 'NetworkFirst',
               options: {
                 cacheName: 'supabase-cache',
                 expiration: {
                   maxEntries: 50,
                   maxAgeSeconds: 60 * 60 * 24 // 24 hours
                 }
               }
             },
             {
               urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
               handler: 'CacheFirst',
               options: {
                 cacheName: 'images-cache',
                 expiration: {
                   maxEntries: 100,
                   maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                 }
               }
             }
           ]
         }
       })
     ]
   };
   ```

3. **Generate PWA Icons**
   Use [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):
   ```bash
   npx pwa-asset-generator static/favicon.png static/icons --icon-only
   ```

### Expected Impact
- **Instant loading** on repeat visits
- **Works offline** (basic functionality)
- **Better perceived performance**

**Time Estimate**: 3-4 hours

---

## ⚡ ADDITIONAL OPTIMIZATIONS

### 1. Font Optimization
Currently, the site uses system fonts (no web fonts). If you add custom fonts in the future:

```css
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/yourfont.woff2') format('woff2');
  font-display: swap; /* Prevents invisible text */
  font-weight: 400;
}
```

### 2. Defer Non-Critical CSS
For very large CSS files, consider inlining critical CSS:

```svelte
<!-- src/routes/+layout.svelte -->
<svelte:head>
  <style>
    /* Critical CSS for above-the-fold content */
    .hero { /* ... */ }
  </style>
  <link rel="stylesheet" href="/app.css" media="print" onload="this.media='all'">
</svelte:head>
```

### 3. Preload Critical Assets
Add to `src/app.html`:

```html
<link rel="preload" href="/logo-url.png" as="image" />
<link rel="preload" href="/bg.jpg" as="image" />
```

### 4. Reduce Third-Party Scripts
Consider alternatives:
- **Google Analytics** → [Plausible Analytics](https://plausible.io/) (lighter, privacy-focused)
- **Self-host** Turnstile CAPTCHA challenges if possible

### 5. Database Query Optimization
Already well-optimized, but consider:
- Adding indexes on frequently queried columns
- Using Supabase Edge Functions for complex queries
- Implementing pagination for large result sets

---

## 📊 MEASURING PERFORMANCE

### Tools to Use

1. **[Google PageSpeed Insights](https://pagespeed.web.dev/)**
   - Run monthly to track Core Web Vitals
   - Target: 90+ score for both mobile and desktop

2. **[GTmetrix](https://gtmetrix.com/)**
   - Detailed waterfall analysis
   - Provides specific recommendations

3. **[WebPageTest](https://www.webpagetest.org/)**
   - Test from different locations
   - Filmstrip view shows loading progression

4. **Lighthouse (Chrome DevTools)**
   ```
   1. Open Chrome DevTools (F12)
   2. Go to Lighthouse tab
   3. Select "Mobile" or "Desktop"
   4. Click "Generate report"
   ```

### Key Metrics to Track

| Metric | Current Target | Goal |
|--------|----------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 1.5s |
| **FID** (First Input Delay) | < 100ms | < 50ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.05 |
| **Speed Index** | < 3.4s | < 2s |
| **Time to Interactive** | < 3.8s | < 2.5s |

---

## 🎯 PRIORITY ROADMAP

### Phase 1: High Impact, Low Effort (Do First)
- ✅ **DONE**: Lazy loading
- ✅ **DONE**: Resource hints
- ✅ **DONE**: Structured data
- 🔜 **Next**: Compress existing images (2-3 hours)

### Phase 2: Medium Impact, Medium Effort
- 🔜 Implement responsive images with srcset (4-6 hours)
- 🔜 Convert images to WebP format (2-3 hours)
- 🔜 Add preload hints for hero images (1 hour)

### Phase 3: Nice to Have
- 🔜 Service worker for offline support (3-4 hours)
- 🔜 Consider lighter analytics alternative (1-2 hours)

---

## 🛠️ QUICK WINS (< 1 hour each)

1. **Enable GZIP/Brotli Compression** - Usually automatic on Vercel
2. **Add viewport meta tag** - Already done ✅
3. **Minimize redirects** - Check with Redirect Mapper tool
4. **Enable HTTP/2** - Automatic on Vercel ✅
5. **Use CDN for static assets** - Already using Supabase Storage ✅

---

## 📝 BEFORE & AFTER TRACKING

Use this template to track improvements:

```
Date: _________________
Tool: PageSpeed Insights

Before Optimization:
- Performance Score: ___/100
- LCP: ___s
- FID: ___ms
- CLS: ___

Changes Made:
1. _______________________
2. _______________________

After Optimization:
- Performance Score: ___/100
- LCP: ___s
- FID: ___ms
- CLS: ___
```

---

## 🎃 SUMMARY

You've already implemented **5 out of 8** high-priority performance optimizations:

✅ Lazy loading
✅ Resource hints
✅ Structured data
✅ Alt text for accessibility
✅ Async JavaScript

**Remaining recommendations are optional** and can be implemented incrementally as you have time. The biggest impact will come from image optimization.

**Next Steps**:
1. Compress existing images (biggest impact)
2. Add responsive images with srcset
3. Consider service worker (nice to have)

---

**Questions?** Check out these resources:
- [Web.dev Performance Guide](https://web.dev/performance/)
- [SvelteKit Performance](https://kit.svelte.dev/docs/performance)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
