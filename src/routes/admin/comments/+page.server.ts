import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, parent }) => {
	// Get authentication from layout
	const { session } = await parent();
	if (!session) {
		throw redirect(302, '/admin/login');
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

	// Fetch all comments with review information
	const { data: comments, error: commentsError } = await supabase
		.from('review_comments')
		.select(`
			*,
			review:reviews (
				name,
				slug
			)
		`)
		.order('created_at', { ascending: false });

	// Silently handle comments fetch errors

	// Transform data to match expected format
	const transformedComments = (comments || []).map(comment => ({
		id: comment.id,
		reviewTitle: comment.review?.name || 'Unknown Review',
		reviewSlug: comment.review?.slug || '',
		name: comment.author_name,
		email: comment.author_email,
		comment: comment.comment_text,
		approved: comment.approved,
		created_at: comment.created_at
	}));

	return {
		comments: transformedComments
	};
};

export const actions: Actions = {
	toggleApproval: async ({ request, cookies }) => {
		// Verify admin authentication - check for both Supabase session and admin_session cookie
		const supabaseAuth = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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

		const { data: { session } } = await supabaseAuth.auth.getSession();
		const adminSession = cookies.get('admin_session');

		if (!session && !adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const currentApproved = formData.get('approved') === 'true';

		if (!id) {
			return fail(400, { error: 'Comment ID is required' });
		}

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

		// Toggle the approval status
		const { error: updateError } = await supabase
			.from('review_comments')
			.update({ approved: !currentApproved })
			.eq('id', id);

		if (updateError) {
			return fail(500, { error: 'Failed to update comment: ' + updateError.message });
		}

		return {
			success: true,
			message: currentApproved ? 'Comment unapproved' : 'Comment approved'
		};
	},

	delete: async ({ request, cookies }) => {
		// Verify admin authentication - check for both Supabase session and admin_session cookie
		const supabaseAuth = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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

		const { data: { session } } = await supabaseAuth.auth.getSession();
		const adminSession = cookies.get('admin_session');

		if (!session && !adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Comment ID is required' });
		}

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

		// Delete comment
		const { error: deleteError } = await supabase
			.from('review_comments')
			.delete()
			.eq('id', id);

		if (deleteError) {
			return fail(500, { error: 'Failed to delete comment: ' + deleteError.message });
		}

		return {
			success: true,
			message: 'Comment deleted successfully'
		};
	}
};
