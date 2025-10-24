<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { createClient } from '@supabase/supabase-js';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Create Supabase client for fetching gallery images
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	let editingReview = $state<string | null>(null); // Track ID of review being edited
	let reviewData = $state({
		title: '',
		slug: '',
		caption: '',
		description: '',
		coverImage: '',
		reviewImage: '',
		overallRating: 5,
		scareRating: 5,
		atmosphereRating: 5,
		actorRating: 5,
		valueRating: 5,
		socialLinks: {
			facebook: '',
			instagram: '',
			tiktok: '',
			website: '',
			youtube: ''
		},
		address: ''
	});

	let submitting = $state(false);
	let showSuccess = $state(false);
	let showDeleteConfirm = $state<string | null>(null); // Track review ID for delete confirmation
	let togglingFeatured = $state<string | null>(null); // Track which review is being toggled

	function generateSlug() {
		reviewData.slug = reviewData.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	// Load review data into form for editing
	async function editReview(review: any) {
		editingReview = review.id;

		reviewData = {
			title: review.name || '',
			slug: review.slug || '',
			caption: review.caption || '',
			description: review.description || review.review_text || '',
			coverImage: review.cover_image_url || '',
			reviewImage: review.review_image || '',
			overallRating: review.rating_overall || 5,
			scareRating: review.rating_scares || 5,
			atmosphereRating: review.rating_atmosphere || 5,
			actorRating: review.rating_actors || 5,
			valueRating: review.rating_value || 5,
			socialLinks: {
				facebook: review.facebook_url || '',
				instagram: review.instagram_url || '',
				tiktok: review.twitter_url || '',
				website: review.website_url || '',
				youtube: review.youtube_url || ''
			},
			address: review.address || ''
		};

		// Scroll to top of form
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Cancel editing and reset form
	function cancelEdit() {
		editingReview = null;
		reviewData = {
			title: '',
			slug: '',
			caption: '',
			description: '',
			coverImage: '',
			reviewImage: '',
			overallRating: 5,
			scareRating: 5,
			atmosphereRating: 5,
			actorRating: 5,
			valueRating: 5,
			socialLinks: {
				facebook: '',
				instagram: '',
				tiktok: '',
				website: '',
				youtube: ''
			},
			address: ''
		};
	}

	// Show success message when form succeeds
	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			// Reset form and editing state after successful submission
			editingReview = null;
			reviewData = {
				title: '',
				slug: '',
				caption: '',
				description: '',
				coverImage: '',
				reviewImage: '',
				overallRating: 5,
				scareRating: 5,
				atmosphereRating: 5,
				actorRating: 5,
				valueRating: 5,
				socialLinks: {
					facebook: '',
					instagram: '',
					tiktok: '',
					website: ''
				},
				address: ''
			};

			// Hide success message after 5 seconds
			setTimeout(() => {
				showSuccess = false;
			}, 5000);
		}
	});

	// Check for edit parameter in URL and auto-load review
	onMount(async () => {
		const editId = $page.url.searchParams.get('edit');
		if (editId) {
			const reviewToEdit = data.reviews.find(r => r.id === editId);
			if (reviewToEdit) {
				await editReview(reviewToEdit);
			}
		}
	});
</script>

<svelte:head>
	<title>{editingReview ? 'Edit Review' : 'Add New Review'} - Admin Dashboard</title>
</svelte:head>

