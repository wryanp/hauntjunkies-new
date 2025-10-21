import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Review, ReviewImage, ReviewComment } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Fetch review by slug
	const { data: review, error: reviewError } = await supabase
		.from('reviews')
		.select('*')
		.eq('slug', params.slug)
		.single();

	if (reviewError || !review) {
		throw error(404, 'Review not found');
	}

	// Fetch images for this review
	const { data: images } = await supabase
		.from('review_images')
		.select('*')
		.eq('review_id', review.id)
		.order('display_order', { ascending: true });

	// Fetch approved comments
	const { data: comments } = await supabase
		.from('review_comments')
		.select('*')
		.eq('review_id', review.id)
		.eq('approved', true)
		.order('created_at', { ascending: false });

	return {
		review: review as Review,
		images: (images as ReviewImage[]) || [],
		comments: (comments as ReviewComment[]) || []
	};
};

export const actions: Actions = {
	comment: async ({ request, params }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
		const formData = await request.formData();

		const author_name = formData.get('author_name')?.toString();
		const author_email = formData.get('author_email')?.toString();
		const comment_text = formData.get('comment_text')?.toString();

		if (!author_name || !author_email || !comment_text) {
			return fail(400, { error: 'All fields are required' });
		}

		// Get review ID from slug
		const { data: review } = await supabase
			.from('reviews')
			.select('id')
			.eq('slug', params.slug)
			.single();

		if (!review) {
			return fail(404, { error: 'Review not found' });
		}

		// Insert comment (unapproved by default)
		const { error: insertError } = await supabase
			.from('review_comments')
			.insert({
				review_id: review.id,
				author_name,
				author_email,
				comment_text,
				approved: false // Requires admin approval
			});

		if (insertError) {
			console.error('Error inserting comment:', insertError);
			return fail(500, { error: 'Failed to submit comment. Please try again.' });
		}

		return { success: true };
	}
};
