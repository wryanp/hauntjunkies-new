import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';
import type { Review } from '$lib/types';

const baseUrl = 'https://hauntjunkies.com'; // Update with your actual domain

export const GET: RequestHandler = async () => {
	// Initialize Supabase client
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Fetch all published reviews
	const { data: reviews } = await supabase
		.from('reviews')
		.select('slug, updated_at, created_at')
		.order('updated_at', { ascending: false });

	const reviewsData = (reviews as Review[]) || [];

	// Generate sitemap XML
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<!-- Homepage -->
	<url>
		<loc>${baseUrl}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>

	<!-- Reviews Listing -->
	<url>
		<loc>${baseUrl}/reviews</loc>
		<changefreq>daily</changefreq>
		<priority>0.9</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>

	<!-- McCloud Manor -->
	<url>
		<loc>${baseUrl}/haunt</loc>
		<changefreq>weekly</changefreq>
		<priority>0.9</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>

	<!-- Tickets -->
	<url>
		<loc>${baseUrl}/tickets</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>

	<!-- About -->
	<url>
		<loc>${baseUrl}/about</loc>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>

	<!-- Contact -->
	<url>
		<loc>${baseUrl}/contact</loc>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>

	<!-- Individual Review Pages -->
	${reviewsData
		.map(
			(review) => `	<url>
		<loc>${baseUrl}/reviews/${review.slug}</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
		<lastmod>${review.updated_at || review.created_at || new Date().toISOString()}</lastmod>
	</url>`
		)
		.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600, s-maxage=3600' // Cache for 1 hour
		}
	});
};
