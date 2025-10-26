import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Review, HeroMessage, Quote, SiteSettings } from '$lib/types';
import { getMultiAwardWinners } from '$lib/utils/awards';
import { logDatabaseError } from '$lib/logger';

export const load: PageServerLoad = async () => {
	// Handle missing Supabase credentials gracefully
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
	    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
	    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		return {
			heroMessage: undefined,
			featuredReviews: [],
			quotes: [],
			showAwardsHero: false,
			multiAwardWinners: []
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
		.order('created_at', { ascending: false });

	// Log review fetch errors for monitoring
	if (error) {
		logDatabaseError('fetch featured reviews', error, { route: '/' });
	}

	// Fetch active quotes (always fetch quotes even if reviews fail)
	const { data: quotes, error: quotesError } = await supabase
		.from('quotes')
		.select('*')
		.eq('is_active', true)
		.order('display_order', { ascending: true });

	// Log quotes fetch errors
	if (quotesError) {
		logDatabaseError('fetch quotes', quotesError, { route: '/' });
	}

	// Fetch site settings for awards hero toggle
	const { data: awardsHeroSetting, error: settingsError } = await supabase
		.from('site_settings')
		.select('*')
		.eq('setting_key', 'show_awards_hero')
		.single();

	// Log settings fetch errors
	if (settingsError) {
		logDatabaseError('fetch site settings', settingsError, { route: '/' });
	}

	const showAwardsHero = awardsHeroSetting?.setting_value?.enabled ?? false;

	// Fetch all reviews to find multi-award winners (only if hero is enabled)
	let multiAwardWinners: Review[] = [];
	if (showAwardsHero) {
		const { data: allReviews, error: reviewsError } = await supabase
			.from('reviews')
			.select('*')
			.order('created_at', { ascending: false });

		if (!reviewsError && allReviews) {
			multiAwardWinners = getMultiAwardWinners(allReviews as Review[]);
		}
	}

	return {
		heroMessage,
		featuredReviews: (featuredReviews as Review[]) || [],
		quotes: (quotes as Quote[]) || [],
		showAwardsHero,
		multiAwardWinners
	};
};
