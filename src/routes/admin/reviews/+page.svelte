<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let editingReview = $state<string | null>(null); // Track ID of review being edited
	let reviewData = $state({
		title: '',
		slug: '',
		location: '',
		description: '',
		coverImage: '',
		featured: false,
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
		address: '',
		galleryImages: [] as string[]
	});

	let submitting = $state(false);
	let showSuccess = $state(false);
	let showDeleteConfirm = $state<string | null>(null); // Track review ID for delete confirmation

	function generateSlug() {
		reviewData.slug = reviewData.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	function addGalleryImage() {
		reviewData.galleryImages = [...reviewData.galleryImages, ''];
	}

	function removeGalleryImage(index: number) {
		reviewData.galleryImages = reviewData.galleryImages.filter((_, i) => i !== index);
	}

	// Load review data into form for editing
	function editReview(review: any) {
		editingReview = review.id;

		// Parse location back into "City, State" format
		const location = review.city && review.state ? `${review.city}, ${review.state}` : review.city || '';

		reviewData = {
			title: review.name || '',
			slug: review.slug || '',
			location,
			description: review.description || review.review_text || '',
			coverImage: review.cover_image_url || '',
			featured: review.featured || false,
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
			address: review.address || '',
			galleryImages: [] // Gallery images would need to be loaded separately
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
			location: '',
			description: '',
			coverImage: '',
			featured: false,
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
			address: '',
			galleryImages: []
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
				location: '',
				description: '',
				coverImage: '',
				featured: false,
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
				address: '',
				galleryImages: []
			};

			// Hide success message after 5 seconds
			setTimeout(() => {
				showSuccess = false;
			}, 5000);
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
				<h3 class="text-green-400 font-bold">
					{editingReview ? 'Review Updated Successfully!' : 'Review Created Successfully!'}
				</h3>
				<p class="text-green-300 text-sm">{form?.message || 'Your review has been published.'}</p>
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
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	}} class="space-y-8">

		<!-- Hidden inputs for form data -->
		{#if editingReview}
			<input type="hidden" name="id" value={editingReview} />
		{/if}
		<input type="hidden" name="name" value={reviewData.title} />
		<input type="hidden" name="slug" value={reviewData.slug} />
		<input type="hidden" name="location" value={reviewData.location} />
		<input type="hidden" name="description" value={reviewData.description} />
		<input type="hidden" name="review_text" value={reviewData.description} />
		<input type="hidden" name="cover_image_url" value={reviewData.coverImage} />
		<input type="hidden" name="featured" value={reviewData.featured} />
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
		<input type="hidden" name="gallery_images" value={JSON.stringify(reviewData.galleryImages)} />

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

				<!-- Location -->
				<div>
					<label for="location" class="block text-white font-semibold mb-2">
						Location *
					</label>
					<input
						type="text"
						id="location"
						bind:value={reviewData.location}
						required
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="e.g., Atlanta, GA"
					/>
					<p class="text-gray-500 text-sm mt-1">Format: City, State</p>
				</div>

				<!-- Featured -->
				<div class="flex items-center">
					<label class="flex items-center space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={reviewData.featured}
							class="w-5 h-5 rounded border-haunt-orange/30 bg-black/50 text-haunt-orange focus:ring-haunt-orange focus:ring-2"
						/>
						<span class="text-white font-semibold">Featured Review</span>
					</label>
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
					<p class="text-gray-500 text-sm mt-1">You can use [REVIEWER_PHOTO:1], [REVIEWER_PHOTO:2], etc. for inline images (add these separately in database)</p>
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
				<p class="text-gray-500 text-sm mt-1">Main image for the review (upload to Supabase Storage first)</p>
			</div>

			<!-- Gallery Images -->
			<div>
				<div class="flex items-center justify-between mb-4">
					<label class="block text-white font-semibold">
						Gallery Images
					</label>
					<button
						type="button"
						onclick={addGalleryImage}
						class="bg-haunt-orange/20 hover:bg-haunt-orange/30 text-haunt-orange px-4 py-2 rounded-lg border border-haunt-orange/50 transition-all"
					>
						+ Add Image
					</button>
				</div>

				<div class="space-y-3">
					{#each reviewData.galleryImages as image, index}
						<div class="flex gap-3">
							<input
								type="url"
								bind:value={reviewData.galleryImages[index]}
								class="flex-1 px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
								placeholder="https://example.com/gallery-image.jpg"
							/>
							<button
								type="button"
								onclick={() => removeGalleryImage(index)}
								class="bg-red-900/20 hover:bg-red-900/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/50 transition-all"
							>
								Remove
							</button>
						</div>
					{/each}

					{#if reviewData.galleryImages.length === 0}
						<p class="text-gray-500 text-sm">No gallery images added yet</p>
					{/if}
				</div>
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
						Full Address
					</label>
					<input
						type="text"
						id="address"
						bind:value={reviewData.address}
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="123 Spooky Lane, Halloween City, ST 12345"
					/>
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
						<h3 class="text-lg font-bold text-white mb-2">{review.name}</h3>
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

						<!-- Action Buttons -->
						<div class="flex gap-2 mt-4">
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
