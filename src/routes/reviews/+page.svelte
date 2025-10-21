<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedYear = $state('all');

	const years = $derived.by(() => {
		const yearSet = new Set(data.reviews.map(r => r.year).filter(Boolean) as number[]);
		return ['all', ...Array.from(yearSet).sort((a, b) => b - a)] as (string | number)[];
	});

	const filteredReviews = $derived.by(() => {
		return data.reviews.filter(review => {
			const matchesSearch = review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			                     (review.city?.toLowerCase().includes(searchQuery.toLowerCase())) ||
			                     (review.state?.toLowerCase().includes(searchQuery.toLowerCase()));
			const matchesYear = selectedYear === 'all' || review.year?.toString() === selectedYear.toString();
			return matchesSearch && matchesYear;
		});
	});
</script>

<svelte:head>
	<title>Haunt Reviews - Haunt Junkies</title>
	<meta name="description" content="Browse our comprehensive collection of haunted attraction reviews" />
</svelte:head>

<div class="bg-gradient-to-b from-gray-900 to-black min-h-screen py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-5xl md:text-6xl font-bold text-white mb-4 font-creepster">
				Haunt Reviews
			</h1>
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
					bind:value={selectedYear}
					class="w-full md:w-48 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
				>
					{#each years as year}
						<option value={year}>{year === 'all' ? 'All Years' : year}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Reviews Grid -->
		{#if filteredReviews.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each filteredReviews as review}
					<a
						href="/reviews/{review.slug}"
						class="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-haunt-orange"
					>
						{#if review.cover_image_url}
							<div class="aspect-video overflow-hidden bg-gray-900">
								<img
									src={review.cover_image_url}
									alt={review.name}
									class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
								/>
							</div>
						{:else}
							<div class="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
								<div class="text-6xl">🏚️</div>
							</div>
						{/if}
						<div class="p-6">
							<div class="flex items-start justify-between gap-2 mb-2">
								<h3 class="text-2xl font-bold text-white group-hover:text-haunt-orange transition-colors flex-1">
									{review.name}
								</h3>
								{#if review.year}
									<span class="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
										{review.year}
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
		{:else}
			<div class="text-center py-20">
				<div class="text-6xl mb-4">🔍</div>
				<p class="text-gray-400 text-lg">No reviews found matching your criteria</p>
			</div>
		{/if}
	</div>
</div>
