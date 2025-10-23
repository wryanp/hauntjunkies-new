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

	if (error) {
		console.error('Error fetching McCloud Manor info:', error);
	}

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

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const story = formData.get('story') as string;
		const dates = formData.get('dates') as string;
		const hours = formData.get('hours') as string;
		const pricing = formData.get('pricing') as string;
		const address = formData.get('address') as string;
		const videoUrl = formData.get('videoUrl') as string;

		// Get the single row ID
		const { data: existingInfo } = await supabase
			.from('mccloud_info')
			.select('id')
			.single();

		if (!existingInfo) {
			return fail(404, { error: 'McCloud Manor info not found' });
		}

		const { error } = await supabase
			.from('mccloud_info')
			.update({
				title,
				description,
				story,
				dates,
				hours,
				pricing,
				address,
				video_url: videoUrl,
				updated_at: new Date().toISOString()
			})
			.eq('id', existingInfo.id);

		if (error) {
			console.error('Error updating McCloud Manor info:', error);
			return fail(500, { error: 'Failed to update info' });
		}

		return { success: true, action: 'updateInfo' };
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
			console.error('Error deleting photo:', error);
			return fail(500, { error: 'Failed to delete photo' });
		}

		return { success: true, action: 'deletePhoto' };
	}
};
