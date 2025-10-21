import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Review } from '$lib/types';

export const load: PageServerLoad = async () => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const { data: reviews, error } = await supabase
		.from('reviews')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching reviews:', error);
		return { reviews: [] };
	}

	return {
		reviews: (reviews as Review[]) || []
	};
};
