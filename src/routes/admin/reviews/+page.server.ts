import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Review } from '$lib/types';

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

	// Fetch all reviews for the admin panel
	const { data: reviews, error: reviewsError } = await supabase
		.from('reviews')
		.select('*')
		.order('created_at', { ascending: false });

	if (reviewsError) {
		console.error('Error fetching reviews:', reviewsError);
	}

	// Get awards hero setting
	const { data: awardsHeroSetting } = await supabase
		.from('site_settings')
		.select('*')
		.eq('setting_key', 'show_awards_hero')
		.single();

	return {
		reviews: (reviews as Review[]) || [],
		showAwardsHero: awardsHeroSetting?.setting_value?.enabled ?? false
	};
};

export const actions: Actions = {
	create: async ({ request, cookies, locals }) => {
		// Note: Authentication is handled by layout, but we double-check here for actions
		// Actions don't go through parent() so we check cookies directly
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();

		// Extract and validate required fields
		const name = formData.get('name')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim();
		const caption = formData.get('caption')?.toString().trim() || '';
		const description = formData.get('description')?.toString().trim();
		const address = formData.get('address')?.toString().trim() || '';

		if (!name || !slug || !description) {
			return fail(400, { error: 'Name, slug, and description are required' });
		}

		// Parse city and state from address
		// Expected format: "Street, City, State ZIP" or "City, State ZIP"
		let city = '';
		let state = '';
		if (address) {
			const addressParts = address.split(',').map(p => p.trim());
			if (addressParts.length >= 2) {
				// Last part should contain "State ZIP"
				const lastPart = addressParts[addressParts.length - 1];
				// Extract state (first word/letters before ZIP)
				const stateMatch = lastPart.match(/^([A-Z]{2})/i);
				if (stateMatch) {
					state = stateMatch[1].toUpperCase();
				}
				// Second to last part is the city
				city = addressParts[addressParts.length - 2];
			} else if (addressParts.length === 1) {
				// If only one part, try to extract state from it
				const stateMatch = addressParts[0].match(/([A-Z]{2})\s*\d{5}/i);
				if (stateMatch) {
					state = stateMatch[1].toUpperCase();
				}
			}
		}

		// Extract other fields
		const year = new Date().getFullYear(); // Default to current year
		const review_text = formData.get('review_text')?.toString() || formData.get('description')?.toString() || '';
		const featured = formData.get('featured') === 'true';

		// Ratings
		const rating_overall = parseFloat(formData.get('rating_overall')?.toString() || '0');
		const rating_scares = parseFloat(formData.get('rating_scares')?.toString() || '0');
		const rating_atmosphere = parseFloat(formData.get('rating_atmosphere')?.toString() || '0');
		const rating_value = parseFloat(formData.get('rating_value')?.toString() || '0');

		// Images and social links
		const cover_image_url = formData.get('cover_image_url')?.toString() || '';
		const review_image = formData.get('review_image')?.toString() || '';
		const website_url = formData.get('website_url')?.toString() || '';
		const facebook_url = formData.get('facebook_url')?.toString() || '';
		const instagram_url = formData.get('instagram_url')?.toString() || '';
		const twitter_url = formData.get('twitter_url')?.toString() || '';
		const tiktok_url = formData.get('tiktok_url')?.toString() || '';
		const youtube_url = formData.get('youtube_url')?.toString() || '';

		// Create Supabase client with service role
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

		// Check if slug already exists
		const { data: existingReview } = await supabase
			.from('reviews')
			.select('id')
			.eq('slug', slug)
			.single();

		if (existingReview) {
			return fail(400, { error: 'A review with this slug already exists' });
		}

		// Insert review
		const { data: review, error: insertError } = await supabase
			.from('reviews')
			.insert({
				name,
				slug,
				caption,
				address,
				city,
				state,
				year,
				description,
				review_text,
				featured,
				rating_overall,
				rating_scares,
				rating_atmosphere,
				rating_value,
				cover_image_url,
				review_image,
				website_url,
				facebook_url,
				instagram_url,
				twitter_url,
				tiktok_url,
				youtube_url,
				view_count: 0
			})
			.select()
			.single();

		if (insertError) {
			console.error('Error creating review:', insertError);
			return fail(500, { error: 'Failed to create review: ' + insertError.message });
		}

		// Handle gallery images if provided
		const galleryImages = formData.get('gallery_images')?.toString();
		if (galleryImages && review) {
			try {
				const imageUrls = JSON.parse(galleryImages);
				if (Array.isArray(imageUrls) && imageUrls.length > 0) {
					const imagesToInsert = imageUrls
						.filter((url: string) => url.trim())
						.map((url: string, index: number) => ({
							review_id: review.id,
							image_url: url.trim(),
							display_order: index,
							caption: ''
						}));

					if (imagesToInsert.length > 0) {
						await supabase.from('review_images').insert(imagesToInsert);
					}
				}
			} catch (e) {
				console.error('Error parsing gallery images:', e);
				// Don't fail the whole operation if gallery images fail
			}
		}

		return {
			success: true,
			review,
			message: 'Review created successfully!'
		};
	},

	update: async ({ request, cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();

		// Get review ID
		const id = formData.get('id')?.toString();
		if (!id) {
			return fail(400, { error: 'Review ID is required' });
		}

		// Extract fields (same as create)
		const name = formData.get('name')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim();
		const caption = formData.get('caption')?.toString().trim() || '';
		const description = formData.get('description')?.toString().trim();
		const address = formData.get('address')?.toString().trim() || '';

		if (!name || !slug || !description) {
			return fail(400, { error: 'Name, slug, and description are required' });
		}

		// Parse city and state from address
		// Expected format: "Street, City, State ZIP" or "City, State ZIP"
		let city = '';
		let state = '';
		if (address) {
			const addressParts = address.split(',').map(p => p.trim());
			if (addressParts.length >= 2) {
				// Last part should contain "State ZIP"
				const lastPart = addressParts[addressParts.length - 1];
				// Extract state (first word/letters before ZIP)
				const stateMatch = lastPart.match(/^([A-Z]{2})/i);
				if (stateMatch) {
					state = stateMatch[1].toUpperCase();
				}
				// Second to last part is the city
				city = addressParts[addressParts.length - 2];
			} else if (addressParts.length === 1) {
				// If only one part, try to extract state from it
				const stateMatch = addressParts[0].match(/([A-Z]{2})\s*\d{5}/i);
				if (stateMatch) {
					state = stateMatch[1].toUpperCase();
				}
			}
		}
		const year = parseInt(formData.get('year')?.toString() || new Date().getFullYear().toString());
		const review_text = formData.get('review_text')?.toString() || formData.get('description')?.toString() || '';
		const featured = formData.get('featured') === 'true';

		const rating_overall = parseFloat(formData.get('rating_overall')?.toString() || '0');
		const rating_scares = parseFloat(formData.get('rating_scares')?.toString() || '0');
		const rating_atmosphere = parseFloat(formData.get('rating_atmosphere')?.toString() || '0');
		const rating_value = parseFloat(formData.get('rating_value')?.toString() || '0');

		const cover_image_url = formData.get('cover_image_url')?.toString() || '';
		const review_image = formData.get('review_image')?.toString() || '';
		const website_url = formData.get('website_url')?.toString() || '';
		const facebook_url = formData.get('facebook_url')?.toString() || '';
		const instagram_url = formData.get('instagram_url')?.toString() || '';
		const twitter_url = formData.get('twitter_url')?.toString() || '';
		const tiktok_url = formData.get('tiktok_url')?.toString() || '';
		const youtube_url = formData.get('youtube_url')?.toString() || '';

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

		// Update review
		const { data: review, error: updateError } = await supabase
			.from('reviews')
			.update({
				name,
				slug,
				caption,
				address,
				city,
				state,
				year,
				description,
				review_text,
				featured,
				rating_overall,
				rating_scares,
				rating_atmosphere,
				rating_value,
				cover_image_url,
				review_image,
				website_url,
				facebook_url,
				instagram_url,
				twitter_url,
				tiktok_url,
				youtube_url
			})
			.eq('id', id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating review:', updateError);
			return fail(500, { error: 'Failed to update review: ' + updateError.message });
		}

		// Handle gallery images if provided
		const galleryImages = formData.get('gallery_images')?.toString();
		if (galleryImages && review) {
			try {
				const imageUrls = JSON.parse(galleryImages);

				// First, delete existing gallery images for this review
				await supabase
					.from('review_images')
					.delete()
					.eq('review_id', id);

				// Then insert new ones
				if (Array.isArray(imageUrls) && imageUrls.length > 0) {
					const imagesToInsert = imageUrls
						.filter((url: string) => url.trim())
						.map((url: string, index: number) => ({
							review_id: id,
							image_url: url.trim(),
							display_order: index,
							caption: ''
						}));

					if (imagesToInsert.length > 0) {
						await supabase.from('review_images').insert(imagesToInsert);
					}
				}
			} catch (e) {
				console.error('Error updating gallery images:', e);
				// Don't fail the whole operation if gallery images fail
			}
		}

		return {
			success: true,
			review,
			message: 'Review updated successfully!'
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
			return fail(400, { error: 'Review ID is required' });
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

		// Delete review (cascade will delete related images and comments)
		const { error: deleteError } = await supabase
			.from('reviews')
			.delete()
			.eq('id', id);

		if (deleteError) {
			console.error('Error deleting review:', deleteError);
			return fail(500, { error: 'Failed to delete review: ' + deleteError.message });
		}

		return {
			success: true,
			message: 'Review deleted successfully!'
		};
	},

	toggleFeatured: async ({ request, cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const currentFeatured = formData.get('featured') === 'true';

		if (!id) {
			return fail(400, { error: 'Review ID is required' });
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

		// Toggle featured status
		const { error: updateError } = await supabase
			.from('reviews')
			.update({ featured: !currentFeatured })
			.eq('id', id);

		if (updateError) {
			console.error('Error toggling featured status:', updateError);
			return fail(500, { error: 'Failed to update featured status: ' + updateError.message });
		}

		return {
			success: true,
			message: `Review ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`
		};
	},

	updateAwards: async ({ request, cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Review ID is required' });
		}

		// Parse award years (null or year value)
		const parseAwardYear = (value: string | null): number | null => {
			if (!value || value === '') return null;
			const year = parseInt(value);
			return isNaN(year) ? null : year;
		};

		const award_best_actors_year = parseAwardYear(formData.get('award_best_actors_year')?.toString() || '');
		const award_best_makeup_year = parseAwardYear(formData.get('award_best_makeup_year')?.toString() || '');
		const award_best_set_design_year = parseAwardYear(formData.get('award_best_set_design_year')?.toString() || '');
		const award_best_story_year = parseAwardYear(formData.get('award_best_story_year')?.toString() || '');
		const award_scariest_year = parseAwardYear(formData.get('award_scariest_year')?.toString() || '');
		const award_best_overall_year = parseAwardYear(formData.get('award_best_overall_year')?.toString() || '');

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

		// Update award fields
		const { error: updateError } = await supabase
			.from('reviews')
			.update({
				award_best_actors_year,
				award_best_makeup_year,
				award_best_set_design_year,
				award_best_story_year,
				award_scariest_year,
				award_best_overall_year
			})
			.eq('id', id);

		if (updateError) {
			console.error('Error updating awards:', updateError);
			return fail(500, { error: 'Failed to update awards: ' + updateError.message });
		}

		return {
			success: true,
			message: 'Awards updated successfully!'
		};
	},

	toggleAwardsHero: async ({ cookies }) => {
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

		// Get current setting
		const { data: currentSetting } = await supabase
			.from('site_settings')
			.select('*')
			.eq('setting_key', 'show_awards_hero')
			.single();

		const currentValue = currentSetting?.setting_value?.enabled ?? false;

		// Update setting
		const { error } = await supabase
			.from('site_settings')
			.update({
				setting_value: { enabled: !currentValue }
			})
			.eq('setting_key', 'show_awards_hero');

		if (error) {
			console.error('Error toggling awards hero:', error);
			return fail(500, { error: 'Failed to update setting' });
		}

		return {
			success: true,
			showAwardsHero: !currentValue
		};
	}
};
