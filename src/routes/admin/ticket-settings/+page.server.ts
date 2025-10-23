import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies }) => {
	// Use service_role key to bypass RLS and see all dates (including disabled ones)
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

	// Fetch all ticket dates (including disabled and past ones for management)
	const { data: dates } = await supabase
		.from('ticket_dates')
		.select('*')
		.order('date', { ascending: true });

	return {
		ticketDates: dates || []
	};
};

export const actions = {
	addDate: async ({ request, cookies }) => {
		// Use service_role key for admin operations to bypass RLS
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

		const formData = await request.formData();
		const date = formData.get('date') as string;
		const startTimeRaw = formData.get('startTime') as string;
		const endTimeRaw = formData.get('endTime') as string;
		const startTime = startTimeRaw?.trim() ? startTimeRaw : null;
		const endTime = endTimeRaw?.trim() ? endTimeRaw : null;
		const capacity = parseInt(formData.get('capacity') as string);
		const maxTicketsPerRequest = parseInt(formData.get('maxTicketsPerRequest') as string);
		const notesRaw = formData.get('notes') as string;
		const notes = notesRaw?.trim() ? notesRaw : null;

		if (!date || !capacity || !maxTicketsPerRequest) {
			return fail(400, { error: 'Date, capacity, and max tickets per request are required' });
		}

		// Check if date already exists
		const { data: existing } = await supabase
			.from('ticket_dates')
			.select('id')
			.eq('date', date)
			.maybeSingle();

		if (existing) {
			return fail(400, { error: 'This date already exists' });
		}

		const { error } = await supabase
			.from('ticket_dates')
			.insert({
				date,
				start_time: startTime,
				end_time: endTime,
				capacity,
				max_tickets_per_request: maxTicketsPerRequest,
				notes: notes,
				is_available: true
			});

		if (error) {
			console.error('Error adding date:', error);
			return fail(500, { error: 'Failed to add date' });
		}

		return { success: true, action: 'addDate' };
	},

	updateDate: async ({ request, cookies }) => {
		// Use service_role key for admin operations to bypass RLS
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

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const startTimeRaw = formData.get('startTime') as string;
		const endTimeRaw = formData.get('endTime') as string;
		const startTime = startTimeRaw?.trim() ? startTimeRaw : null;
		const endTime = endTimeRaw?.trim() ? endTimeRaw : null;
		const capacity = parseInt(formData.get('capacity') as string);
		const maxTicketsPerRequest = parseInt(formData.get('maxTicketsPerRequest') as string);
		const notesRaw = formData.get('notes') as string;
		const notes = notesRaw?.trim() ? notesRaw : null;
		const isAvailable = formData.get('isAvailable') === 'true';

		if (!id || !capacity || !maxTicketsPerRequest) {
			return fail(400, { error: 'Invalid data' });
		}

		const { error } = await supabase
			.from('ticket_dates')
			.update({
				start_time: startTime,
				end_time: endTime,
				capacity,
				max_tickets_per_request: maxTicketsPerRequest,
				notes: notes,
				is_available: isAvailable
			})
			.eq('id', id);

		if (error) {
			console.error('Error updating date:', error);
			return fail(500, { error: 'Failed to update date' });
		}

		return { success: true, action: 'updateDate' };
	},

	toggleAvailability: async ({ request, cookies }) => {
		// Use service_role key for admin operations to bypass RLS
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

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const isAvailable = formData.get('isAvailable') === 'true';

		const { error } = await supabase
			.from('ticket_dates')
			.update({ is_available: isAvailable })
			.eq('id', id);

		if (error) {
			console.error('Error toggling availability:', error);
			return fail(500, { error: 'Failed to update availability' });
		}

		return { success: true, action: 'toggleAvailability' };
	},

	deleteDate: async ({ request, cookies }) => {
		// Use service_role key for admin operations to bypass RLS
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

		const formData = await request.formData();
		const id = formData.get('id') as string;

		const { error } = await supabase
			.from('ticket_dates')
			.delete()
			.eq('id', id);

		if (error) {
			console.error('Error deleting date:', error);
			return fail(500, { error: 'Failed to delete date' });
		}

		return { success: true, action: 'deleteDate' };
	}
} satisfies Actions;
