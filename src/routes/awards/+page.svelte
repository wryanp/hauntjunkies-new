<script lang="ts">
	import type { PageData } from './$types';
	import type { AwardCategory } from '$lib/types';
	import { AWARD_CATEGORIES } from '$lib/types';
	import SEO from '$lib/components/SEO.svelte';
	import GoldenGhostAwards from '$lib/components/GoldenGhostAwards.svelte';
	import { getAwards, getReviewsByCategory, getAwardCount } from '$lib/utils/awards';

	let { data }: { data: PageData } = $props();

	let selectedYear = $state<number | 'all'>('all');
	let selectedCategory = $state<AwardCategory | 'all'>('all');

	// Filter reviews based on selected year and category
	const filteredReviews = $derived.by(() => {
		let filtered = data.awardWinners;

		if (selectedYear !== 'all') {
			const year = selectedYear as number;
			filtered = filtered.filter((review) => {
				const awards = getAwards(review);
				return awards.some((award) => award.year === year);
			});
		}

		if (selectedCategory !== 'all') {
			const category = selectedCategory as AwardCategory;
			filtered = getReviewsByCategory(filtered, category);
		}

		return filtered;
	});
</script>

<SEO
	title="Golden Ghost Awards - Haunt Junkies"
	description="Explore all Golden Ghost Award winners - recognizing the best haunted attractions for outstanding performance, makeup, set design, storytelling, and more."
	url="/awards"
	image="/og-awards.jpg"
	type="website"
/>

<div class="bg-gradient-to-b from-gray-900 via-black to-gray-900 min-h-screen pt-32 pb-20">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="text-center mb-16">
			<div class="inline-flex items-center justify-center gap-4 mb-6">
				<img src="/golden-ghost-award.png" alt="Golden Ghost Award" class="w-20 h-20 md:w-24 md:h-24 drop-shadow-2xl" />
				<h1
					class="text-5xl md:text-6xl lg:text-7xl font-extrabold"
					style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFA500 75%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 60px rgba(255,215,0,0.6);"
				>
					GOLDEN GHOST AWARDS
				</h1>
				<img src="/golden-ghost-award.png" alt="Golden Ghost Award" class="w-20 h-20 md:w-24 md:h-24 drop-shadow-2xl" />
			</div>
			<div class="w-64 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-8"></div>
			<p class="text-2xl md:text-3xl text-yellow-100 font-bold max-w-3xl mx-auto mb-4">
				Celebrating Excellence in Haunted Attractions
			</p>
			<p class="text-lg text-gray-300 max-w-2xl mx-auto">
				Recognizing haunts for creating the most immersive, terrifying, and unforgettable haunted house experiences
			</p>
		</div>

		<!-- Award Categories Overview -->
		<div class="mb-16 bg-gray-800/50 rounded-2xl p-8 border border-yellow-500/30">
			<h2 class="text-3xl font-bold text-yellow-400 mb-6 text-center">Award Categories</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each Object.entries(AWARD_CATEGORIES) as [key, info]}
					<div class="bg-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-yellow-500/50 transition-colors">
						<div class="flex items-center gap-3 mb-3">
							<span class="text-4xl">{info.icon}</span>
							<h3 class="text-xl font-bold text-white">{info.label}</h3>
						</div>
						<p class="text-gray-400 text-sm">{info.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Filters -->
		<div class="mb-12 flex flex-col md:flex-row gap-4">
			<div class="flex-1">
				<label class="block text-sm font-medium text-gray-400 mb-2">Filter by Year</label>
				<select
					bind:value={selectedYear}
					class="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-500"
				>
					<option value="all">All Years</option>
					{#each data.awardYears as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</div>
			<div class="flex-1">
				<label class="block text-sm font-medium text-gray-400 mb-2">Filter by Category</label>
				<select
					bind:value={selectedCategory}
					class="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-500"
				>
					<option value="all">All Categories</option>
					{#each Object.entries(AWARD_CATEGORIES) as [key, info]}
						<option value={key}>{info.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Award Winners Grid -->
		{#if filteredReviews.length > 0}
			<div class="mb-8">
				<h2 class="text-3xl font-bold text-white mb-6">
					{selectedYear !== 'all' ? `${selectedYear} ` : ''}Award Winners
					<span class="text-gray-500 text-xl ml-3">({filteredReviews.length})</span>
				</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each filteredReviews as review}
					<a
						href="/reviews/{review.slug}"
						class="group relative"
					>
						<!-- Golden glow effect -->
						<div class="absolute -inset-2 bg-gradient-to-r from-yellow-600/30 via-yellow-500/40 to-yellow-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

						<!-- Card -->
						<div class="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border-2 border-yellow-500/60 group-hover:border-yellow-400 transition-all duration-500" style="box-shadow: 0 0 30px rgba(255,215,0,0.4);">
							{#if review.cover_image_url}
								<div class="aspect-video overflow-hidden relative bg-gray-900">
									<img
										src={review.cover_image_url}
										alt={review.name}
										class="w-full h-full object-contain transition-transform duration-700"
									/>
									<!-- Gradient overlay -->
									<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
								</div>
							{:else}
								<div class="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
									<div class="text-6xl">🏚️</div>
								</div>
							{/if}

							<div class="p-6 relative">
								<!-- Decorative line -->
								<div class="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>

								<h3 class="text-2xl md:text-3xl font-extrabold text-white group-hover:text-yellow-400 transition-colors mb-3">
									{review.name}
								</h3>

								{#if review.city && review.state}
									<div class="flex items-center gap-2 text-gray-400 mb-4">
										<svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
										</svg>
										<p class="text-sm font-medium">{review.city}, {review.state}</p>
									</div>
								{/if}

								<!-- Awards Display -->
								<div class="mb-4">
									<GoldenGhostAwards
										{review}
										layout="grid"
										size="small"
										animation="none"
										showLabel={false}
									/>
								</div>

								{#if review.description}
									<p class="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">
										{review.description}
									</p>
								{/if}

								<!-- View button -->
								<div class="flex items-center gap-2 text-yellow-400 font-bold group-hover:gap-4 transition-all">
									<span class="text-sm uppercase tracking-wider">View Review</span>
									<svg class="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
				<div class="text-6xl mb-4">🏆</div>
				<p class="text-gray-400 text-lg">No award winners found matching your criteria</p>
			</div>
		{/if}

		<!-- Back to Home Button -->
		<div class="mt-16 text-center">
			<a
				href="/"
				class="inline-flex items-center gap-2 text-haunt-orange hover:text-orange-400 transition-colors text-lg font-medium"
			>
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Home
			</a>
		</div>
	</div>
</div>
