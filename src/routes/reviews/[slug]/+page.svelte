<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import TurnstileWidget from '$lib/components/TurnstileWidget.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import GoogleMap from '$lib/components/GoogleMap.svelte';
	import GoldenGhostAwards from '$lib/components/GoldenGhostAwards.svelte';
	import { hasGoldenGhostAwards } from '$lib/utils/awards';
	import { dev } from '$app/environment';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let commentFormVisible = $state(false);
	let submitting = $state(false);
	let captchaToken = $state(dev ? 'dev-mode' : ''); // Auto-pass in dev mode

	// Calculate total award count
	let awardCount = $derived(
		(data.review.award_best_actors_year ? 1 : 0) +
		(data.review.award_best_makeup_year ? 1 : 0) +
		(data.review.award_best_set_design_year ? 1 : 0) +
		(data.review.award_best_story_year ? 1 : 0) +
		(data.review.award_scariest_year ? 1 : 0) +
		(data.review.award_best_overall_year ? 1 : 0)
	);

	// Extract year from review title (e.g., "Netherworld Haunted House 2024" -> "2024")
	let reviewYear = $derived.by(() => {
		const match = data.review.name.match(/(\d{4})/);
		return match ? match[1] : new Date().getFullYear().toString();
	});

	// Parse review text and replace image placeholders with actual images
	// Supports placeholders like [REVIEWER_PHOTO:1], [IMAGE:URL], etc.
	function parseReviewText(text: string | undefined): string {
		if (!text) return '';

		// First, replace [IMAGE:URL] with actual images and remove surrounding newlines
		let parsed = text.replace(/\n*\[IMAGE:(https?:\/\/[^\]]+)\]\n*/g, (match, imageUrl) => {
			return `<div class="my-0 mx-auto max-w-2xl" style="margin-top: 1rem !important; margin-bottom: 1rem !important;"><img src="${imageUrl}" alt="Review image" class="w-full rounded-lg border-2 border-haunt-orange/30 shadow-xl" /></div>`;
		});

		// Then, replace [REVIEWER_PHOTO:N] with actual images and remove surrounding newlines
		parsed = parsed.replace(/\n*\[REVIEWER_PHOTO:(\d+)\]\n*/g, (match, photoIndex) => {
			const index = parseInt(photoIndex) - 1; // Convert to 0-based index
			const photo = data.reviewerPhotos?.[index];

			if (!photo) {
				return match; // Return placeholder if photo not found
			}

			// Generate HTML for the image
			const caption = photo.caption ? `<p class="text-sm text-gray-400 text-center mt-2 italic">${photo.caption}</p>` : '';
			const altText = photo.alt_text || photo.caption || 'Reviewer photo from the haunt';

			return `<div class="my-0 mx-auto max-w-2xl" style="margin-top: 1rem !important; margin-bottom: 1rem !important;"><img src="${photo.image_url}" alt="${altText}" class="w-full rounded-lg border-2 border-haunt-orange/30 shadow-xl" />${caption}</div>`;
		});

		return parsed;
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

	// Social sharing
	const shareUrl = $derived(`https://hauntjunkies.com/reviews/${data.review.slug}`);
	let showCopyToast = $state(false);
	let copyToastMessage = $state('');

	function copyLinkToClipboard() {
		// Try clipboard API first
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(shareUrl).then(() => {
				copyToastMessage = 'Link copied to clipboard!';
				showCopyToast = true;
				setTimeout(() => { showCopyToast = false; }, 3000);
			}).catch((err) => {
				console.error('Clipboard API failed:', err);
				fallbackCopyToClipboard();
			});
		} else {
			// Fallback for browsers/contexts where clipboard API is not available
			fallbackCopyToClipboard();
		}
	}

	function fallbackCopyToClipboard() {
		// Create a temporary text area element
		const textArea = document.createElement('textarea');
		textArea.value = shareUrl;
		textArea.style.position = 'fixed';
		textArea.style.left = '-999999px';
		textArea.style.top = '-999999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand('copy');
			if (successful) {
				copyToastMessage = 'Link copied to clipboard!';
			} else {
				copyToastMessage = 'Copy failed - please try again';
			}
			showCopyToast = true;
			setTimeout(() => { showCopyToast = false; }, 3000);
		} catch (err) {
			console.error('Fallback copy failed:', err);
			copyToastMessage = 'Copy failed - please try again';
			showCopyToast = true;
			setTimeout(() => { showCopyToast = false; }, 3000);
		}

		document.body.removeChild(textArea);
	}
