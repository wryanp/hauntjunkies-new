<script lang="ts">
	import type { Quote } from '$lib/types';

	let { quotes = [] }: { quotes: Quote[] } = $props();

	// Get a random quote from the active quotes
	const randomQuote = quotes.length > 0
		? quotes[Math.floor(Math.random() * quotes.length)]
		: null;
</script>

{#if randomQuote}
	<section class="py-16 md:py-20 relative overflow-hidden">
		<!-- Background Image -->
		<div class="absolute inset-0" style="background-image: url('/experience-bg.webp'); background-size: cover; background-position: center;"></div>

		<!-- Dark overlay -->
		<div class="absolute inset-0 bg-black/90"></div>

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
		<div class="absolute inset-0 opacity-5" style="background-image: url('/calendar-bg.webp'); background-size: cover;"></div>

		<!-- Content -->
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
			<div class="relative">
				<!-- Subtle glow behind quote box -->
				<div class="absolute -inset-3 bg-gradient-to-r from-haunt-orange/10 via-orange-600/15 to-haunt-orange/10 blur-2xl opacity-40"></div>

				<!-- Quote Container -->
				<div class="relative bg-black/80 backdrop-blur-sm rounded-none border-t-4 border-b-4 border-haunt-orange/60 p-8 md:p-12 shadow-2xl overflow-hidden" style="box-shadow: inset 0 0 60px rgba(0,0,0,0.9), 0 0 40px rgba(252,116,3,0.2);">
					<!-- Dark vignette effect -->
					<div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
					<div class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>

					<!-- Eerie glow -->
					<div class="absolute inset-0 bg-gradient-to-br from-haunt-orange/10 via-transparent to-red-900/10"></div>

					<!-- Content wrapper -->
					<div class="relative">
						<!-- Quote Icon - large and ominous -->
						<svg class="absolute -top-4 -left-3 md:-top-6 md:-left-4 w-20 h-20 md:w-28 md:h-28 text-haunt-orange/15 opacity-50" fill="currentColor" viewBox="0 0 24 24">
							<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
						</svg>

						<!-- Quote Text -->
						<blockquote class="text-center mb-8 mt-6">
							<p class="text-xl md:text-3xl lg:text-4xl font-serif text-white leading-snug md:leading-snug lg:leading-snug tracking-wide italic" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(252,116,3,0.3);">
								"{randomQuote.text}"
							</p>
						</blockquote>

						<!-- Separator - blood drip effect -->
						<div class="flex justify-center mb-6">
							<div class="relative">
								<div class="w-24 h-px bg-haunt-orange"></div>
								<div class="absolute left-1/2 -translate-x-1/2 top-0 w-1 h-2 bg-gradient-to-b from-haunt-orange to-transparent"></div>
							</div>
						</div>

						<!-- Author -->
						<footer class="text-center">
							<cite class="text-lg md:text-xl text-haunt-orange font-bold not-italic tracking-widest uppercase" style="text-shadow: 0 0 10px rgba(252,116,3,0.6), 2px 2px 4px rgba(0,0,0,0.8);">
								— {randomQuote.by} —
							</cite>
						</footer>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}
