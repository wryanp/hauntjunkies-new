<script lang="ts">
	import ParallaxHero from '$lib/components/ParallaxHero.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

</script>

<svelte:head>
	<title>Haunt Junkies - Your Source for Haunted Attraction Reviews</title>
	<meta name="description" content="Expert reviews of haunted houses, haunted attractions, and home haunts. Find the best scares near you!" />
</svelte:head>

<!-- Hero Section -->
<ParallaxHero
	backgroundImage="/bg.jpg"
	title="Haunt Junkies"
	subtitle="Your trusted source for haunted attraction reviews"
	announcement={data.heroMessage?.message}
/>

<!-- Featured Reviews Section -->
<section class="py-12 bg-gradient-to-b from-black via-gray-900 to-black">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-4xl md:text-5xl font-bold text-center text-haunt-orange mb-4 font-creepster">
			Featured Reviews
		</h2>
		<p class="text-center text-gray-400 mb-12 text-lg">
			Our top-rated haunted attractions
		</p>

		{#if data.featuredReviews && data.featuredReviews.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each data.featuredReviews as review}
					<a
						href="/reviews/{review.slug}"
						class="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-haunt-orange"
					>
						{#if review.cover_image_url}
							<div class="aspect-video overflow-hidden">
								<img
									src={review.cover_image_url}
									alt={review.name}
									class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
								/>
							</div>
						{/if}
						<div class="p-6">
							<h3 class="text-2xl font-bold text-white group-hover:text-haunt-orange transition-colors mb-2">
								{review.name}
							</h3>
							{#if review.city && review.state}
								<p class="text-gray-400 mb-3">
									{review.city}, {review.state}
								</p>
							{/if}
							{#if review.rating_overall}
								<div class="flex items-center gap-2">
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
									<span class="text-gray-400">{review.rating_overall.toFixed(1)}</span>
								</div>
							{/if}
							{#if review.description}
								<p class="text-gray-300 mt-3 line-clamp-3">
									{review.description}
								</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-400 text-lg">No featured reviews yet. Check back soon!</p>
			</div>
		{/if}

		<div class="text-center mt-12">
			<a
				href="/reviews"
				class="inline-block bg-haunt-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
			>
				View All Reviews
			</a>
		</div>
	</div>
</section>

<!-- McCloud Manor CTA Section with Video -->
<section class="relative h-screen overflow-hidden">
	<!-- Background Video -->
	<div class="absolute inset-0 overflow-hidden">
		<video
			autoplay
			muted
			loop
			playsinline
			class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
		>
			<source src="/videos/haunt.mp4" type="video/mp4" />
		</video>
	</div>

	<!-- Content -->
	<div class="relative z-10 h-full flex items-center justify-center">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<h2 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-creepster drop-shadow-2xl">
				Visit McCloud Manor
			</h2>
			<p class="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg">
				Experience our award-winning home haunt. A terrifying journey through the depths of horror awaits you.
			</p>
			<a
				href="/haunt"
				class="inline-block bg-haunt-red hover:bg-red-800 text-white font-bold py-4 px-10 rounded-lg transition-all transform hover:scale-105 text-xl shadow-2xl"
			>
				Enter If You Dare
			</a>
		</div>
	</div>
</section>
