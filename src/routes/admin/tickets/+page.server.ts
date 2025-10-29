import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Helper function to verify admin authentication
async function verifyAdminAuth(cookies: any): Promise<boolean> {
	// Check Supabase session first
	const supabaseClient = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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

	const { data: { session } } = await supabaseClient.auth.getSession();
	if (session) return true;

	// Fallback to admin_session cookie
	const adminSession = cookies.get('admin_session');
	return !!adminSession;
}

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

	// Fetch all ticket requests with QR code scan status
	const { data: tickets, error } = await supabase
		.from('ticket_requests')
		.select(`
			*,
			ticket_qr_codes (
				used_at
			)
		`)
		.order('created_at', { ascending: false });

	return {
		tickets: tickets || []
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, cookies }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
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
			return fail(500, { error: 'Failed to update status: ' + updateError.message });
		}

		return {
			success: true,
			message: `Ticket marked as ${status}`
		};
	},

	delete: async ({ request, cookies }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
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
			return fail(500, { error: 'Failed to delete ticket: ' + deleteError.message });
		}

		return {
			success: true,
			message: 'Ticket request deleted successfully'
		};
	},

	bulkDelete: async ({ request, cookies }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const idsString = formData.get('ids')?.toString();

		if (!idsString) {
			return fail(400, { error: 'No ticket IDs provided' });
		}

		const ids = idsString.split(',').filter(id => id.trim().length > 0);

		if (ids.length === 0) {
			return fail(400, { error: 'No valid ticket IDs provided' });
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

		// Bulk delete using .in() query
		const { error: deleteError } = await supabase
			.from('ticket_requests')
			.delete()
			.in('id', ids);

		if (deleteError) {
			return fail(500, { error: 'Failed to delete tickets: ' + deleteError.message });
		}

		return {
			success: true,
			message: `${ids.length} ticket${ids.length === 1 ? '' : 's'} deleted successfully`
		};
	}
};
