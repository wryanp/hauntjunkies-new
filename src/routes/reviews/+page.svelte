<script lang="ts">
	import type { PageData } from './$types';
	import type { Review } from '$lib/types';
	import SEO from '$lib/components/SEO.svelte';
	import { hasGoldenGhostAwards } from '$lib/utils/awards';
	import { isValidImageUrl, getFallbackReviewImage } from '$lib/imageUtils';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');

	// Extract state from address
	function getState(address: string | undefined): string {
		if (!address) return 'Unknown';

		const parts = address.split(',').map(p => p.trim());
		if (parts.length >= 2) {
			const stateZip = parts[parts.length - 1];
			const stateMatch = stateZip.match(/^([A-Z]{2})/);
			return stateMatch ? stateMatch[1] : 'Unknown';
		}

		return 'Unknown';
	}

	// Extract year from review name
	function getYear(name: string): string {
		const yearMatch = name.match(/(\d{4})/);
		return yearMatch ? yearMatch[1] : 'Unknown';
	}

	// Extract city and state from full address
	function getCityState(address: string | undefined): string {
		if (!address) return '';

		// Address format: "Street, City, State ZIP"
		const parts = address.split(',').map(p => p.trim());

		if (parts.length >= 3) {
			// Has street, city, state
			const city = parts[parts.length - 2];
			const stateZip = parts[parts.length - 1];
			const stateMatch = stateZip.match(/^([A-Z]{2})/);
			return stateMatch ? `${city}, ${stateMatch[1]}` : city;
		} else if (parts.length === 2) {
			// Has city, state
			const stateZip = parts[1];
			const stateMatch = stateZip.match(/^([A-Z]{2})/);
			return stateMatch ? `${parts[0]}, ${stateMatch[1]}` : parts[0];
		}

		return address;
	}

	// Filter and group reviews
	const groupedReviews = $derived.by(() => {
		// First filter by search query
		let reviews = data.reviews;
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			reviews = reviews.filter(review =>
				review.name.toLowerCase().includes(query) ||
				review.address?.toLowerCase().includes(query) ||
				review.description?.toLowerCase().includes(query)
			);
		}

		// Group by state and year
		const grouped: Record<string, Record<string, Review[]>> = {};

		reviews.forEach(review => {
			const state = getState(review.address);
			const year = getYear(review.name);

			if (!grouped[state]) {
				grouped[state] = {};
			}
			if (!grouped[state][year]) {
				grouped[state][year] = [];
			}
			grouped[state][year].push(review);
		});

		// Sort reviews within each year by review_date (most recent first)
		Object.keys(grouped).forEach(state => {
			Object.keys(grouped[state]).forEach(year => {
				grouped[state][year].sort((a, b) => {
					const dateA = a.review_date ? new Date(a.review_date).getTime() : 0;
					const dateB = b.review_date ? new Date(b.review_date).getTime() : 0;
					return dateB - dateA;
				});
			});
		});

		return grouped;
	});

	// Get most recent review date for a state
	function getMostRecentDateForState(state: string): number {
		let mostRecent = 0;
		Object.keys(groupedReviews[state]).forEach(year => {
			groupedReviews[state][year].forEach(review => {
				const reviewDate = review.review_date ? new Date(review.review_date).getTime() : 0;
				if (reviewDate > mostRecent) {
					mostRecent = reviewDate;
				}
			});
		});
		return mostRecent;
	}

	// Get sorted states (by most recent review)
	const sortedStates = $derived(
		Object.keys(groupedReviews).sort((a, b) => {
			return getMostRecentDateForState(b) - getMostRecentDateForState(a);
		})
	);

	// Get sorted years for a state (most recent first)
	function getSortedYears(state: string): string[] {
		return Object.keys(groupedReviews[state]).sort((a, b) => {
			if (a === 'Unknown') return 1;
			if (b === 'Unknown') return 1;
			return parseInt(b) - parseInt(a);
		});
	}
</script>

