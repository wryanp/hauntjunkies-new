import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { McCloudInfo, McCloudPhoto } from '$lib/types';

export const load: PageServerLoad = async () => {
	// Handle missing Supabase credentials gracefully
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
	    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
	    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		console.warn('Supabase credentials not configured - returning empty data');
		return {
			info: null,
			photos: []
		};
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Fetch McCloud Manor info (single row)
	const { data: info } = await supabase
		.from('mccloud_info')
		.select('*')
		.single();

	// Fetch photos
	const { data: photos } = await supabase
		.from('mccloud_photos')
		.select('*')
		.order('display_order', { ascending: true});

	// Fetch available ticket dates
	const { data: ticketDates } = await supabase
		.from('ticket_dates')
		.select('*')
		.eq('is_available', true)
		.gte('date', new Date().toISOString().split('T')[0])
		.order('date', { ascending: true });

	return {
		info: info as McCloudInfo | null,
		photos: (photos as McCloudPhoto[]) || [],
		ticketDates: ticketDates || []
	};
};

export const actions: Actions = {
	requestTickets: async ({ request, cookies }) => {
		// Use service_role key to bypass RLS for ticket request submissions
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

		const name = formData.get('name')?.toString();
		const email = formData.get('email')?.toString();
		const phone = formData.get('phone')?.toString() || null;
		const quantity = parseInt(formData.get('quantity')?.toString() || '0');
		const preferred_date = formData.get('preferred_date')?.toString() || null;
		const message = formData.get('message')?.toString() || null;

		if (!name || !email || !quantity || quantity < 1) {
			return fail(400, { error: 'Please fill out all required fields' });
		}

		const { error: insertError } = await supabase
			.from('ticket_requests')
			.insert({
				name,
				email,
				phone,
				quantity,
				preferred_date,
				message,
				status: 'pending'
			});

		if (insertError) {
			console.error('Error inserting ticket request:', insertError);
			return fail(500, { error: 'Failed to submit request. Please try again.' });
		}

		return { success: true };
	}
};
