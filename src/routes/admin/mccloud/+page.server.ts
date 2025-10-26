import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies }) => {
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

	// Fetch McCloud Manor info (single row)
	const { data: info, error } = await supabase
		.from('mccloud_info')
		.select('*')
		.single();

	// Silently handle fetch errors

	// Fetch McCloud Manor photos
	const { data: photos } = await supabase
		.from('mccloud_photos')
		.select('*')
		.order('display_order', { ascending: true });

	return {
		info: info || null,
		photos: photos || []
	};
};

export const actions: Actions = {
	updateInfo: async ({ request, cookies }) => {
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

		// Note: This action is currently not used since the form was removed.
		// The story is hardcoded in the frontend and other fields (title, dates, hours, etc.)
		// should be managed through the database directly or a more complete admin form.
		return fail(404, { error: 'This action is not currently implemented. Manage fields through database.' });
	},

	deletePhoto: async ({ request, cookies }) => {
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
		const photoId = formData.get('photoId') as string;

		const { error } = await supabase
			.from('mccloud_photos')
			.delete()
			.eq('id', photoId);

		if (error) {
			return fail(500, { error: 'Failed to delete photo' });
		}

		return { success: true, action: 'deletePhoto' };
	}
};
