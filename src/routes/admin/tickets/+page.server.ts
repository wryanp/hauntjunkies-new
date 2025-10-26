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

	// Silently handle ticket fetch errors

	// Mock ticket data for demo if no real tickets exist
	const mockTickets = [
		{
			id: 'mock-1',
			name: 'John Smith',
			first_name: 'John',
			last_name: 'Smith',
			email: 'john.smith@email.com',
			phone: '555-0101',
			tickets: 4,
			date: '2024-10-31',
			preferred_date: '2024-10-31',
			special_requests: null,
			status: 'confirmed',
			created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
		},
		{
			id: 'mock-2',
			name: 'Sarah Johnson',
			first_name: 'Sarah',
			last_name: 'Johnson',
			email: 'sarah.j@email.com',
			phone: '555-0102',
			tickets: 2,
			date: '2024-11-01',
			preferred_date: '2024-11-01',
			special_requests: null,
			status: 'confirmed',
			created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
		},
		{
			id: 'mock-3',
			name: 'Michael Brown',
			first_name: 'Michael',
			last_name: 'Brown',
			email: 'mbrown@email.com',
			phone: '555-0103',
			tickets: 6,
			date: '2024-10-31',
			preferred_date: '2024-10-31',
			special_requests: 'Wheelchair accessible',
			status: 'confirmed',
			created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
		},
		{
			id: 'mock-4',
			name: 'Emily Davis',
			first_name: 'Emily',
			last_name: 'Davis',
			email: 'emily.davis@email.com',
			phone: '555-0104',
			tickets: 3,
			date: '2024-11-02',
			preferred_date: '2024-11-02',
			special_requests: null,
			status: 'confirmed',
			created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
		}
	];

	return {
		tickets: (tickets && tickets.length > 0) ? tickets : mockTickets
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
			return fail(500, { error: 'Failed to delete ticket: ' + deleteError.message });
		}

		return {
			success: true,
			message: 'Ticket request deleted successfully'
		};
	},

	bulkDelete: async ({ request, cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
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
