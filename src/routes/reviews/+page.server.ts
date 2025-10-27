import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Review, ReviewImage } from '$lib/types';

export const load: PageServerLoad = async () => {
	// Handle missing Supabase credentials gracefully
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
	    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
	    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		return { reviews: [], logos: {} };
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const { data: reviews, error } = await supabase
		.from('reviews')
		.select('*')
		.order('review_date', { ascending: false, nullsFirst: false })
		.order('created_at', { ascending: false }); // Fallback for reviews without review_date

	if (error) {
		return { reviews: [], logos: {} };
	}

	// Fetch logo images for all reviews (where caption = "Review Logo" and display_order = 0)
	const { data: logoImages } = await supabase
		.from('review_images')
		.select('review_id, image_url')
		.eq('caption', 'Review Logo')
		.eq('display_order', 0);

	// Create a map of review_id -> logo URL for quick lookup
	const logos: Record<string, string> = {};
	if (logoImages) {
		logoImages.forEach((logo: ReviewImage) => {
			logos[logo.review_id] = logo.image_url;
		});
	}

	return {
		reviews: (reviews as Review[]) || [],
		logos
	};
};
