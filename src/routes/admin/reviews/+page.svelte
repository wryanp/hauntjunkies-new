<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { createClient } from '@supabase/supabase-js';
	import type { PageData, ActionData } from './$types';
	import AwardsManager from '$lib/components/AwardsManager.svelte';
	import { getAwardCount } from '$lib/utils/awards';

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
		featured: false,
		socialLinks: {
			facebook: '',
			instagram: '',
			twitter: '',
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
	let managingAwards = $state<any>(null); // Track which review's awards are being managed
	let showForm = $state(false); // Track whether the form should be shown
	let togglingAwards = $state(false); // Track awards hero toggle state

	function generateSlug() {
		reviewData.slug = reviewData.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	// Load review data into form for editing
	async function editReview(review: any) {
		editingReview = review.id;
		showForm = true;

		reviewData = {
			title: review.name || '',
			slug: review.slug || '',
			caption: review.caption || '',
			description: review.description || review.review_text || '',
			coverImage: review.cover_image_url || '',
			reviewImage: review.review_image || '',
			overallRating: review.rating_overall || 5,
			featured: review.featured || false,
			socialLinks: {
				facebook: review.facebook_url || '',
				instagram: review.instagram_url || '',
				twitter: review.twitter_url || '',
				tiktok: review.tiktok_url || '',
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
		showForm = false;
		reviewData = {
			title: '',
			slug: '',
			caption: '',
			description: '',
			coverImage: '',
			reviewImage: '',
			overallRating: 5,
			featured: false,
			socialLinks: {
				facebook: '',
				instagram: '',
				twitter: '',
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
				featured: false,
				socialLinks: {
					facebook: '',
					instagram: '',
					twitter: '',
					tiktok: '',
					website: '',
					youtube: ''
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

	let showCriteriaReminder = $state(true);
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
				<p class="text-green-400 font-bold">Success!</p>
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
				<p class="text-red-400 font-bold">Error</p>
				<p class="text-red-300 text-sm">{form.error}</p>
			</div>
		</div>
	{/if}

	<!-- Review Criteria Reminder -->
	<div class="mb-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
		<button
			type="button"
			onclick={() => showCriteriaReminder = !showCriteriaReminder}
			class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
		>
			<div class="flex items-center gap-3">
				<svg class="w-5 h-5 text-haunt-orange" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
				</svg>
				<span class="text-white font-semibold">Review Criteria Reference</span>
			</div>
			<svg
				class="w-5 h-5 text-gray-400 transition-transform {showCriteriaReminder ? 'rotate-180' : ''}"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if showCriteriaReminder}
			<div class="px-4 pb-4 border-t border-gray-700/50">
				<p class="text-gray-400 text-sm mb-3 mt-3">Things to consider when writing your review:</p>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Acting</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Atmosphere/Ambience</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Costuming</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Immersion</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Makeup/Masks</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Queue Line</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Scare Factor</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Set Design</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Special-FX/Animatronics</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Story/Theming</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Value</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-haunt-orange">•</span>
						<span class="text-gray-300">Overall Experience</span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- New Review Button (shown when form is hidden) -->
	{#if !showForm}
		<div class="flex justify-center">
			<button
				type="button"
				onclick={() => showForm = true}
				class="bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center gap-3"
				style="box-shadow: 0 0 30px rgba(252,116,3,0.4);"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span class="text-lg">Create New Review</span>
			</button>
		</div>

	<!-- Golden Ghost Awards Hero Toggle (hidden when form is shown) -->
	<div class="mb-8 mt-8 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 p-6 shadow-lg">
		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
			<div class="flex items-center gap-4">
				<img src="/golden-ghost-award.webp" alt="Golden Ghost Award" class="w-12 h-12 drop-shadow-xl" />
				<div class="flex-1">
					<h2 class="text-xl font-bold text-yellow-400">Awards Hero Section</h2>
					<p class="text-gray-400 text-sm mt-1">
						Display multi-award winners prominently on homepage
					</p>
					<div class="flex items-center gap-2 text-sm mt-2">
						<span class="font-semibold text-white">Status:</span>
						{#if data.showAwardsHero}
							<span class="text-green-400 whitespace-nowrap">✓ Enabled</span>
						{:else}
							<span class="text-gray-500 whitespace-nowrap">Disabled</span>
						{/if}
					</div>
				</div>
			</div>
			<form
				method="POST"
				action="?/toggleAwardsHero"
				use:enhance={() => {
					togglingAwards = true;
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							await invalidateAll();
							// Reload the current page to ensure data is fresh
							await goto($page.url.pathname, { invalidateAll: true });
						}
						togglingAwards = false;
					};
				}}
			>
				<button
					type="submit"
					disabled={togglingAwards}
					class="px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg whitespace-nowrap {data.showAwardsHero
						? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'
						: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black'}"
					style="box-shadow: 0 0 20px rgba({data.showAwardsHero ? '220,38,38' : '255,215,0'},0.4);"
				>
					{#if togglingAwards}
						<span class="flex items-center gap-2">
							<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Updating...
						</span>
					{:else}
						{data.showAwardsHero ? 'Disable Hero Section' : 'Enable Hero Section'}
					{/if}
				</button>
			</form>
		</div>
	</div>
	{/if}

	<!-- Form -->
	{#if showForm}
	<form method="POST" action={editingReview ? '?/update' : '?/create'} use:enhance={() => {
		submitting = true;
		const isEditing = !!editingReview;
		const slug = reviewData.slug;

		return async ({ result, update }) => {
			await update();
			submitting = false;

			// If update was successful and we're editing, redirect to the reviews page
			if (result.type === 'success' && isEditing) {
				goto('/reviews');
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
		<input type="hidden" name="featured" value={reviewData.featured} />
		<input type="hidden" name="address" value={reviewData.address} />
		<input type="hidden" name="website_url" value={reviewData.socialLinks.website} />
		<input type="hidden" name="facebook_url" value={reviewData.socialLinks.facebook} />
		<input type="hidden" name="instagram_url" value={reviewData.socialLinks.instagram} />
		<input type="hidden" name="twitter_url" value={reviewData.socialLinks.twitter} />
		<input type="hidden" name="tiktok_url" value={reviewData.socialLinks.tiktok} />
		<input type="hidden" name="youtube_url" value={reviewData.socialLinks.youtube} />

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

				<!-- Twitter -->
				<div>
					<label for="twitter" class="block text-white font-semibold mb-2">
						Twitter / X
					</label>
					<input
						type="url"
						id="twitter"
						bind:value={reviewData.socialLinks.twitter}
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
						placeholder="https://twitter.com/..."
					/>
				</div>

				<!-- TikTok -->
				<div>
					<label for="tiktok" class="block text-white font-semibold mb-2">
						TikTok
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

		<!-- Ratings -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6">
			<h2 class="text-2xl font-bold text-white mb-6">Rating & Display Settings</h2>

			<!-- Overall Rating -->
			<div class="mb-6">
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

			<!-- Featured Toggle -->
			<div class="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-haunt-orange/20">
				<div class="flex items-center gap-3">
					<svg class="w-5 h-5 text-haunt-orange" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
					</svg>
					<div>
						<p class="text-white font-semibold">Feature on Homepage</p>
						<p class="text-gray-400 text-sm">Display this review prominently on the homepage</p>
					</div>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						bind:checked={reviewData.featured}
						class="sr-only peer"
					/>
					<div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-haunt-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-haunt-orange"></div>
				</label>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="flex flex-col gap-4">
			{#if editingReview}
				<!-- Manage Awards Button (only for editing) -->
				<button
					type="button"
					onclick={() => {
						const review = data.reviews.find(r => r.id === editingReview);
						if (review) managingAwards = review;
					}}
					class="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border transition-all font-bold bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-400 border-yellow-600/50"
				>
					<img src="/golden-ghost-award.webp" alt="Golden Ghost Award icon" class="w-5 h-5" />
					Manage Awards
					{#if editingReview && data.reviews.find(r => r.id === editingReview)}
						{@const review = data.reviews.find(r => r.id === editingReview)!}
						{@const count = getAwardCount(review)}
						{#if count > 0}
							<span class="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
								{count}
							</span>
						{/if}
					{/if}
				</button>
			{/if}

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
		</div>
	</form>
	{/if}

	<!-- Existing Reviews List -->
	{#if !showForm && data.reviews && data.reviews.length > 0}
		<div class="mt-12">
			<h2 class="text-2xl font-bold text-white mb-6">Existing Reviews ({data.reviews.length})</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.reviews as review}
					<div class="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
						<div class="flex items-start justify-between mb-2">
							<h3 class="text-lg font-bold text-white">
								{review.name}
							</h3>
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
							<p class="flex items-center gap-2">
								<img src="/ghost.png" alt="Rating" class="w-5 h-5 object-contain" />
								<span class="text-haunt-orange font-semibold leading-none">{review.rating_overall.toFixed(1)}/5</span>
							</p>
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

						<!-- Awards Button -->
						<div class="mt-3">
							<button
								type="button"
								onclick={() => managingAwards = review}
								class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-semibold bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-400 border-yellow-600/50"
							>
								<img src="/golden-ghost-award.webp" alt="Golden Ghost Award icon" class="w-4 h-4" />
								Manage Awards
								{#if getAwardCount(review) > 0}
									<span class="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
										{getAwardCount(review)}
									</span>
								{/if}
							</button>
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

<!-- Awards Manager Modal -->
{#if managingAwards}
	<AwardsManager
		review={managingAwards}
		onClose={() => {
			managingAwards = null;
			invalidateAll();
		}}
	/>
{/if}
