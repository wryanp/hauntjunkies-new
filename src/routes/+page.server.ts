import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Review, HeroMessage } from '$lib/types';

export const load: PageServerLoad = async () => {
	// Handle missing Supabase credentials gracefully
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
	    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
	    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		console.warn('Supabase credentials not configured - returning empty data');
		return {
			heroMessage: undefined,
			featuredReviews: []
		};
	}

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
