<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import QuoteSection from '$lib/components/QuoteSection.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import GoldenGhostAwards from '$lib/components/GoldenGhostAwards.svelte';
	import { getAwardCount, hasGoldenGhostAwards } from '$lib/utils/awards';
	import { isValidImageUrl, getFallbackReviewImage } from '$lib/imageUtils';
	import { getStateName } from '$lib/utils/states';

	let { data }: { data: PageData } = $props();
	let showMcCloudLogo = $state(false);
	let scrollContainer = $state<HTMLDivElement | undefined>();
	let autoScrollInterval: NodeJS.Timeout | null = null;
	let isPaused = $state(false);


	function scrollLeft() {
		if (scrollContainer) {
			const scrollAmount = scrollContainer.clientWidth;
			const currentScroll = scrollContainer.scrollLeft;

			// If at the beginning, scroll to the end
			if (currentScroll <= 10) {
				const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
				// Round to nearest scroll position to prevent overflow
				const targetScroll = Math.floor(maxScroll / scrollAmount) * scrollAmount;
				scrollContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
			} else {
				// Calculate target position and ensure it's aligned
				const targetScroll = Math.max(0, Math.round((currentScroll - scrollAmount) / scrollAmount) * scrollAmount);
				scrollContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
			}
		}
	}

	function scrollRight() {
		if (scrollContainer) {
			const scrollAmount = scrollContainer.clientWidth;
			const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
			const currentScroll = scrollContainer.scrollLeft;

			// If at the end, scroll back to the beginning
			if (currentScroll >= maxScroll - 10) {
				scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
			} else {
				// Calculate target position and ensure it's aligned
				const targetScroll = Math.min(maxScroll, Math.round((currentScroll + scrollAmount) / scrollAmount) * scrollAmount);
				scrollContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
			}
		}
	}

	function autoScroll() {
		if (!scrollContainer || isPaused) return;

		const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
		const currentScroll = scrollContainer.scrollLeft;

		// If at the end, scroll back to the beginning
		if (currentScroll >= maxScroll - 10) {
			scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
		} else {
			// Scroll by the container width (3 cards)
			const scrollAmount = scrollContainer.clientWidth;
			scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
		}
	}

	function startAutoScroll() {
		stopAutoScroll();
		autoScrollInterval = setInterval(autoScroll, 5000); // Scroll every 5 seconds
	}

	function stopAutoScroll() {
		if (autoScrollInterval) {
			clearInterval(autoScrollInterval);
			autoScrollInterval = null;
		}
	}

	function pauseAutoScroll() {
		isPaused = true;
	}

	function resumeAutoScroll() {
		isPaused = false;
	}

	// Keyboard navigation for carousel
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			scrollLeft();
			pauseAutoScroll();
			setTimeout(resumeAutoScroll, 10000); // Resume after 10 seconds
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			scrollRight();
			pauseAutoScroll();
			setTimeout(resumeAutoScroll, 10000);
		}
	}

	onMount(async () => {
		// Scroll to top when page loads
		window.scrollTo({ top: 0, behavior: 'instant' });

		const { PowerGlitch } = await import('powerglitch');

		// Apply glitch to McCloud Manor title
		PowerGlitch.glitch('.glitch-text', {
			playMode: 'always',
			createContainers: true,
			hideOverflow: false,
			timing: {
				duration: 2000,
				iterations: Infinity,
			},
			glitchTimeSpan: {
				start: 0.5,
				end: 0.7,
			},
			shake: {
				velocity: 15,
				amplitudeX: 0.2,
				amplitudeY: 0.2,
			},
			slice: {
				count: 6,
				velocity: 15,
				minHeight: 0.02,
				maxHeight: 0.15,
				hueRotate: true,
			},
		});

		// Intersection Observer for McCloud logo animation
		const observerOptions = {
			threshold: 0.3,
			rootMargin: '0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !showMcCloudLogo) {
					showMcCloudLogo = true;
				}
			});
		}, observerOptions);

		// Observe the logo
		const logo = document.querySelector('.mccloud-logo');
		if (logo) {
			observer.observe(logo);
		}

		// Apply glitch to "terrifying" text
		PowerGlitch.glitch('.glitch-text-terrifying', {
			playMode: 'always',
			createContainers: true,
			hideOverflow: false,
			timing: {
				duration: 2500,
				iterations: Infinity,
			},
			glitchTimeSpan: {
				start: 0.6,
				end: 0.8,
			},
			shake: {
				velocity: 20,
				amplitudeX: 0.3,
				amplitudeY: 0.2,
			},
			slice: {
				count: 8,
				velocity: 20,
				minHeight: 0.02,
				maxHeight: 0.2,
				hueRotate: true,
			},
			pulse: {
				scale: 1.05,
			},
		});

		// Add keyboard navigation
		window.addEventListener('keydown', handleKeyPress);

		// Start auto-scrolling for featured reviews
		startAutoScroll();
	});

	onDestroy(() => {
		stopAutoScroll();
		if (browser) {
			window.removeEventListener('keydown', handleKeyPress);
		}
	});

