import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Review } from '$lib/types';

export const load: PageServerLoad = async () => {
	// Handle missing Supabase credentials gracefully
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
	    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
	    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		return { reviews: [] };
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const { data: reviews, error } = await supabase
		.from('reviews')
		.select('*')
		.order('review_date', { ascending: false, nullsFirst: false })
		.order('created_at', { ascending: false }); // Fallback for reviews without review_date

	if (error) {
		return { reviews: [] };
	}

	return {
		reviews: (reviews as Review[]) || []
	};
};
