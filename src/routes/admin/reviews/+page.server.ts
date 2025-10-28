import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Review } from '$lib/types';

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

	// Fetch all reviews for the admin panel
	const { data: reviews, error: reviewsError } = await supabase
		.from('reviews')
		.select('*')
		.order('created_at', { ascending: false });

	// Silently handle review fetch errors - return empty array

	// Get awards hero setting
	const { data: awardsHeroSetting } = await supabase
		.from('site_settings')
		.select('*')
		.eq('setting_key', 'show_awards_hero')
		.single();

	// Fetch logos for all reviews
	const logos: Record<string, string> = {};
	if (reviews && reviews.length > 0) {
		const reviewIds = reviews.map(r => r.id);
		const { data: logoImages } = await supabase
			.from('review_images')
			.select('review_id, image_url')
			.eq('caption', 'Review Logo')
			.eq('display_order', 0)
			.in('review_id', reviewIds);

		if (logoImages) {
			logoImages.forEach((logo: any) => {
				logos[logo.review_id] = logo.image_url;
			});
		}
	}

	return {
		reviews: (reviews as Review[]) || [],
		showAwardsHero: awardsHeroSetting?.setting_value?.enabled ?? false,
		logos
	};
};

export const actions: Actions = {
	create: async ({ request, cookies, locals }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
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
		let zip = '';
		if (address) {
			const addressParts = address.split(',').map(p => p.trim());
			if (addressParts.length >= 2) {
				// Last part should contain "State ZIP"
				const lastPart = addressParts[addressParts.length - 1];
				// Extract state and ZIP (e.g., "CA 12345" or "CA")
				const stateZipMatch = lastPart.match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/i);
				if (stateZipMatch) {
					state = stateZipMatch[1].toUpperCase();
					zip = stateZipMatch[2] || '';
				}
				// Second to last part is the city
				city = addressParts[addressParts.length - 2];
			} else if (addressParts.length === 1) {
				// If only one part, try to extract state from it
				const stateMatch = addressParts[0].match(/([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/i);
				if (stateMatch) {
					state = stateMatch[1].toUpperCase();
					zip = stateMatch[2] || '';
				}
			}
		}

		// Extract year from review name (e.g., "Haunt Name 2024")
		const yearMatch = name?.match(/(\d{4})/);
		const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
		const review_text = formData.get('review_text')?.toString() || formData.get('description')?.toString() || '';
		const featured = formData.get('featured') === 'true';

		// Ratings
		const rating_overall = parseFloat(formData.get('rating_overall')?.toString() || '0');
		const rating_scares = parseFloat(formData.get('rating_scares')?.toString() || '0');
		const rating_atmosphere = parseFloat(formData.get('rating_atmosphere')?.toString() || '0');
		const rating_value = parseFloat(formData.get('rating_value')?.toString() || '0');

		// Social links
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
				zip,
				year,
				description,
				review_text,
				featured,
				rating_overall,
				rating_scares,
				rating_atmosphere,
				rating_value,
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
		if (!(await verifyAdminAuth(cookies))) {
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
		let zip = '';
		if (address) {
			const addressParts = address.split(',').map(p => p.trim());
			if (addressParts.length >= 2) {
				// Last part should contain "State ZIP"
				const lastPart = addressParts[addressParts.length - 1];
				// Extract state and ZIP (e.g., "CA 12345" or "CA")
				const stateZipMatch = lastPart.match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/i);
				if (stateZipMatch) {
					state = stateZipMatch[1].toUpperCase();
					zip = stateZipMatch[2] || '';
				}
				// Second to last part is the city
				city = addressParts[addressParts.length - 2];
			} else if (addressParts.length === 1) {
				// If only one part, try to extract state from it
				const stateMatch = addressParts[0].match(/([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/i);
				if (stateMatch) {
					state = stateMatch[1].toUpperCase();
					zip = stateMatch[2] || '';
				}
			}
		}

		// Extract year from review name (e.g., "Haunt Name 2024")
		const yearMatch = name?.match(/(\d{4})/);
		const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();

		const review_text = formData.get('review_text')?.toString() || formData.get('description')?.toString() || '';
		const featured = formData.get('featured') === 'true';

		const rating_overall = parseFloat(formData.get('rating_overall')?.toString() || '0');
		const rating_scares = parseFloat(formData.get('rating_scares')?.toString() || '0');
		const rating_atmosphere = parseFloat(formData.get('rating_atmosphere')?.toString() || '0');
		const rating_value = parseFloat(formData.get('rating_value')?.toString() || '0');

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
				zip,
				year,
				description,
				review_text,
				featured,
				rating_overall,
				rating_scares,
				rating_atmosphere,
				rating_value,
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
		if (!(await verifyAdminAuth(cookies))) {
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
			return fail(500, { error: 'Failed to delete review: ' + deleteError.message });
		}

		return {
			success: true,
			message: 'Review deleted successfully!'
		};
	},

	toggleFeatured: async ({ request, cookies }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
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
			return fail(500, { error: 'Failed to update featured status: ' + updateError.message });
		}

		return {
			success: true,
			message: `Review ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`
		};
	},

	updateAwards: async ({ request, cookies }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
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
			return fail(500, { error: 'Failed to update awards: ' + updateError.message });
		}

		return {
			success: true,
			message: 'Awards updated successfully!'
		};
	},

	toggleAwardsHero: async ({ cookies }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
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
			return fail(500, { error: 'Failed to update setting' });
		}

		return {
			success: true,
			showAwardsHero: !currentValue
		};
	},

	uploadLogo: async ({ request, cookies }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const logoFile = formData.get('logoFile') as File;

		if (!id) {
			return fail(400, { error: 'Review ID is required' });
		}

		if (!logoFile || logoFile.size === 0) {
			return fail(400, { error: 'Logo file is required' });
		}

		// Validate file type
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
		if (!allowedTypes.includes(logoFile.type)) {
			return fail(400, { error: 'Invalid file type. Only PNG, JPEG, JPG, and WEBP are allowed.' });
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024;
		if (logoFile.size > maxSize) {
			return fail(400, { error: 'File size too large. Maximum 10MB allowed.' });
		}

		// Use createClient with service role key to bypass RLS
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});

		// Get file extension
		const fileExt = logoFile.name.split('.').pop();
		const fileName = `logos/${id}.${fileExt}`;

		// Convert File to ArrayBuffer then to Uint8Array
		const arrayBuffer = await logoFile.arrayBuffer();
		const fileBuffer = new Uint8Array(arrayBuffer);

		// Delete old logo from storage if it exists
		const { data: existingLogo } = await supabase
			.from('review_images')
			.select('image_url')
			.eq('review_id', id)
			.eq('caption', 'Review Logo')
			.eq('display_order', 0)
			.single();

		if (existingLogo?.image_url) {
			// Extract filename from URL
			const urlParts = existingLogo.image_url.split('/');
			const oldFileName = urlParts[urlParts.length - 1];

			// Delete from storage (logos subfolder)
			await supabase.storage
				.from('review-images')
				.remove([`logos/${oldFileName}`]);

			// Delete from review_images table
			await supabase
				.from('review_images')
				.delete()
				.eq('review_id', id)
				.eq('caption', 'Review Logo')
				.eq('display_order', 0);
		}

		// Upload to Supabase Storage (review-images bucket, logos subfolder)
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from('review-images')
			.upload(fileName, fileBuffer, {
				contentType: logoFile.type,
				upsert: true
			});

		if (uploadError) {
			return fail(500, { error: 'Failed to upload logo: ' + uploadError.message });
		}

		// Get public URL
		const { data: { publicUrl } } = supabase.storage
			.from('review-images')
			.getPublicUrl(fileName);

		// Insert into review_images table
		const { error: insertError } = await supabase
			.from('review_images')
			.insert({
				review_id: id,
				image_url: publicUrl,
				caption: 'Review Logo',
				display_order: 0
			});

		if (insertError) {
			return fail(500, { error: 'Failed to save logo record: ' + insertError.message });
		}

		return {
			success: true,
			message: 'Logo uploaded successfully!'
		};
	},

	uploadSocialImage: async ({ request, cookies }) => {
		// Verify admin authentication
		if (!(await verifyAdminAuth(cookies))) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const socialImageFile = formData.get('socialImageFile') as File;

		if (!id) {
			return fail(400, { error: 'Review ID is required' });
		}

		if (!socialImageFile || socialImageFile.size === 0) {
			return fail(400, { error: 'Social image file is required' });
		}

		// Validate file type
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
		if (!allowedTypes.includes(socialImageFile.type)) {
			return fail(400, { error: 'Invalid file type. Only PNG, JPEG, JPG, and WEBP are allowed.' });
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024;
		if (socialImageFile.size > maxSize) {
			return fail(400, { error: 'File size too large. Maximum 10MB allowed.' });
		}

		// Use createClient with service role key to bypass RLS
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});

		// Get file extension
		const fileExt = socialImageFile.name.split('.').pop();
		const fileName = `social/${id}.${fileExt}`;

		// Convert File to ArrayBuffer then to Uint8Array
		const arrayBuffer = await socialImageFile.arrayBuffer();
		const fileBuffer = new Uint8Array(arrayBuffer);

		// Get current review to check if there's an existing social image
		const { data: currentReview } = await supabase
			.from('reviews')
			.select('review_image')
			.eq('id', id)
			.single();

		// Delete old image from storage if it exists
		if (currentReview?.review_image) {
			const urlParts = currentReview.review_image.split('/');
			const oldFileName = urlParts[urlParts.length - 1];

			await supabase.storage
				.from('review-images')
				.remove([`social/${oldFileName}`]);
		}

		// Upload to Supabase Storage (review-images bucket, social subfolder)
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from('review-images')
			.upload(fileName, fileBuffer, {
				contentType: socialImageFile.type,
				upsert: true
			});

		if (uploadError) {
			return fail(500, { error: 'Failed to upload social image: ' + uploadError.message });
		}

		// Get public URL
		const { data: { publicUrl } } = supabase.storage
			.from('review-images')
			.getPublicUrl(fileName);

		// Update review record with new social image URL
		const { error: updateError } = await supabase
			.from('reviews')
			.update({ review_image: publicUrl })
			.eq('id', id);

		if (updateError) {
			return fail(500, { error: 'Failed to save social image record: ' + updateError.message });
		}

		return {
			success: true,
			message: 'Social share image uploaded successfully!'
		};
	}
};
