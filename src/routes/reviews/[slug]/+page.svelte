<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import TurnstileWidget from '$lib/components/TurnstileWidget.svelte';
	import ViewCounter from '$lib/components/ViewCounter.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import GoogleMap from '$lib/components/GoogleMap.svelte';
	import { dev } from '$app/environment';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let commentFormVisible = $state(false);
	let submitting = $state(false);
	let captchaToken = $state(dev ? 'dev-mode' : ''); // Auto-pass in dev mode

	// Parse review text and replace image placeholders with actual images
	// Supports placeholders like [REVIEWER_PHOTO:1], [REVIEWER_PHOTO:2], etc.
	function parseReviewText(text: string | undefined): string {
		if (!text) return '';

		// Replace [REVIEWER_PHOTO:N] with actual images
		return text.replace(/\[REVIEWER_PHOTO:(\d+)\]/g, (match, photoIndex) => {
			const index = parseInt(photoIndex) - 1; // Convert to 0-based index
			const photo = data.reviewerPhotos?.[index];

			if (!photo) {
				return match; // Return placeholder if photo not found
			}

			// Generate HTML for the image
			const caption = photo.caption ? `<p class="text-sm text-gray-400 text-center mt-2 italic">${photo.caption}</p>` : '';
			const altText = photo.alt_text || photo.caption || 'Reviewer photo from the haunt';

			return `
				<div class="my-8 mx-auto max-w-2xl">
					<img
						src="${photo.image_url}"
						alt="${altText}"
						class="w-full rounded-lg border-2 border-haunt-orange/30 shadow-xl"
					/>
					${caption}
				</div>
			`;
		});
	}

	const formattedReviewText = $derived(parseReviewText(data.review.review_text));

	// Extract YouTube video ID from URL
	function getYouTubeEmbedUrl(url: string): string | null {
		if (!url) return null;

		// Handle various YouTube URL formats
		const patterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
			/youtube\.com\/embed\/([^&\s]+)/,
			/youtube\.com\/v\/([^&\s]+)/
		];

		for (const pattern of patterns) {
			const match = url.match(pattern);
			if (match && match[1]) {
				return `https://www.youtube.com/embed/${match[1]}`;
			}
		}

		return null;
	}

	const youtubeEmbedUrl = $derived(data.review.youtube_url ? getYouTubeEmbedUrl(data.review.youtube_url) : null);
</script>

<SEO
	title={data.review.name}
	description={data.review.description || `Expert review of ${data.review.name}. Ratings for scares, atmosphere, and value. Located in ${data.review.city}, ${data.review.state}. Read our full review and see photos.`}
	url={`/reviews/${data.review.slug}`}
	image={data.review.cover_image_url || '/og-review-default.jpg'}
	type="article"
	article={{
		publishedTime: data.review.created_at,
		modifiedTime: data.review.updated_at,
		section: 'Haunt Reviews',
		tags: [
			data.review.state || '',
			data.review.city || '',
			data.review.year?.toString() || '',
			'haunted house',
			'halloween'
		].filter(Boolean)
	}}
/>
<StructuredData review={data.review} />

