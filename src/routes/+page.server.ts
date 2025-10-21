import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Review, HeroMessage } from '$lib/types';

export const load: PageServerLoad = async () => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Fetch active hero message
	const { data: heroMessages } = await supabase
		.from('hero_message')
		.select('*')
		.eq('is_active', true)
		.limit(1);

	const heroMessage = heroMessages?.[0] as HeroMessage | undefined;

	// Fetch featured reviews
	const { data: featuredReviews, error } = await supabase
		.from('reviews')
		.select('*')
		.eq('featured', true)
		.order('created_at', { ascending: false })
		.limit(6);

	if (error) {
		console.error('Error fetching featured reviews:', error);
		return {
			heroMessage,
			featuredReviews: []
		};
	}

	return {
		heroMessage,
		featuredReviews: (featuredReviews as Review[]) || []
	};
};