</script>

<SEO
	title={data.review.name}
	description={data.review.description || `Expert review of ${data.review.name}. Ratings for scares, atmosphere, and value. Located in ${data.review.city}, ${data.review.state}. Read our full review and see photos.`}
	url={`/reviews/${data.review.slug}`}
	image={data.review.review_image || data.review.cover_image_url || '/og.png'}
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

<div class="bg-gradient-to-b from-black via-neutral-900 to-black min-h-screen">
	<!-- Hero Image -->
	{#if data.review.cover_image_url}
		<div class="relative h-96 overflow-hidden bg-black">
			<img
				src={data.review.cover_image_url}
				alt={data.review.name}
				class="w-full h-full object-contain"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>
		</div>
	{/if}

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 relative">
		<!-- Breadcrumbs -->
		<Breadcrumbs
			items={[
				{ label: 'Reviews', href: '/reviews' },
				{ label: data.review.name, href: `/reviews/${data.review.slug}` }
			]}
		/>

		<!-- Back to Reviews Button -->
		<div class="mb-6">
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
				{#if data.review.address}
					<a
						href="https://www.google.com/maps/search/?api=1&query={encodeURIComponent(data.review.address)}"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-1 hover:text-haunt-orange transition-colors"
						title="Open in Maps"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
						<span>{data.review.address}</span>
					</a>
				{/if}
			</div>

			<!-- Social Links -->
			{#if data.review.website_url || data.review.facebook_url || data.review.instagram_url || data.review.twitter_url || data.review.youtube_url}
				<div class="flex flex-wrap gap-3 mb-6">
					{#if data.review.website_url}
						<a
							href={data.review.website_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 hover:border-haunt-orange px-4 py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-[calc((100%-1.5rem)/3)] md:w-auto"
							title="Visit Website"
							aria-label="Visit website"
							style="box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);"
						>
							<div class="absolute inset-0 bg-gradient-to-r from-haunt-orange/0 via-haunt-orange/10 to-haunt-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<svg class="w-5 h-5 text-gray-400 group-hover:text-haunt-orange transition-colors duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd" />
							</svg>
							<span class="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 relative z-10">Website</span>
						</a>
					{/if}
					{#if data.review.facebook_url}
						<a
							href={data.review.facebook_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 hover:border-haunt-orange px-4 py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-[calc((100%-1.5rem)/3)] md:w-auto"
							title="Visit Facebook"
							aria-label="Visit Facebook page"
							style="box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);"
						>
							<div class="absolute inset-0 bg-gradient-to-r from-haunt-orange/0 via-haunt-orange/10 to-haunt-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<svg class="w-5 h-5 text-[#1877F2] transition-colors duration-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
							</svg>
							<span class="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 relative z-10">Facebook</span>
						</a>
					{/if}
					{#if data.review.instagram_url}
						<a
							href={data.review.instagram_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 hover:border-haunt-orange px-4 py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-[calc((100%-1.5rem)/3)] md:w-auto"
							title="Visit Instagram"
							aria-label="Visit Instagram page"
							style="box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);"
						>
							<div class="absolute inset-0 bg-gradient-to-r from-haunt-orange/0 via-haunt-orange/10 to-haunt-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<svg class="w-5 h-5 text-[#E4405F] transition-colors duration-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
							<span class="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 relative z-10">Instagram</span>
						</a>
					{/if}
					{#if data.review.twitter_url}
						<a
							href={data.review.twitter_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 hover:border-haunt-orange px-4 py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-[calc((100%-1.5rem)/3)] md:w-auto"
							title="Visit Twitter/X"
							aria-label="Visit Twitter/X page"
							style="box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);"
						>
							<div class="absolute inset-0 bg-gradient-to-r from-haunt-orange/0 via-haunt-orange/10 to-haunt-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<svg class="w-5 h-5 text-white transition-colors duration-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
							<span class="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 relative z-10">Twitter</span>
						</a>
					{/if}
					{#if data.review.tiktok_url}
						<a
							href={data.review.tiktok_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 hover:border-haunt-orange px-4 py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-[calc((100%-1.5rem)/3)] md:w-auto"
							title="Visit TikTok"
							aria-label="Visit TikTok page"
							style="box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);"
						>
							<div class="absolute inset-0 bg-gradient-to-r from-haunt-orange/0 via-haunt-orange/10 to-haunt-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<svg class="w-5 h-5 text-white transition-colors duration-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
							</svg>
							<span class="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 relative z-10">TikTok</span>
						</a>
					{/if}
					{#if data.review.youtube_url}
						<a
							href={data.review.youtube_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 hover:border-haunt-orange px-4 py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-[calc((100%-1.5rem)/3)] md:w-auto"
							title="Watch on YouTube"
							aria-label="Watch video on YouTube"
							style="box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);"
						>
							<div class="absolute inset-0 bg-gradient-to-r from-haunt-orange/0 via-haunt-orange/10 to-haunt-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<svg class="w-5 h-5 text-[#FF0000] transition-colors duration-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
							<span class="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 relative z-10">YouTube</span>
						</a>
					{/if}
				</div>
			{/if}

			<!-- Ratings and Awards Side by Side -->
			<div class="flex flex-col md:flex-row gap-3 mb-6">
				<!-- Overall Rating -->
				{#if data.review.rating_overall}
					<div class="bg-gray-800/50 rounded px-6 pt-3 pb-4 border border-gray-700 flex flex-col items-center h-48 w-full md:w-[400px]">
						<h2 class="text-2xl font-bold text-haunt-orange uppercase leading-none text-center">Overall Rating</h2>
						<div class="flex-1 flex items-center justify-center w-full">
							<div class="flex flex-col items-center gap-3 mt-2 w-full">
								<div class="flex items-center justify-center gap-2 mt-2 w-full">
									<div class="text-6xl font-bold text-white leading-none" style="text-shadow: 0 0 20px rgba(252, 116, 3, 0.6), 0 0 40px rgba(252, 116, 3, 0.4);">{data.review.rating_overall.toFixed(1)}</div>
									</div>
								<div class="flex items-center justify-center gap-1 w-full">
									{#each Array(5) as _, i}
										{@const rating = data.review.rating_overall}
										{@const isHalf = i === Math.floor(rating) && rating % 1 !== 0}
										{@const isFull = i < Math.floor(rating)}

										{#if isHalf}
											<!-- Mobile: Use half-ghost image -->
											<img
												src="/half-ghost.png"
												alt="Rating ghost"
												class="w-14 h-14 object-contain opacity-100 brightness-150 md:hidden"
												style="filter: drop-shadow(0 4px 8px rgba(252, 116, 3, 0.8)) contrast(1.2);"
											/>
											<!-- Desktop: Use clip-path -->
											<div class="relative w-14 h-14 hidden md:block">
												<!-- Dim background ghost -->
												<img
													src="/ghost.png"
													alt="Rating ghost"
													class="absolute inset-0 w-14 h-14 object-contain opacity-30 grayscale"
												/>
												<!-- Bright half ghost (clipped to left 50%) -->
												<img
													src="/ghost.png"
													alt="Rating ghost"
													class="absolute inset-0 w-14 h-14 object-contain opacity-100 brightness-150"
													style="clip-path: inset(0 50% 0 0); filter: drop-shadow(0 4px 8px rgba(252, 116, 3, 0.8)) contrast(1.2);"
												/>
											</div>
										{:else}
											<img
												src="/ghost.png"
												alt="Rating ghost"
												class="w-14 h-14 object-contain transition-all {isFull ? 'opacity-100 brightness-110' : 'opacity-20 grayscale'}"
												style="filter: {isFull ? 'drop-shadow(0 3px 6px rgba(252, 116, 3, 0.5))' : 'none'};"
											/>
										{/if}
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Golden Ghost Awards -->
				{#if hasGoldenGhostAwards(data.review)}
					<div class="bg-gray-800/50 rounded px-2 md:px-6 pt-3 pb-4 border border-yellow-500/30 relative overflow-hidden flex flex-col items-center h-48 w-full md:w-auto md:flex-1" style="box-shadow: 0 0 20px rgba(234, 179, 8, 0.1);">
						<div class="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5 pointer-events-none"></div>
						<div class="flex-1 flex flex-col items-center justify-center relative z-10 gap-1 md:gap-4">
							<h2 class="font-bold text-yellow-400 uppercase leading-none text-center whitespace-nowrap" style="font-size: 1.300rem;">{reviewYear} Golden Ghost Award Winner</h2>
							<div class="text-base w-full flex justify-center -mt-6 md:-mt-8 ml-2 md:ml-0" style="transform: scale(1);" class:md:scale={true}>
								<style>
									.md\:scale {
										transform: scale(1);
									}
									@media (min-width: 768px) {
										.md\:scale {
											transform: scale(1.5);
										}
									}
								</style>
								<GoldenGhostAwards
									review={data.review}
									layout="horizontal"
									size="small"
									animation="none"
									showLabel={false}
								/>
							</div>
						</div>
					</div>
				{/if}
			</div>
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

		<!-- Review Text with Inline Images -->
		{#if data.review.review_text}
			<div class="bg-gray-800/50 rounded-lg px-4 py-3 md:p-6 mb-6 border border-gray-700">
				<h2 class="text-2xl font-bold text-haunt-orange uppercase leading-none mb-4">{data.review.name} Review</h2>
				<div class="prose prose-invert max-w-none text-gray-300 leading-relaxed" style="white-space: pre-line;">
					<style>
						.prose p {
							margin-top: 0 !important;
							margin-bottom: 0 !important;
							padding-top: 0 !important;
							padding-bottom: 0 !important;
						}
						.prose div {
							margin-top: 0 !important;
							margin-bottom: 0 !important;
							padding-top: 0 !important;
							padding-bottom: 0 !important;
						}
						@media (max-width: 767px) {
							.prose p {
								margin-top: 0 !important;
								margin-bottom: 0 !important;
							}
							.prose div {
								margin-top: 0 !important;
								margin-bottom: 0 !important;
							}
						}
					</style>
					{@html formattedReviewText}
				</div>
			</div>
		{/if}



		<!-- Share This Review -->
		<div class="mb-6">
			<h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Share This Review</h3>
			<button
				onclick={copyLinkToClipboard}
				class="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 hover:border-haunt-orange px-6 py-3 rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
				title="Copy link to share"
				aria-label="Copy link to share"
				style="box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);"
			>
				<div class="absolute inset-0 bg-gradient-to-r from-haunt-orange/0 via-haunt-orange/10 to-haunt-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				<svg class="w-5 h-5 text-haunt-orange transition-colors duration-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
				</svg>
				<span class="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 relative z-10">Copy Link to Share</span>
			</button>
		</div>
		<!-- Comments Section -->
		<div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
			<h2 class="text-2xl font-bold text-haunt-orange uppercase leading-none mb-4">
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

<!-- Toast Notification -->
{#if showCopyToast}
	<div
		class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9999] px-8 py-5 bg-haunt-orange text-white rounded-xl shadow-2xl flex items-center justify-center gap-3 max-w-[90vw]"
		style="box-shadow: 0 10px 40px rgba(252, 116, 3, 0.6); animation: slideUp 0.3s ease-out;"
	>
		<svg class="w-7 h-7 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
		</svg>
		<span class="font-bold text-xl">{copyToastMessage}</span>
	</div>
{/if}

<style>
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translate(-50%, 20px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
</style>