<div class="bg-gradient-to-b from-gray-900 to-black min-h-screen">
	<!-- Hero Image -->
	{#if data.review.cover_image_url}
		<div class="relative h-96 overflow-hidden">
			<img
				src={data.review.cover_image_url}
				alt={data.review.name}
				class="w-full h-full object-cover"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
		</div>
	{/if}

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 {data.review.cover_image_url ? '-mt-32' : 'pt-12'} pb-20 relative">
		<!-- Breadcrumbs -->
		<Breadcrumbs
			items={[
				{ label: 'Reviews', href: '/reviews' },
				{ label: data.review.name, href: `/reviews/${data.review.slug}` }
			]}
		/>

		<!-- Review Header -->
		<div class="mb-8">
			<div class="flex items-start justify-between gap-4 mb-4">
				<h1 class="text-4xl md:text-6xl font-bold text-white flex-1">
					{data.review.name}
				</h1>

				<!-- Admin Edit Button -->
				{#if data.isAuthenticated}
					<a
						href="/admin/reviews?edit={data.review.id}"
						class="group bg-haunt-orange/20 hover:bg-haunt-orange border-2 border-haunt-orange/50 hover:border-haunt-orange px-4 py-2 rounded-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
						title="Edit this review"
					>
						<svg class="w-5 h-5 text-haunt-orange group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
						<span class="text-haunt-orange group-hover:text-white transition-colors font-semibold">Edit</span>
					</a>
				{/if}
			</div>

			<div class="flex flex-wrap gap-4 items-center text-gray-400 mb-4">
				{#if data.review.city && data.review.state}
					<div class="flex items-center gap-1">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
						<span>{data.review.city}, {data.review.state}</span>
					</div>
				{/if}
				{#if data.review.year}
					<div class="flex items-center gap-1">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
						</svg>
						<span>{data.review.year}</span>
					</div>
				{/if}
				{#if data.review.view_count && data.review.view_count > 0}
					<ViewCounter viewCount={data.review.view_count} size="md" showLabel={true} />
				{/if}
			</div>

			<!-- Ratings -->
			{#if data.review.rating_overall}
				<div class="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
					<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">Overall Rating</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<div class="text-5xl font-bold text-white mb-2">{data.review.rating_overall.toFixed(1)}</div>
							<div class="flex">
								{#each Array(5) as _, i}
									<svg
										class="w-6 h-6 {i < Math.round(data.review.rating_overall) ? 'text-haunt-orange' : 'text-gray-600'}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								{/each}
							</div>
						</div>
						<div class="space-y-2">
							{#if data.review.rating_scares}
								<div class="flex justify-between">
									<span class="text-gray-400">Scares</span>
									<span class="text-white font-medium">{data.review.rating_scares.toFixed(1)}</span>
								</div>
							{/if}
							{#if data.review.rating_atmosphere}
								<div class="flex justify-between">
									<span class="text-gray-400">Atmosphere</span>
									<span class="text-white font-medium">{data.review.rating_atmosphere.toFixed(1)}</span>
								</div>
							{/if}
							{#if data.review.rating_value}
								<div class="flex justify-between">
									<span class="text-gray-400">Value</span>
									<span class="text-white font-medium">{data.review.rating_value.toFixed(1)}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- Social Links -->
			{#if data.review.website_url || data.review.facebook_url || data.review.instagram_url || data.review.twitter_url || data.review.youtube_url}
				<div class="flex flex-wrap gap-4 mb-6">
					{#if data.review.website_url}
						<a
							href={data.review.website_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group bg-haunt-orange/20 hover:bg-haunt-orange border-2 border-haunt-orange/50 hover:border-haunt-orange p-3 rounded-lg transition-all transform hover:scale-110"
							title="Visit Website"
							aria-label="Visit website"
						>
							<svg class="w-6 h-6 text-haunt-orange group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd" />
							</svg>
						</a>
					{/if}
					{#if data.review.facebook_url}
						<a
							href={data.review.facebook_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group bg-haunt-orange/20 hover:bg-haunt-orange border-2 border-haunt-orange/50 hover:border-haunt-orange p-3 rounded-lg transition-all transform hover:scale-110"
							title="Visit Facebook"
							aria-label="Visit Facebook page"
						>
							<svg class="w-6 h-6 text-haunt-orange group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
							</svg>
						</a>
					{/if}
					{#if data.review.instagram_url}
						<a
							href={data.review.instagram_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group bg-haunt-orange/20 hover:bg-haunt-orange border-2 border-haunt-orange/50 hover:border-haunt-orange p-3 rounded-lg transition-all transform hover:scale-110"
							title="Visit Instagram"
							aria-label="Visit Instagram page"
						>
							<svg class="w-6 h-6 text-haunt-orange group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
						</a>
					{/if}
					{#if data.review.twitter_url}
						<a
							href={data.review.twitter_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group bg-haunt-orange/20 hover:bg-haunt-orange border-2 border-haunt-orange/50 hover:border-haunt-orange p-3 rounded-lg transition-all transform hover:scale-110"
							title="Visit Twitter/X"
							aria-label="Visit Twitter/X page"
						>
							<svg class="w-6 h-6 text-haunt-orange group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
						</a>
					{/if}
					{#if data.review.youtube_url}
						<a
							href={data.review.youtube_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group bg-haunt-orange/20 hover:bg-haunt-orange border-2 border-haunt-orange/50 hover:border-haunt-orange p-3 rounded-lg transition-all transform hover:scale-110"
							title="Watch on YouTube"
							aria-label="Watch video on YouTube"
						>
							<svg class="w-6 h-6 text-haunt-orange group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</a>
					{/if}
				</div>
			{/if}
		</div>

		<!-- YouTube Video -->
		{#if youtubeEmbedUrl}
			<div class="mb-6">
				<div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
					<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster flex items-center gap-2">
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
						</svg>
						Video
					</h2>
					<div class="relative w-full" style="padding-bottom: 56.25%;">
						<iframe
							src={youtubeEmbedUrl}
							title="YouTube video"
							class="absolute top-0 left-0 w-full h-full rounded-lg"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				</div>
			</div>
		{/if}

		<!-- Location Map -->
		{#if data.review.address}
			<div class="mb-6">
				<div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
					<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster flex items-center gap-2">
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
						Location
					</h2>
					<p class="text-gray-300 mb-4">{data.review.address}</p>
					<GoogleMap
						address={data.review.address}
						name={data.review.name}
						height="400px"
					/>
					<div class="mt-4">
						<a
							href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.review.address)}`}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 text-haunt-orange hover:text-orange-400 transition-colors"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
								<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
							</svg>
							Open in Google Maps
						</a>
					</div>
				</div>
			</div>
		{/if}

		<!-- Description -->
		{#if data.review.description}
			<div class="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
				<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">About</h2>
				<p class="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
					{data.review.description}
				</p>
			</div>
		{/if}

		<!-- Review Text with Inline Images -->
		{#if data.review.review_text}
			<div class="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
				<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">Our Review</h2>
				<div class="prose prose-invert max-w-none text-gray-300 leading-relaxed" style="white-space: pre-line;">
					{@html formattedReviewText}
				</div>
			</div>
		{/if}

		<!-- Gallery -->
		{#if data.images && data.images.length > 0}
			<div class="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
				<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">Gallery</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					{#each data.images as image}
						<div class="aspect-square overflow-hidden rounded-lg">
							<img
								src={image.image_url}
								alt={image.caption || data.review.name}
								class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Comments Section -->
		<div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
			<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">
				Comments ({data.comments.length})
			</h2>

			<!-- Add Comment Button -->
			{#if !commentFormVisible}
				<button
					onclick={() => commentFormVisible = true}
					class="mb-6 bg-haunt-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
				>
					Leave a Comment
				</button>
			{/if}

			<!-- Comment Form -->
			{#if commentFormVisible}
				<form method="POST" action="?/comment" use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
						// Reset CAPTCHA after submission
						captchaToken = '';
					};
				}} class="mb-8 bg-gray-900/50 rounded-lg p-6 border border-gray-700">
					{#if form?.success}
						<div class="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
							Thank you! Your comment has been submitted and is awaiting approval.
						</div>
					{/if}
					{#if form?.error}
						<div class="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
							{form.error}
						</div>
					{/if}

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label for="author_name" class="block text-sm font-medium text-gray-400 mb-2">Name</label>
							<input
								type="text"
								id="author_name"
								name="author_name"
								required
								class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
							/>
						</div>
						<div>
							<label for="author_email" class="block text-sm font-medium text-gray-400 mb-2">Email</label>
							<input
								type="email"
								id="author_email"
								name="author_email"
								required
								class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
							/>
						</div>
					</div>
					<div class="mb-4">
						<label for="comment_text" class="block text-sm font-medium text-gray-400 mb-2">Comment</label>
						<textarea
							id="comment_text"
							name="comment_text"
							required
							rows="4"
							class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
						></textarea>
					</div>

					<!-- CAPTCHA Widget (hidden in dev mode) -->
					{#if !dev}
						<div class="mb-4">
							<TurnstileWidget
								onVerify={(token) => captchaToken = token}
								onError={() => captchaToken = ''}
							/>
						</div>
					{/if}

					<div class="flex gap-3">
						<button
							type="submit"
							disabled={submitting || !captchaToken}
							class="bg-haunt-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? 'Submitting...' : 'Submit Comment'}
						</button>
						<button
							type="button"
							onclick={() => commentFormVisible = false}
							class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
						>
							Cancel
						</button>
					</div>
				</form>
			{/if}

			<!-- Comments List -->
			{#if data.comments.length > 0}
				<div class="space-y-4">
					{#each data.comments as comment}
						<div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
							<div class="flex justify-between items-start mb-2">
								<div class="font-medium text-white">{comment.author_name}</div>
								<div class="text-sm text-gray-500">
									{new Date(comment.created_at).toLocaleDateString()}
								</div>
							</div>
							<p class="text-gray-300 whitespace-pre-line">{comment.comment_text}</p>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-gray-400">No comments yet. Be the first to leave a comment!</p>
			{/if}
		</div>

		<!-- Back Button -->
		<div class="mt-8">
			<a
				href="/reviews"
				class="inline-flex items-center gap-2 text-haunt-orange hover:text-orange-400 transition-colors"
			>
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Reviews
			</a>
		</div>
	</div>
</div>
