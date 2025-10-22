<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Scroll to top when page loads
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<title>Shop - Coming Soon - Haunt Junkies</title>
	<meta name="description" content="Haunt Junkies merchandise shop coming soon!" />
</svelte:head>

<!-- Coming Soon Section -->
<section class="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0" style="background-image: url('/bg.jpg'); background-size: cover; background-position: center;"></div>

	<!-- Overlay -->
	<div class="absolute inset-0 bg-black/70"></div>

	<!-- Animated background effects -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0" style="background: radial-gradient(circle at 30% 50%, rgba(255,107,0,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255,107,0,0.3) 0%, transparent 50%);"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
		<!-- Main Heading -->
		<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange mb-6 tracking-tight" style="text-shadow: 0 0 40px rgba(255,107,0,0.6);">
			COMING SOON
		</h1>

		<div class="w-48 h-1 bg-gradient-to-r from-transparent via-haunt-orange to-transparent mx-auto mb-8"></div>

		<!-- Subheading -->
		<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
			Haunt Junkies Merch Shop
		</h2>

		<!-- Description -->
		<div class="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed space-y-2">
			<p>Get ready to show your love for all things haunted!</p>
			<p>Our merchandise shop is under construction and will be launching soon with exclusive Haunt Junkies gear, apparel, and collectibles.</p>
		</div>

		<!-- CTA Button -->
		<a
			href="/"
			class="group inline-flex items-center gap-3 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-extrabold py-5 px-12 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden relative text-xl"
			style="box-shadow: 0 0 40px rgba(255,107,0,0.5);"
		>
			<!-- Animated shimmer -->
			<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

			<svg class="w-6 h-6 relative z-10 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
			</svg>
			<span class="relative z-10 tracking-wide">BACK TO HOME</span>
		</a>
	</div>
</section>
