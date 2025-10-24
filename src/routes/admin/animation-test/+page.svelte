<script lang="ts">
	import GoldenGhostBadge from '$lib/components/GoldenGhostBadge.svelte';
	import GoldenGhostAwards from '$lib/components/GoldenGhostAwards.svelte';
	import type { Review } from '$lib/types';

	// Mock review data with all 6 awards for comprehensive testing
	const mockReview: Review = {
		id: 'test-1',
		slug: 'test-haunt',
		name: 'Test Haunt - All Awards Winner',
		description: 'A legendary haunt that swept all categories',
		location: 'Test City, ST',
		rating_overall: 5,
		rating_scares: 5,
		rating_atmosphere: 5,
		rating_actors: 5,
		rating_sets: 5,
		rating_value: 5,
		featured: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [],
		// All 6 Golden Ghost Awards
		award_best_actors_year: 2024,
		award_best_makeup_year: 2024,
		award_best_set_design_year: 2024,
		award_best_story_year: 2024,
		award_scariest_year: 2024,
		award_best_overall_year: 2024
	};

	// Mock review with only 2 awards
	const mockReviewTwoAwards: Review = {
		...mockReview,
		id: 'test-2',
		name: 'Test Haunt - Two Awards',
		award_best_actors_year: 2024,
		award_scariest_year: 2024,
		award_best_makeup_year: undefined,
		award_best_set_design_year: undefined,
		award_best_story_year: undefined,
		award_best_overall_year: undefined
	};

	// Mock review with single award
	const mockReviewSingleAward: Review = {
		...mockReview,
		id: 'test-3',
		name: 'Test Haunt - Single Award',
		award_best_overall_year: 2024,
		award_best_actors_year: undefined,
		award_best_makeup_year: undefined,
		award_best_set_design_year: undefined,
		award_best_story_year: undefined,
		award_scariest_year: undefined
	};
</script>

<svelte:head>
	<title>Animation Testing - Admin - Haunt Junkies</title>
</svelte:head>

