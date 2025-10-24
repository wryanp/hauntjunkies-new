import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return json({ error: 'Missing approval token' }, { status: 400 });
	}

	// Create Supabase client with service role for admin operations
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	// Find comment with this approval token
	const { data: comment, error: findError } = await supabase
		.from('review_comments')
		.select('id, approved, review_id, reviews(slug)')
		.eq('approval_token', token)
		.single();

	if (findError || !comment) {
		return json({ error: 'Invalid or expired approval token' }, { status: 404 });
	}

	// Check if already approved
	if (comment.approved) {
		return json({ message: 'Comment already approved' }, { status: 200 });
	}

	// Approve the comment and clear the token
	const { error: updateError } = await supabase
		.from('review_comments')
		.update({
			approved: true,
			approval_token: null // Clear token after use
		})
		.eq('id', comment.id);

	if (updateError) {
		console.error('Error approving comment:', updateError);
		return json({ error: 'Failed to approve comment' }, { status: 500 });
	}

	// Redirect to the review page with a success message
	const reviewSlug = (comment as any).reviews?.slug;
	if (reviewSlug) {
		throw redirect(302, `/reviews/${reviewSlug}?comment_approved=true`);
	}

	return json({ success: true, message: 'Comment approved successfully' });
};
