import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

const SITE_URL = 'https://hauntjunkies.com';

export const GET: RequestHandler = async () => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Fetch all published reviews
	const { data: reviews } = await supabase
		.from('reviews')
		.select('slug, updated_at, created_at')
		.order('updated_at', { ascending: false});

	// Static pages with priorities and change frequencies
	const staticPages = [
		{ url: '', priority: '1.0', changefreq: 'weekly' }, // Homepage
		{ url: 'reviews', priority: '0.9', changefreq: 'daily' },
		{ url: 'mccloudmanor', priority: '0.8', changefreq: 'monthly' },
		{ url: 'tickets', priority: '0.7', changefreq: 'monthly' },
		{ url: 'contact', priority: '0.6', changefreq: 'monthly' },
		{ url: 'about', priority: '0.5', changefreq: 'yearly' }
	];

	// Build XML
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
	.map(
		(page) => `  <url>
    <loc>${SITE_URL}/${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
${
	reviews
		? reviews
				.map((review) => {
					const lastmod = review.updated_at || review.created_at;
					return `  <url>
    <loc>${SITE_URL}/reviews/${review.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
				})
				.join('\n')
		: ''
}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
		}
	});
};
