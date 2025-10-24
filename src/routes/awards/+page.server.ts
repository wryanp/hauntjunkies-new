import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Review } from '$lib/types';
import { getAwardWinners, groupReviewsByAwardYear } from '$lib/utils/awards';

export const load: PageServerLoad = async () => {
	// Handle missing Supabase credentials gracefully
	if (
		!PUBLIC_SUPABASE_URL ||
		!PUBLIC_SUPABASE_ANON_KEY ||
		PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
		PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key'
	) {
		console.warn('Supabase credentials not configured - returning empty data');
		return {
			awardWinners: [],
			awardYears: []
		};
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Fetch all reviews with awards
	const { data: allReviews, error } = await supabase
		.from('reviews')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching reviews for awards page:', error);
		return {
			awardWinners: [],
			awardYears: []
		};
	}

	// Filter to only award winners
	const awardWinners = getAwardWinners((allReviews as Review[]) || []);

	// Group by year
	const groupedByYear = groupReviewsByAwardYear(awardWinners);

	// Get sorted years (newest first)
	const awardYears = Array.from(groupedByYear.keys()).sort((a, b) => b - a);

	return {
		awardWinners,
		awardYears,
		groupedByYear: Object.fromEntries(groupedByYear)
	};
};
