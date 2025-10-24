<script lang="ts">
	import type { PageData } from './$types';
	import type { Review } from '$lib/types';
	import SEO from '$lib/components/SEO.svelte';

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
			<p class="text-xl text-gray-400">
				Explore {data.reviews.length} haunted attraction{data.reviews.length !== 1 ? 's' : ''}
			</p>
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
									<a
										href="/reviews/{review.slug}"
										class="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-haunt-orange"
									>
										{#if review.cover_image_url}
											<div class="aspect-video overflow-hidden bg-gray-900">
												<img
													src={review.cover_image_url}
													alt={review.name}
													class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
												/>
											</div>
										{:else}
											<div class="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
												<div class="text-6xl">🏚️</div>
											</div>
										{/if}
										<div class="p-6">
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
												<div class="flex items-center gap-2 mb-3">
													<div class="flex">
														{#each Array(5) as _, i}
															<svg
																class="w-5 h-5 {i < Math.round(review.rating_overall) ? 'text-haunt-orange' : 'text-gray-600'}"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
															</svg>
														{/each}
													</div>
													<span class="text-gray-400 font-medium">{review.rating_overall.toFixed(1)}</span>
												</div>
											{/if}
											{#if review.description}
												<p class="text-gray-300 line-clamp-3">
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