<SEO
	title="Haunt Reviews"
	description="Expert reviews of haunted attractions, Halloween events, and horror experiences. Find the scariest haunts near you with detailed ratings, photos, and insider tips from Haunt Junkies."
	url="/reviews"
	image="/og.png"
	type="website"
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		'itemListElement': data.reviews.slice(0, 10).map((review, index) => ({
			'@type': 'ListItem',
			'position': index + 1,
			'item': {
				'@type': 'Review',
				'@id': `https://hauntjunkies.com/reviews/${review.slug}`,
				'name': review.name,
				'reviewRating': review.rating_overall ? {
					'@type': 'Rating',
					'ratingValue': review.rating_overall,
					'bestRating': 5
				} : undefined,
				'itemReviewed': {
					'@type': 'LocalBusiness',
					'name': review.name,
					...(review.address ? { 'address': review.address } : {})
				}
			}
		}))
	})}</` + `script>`}
</svelte:head>

<div class="bg-gradient-to-b from-neutral-900 via-black via-30% via-neutral-900 via-60% via-black to-neutral-900 pt-32 pb-12 md:pt-32 md:pb-12" style="min-height: 100vh; min-height: -webkit-fill-available; min-height: 100dvh;">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(255,107,0,0.6);">
				HAUNT REVIEWS
			</h1>
			<div class="w-48 h-1 bg-gradient-to-r from-transparent via-haunt-orange to-transparent mx-auto mb-6"></div>
			<a href="/review-criteria" class="text-white hover:text-haunt-orange transition-colors text-xl uppercase tracking-wider font-semibold">
				Review Criteria Explained →
			</a>
		</div>

		<!-- Search Filter -->
		<div class="mb-12">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search by name or location..."
				class="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange"
			/>
		</div>

		<!-- Reviews Grid -->
		{#if sortedStates.length > 0}
			{#each sortedStates as state}
				<!-- State Header -->
				<div class="mb-12">
					<h2 class="text-4xl font-bold text-haunt-orange mb-8 pb-4 border-b-2 border-haunt-orange/30">
						{state}
					</h2>

					{#each getSortedYears(state) as year}
						<!-- Year Subheader -->
						<div class="mb-10">
							<h3 class="text-2xl font-semibold text-gray-300 mb-6 pl-4 border-l-4 border-haunt-orange/50">
								{year}
							</h3>

							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{#each groupedReviews[state][year] as review}
					{@const logo = data.logos[review.id]}
					{@const imageUrl = logo || (isValidImageUrl(review.cover_image_url)
						? review.cover_image_url
						: getFallbackReviewImage())}
					<a
						href="/reviews/{review.slug}"
						class="group bg-neutral-900/50 rounded-lg overflow-hidden hover:bg-neutral-900 transition-all duration-300 relative border border-neutral-800 {hasGoldenGhostAwards(review) ? 'hover:border-yellow-500' : 'hover:border-haunt-orange'} transform hover:scale-105 flex flex-col h-full"
					>
						{#if hasGoldenGhostAwards(review)}
							{@const yearMatch = review.name.match(/(\d{4})/)}
							{@const displayYear = yearMatch ? yearMatch[1] : new Date().getFullYear().toString()}
							<div class="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 px-2 py-2 flex items-center justify-center gap-1.5 relative overflow-hidden">
								<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
								<img src="/golden-ghost-award.webp" alt="Golden Ghost Award" loading="lazy" class="w-6 h-6 md:w-8 md:h-8 relative z-10 flex-shrink-0" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)) contrast(1.1) brightness(1.05);" />
								<span class="text-black font-bold text-xs md:text-sm uppercase tracking-tighter relative z-10 whitespace-nowrap">
									{displayYear} Golden Ghost Award Winner
								</span>
							</div>
						{/if}

						<div class="aspect-video overflow-hidden bg-gray-900">
							<img
								src={imageUrl}
								alt={review.name}
								loading="lazy"
								class="w-full h-full {logo || isValidImageUrl(review.cover_image_url) ? 'object-contain' : 'object-cover'} transition-transform duration-300"
							/>
						</div>

						<div class="p-6 flex-1 flex flex-col">
							<h4 class="text-2xl font-bold text-white group-hover:text-haunt-orange transition-colors mb-2">
								{review.name}
							</h4>
							{#if review.address}
								{@const cityState = getCityState(review.address)}
								<p class="text-gray-400 mb-3 flex items-center gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
									</svg>
									{cityState}
								</p>
							{/if}
											{#if review.rating_overall}
												<div class="flex items-center gap-3 mb-3">
													<div class="flex items-center gap-0.5">
														{#each Array(5) as _, i}
															{@const rating = review.rating_overall}
															{@const isHalf = i === Math.floor(rating) && rating % 1 !== 0}
															{@const isFull = i < Math.floor(rating)}

															{#if isHalf}
																<!-- Mobile: Use half-ghost image -->
																<img
																	src="/half-ghost.webp"
																	alt="Rating ghost"
																	class="w-7 h-7 object-contain opacity-100 brightness-110 md:hidden -mx-1.5"
																	style="filter: drop-shadow(0 2px 4px rgba(252, 116, 3, 0.4));"
																/>
																<!-- Desktop: Use clip-path -->
																<div class="relative w-7 h-7 hidden md:block">
																	<!-- Dim background ghost -->
																	<img
																		src="/ghost.webp"
																		alt="Rating ghost"
																		class="absolute inset-0 w-7 h-7 object-contain opacity-20 grayscale"
																	/>
																	<!-- Bright half ghost (clipped to left 50%) -->
																	<img
																		src="/ghost.webp"
																		alt="Rating ghost"
																		class="absolute inset-0 w-7 h-7 object-contain opacity-100 brightness-110"
																		style="clip-path: inset(0 50% 0 0); filter: drop-shadow(0 2px 4px rgba(252, 116, 3, 0.4));"
																	/>
																</div>
															{:else}
																<img
																	src="/ghost.webp"
																	alt="Rating ghost"
																	class="w-7 h-7 object-contain transition-all {isFull ? 'opacity-100 brightness-110' : 'opacity-20 grayscale'}"
																	style="filter: {isFull ? 'drop-shadow(0 2px 4px rgba(252, 116, 3, 0.4))' : 'none'};"
																/>
															{/if}
														{/each}
													</div>
													<span class="text-gray-400 font-medium text-lg leading-none">{review.rating_overall.toFixed(1)}</span>
												</div>
											{/if}
							{#if review.caption}
								<p class="text-gray-300 italic line-clamp-3 leading-relaxed pl-3 border-l-2 border-haunt-orange/30 min-h-[4.5rem] mt-auto">
									{review.caption}
								</p>
							{/if}
						</div>
					</a>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/each}
		{:else}
			<div class="text-center py-20">
				<div class="text-6xl mb-4">🔍</div>
				<p class="text-gray-400 text-lg">No reviews found matching your criteria</p>
			</div>
		{/if}
	</div>
</div>
