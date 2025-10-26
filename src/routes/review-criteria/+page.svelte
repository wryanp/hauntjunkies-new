<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
</script>

<SEO
	title="Review Criteria"
	description="Learn how Haunt Junkies rates and reviews haunted attractions. Our comprehensive criteria covers scares, atmosphere, value, and overall experience."
	url="/review-criteria"
	type="website"
/>

<div class="bg-gradient-to-b from-gray-900 to-black min-h-screen">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
		<!-- Breadcrumbs -->
		<Breadcrumbs
			items={[
				{ label: 'Reviews', href: '/reviews' },
				{ label: 'Review Criteria', href: '/review-criteria' }
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
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
				Review Criteria
			</h1>
			<div class="w-32 h-1 bg-haunt-orange mb-6"></div>
			<p class="text-xl text-gray-400">
				How we evaluate and rate haunted attractions
			</p>
		</div>

		<!-- Content -->
		<div class="space-y-8">
			<!-- Introduction & Review Criteria -->
			<div class="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
				<div class="mb-8">
					<p class="text-lg md:text-xl text-gray-200 leading-relaxed mb-6">
						All Haunt Junkies reviews come from the same dedicated <span class="text-haunt-orange font-semibold">two-person team</span>.
					</p>
					<p class="text-lg md:text-xl text-gray-200 leading-relaxed">
						Having visited <span class="text-haunt-orange font-semibold">over 100 haunted attractions</span> and operating our own <span class="text-haunt-orange font-semibold">professional home haunt</span>, we bring real haunter insight and a unique perspective from <span class="text-haunt-orange font-semibold italic">both sides of the scream</span>.
					</p>
				</div>

				<div class="border-t border-gray-700 pt-6">
					<p class="text-xl md:text-2xl text-gray-300 font-semibold mb-6">The things we take into consideration are:</p>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-3">
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Acting</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Atmosphere/Ambience</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Costuming</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Immersion</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Makeup/Masks</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Queue Line</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Scare Factor</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Set Design</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Special-FX/Animatronics</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Story/Theming</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Value</span>
						</div>
						<div class="flex items-baseline gap-3">
							<span class="text-haunt-orange text-xl">•</span>
							<span class="text-gray-200 text-lg">Overall Experience</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Golden Ghost Awards -->
			<div class="bg-gray-800/50 rounded-lg p-6 border border-yellow-500/30 relative overflow-hidden" style="box-shadow: 0 0 20px rgba(234, 179, 8, 0.1);">
				<div class="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5 pointer-events-none"></div>
				<div class="relative z-10">
					<h2 class="text-2xl font-bold text-yellow-400 uppercase leading-none mb-4 flex items-center gap-3">
					<img src="/golden-ghost-award.webp" alt="Golden Ghost Award" class="w-10 h-10 drop-shadow-xl" />
					What are the Golden Ghost Awards?
				</h2>
					<p class="text-gray-300 leading-relaxed mb-4">
						Each year, we recognize haunted attractions that truly stood out with an award from the following 6 award categories:
					</p>
					<ul class="space-y-2 text-gray-300">
						<li><strong class="text-yellow-400">Best Haunt Actors</strong> - Outstanding performance and character portrayal</li>
						<li><strong class="text-yellow-400">Best Haunt Makeup</strong> - Exceptional makeup and prosthetics artistry</li>
						<li><strong class="text-yellow-400">Best Set Design</strong> - Immersive environments and scenic design</li>
						<li><strong class="text-yellow-400">Best Haunt Story</strong> - Compelling narrative and storytelling</li>
						<li><strong class="text-yellow-400">Scariest Haunt</strong> - Most terrifying and intense experience</li>
						<li><strong class="text-yellow-400">Best Overall Haunt</strong> - The ultimate haunt experience - our highest honor</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Back to Reviews -->
		<div class="mt-12">
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