<div class="max-w-7xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center gap-4 mb-4">
			<a
				href="/admin/dashboard"
				class="text-gray-400 hover:text-white transition-colors"
				aria-label="Back to dashboard"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<div>
				<h1 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400">
					Golden Ghost Award Animation Testing
				</h1>
				<p class="text-gray-400 mt-2">Preview all animation options to choose your preferred style</p>
			</div>
		</div>
	</div>

	<!-- Animation Comparison Grid -->
	<div class="space-y-8">
		<!-- Option 1: Sequential Reveal -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 p-6 shadow-lg">
			<div class="mb-6">
				<div class="flex items-center gap-3 mb-2">
					<span class="text-2xl">✨</span>
					<h2 class="text-2xl font-bold text-yellow-400">Option 1: Sequential Reveal</h2>
				</div>
				<p class="text-gray-400 text-sm">Awards appear one by one with a subtle fade-in and scale effect. Perfect for dramatic reveals.</p>
			</div>

			<!-- All 6 Awards -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold text-white mb-3">All 6 Awards (Large)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostAwards
						review={mockReview}
						layout="grid"
						size="large"
						animation="sequential"
						showLabel={true}
					/>
				</div>
			</div>

			<!-- 2 Awards Horizontal -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold text-white mb-3">2 Awards (Medium, Horizontal)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostAwards
						review={mockReviewTwoAwards}
						layout="horizontal"
						size="medium"
						animation="sequential"
						showLabel={true}
					/>
				</div>
			</div>

			<!-- Single Award -->
			<div>
				<h3 class="text-lg font-semibold text-white mb-3">Single Award (Small)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostBadge
						category="best_overall"
						year={2024}
						size="small"
						animation="sequential"
						showLabel={true}
					/>
				</div>
			</div>
		</div>

		<!-- Option 2: Hover Flip -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 p-6 shadow-lg">
			<div class="mb-6">
				<div class="flex items-center gap-3 mb-2">
					<span class="text-2xl">🔄</span>
					<h2 class="text-2xl font-bold text-yellow-400">Option 2: Hover Flip</h2>
				</div>
				<p class="text-gray-400 text-sm">Interactive 3D flip effect on hover. Engaging and modern with tactile feedback.</p>
			</div>

			<!-- All 6 Awards -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold text-white mb-3">All 6 Awards (Large) - Hover to Flip</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostAwards
						review={mockReview}
						layout="grid"
						size="large"
						animation="hover"
						showLabel={true}
					/>
				</div>
			</div>

			<!-- 2 Awards Horizontal -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold text-white mb-3">2 Awards (Medium, Horizontal) - Hover to Flip</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostAwards
						review={mockReviewTwoAwards}
						layout="horizontal"
						size="medium"
						animation="hover"
						showLabel={true}
					/>
				</div>
			</div>

			<!-- Single Award -->
			<div>
				<h3 class="text-lg font-semibold text-white mb-3">Single Award (Small) - Hover to Flip</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostBadge
						category="best_overall"
						year={2024}
						size="small"
						animation="hover"
						showLabel={true}
					/>
				</div>
			</div>
		</div>

		<!-- Option 3: Particle Effect -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 p-6 shadow-lg">
			<div class="mb-6">
				<div class="flex items-center gap-3 mb-2">
					<span class="text-2xl">✨</span>
					<h2 class="text-2xl font-bold text-yellow-400">Option 3: Particle Effect</h2>
				</div>
				<p class="text-gray-400 text-sm">Continuous floating particles create a magical, ethereal atmosphere. Subtle and elegant.</p>
			</div>

			<!-- All 6 Awards -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold text-white mb-3">All 6 Awards (Large)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostAwards
						review={mockReview}
						layout="grid"
						size="large"
						animation="particle"
						showLabel={true}
					/>
				</div>
			</div>

			<!-- 2 Awards Horizontal -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold text-white mb-3">2 Awards (Medium, Horizontal)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostAwards
						review={mockReviewTwoAwards}
						layout="horizontal"
						size="medium"
						animation="particle"
						showLabel={true}
					/>
				</div>
			</div>

			<!-- Single Award -->
			<div>
				<h3 class="text-lg font-semibold text-white mb-3">Single Award (Small)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostBadge
						category="best_overall"
						year={2024}
						size="small"
						animation="particle"
						showLabel={true}
					/>
				</div>
			</div>
		</div>

		<!-- Option 4: No Animation -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 p-6 shadow-lg">
			<div class="mb-6">
				<div class="flex items-center gap-3 mb-2">
					<span class="text-2xl">⚡</span>
					<h2 class="text-2xl font-bold text-yellow-400">Option 4: No Animation (Static)</h2>
				</div>
				<p class="text-gray-400 text-sm">Clean, simple display without animations. Best performance and accessibility.</p>
			</div>

			<!-- All 6 Awards -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold text-white mb-3">All 6 Awards (Large)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostAwards
						review={mockReview}
						layout="grid"
						size="large"
						animation="none"
						showLabel={true}
					/>
				</div>
			</div>

			<!-- 2 Awards Horizontal -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold text-white mb-3">2 Awards (Medium, Horizontal)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostAwards
						review={mockReviewTwoAwards}
						layout="horizontal"
						size="medium"
						animation="none"
						showLabel={true}
					/>
				</div>
			</div>

			<!-- Single Award -->
			<div>
				<h3 class="text-lg font-semibold text-white mb-3">Single Award (Small)</h3>
				<div class="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
					<GoldenGhostBadge
						category="best_overall"
						year={2024}
						size="small"
						animation="none"
						showLabel={true}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Implementation Notes -->
	<div class="mt-8 bg-gradient-to-br from-blue-900/20 to-blue-950/20 backdrop-blur-sm rounded-xl border-2 border-blue-500/30 p-6 shadow-lg">
		<h2 class="text-xl font-bold text-blue-400 mb-4">Implementation Notes</h2>
		<div class="space-y-4 text-gray-300">
			<div>
				<h3 class="font-semibold text-white mb-2">To Change Animation Globally:</h3>
				<p class="text-sm">Update the <code class="bg-black/50 px-2 py-1 rounded text-blue-300">animation</code> prop in these files:</p>
				<ul class="list-disc list-inside text-sm mt-2 space-y-1 ml-4">
					<li><code class="bg-black/50 px-2 py-1 rounded text-blue-300">/src/routes/reviews/[slug]/+page.svelte</code> - Individual review pages</li>
					<li><code class="bg-black/50 px-2 py-1 rounded text-blue-300">/src/routes/+page.svelte</code> - Homepage hero section</li>
					<li><code class="bg-black/50 px-2 py-1 rounded text-blue-300">/src/routes/awards/+page.svelte</code> - Awards showcase page</li>
				</ul>
			</div>
			<div>
				<h3 class="font-semibold text-white mb-2">Animation Options:</h3>
				<ul class="list-disc list-inside text-sm space-y-1 ml-4">
					<li><code class="bg-black/50 px-2 py-1 rounded text-yellow-300">animation="sequential"</code> - Sequential reveal with fade-in</li>
					<li><code class="bg-black/50 px-2 py-1 rounded text-yellow-300">animation="hover"</code> - 3D flip on hover</li>
					<li><code class="bg-black/50 px-2 py-1 rounded text-yellow-300">animation="particle"</code> - Floating particle effect</li>
					<li><code class="bg-black/50 px-2 py-1 rounded text-yellow-300">animation="none"</code> - No animation (static)</li>
				</ul>
			</div>
			<div>
				<h3 class="font-semibold text-white mb-2">Performance Considerations:</h3>
				<p class="text-sm">
					Particle effects use CSS animations and are GPU-accelerated, so they perform well even on mobile devices.
					Sequential and hover animations are very lightweight. Choose based on your design preference!
				</p>
			</div>
		</div>
	</div>

	<!-- Back to Dashboard -->
	<div class="mt-8 text-center">
		<a
			href="/admin/dashboard"
			class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
		>
			<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Dashboard
		</a>
	</div>
</div>