</script>

<SEO
	title="Haunt Junkies - Haunted Attraction Reviews and the Home of McCloud Manor"
	description="Haunted attraction reviews and the home of McCloud Manor Expert reviews of haunted houses, haunted attractions, and home haunts. Find the best scares near you!"
	url="/"
	image="/hauntjunkies-only.jpg"
	type="website"
/>

<svelte:head>
	<!-- SnapWidget Script for Instagram Feed -->
	<script src="https://snapwidget.com/js/snapwidget.js"></script>

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'name': 'Haunt Junkies',
		'url': 'https://hauntjunkies.com',
		'logo': 'https://hauntjunkies.com/logo-url.webp',
		'description': 'Expert reviews of haunted attractions, Halloween events, and horror experiences',
		'sameAs': [
			'https://www.facebook.com/hauntjunkies',
			'https://www.instagram.com/hauntjunkies',
			'https://www.tiktok.com/@hauntjunkies'
		]
	})}</` + `script>`}
</svelte:head>

<!-- Hero Section with Featured Reviews -->
<section class="parallax relative md:min-h-screen bg-overlay-dark bg-black overflow-visible">
	<!-- Background Image -->
	<div class="absolute inset-0 bg-center bg-no-repeat" style="background-image: url('/bg.webp'); background-size: cover; background-position: center;"></div>

	<!-- Overlay -->
	<div class="absolute inset-0 bg-black/40"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 pb-20 overflow-visible">
		<!-- Main Site Heading -->
		<h1 class="sr-only">Haunt Junkies - Southern California's Premier Haunted Attraction Reviews</h1>

		<!-- Featured Reviews Header -->
		<div class="text-center mb-12">
			<div class="relative inline-block">
				<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(255,107,0,0.6);">
					FEATURED REVIEWS
				</h2>

				<!-- Decorative underline -->
				<div class="w-48 h-1 bg-gradient-to-r from-transparent via-haunt-orange to-transparent mx-auto mb-6"></div>
			</div>

			<!-- <p class="text-2xl md:text-3xl text-orange-100 font-bold max-w-3xl mx-auto mb-2">
				Expert reviews from real haunt enthusiasts
			</p>
			<p class="text-lg text-gray-400 font-light">
				Read reviews from our previous haunt tours
			</p> -->
		</div>

		{#if data.featuredReviews && data.featuredReviews.length > 0}
			<div class="relative px-8 md:px-12 overflow-visible">
				<!-- Navigation Arrows -->
				{#if data.featuredReviews.length >= 2}
					<button
						onclick={scrollLeft}
						class="absolute left-2 md:-left-8 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-haunt-orange border-2 border-haunt-orange text-haunt-orange hover:text-white p-3 md:p-4 transition-all transform hover:scale-110 flex items-center justify-center"
						aria-label="Scroll left"
						style="box-shadow: 0 0 20px rgba(252, 116, 3, 0.5);"
					>
						<svg class="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						onclick={scrollRight}
						class="absolute right-2 md:-right-8 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-haunt-orange border-2 border-haunt-orange text-haunt-orange hover:text-white p-3 md:p-4 transition-all transform hover:scale-110 flex items-center justify-center"
						aria-label="Scroll right"
						style="box-shadow: 0 0 20px rgba(252, 116, 3, 0.5);"
					>
						<svg class="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				{/if}

				<!-- Scrollable Container -->
				<div
					bind:this={scrollContainer}
					role="region"
					aria-label="Featured reviews carousel"
					onmouseenter={pauseAutoScroll}
					onmouseleave={resumeAutoScroll}
					ontouchstart={pauseAutoScroll}
					ontouchend={resumeAutoScroll}
					class="carousel-container flex gap-0 md:gap-8 overflow-x-auto overflow-y-visible scroll-smooth py-12 px-0 md:px-6"
					style="scroll-snap-type: x mandatory;"
				>
					{#each data.featuredReviews as review}
						{@const logo = data.logos[review.id]}
						{@const imageUrl = logo || (isValidImageUrl(review.cover_image_url)
							? review.cover_image_url
							: getFallbackReviewImage())}
						<a
							href="/reviews/{review.slug}"
							class="group bg-neutral-900/50 rounded-lg overflow-hidden hover:bg-neutral-900 transition-all duration-300 relative border border-neutral-800 {hasGoldenGhostAwards(review) ? 'hover:border-yellow-500' : 'hover:border-haunt-orange'} transform md:hover:scale-105 md:hover:z-10 flex-shrink-0 w-full md:w-[calc((100%-4rem)/3)] flex flex-col"
							style="scroll-snap-align: center;"
						>
							{#if hasGoldenGhostAwards(review)}
								{@const yearMatch = review.name.match(/(\d{4})/)}
								{@const displayYear = yearMatch ? yearMatch[1] : new Date().getFullYear().toString()}
								<div class="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 px-2 py-2 flex items-center justify-center gap-1.5 relative overflow-hidden">
									<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
									<img src="/golden-ghost-award.webp" alt="Golden Ghost Award" loading="lazy" class="w-6 h-6 md:w-7 md:h-7 relative z-10 flex-shrink-0" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)) contrast(1.1) brightness(1.05);" />
									<span class="text-black font-bold text-xs md:text-sm uppercase tracking-tighter relative z-10 whitespace-nowrap">
										{displayYear} Golden Ghost Award Winner
									</span>
								</div>
							{/if}

							<div class="aspect-video overflow-hidden bg-neutral-900">
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
								{#if review.city && review.state}
									<p class="text-gray-400 mb-3 flex items-center gap-1">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
										</svg>
										{review.city}, {getStateName(review.state)}
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
		{:else}
			<div class="text-center py-16 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border-2 border-gray-800">
				<svg class="w-24 h-24 mx-auto mb-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12c0 2.85 1.2 5.41 3.11 7.24.1.48.25.93.45 1.37.23.51.52.98.87 1.4.03.04.07.07.1.11.36.39.77.73 1.23 1.01.46.28.96.5 1.49.65.17.05.34.09.51.12.54.1 1.1.15 1.67.15.83 0 1.64-.13 2.41-.37.14-.04.27-.09.41-.14.52-.19 1.01-.44 1.46-.74.46-.31.88-.67 1.25-1.08.04-.04.07-.09.11-.13.34-.42.63-.88.86-1.38.2-.44.35-.9.45-1.38C20.8 17.41 22 14.85 22 12c0-5.52-4.48-10-10-10zm0 18c-1.38 0-2.63-.56-3.54-1.46C7.56 17.63 7 16.38 7 15c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3zm4-6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
				</svg>
				<p class="text-gray-400 text-xl font-medium">No featured reviews yet. Check back soon!</p>
			</div>
		{/if}

		<!-- Enhanced CTA Button -->
		<div class="text-center mt-16">
			<a
				href="/reviews"
				class="group inline-flex items-center gap-3 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-extrabold py-5 px-12 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden relative text-xl"
				style="box-shadow: 0 0 40px rgba(255,107,0,0.5);"
			>
				<!-- Animated shimmer -->
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

				<span class="relative z-10 tracking-wide">VIEW ALL REVIEWS</span>
				<svg class="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- Multi-Award Winner Hero Section -->
{#if data.showAwardsHero && data.multiAwardWinners && data.multiAwardWinners.length > 0}
	<section class="py-20 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
		<!-- Animated golden particle background -->
		<div class="absolute inset-0 opacity-30">
			<div class="absolute inset-0" style="background: radial-gradient(circle at 20% 30%, rgba(255,215,0,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,215,0,0.15) 0%, transparent 40%);"></div>
		</div>

		<!-- Sparkle effects -->
		<div class="absolute inset-0 opacity-20">
			<div class="absolute top-10 left-[10%] w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
			<div class="absolute top-1/4 right-[15%] w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style="animation-delay: 0.3s;"></div>
			<div class="absolute bottom-1/3 left-[20%] w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style="animation-delay: 0.6s;"></div>
			<div class="absolute bottom-20 right-[25%] w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style="animation-delay: 0.9s;"></div>
		</div>

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
			<!-- Header -->
			<div class="text-center mb-16">
				<div class="inline-flex items-center justify-center gap-4 mb-6">
					<span class="text-6xl">👑</span>
					<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFA500 75%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 60px rgba(255,215,0,0.6);">
						ELITE AWARD WINNERS
					</h2>
					<span class="text-6xl">👑</span>
				</div>
				<div class="w-64 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-8"></div>
				<p class="text-2xl md:text-3xl text-yellow-100 font-bold max-w-3xl mx-auto mb-3">
					Haunts with Multiple Golden Ghost Awards
				</p>
				<p class="text-lg text-gray-300 max-w-2xl mx-auto">
					These exceptional haunts have earned multiple prestigious Golden Ghost Awards for their outstanding achievement
				</p>
			</div>

			<!-- Award Winners Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each data.multiAwardWinners as review}
					{@const logo = data.logos[review.id]}
					{@const awardImageUrl = logo || review.cover_image_url}
					<a href="/reviews/{review.slug}" class="group relative">
						<!-- Golden glow effect -->
						<div class="absolute -inset-2 bg-gradient-to-r from-yellow-600/30 via-yellow-500/40 to-yellow-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

						<!-- Card -->
						<div class="relative bg-gradient-to-br from-neutral-900 via-black to-neutral-900 rounded-2xl overflow-hidden border-2 border-yellow-500/60 group-hover:border-yellow-400 transition-all duration-500" style="box-shadow: 0 0 30px rgba(255,215,0,0.4);">
							{#if awardImageUrl}
								<div class="aspect-video overflow-hidden relative bg-neutral-900">
									<img
										src={awardImageUrl}
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
										size="medium"
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

			<!-- View All Awards CTA -->
			<div class="text-center mt-16">
				<a
					href="/reviews"
					class="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-extrabold py-5 px-12 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden relative text-xl"
					style="box-shadow: 0 0 40px rgba(255,215,0,0.6);"
				>
					<!-- Animated shimmer -->
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

					<span class="relative z-10 tracking-wide">SEE ALL AWARD WINNERS</span>
					<svg class="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</a>
			</div>
		</div>
	</section>
{/if}

<!-- Golden Ghost Awards Section -->
<section class="py-16 mobile-landscape:py-10 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
	<!-- Animated golden glow background -->
	<div class="absolute inset-0 opacity-20">
		<div class="absolute inset-0" style="background: radial-gradient(circle at 30% 50%, rgba(255,215,0,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255,215,0,0.3) 0%, transparent 50%);"></div>
	</div>

	<!-- Texture overlay -->
	<div class="texture-overlay"></div>

	<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10">
		<!-- Striking Header -->
		<div class="text-center mb-16 px-4 sm:px-0">
			<div class="relative inline-block">
				<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFA500 75%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 60px rgba(255,215,0,0.6);">
					THE GOLDEN GHOST AWARDS
				</h2>

				<!-- Decorative underline with gradient -->
				<div class="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-6"></div>
			</div>

			<p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
				Recognizing haunts for creating incredible haunted house experiences
			</p>
		</div>

		<!-- Video Container with Golden Frame -->
		<div class="relative w-full sm:max-w-5xl mx-auto">
			<!-- Subtle golden glow behind video -->
			<div class="absolute -inset-4 bg-gradient-to-r from-yellow-600/20 via-yellow-500/25 to-yellow-600/20 blur-2xl opacity-50"></div>

			<!-- Clean video frame -->
			<div class="relative bg-gradient-to-br from-yellow-900/20 via-black/40 to-yellow-900/20 rounded-2xl border-2 border-yellow-600/40 p-0.5 sm:p-6" style="box-shadow: 0 0 30px rgba(255,215,0,0.3), inset 0 0 20px rgba(0,0,0,0.5);">

				<!-- YouTube Video Embed -->
				<div class="relative rounded-2xl overflow-hidden" style="aspect-ratio: 16/9; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
					<iframe
						class="absolute inset-0 w-full h-full"
						src="https://www.youtube.com/embed/vhb4LzRQXA4"
						title="Golden Ghost Awards - McCloud Manor"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</div>

		<!-- Call to Action -->
		<div class="mt-16 text-center">
			<a
				href="https://www.youtube.com/@hauntjunkies"
				target="_blank"
				rel="noopener noreferrer"
				class="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-extrabold py-5 px-12 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden relative text-xl"
				style="box-shadow: 0 0 40px rgba(255,215,0,0.6);"
			>
				<!-- Animated shimmer effect -->
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

				<span class="relative z-10 tracking-wide">VISIT OUR YOUTUBE</span>
				<svg class="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- Instagram Feed Section -->
<section class="py-16 mobile-landscape:py-10 relative overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/hauntedgraveyard-bg.webp');"></div>

	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-black/70 md:bg-black/60"></div>

	<div class="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 relative z-10">
		<!-- Header -->
		<div class="text-center mb-16 px-1 sm:px-0">
			<div class="relative inline-block">
				<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(255,107,0,0.6);">
					FOLLOW THE TERROR
				</h2>

				<!-- Decorative underline -->
				<div class="w-48 h-1 bg-gradient-to-r from-transparent via-haunt-orange to-transparent mx-auto mb-6"></div>
			</div>

			<p class="text-sm md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto font-light">
				Follow us on Instagram to join in our adventures to haunted attractions across the country and for updates on McCloud Manor
			</p>
		</div>

		<!-- Instagram Embed Container -->
		<div class="relative w-full sm:max-w-5xl mx-auto">
			<!-- Glow effect behind feed -->
			<div class="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-haunt-orange/20 via-orange-600/25 to-haunt-orange/20 blur-2xl opacity-50"></div>

		<!-- Feed container -->
		<div class="relative bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 rounded-2xl border-4 border-haunt-orange/50 p-0.5 sm:p-2 md:p-4" style="box-shadow: 0 0 30px rgba(255,107,0,0.3), inset 0 0 20px rgba(0,0,0,0.8);">

			<!-- Instagram Wrapper -->
			<div class="relative rounded-2xl overflow-hidden h-[260px] md:h-[650px] flex items-center justify-center" style="box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
				<iframe src="https://snapwidget.com/embed/1110765" class="snapwidget-widget absolute inset-0 w-full h-full" frameborder="0" scrolling="no" style="border:none; overflow:hidden;" title="Posts from Instagram"></iframe>
			</div>
		</div>
		</div>
	</div>
</section>

<!-- Quote Section -->
<QuoteSection quotes={data.quotes} />

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
			<!-- McCloud Manor Logo -->
			<div class="mb-8 mccloud-logo {showMcCloudLogo ? 'animate-fade-in' : 'logo-hidden'}">
				<img src="/mccloudmanor.webp" alt="McCloud Manor" loading="lazy" class="h-56 md:h-64 lg:h-72 w-auto mx-auto drop-shadow-2xl" />
			</div>

			<p class="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg font-light">
				A <span class="glitch-text-terrifying text-white font-bold">terrifying</span> home haunt experience brought to you by Haunt Junkies
			</p>
			<a
				href="/mccloudmanor"
				class="group inline-flex items-center gap-3 bg-gradient-to-r from-haunt-red to-red-900 hover:from-red-900 hover:to-haunt-red text-white font-extrabold py-5 px-12 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden relative text-xl"
				style="box-shadow: 0 0 40px rgba(164,18,20,0.6);"
			>
				<!-- Animated shimmer -->
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

				<span class="relative z-10 tracking-wide">VISIT MCCLOUD MANOR</span>
				<svg class="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
</section>

<style>
	.logo-hidden {
		opacity: 0;
		transform: scale(1.2);
		filter: blur(20px) brightness(0.3);
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
			transform: scale(1.2);
			filter: blur(20px) brightness(0.3);
		}
		40% {
			opacity: 0.4;
			transform: scale(1.08);
			filter: blur(12px) brightness(0.6);
		}
		70% {
			opacity: 0.7;
			transform: scale(1.03);
			filter: blur(5px) brightness(0.85);
		}
		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0px) brightness(1);
		}
	}

	.animate-fade-in {
		animation: fade-in 1.5s ease-out forwards;
	}

	/* Hide scrollbar for carousel */
	.carousel-container::-webkit-scrollbar {
		display: none;
	}

	.carousel-container {
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}
</style>
