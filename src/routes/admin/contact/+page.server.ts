import type { PageServerLoad, Actions } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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

	// Fetch all contact submissions, ordered by newest first
	const { data: submissions, error } = await supabase
		.from('contact_submissions')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		return {
			submissions: []
		};
	}

	return {
		submissions: submissions || []
	};
};

export const actions: Actions = {
	toggleRead: async ({ request, cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Missing message ID' });
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

		// Get current read status
		const { data: submission } = await supabase
			.from('contact_submissions')
			.select('read')
			.eq('id', id)
			.single();

		if (!submission) {
			return fail(404, { error: 'Message not found' });
		}

		// Toggle the read status
		const { error } = await supabase
			.from('contact_submissions')
			.update({ read: !submission.read })
			.eq('id', id);

		if (error) {
			return fail(500, { error: 'Failed to update message status' });
		}

		return { success: true, message: 'Message status updated' };
	},

	markAllRead: async ({ cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
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

		// Mark all unread messages as read
		const { error } = await supabase
			.from('contact_submissions')
			.update({ read: true })
			.eq('read', false);

		if (error) {
			return fail(500, { error: 'Failed to mark all messages as read' });
		}

		return { success: true, message: 'All messages marked as read' };
	},

	delete: async ({ request, cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Missing message ID' });
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

		const { error } = await supabase.from('contact_submissions').delete().eq('id', id);

		if (error) {
			return fail(500, { error: 'Failed to delete message' });
		}

		return { success: true, message: 'Message deleted successfully' };
	}
};
