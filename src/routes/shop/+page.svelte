<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';

	onMount(() => {
		// Scroll to top when page loads
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
</script>

<SEO
	title="Shop - Coming Soon"
	description="Haunt Junkies merchandise shop coming soon! Stay tuned for exclusive horror-themed apparel and collectibles."
	url="/shop"
	image="/og.png"
	type="website"
	noindex={true}
/>

<!-- Coming Soon Section -->
<section class="relative overflow-hidden" style="min-height: 100vh; min-height: -webkit-fill-available; min-height: 100dvh;">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img src="/experience-bg.jpg" alt="" role="presentation" class="w-full h-full object-cover" style="object-position: center;" />
	</div>

	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-black/60"></div>

	<!-- Smoky animated background -->
	<div class="absolute inset-0">
		<!-- Multiple smoke layers for depth -->
		<div class="absolute inset-0 opacity-20" style="background: radial-gradient(ellipse at 20% 30%, rgba(100,100,100,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(100,100,100,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(80,80,80,0.2) 0%, transparent 60%);"></div>
		<div class="absolute inset-0 opacity-15" style="background: radial-gradient(ellipse at 60% 40%, rgba(120,120,120,0.4) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(90,90,90,0.3) 0%, transparent 50%);"></div>

		<!-- Animated smoke wisps -->
		<div class="absolute inset-0 animate-pulse" style="animation-duration: 8s; background: radial-gradient(ellipse at 40% 60%, rgba(100,100,100,0.15) 0%, transparent 40%);"></div>
	</div>

	<!-- Orange glow accents -->
	<div class="absolute inset-0 opacity-10" style="background: radial-gradient(ellipse at 50% 0%, rgba(252,116,3,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(252,116,3,0.4) 0%, transparent 50%);"></div>

	<!-- Texture overlay -->
	<div class="absolute inset-0 opacity-5" style="background-image: url('/calendar-bg.png'); background-size: cover;"></div>

	<!-- Content -->
	<div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 py-20">
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
			data-sveltekit-preload-data="hover"
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
