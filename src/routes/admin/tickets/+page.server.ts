import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
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

	// Fetch all ticket requests
	const { data: tickets, error } = await supabase
		.from('ticket_requests')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching ticket requests:', error);
	}

	return {
		tickets: tickets || []
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const status = formData.get('status')?.toString();

		if (!id || !status) {
			return fail(400, { error: 'Missing required fields' });
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

		const { error: updateError } = await supabase
			.from('ticket_requests')
			.update({ status })
			.eq('id', id);

		if (updateError) {
			console.error('Error updating ticket status:', updateError);
			return fail(500, { error: 'Failed to update status: ' + updateError.message });
		}

		return {
			success: true,
			message: `Ticket marked as ${status}`
		};
	},

	delete: async ({ request, cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Ticket ID is required' });
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

		const { error: deleteError } = await supabase
			.from('ticket_requests')
			.delete()
			.eq('id', id);

		if (deleteError) {
			console.error('Error deleting ticket:', deleteError);
			return fail(500, { error: 'Failed to delete ticket: ' + deleteError.message });
		}

		return {
			success: true,
			message: 'Ticket request deleted successfully'
		};
	}
};