<div>
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-white mb-2">
			{editingReview ? 'Edit Review' : 'Add New Review'}
		</h1>
		<p class="text-gray-400">
			{editingReview ? 'Update an existing haunted attraction review' : 'Create a new haunted attraction review'}
		</p>
	</div>

	<!-- Success Message -->
	{#if showSuccess || form?.success}
		<div class="mb-6 bg-green-900/50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
			<svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<div>
				<h3 class="text-green-400 font-bold">Success!</h3>
				<p class="text-green-300 text-sm">{form?.message || 'Action completed successfully.'}</p>
			</div>
		</div>
	{/if}

	<!-- Error Message -->
	{#if form?.error}
		<div class="mb-6 bg-red-900/50 border-2 border-red-500 rounded-lg p-4 flex items-center gap-3">
			<svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<div>
				<h3 class="text-red-400 font-bold">Error</h3>
				<p class="text-red-300 text-sm">{form.error}</p>
			</div>
		</div>
	{/if}

	<!-- Form -->
	<form method="POST" action={editingReview ? '?/update' : '?/create'} use:enhance={() => {
		submitting = true;
		const isEditing = !!editingReview;
		const slug = reviewData.slug;

		return async ({ result, update }) => {
			await update();
			submitting = false;

			// Scroll to top to show success/error message
			window.scrollTo({ top: 0, behavior: 'smooth' });

			// If update was successful and we're editing, redirect to the review page
			if (result.type === 'success' && isEditing && slug) {
				setTimeout(() => {
					goto(`/reviews/${slug}`);
				}, 1000); // Small delay to show success message
			}
		};
	}} class="space-y-8">

		<!-- Hidden inputs for form data -->
		{#if editingReview}
			<input type="hidden" name="id" value={editingReview} />
		{/if}
		<input type="hidden" name="name" value={reviewData.title} />
		<input type="hidden" name="slug" value={reviewData.slug} />
		<input type="hidden" name="caption" value={reviewData.caption} />
		<input type="hidden" name="description" value={reviewData.description} />
		<input type="hidden" name="review_text" value={reviewData.description} />
		<input type="hidden" name="cover_image_url" value={reviewData.coverImage} />
		<input type="hidden" name="review_image" value={reviewData.reviewImage} />
		<input type="hidden" name="rating_overall" value={reviewData.overallRating} />
		<input type="hidden" name="rating_scares" value={reviewData.scareRating} />
		<input type="hidden" name="rating_atmosphere" value={reviewData.atmosphereRating} />
		<input type="hidden" name="rating_value" value={reviewData.valueRating} />
		<input type="hidden" name="address" value={reviewData.address} />
		<input type="hidden" name="website_url" value={reviewData.socialLinks.website} />
		<input type="hidden" name="facebook_url" value={reviewData.socialLinks.facebook} />
		<input type="hidden" name="instagram_url" value={reviewData.socialLinks.instagram} />
		<input type="hidden" name="twitter_url" value={reviewData.socialLinks.tiktok} />
		<input type="hidden" name="youtube_url" value={reviewData.socialLinks.youtube} />

		<!-- Basic Information -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6">
			<h2 class="text-2xl font-bold text-white mb-6">Basic Information</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Title -->
				<div class="md:col-span-2">
					<label for="title" class="block text-white font-semibold mb-2">
						Review Title *
					</label>
					<input
						type="text"
						id="title"
						bind:value={reviewData.title}
						oninput={generateSlug}
						required
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="e.g., Haunted Manor 2024"
					/>
				</div>

				<!-- Slug -->
				<div class="md:col-span-2">
					<label for="slug" class="block text-white font-semibold mb-2">
						URL Slug *
					</label>
					<input
						type="text"
						id="slug"
						bind:value={reviewData.slug}
						required
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="haunted-manor-2024"
					/>
					<p class="text-gray-500 text-sm mt-1">Will be used in URL: /reviews/{reviewData.slug || 'your-slug'}</p>
				</div>

				<!-- Caption -->
				<div class="md:col-span-2">
					<label for="caption" class="block text-white font-semibold mb-2">
						Caption
					</label>
					<input
						type="text"
						id="caption"
						bind:value={reviewData.caption}
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="A brief description of this haunt"
					/>
					<p class="text-gray-500 text-sm mt-1">Short description shown on review cards</p>
				</div>

				<!-- Description/Review Text -->
				<div class="md:col-span-2">
					<label for="description" class="block text-white font-semibold mb-2">
						Review Text *
					</label>
					<textarea
						id="description"
						bind:value={reviewData.description}
						required
						rows="10"
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors resize-none"
						placeholder="Write your detailed review here..."
					></textarea>
					<p class="text-gray-500 text-sm mt-1">
						Inline images: <code class="bg-gray-800 px-1 py-0.5 rounded">[REVIEWER_PHOTO:1]</code> (database images with captions) or
						<code class="bg-gray-800 px-1 py-0.5 rounded">[IMAGE:https://url.com/image.jpg]</code> or
						<code class="bg-gray-800 px-1 py-0.5 rounded">[IMAGE:https://url.com/image.jpg|Caption]</code> (direct URLs)
					</p>
				</div>
			</div>
		</div>

		<!-- Images -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6">
			<h2 class="text-2xl font-bold text-white mb-6">Images</h2>

			<!-- Cover Image -->
			<div class="mb-6">
				<label for="coverImage" class="block text-white font-semibold mb-2">
					Cover Image URL *
				</label>
				<input
					type="url"
					id="coverImage"
					bind:value={reviewData.coverImage}
					required
					class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
					placeholder="https://example.com/image.jpg"
				/>
				<div class="flex items-start gap-2 mt-1">
					<svg class="w-4 h-4 text-haunt-orange mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
					</svg>
					<p class="text-gray-500 text-sm">
						<strong class="text-haunt-orange">Recommended: 16:9 ratio (e.g., 1920x1080)</strong> - Images will be cropped to 16:9 on homepage to ensure uniform display.
					</p>
				</div>

				<!-- Cover Image Preview - Shows how it will look on homepage -->
				{#if reviewData.coverImage?.trim()}
					<div class="mt-4 space-y-2">
						<p class="text-xs text-gray-400 uppercase tracking-wide font-semibold">Preview (Homepage Display):</p>
						<div class="w-full max-w-2xl mx-auto overflow-hidden rounded-lg border-2 border-haunt-orange/50 bg-black">
							<div class="aspect-video overflow-hidden relative">
								<img
									src={reviewData.coverImage}
									alt="Cover preview"
									class="w-full h-full object-contain"
									onerror={(e) => {
										const target = e.target as HTMLImageElement;
										target.style.display = 'none';
										const errorDiv = target.parentElement?.querySelector('.error-message') as HTMLElement;
										if (errorDiv) errorDiv.style.display = 'flex';
									}}
								/>
								<div class="error-message hidden absolute inset-0 bg-gray-800 items-center justify-center text-gray-400">
									Failed to load cover image
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Social Media Share Image -->
			<div class="mb-6">
				<label for="reviewImage" class="block text-white font-semibold mb-2">
					Social Media Share Image
				</label>
				<input
					type="url"
					id="reviewImage"
					bind:value={reviewData.reviewImage}
					class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
					placeholder="https://example.com/share-image.jpg"
				/>
				<div class="flex items-start gap-2 mt-1">
					<svg class="w-4 h-4 text-haunt-orange mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
					</svg>
					<p class="text-gray-500 text-sm">
						This image appears when the review is shared on social media, text messages, or other platforms. <strong class="text-haunt-orange">Recommended: 1200x630px (Open Graph standard)</strong>. If left blank, the cover image will be used.
					</p>
				</div>

				<!-- Review Image Preview -->
				{#if reviewData.reviewImage?.trim()}
					<div class="mt-4 space-y-2">
						<p class="text-xs text-gray-400 uppercase tracking-wide font-semibold">Preview (Social Share):</p>
						<div class="w-full max-w-2xl mx-auto overflow-hidden rounded-lg border-2 border-haunt-orange/50 bg-black">
							<div class="aspect-[1200/630] overflow-hidden relative">
								<img
									src={reviewData.reviewImage}
									alt="Social share preview"
									class="w-full h-full object-contain"
									onerror={(e) => {
										const target = e.target as HTMLImageElement;
										target.style.display = 'none';
										const errorDiv = target.parentElement?.querySelector('.error-message') as HTMLElement;
										if (errorDiv) errorDiv.style.display = 'flex';
									}}
								/>
								<div class="error-message hidden absolute inset-0 bg-gray-800 items-center justify-center text-gray-400">
									Failed to load share image
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

		</div>

		<!-- Ratings -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6">
			<h2 class="text-2xl font-bold text-white mb-6">Ratings</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Overall Rating -->
				<div>
					<label for="overallRating" class="block text-white font-semibold mb-2">
						Overall Rating: {reviewData.overallRating}/5
					</label>
					<input
						type="range"
						id="overallRating"
						bind:value={reviewData.overallRating}
						min="1"
						max="5"
						step="0.5"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-haunt-orange"
					/>
				</div>

				<!-- Scare Rating -->
				<div>
					<label for="scareRating" class="block text-white font-semibold mb-2">
						Scare Factor: {reviewData.scareRating}/5
					</label>
					<input
						type="range"
						id="scareRating"
						bind:value={reviewData.scareRating}
						min="1"
						max="5"
						step="0.5"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-haunt-orange"
					/>
				</div>

				<!-- Atmosphere Rating -->
				<div>
					<label for="atmosphereRating" class="block text-white font-semibold mb-2">
						Atmosphere: {reviewData.atmosphereRating}/5
					</label>
					<input
						type="range"
						id="atmosphereRating"
						bind:value={reviewData.atmosphereRating}
						min="1"
						max="5"
						step="0.5"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-haunt-orange"
					/>
				</div>

				<!-- Value Rating -->
				<div>
					<label for="valueRating" class="block text-white font-semibold mb-2">
						Value: {reviewData.valueRating}/5
					</label>
					<input
						type="range"
						id="valueRating"
						bind:value={reviewData.valueRating}
						min="1"
						max="5"
						step="0.5"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-haunt-orange"
					/>
				</div>
			</div>
		</div>

		<!-- Social Media Links & Contact -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6">
			<h2 class="text-2xl font-bold text-white mb-6">Haunt Information</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Address -->
				<div class="md:col-span-2">
					<label for="address" class="block text-white font-semibold mb-2">
						Full Address *
					</label>
					<input
						type="text"
						id="address"
						bind:value={reviewData.address}
						required
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="123 Spooky Lane, Halloween City, ST 12345"
					/>
					<p class="text-gray-500 text-sm mt-1">Format: Street, City, State ZIP (City and State will be auto-extracted)</p>
				</div>

				<!-- Website -->
				<div>
					<label for="website" class="block text-white font-semibold mb-2">
						Website
					</label>
					<input
						type="url"
						id="website"
						bind:value={reviewData.socialLinks.website}
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="https://example.com"
					/>
				</div>

				<!-- Facebook -->
				<div>
					<label for="facebook" class="block text-white font-semibold mb-2">
						Facebook
					</label>
					<input
						type="url"
						id="facebook"
						bind:value={reviewData.socialLinks.facebook}
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="https://facebook.com/..."
					/>
				</div>

				<!-- Instagram -->
				<div>
					<label for="instagram" class="block text-white font-semibold mb-2">
						Instagram
					</label>
					<input
						type="url"
						id="instagram"
						bind:value={reviewData.socialLinks.instagram}
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="https://instagram.com/..."
					/>
				</div>

				<!-- TikTok / Twitter -->
				<div>
					<label for="tiktok" class="block text-white font-semibold mb-2">
						TikTok / Twitter
					</label>
					<input
						type="url"
						id="tiktok"
						bind:value={reviewData.socialLinks.tiktok}
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="https://tiktok.com/@..."
					/>
				</div>

				<!-- YouTube -->
				<div>
					<label for="youtube" class="block text-white font-semibold mb-2">
						YouTube
					</label>
					<input
						type="url"
						id="youtube"
						bind:value={reviewData.socialLinks.youtube}
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="https://youtube.com/watch?v=..."
					/>
					<p class="text-gray-500 text-sm mt-1">Full YouTube URL (will be embedded in review)</p>
				</div>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="flex gap-4">
			<button
				type="submit"
				disabled={submitting}
				class="flex-1 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
				style="box-shadow: 0 0 30px rgba(252,116,3,0.4);"
			>
				{#if submitting}
					{editingReview ? 'Updating Review...' : 'Creating Review...'}
				{:else}
					{editingReview ? 'Update Review' : 'Publish Review'}
				{/if}
			</button>
			{#if editingReview}
				<button
					type="button"
					onclick={cancelEdit}
					class="px-6 py-4 bg-black/50 hover:bg-black/70 text-gray-400 hover:text-white font-bold rounded-xl transition-all border border-gray-700"
				>
					Cancel Edit
				</button>
			{:else}
				<a
					href="/admin/dashboard"
					class="px-6 py-4 bg-black/50 hover:bg-black/70 text-gray-400 hover:text-white font-bold rounded-xl transition-all border border-gray-700 text-center"
				>
					Cancel
				</a>
			{/if}
		</div>
	</form>

	<!-- Existing Reviews List -->
	{#if data.reviews && data.reviews.length > 0}
		<div class="mt-12">
			<h2 class="text-2xl font-bold text-white mb-6">Existing Reviews ({data.reviews.length})</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.reviews as review}
					<div class="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
						<div class="flex items-start justify-between mb-2">
							<h3 class="text-lg font-bold text-white">{review.name}</h3>
							{#if review.featured}
								<span class="inline-flex items-center gap-1 bg-haunt-orange/20 text-haunt-orange px-2 py-1 rounded-md text-xs font-semibold">
									<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
									</svg>
									Featured
								</span>
							{/if}
						</div>
						<p class="text-gray-400 text-sm mb-2">{review.city}, {review.state}</p>
						{#if review.rating_overall}
							<p class="text-haunt-orange font-semibold">⭐ {review.rating_overall.toFixed(1)}/5</p>
						{/if}
						<div class="flex gap-2 mt-4 flex-wrap">
							<a
								href="/reviews/{review.slug}"
								target="_blank"
								class="text-sm text-haunt-orange hover:underline"
							>
								View →
							</a>
							{#if review.view_count}
								<span class="text-sm text-gray-500">• {review.view_count} views</span>
							{/if}
						</div>

						<!-- Featured Toggle -->
						<div class="mt-4">
							<form method="POST" action="?/toggleFeatured" use:enhance={() => {
								togglingFeatured = review.id;
								return async ({ result, update }) => {
									togglingFeatured = null;
									if (result.type === 'success') {
										await invalidateAll();
									}
									await update();
								};
							}}>
								<input type="hidden" name="id" value={review.id} />
								<input type="hidden" name="featured" value={review.featured} />
								<button
									type="submit"
									disabled={togglingFeatured === review.id}
									class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed {review.featured ? 'bg-haunt-orange/20 hover:bg-haunt-orange/30 text-haunt-orange border-haunt-orange/50' : 'bg-gray-700/20 hover:bg-gray-700/30 text-gray-400 border-gray-600/50'}"
								>
									{#if togglingFeatured === review.id}
										<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									{:else}
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
										</svg>
									{/if}
									{review.featured ? 'Unfeature' : 'Feature on Homepage'}
								</button>
							</form>
						</div>

						<!-- Action Buttons -->
						<div class="flex gap-2 mt-3">
							<button
								type="button"
								onclick={() => editReview(review)}
								class="flex-1 bg-haunt-orange/20 hover:bg-haunt-orange/30 text-haunt-orange px-3 py-2 rounded-lg border border-haunt-orange/50 transition-all text-sm font-semibold"
							>
								Edit
							</button>

							{#if showDeleteConfirm === review.id}
								<form method="POST" action="?/delete" use:enhance class="flex-1 flex gap-2">
									<input type="hidden" name="id" value={review.id} />
									<button
										type="submit"
										class="flex-1 bg-red-900/50 hover:bg-red-900/70 text-red-400 px-3 py-2 rounded-lg border border-red-500/50 transition-all text-sm font-semibold"
									>
										Confirm?
									</button>
									<button
										type="button"
										onclick={() => showDeleteConfirm = null}
										class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
									>
										✕
									</button>
								</form>
							{:else}
								<button
									type="button"
									onclick={() => showDeleteConfirm = review.id}
									class="flex-1 bg-red-900/20 hover:bg-red-900/30 text-red-400 px-3 py-2 rounded-lg border border-red-500/50 transition-all text-sm font-semibold"
								>
									Delete
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
