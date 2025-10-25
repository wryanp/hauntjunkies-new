<script lang="ts">
	import type { PageData } from './$types';
	import type { Review } from '$lib/types';
	import SEO from '$lib/components/SEO.svelte';
	import { hasGoldenGhostAwards } from '$lib/utils/awards';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedYear = $state('all');
	let selectedState = $state('all');

	// Get unique years from reviews
	const years = $derived.by(() => {
		const yearSet = new Set(data.reviews.map(r => r.year).filter(Boolean) as number[]);
		return ['all', ...Array.from(yearSet).sort((a, b) => b - a)] as (string | number)[];
	});

	// Get unique states from reviews
	const states = $derived.by(() => {
		const stateSet = new Set(data.reviews.map(r => r.state).filter(Boolean) as string[]);
		return ['all', ...Array.from(stateSet).sort()] as string[];
	});

	// Filter reviews based on search and filters
	const filteredReviews = $derived.by(() => {
		return data.reviews.filter(review => {
			const matchesSearch = review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			                     (review.city?.toLowerCase().includes(searchQuery.toLowerCase())) ||
			                     (review.state?.toLowerCase().includes(searchQuery.toLowerCase()));
			const matchesYear = selectedYear === 'all' || review.year?.toString() === selectedYear.toString();
			const matchesState = selectedState === 'all' || review.state === selectedState;
			return matchesSearch && matchesYear && matchesState;
		});
	});

	// Group reviews by state and year for organized display
	type GroupedReviews = {
		[state: string]: {
			[year: string]: Review[]
		}
	};

	const groupedReviews = $derived.by(() => {
		const grouped: GroupedReviews = {};

		filteredReviews.forEach(review => {
			const state = review.state || 'Unknown State';
			const year = review.year?.toString() || 'Unknown Year';

			if (!grouped[state]) {
				grouped[state] = {};
			}
			if (!grouped[state][year]) {
				grouped[state][year] = [];
			}

			grouped[state][year].push(review);
		});

		return grouped;
	});

	// Get sorted state keys
	const sortedStates = $derived.by(() => {
		return Object.keys(groupedReviews).sort();
	});
</script>

<SEO
	title="Haunt Reviews"
	description="Expert reviews of haunted attractions, Halloween events, and horror experiences. Find the scariest haunts near you with detailed ratings, photos, and insider tips from Haunt Junkies."
	url="/reviews"
	image="/og-reviews.jpg"
	type="website"
/>

<div class="bg-gradient-to-b from-gray-900 to-black pt-32 pb-12 md:pt-32 md:pb-12" style="min-height: 100vh; min-height: -webkit-fill-available; min-height: 100dvh;">
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

		<!-- Filters -->
		<div class="mb-12 flex flex-col md:flex-row gap-4">
			<div class="flex-1">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search by name or location..."
					class="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange"
				/>
			</div>
			<div>
				<select
					bind:value={selectedState}
					class="w-full md:w-48 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
				>
					{#each states as state}
						<option value={state}>{state === 'all' ? 'All States' : state}</option>
					{/each}
				</select>
			</div>
			<div>
				<select
					bind:value={selectedYear}
					class="w-full md:w-48 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
				>
					{#each years as year}
						<option value={year}>{year === 'all' ? 'All Years' : year}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Reviews organized by State and Year -->
		{#if filteredReviews.length > 0}
			{#each sortedStates as state}
				<div class="mb-16">
					<!-- State Header -->
					<div class="mb-8">
						<h2 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange mb-2">
							{state}
						</h2>
						<div class="w-24 h-1 bg-gradient-to-r from-haunt-orange to-transparent"></div>
					</div>

					<!-- Years within this state -->
					{#each Object.keys(groupedReviews[state]).sort((a, b) => Number(b) - Number(a)) as year}
						<div class="mb-12">
							<!-- Year subheader -->
							<h3 class="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
								<span class="text-haunt-orange">{year}</span>
								<div class="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
							</h3>

							<!-- Reviews grid for this year -->
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{#each groupedReviews[state][year] as review}
									{@const imageUrl = review.cover_image_url && !review.cover_image_url.includes('placeholder')
										? review.cover_image_url
										: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&h=450&q=80&fit=crop'}
									<a
										href="/reviews/{review.slug}"
										class="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 relative border border-gray-700 {hasGoldenGhostAwards(review) ? 'hover:border-yellow-500' : 'hover:border-haunt-orange'} transform hover:scale-105 flex flex-col h-full"
									>
										{#if hasGoldenGhostAwards(review)}
											{@const yearMatch = review.name.match(/(\d{4})/)}
											{@const displayYear = yearMatch ? yearMatch[1] : new Date().getFullYear().toString()}
											<div class="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 px-2 py-2 flex items-center justify-center gap-1.5 relative overflow-hidden">
												<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
												<img src="/golden-ghost-award.png" alt="Golden Ghost Award" class="w-6 h-6 md:w-8 md:h-8 relative z-10 flex-shrink-0" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)) contrast(1.1) brightness(1.05);" />
												<span class="text-black font-bold text-xs md:text-sm uppercase tracking-tighter relative z-10 whitespace-nowrap">
													{displayYear} Golden Ghost Award Winner
												</span>
											</div>
										{/if}

										<div class="aspect-video overflow-hidden bg-gray-900">
											<img
												src={imageUrl}
												alt={review.name}
												class="w-full h-full {review.cover_image_url && !review.cover_image_url.includes('placeholder') ? 'object-contain' : 'object-cover'} transition-transform duration-300"
											/>
										</div>

										<div class="p-6 flex-1 flex flex-col">
											<div class="flex items-start justify-between gap-2 mb-2">
												<h4 class="text-2xl font-bold text-white group-hover:text-haunt-orange transition-colors flex-1">
													{review.name}
												</h4>
												{#if review.review_date}
													<span class="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
														{new Date(review.review_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
													</span>
												{/if}
											</div>
											{#if review.city && review.state}
												<p class="text-gray-400 mb-3 flex items-center gap-1">
													<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
														<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
													</svg>
													{review.city}, {review.state}
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
																	src="/half-ghost.png"
																	alt="Rating ghost"
																	class="w-7 h-7 object-contain opacity-100 brightness-110 md:hidden"
																	style="filter: drop-shadow(0 2px 4px rgba(252, 116, 3, 0.4));"
																/>
																<!-- Desktop: Use clip-path -->
																<div class="relative w-7 h-7 hidden md:block">
																	<!-- Dim background ghost -->
																	<img
																		src="/ghost.png"
																		alt="Rating ghost"
																		class="absolute inset-0 w-7 h-7 object-contain opacity-20 grayscale"
																	/>
																	<!-- Bright half ghost (clipped to left 50%) -->
																	<img
																		src="/ghost.png"
																		alt="Rating ghost"
																		class="absolute inset-0 w-7 h-7 object-contain opacity-100 brightness-110"
																		style="clip-path: inset(0 50% 0 0); filter: drop-shadow(0 2px 4px rgba(252, 116, 3, 0.4));"
																	/>
																</div>
															{:else}
																<img
																	src="/ghost.png"
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
											{#if review.description}
												<p class="text-gray-300 italic line-clamp-3 leading-relaxed pl-3 border-l-2 border-haunt-orange/30 min-h-[4.5rem] mt-auto">
													{review.description}
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
