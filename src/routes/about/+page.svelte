<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="About Us"
	description="Learn about Haunt Junkies - passionate fans of horror and haunted attractions traveling the country to review haunts and create our own terrifying experiences at McCloud Manor."
	url="/about"
	image="/og.png"
	type="website"
/>

<!-- About Us Section -->
<section class="pt-32 pb-20 md:pt-32 md:pb-20 relative overflow-hidden" style="min-height: 100vh; min-height: -webkit-fill-available; min-height: 100dvh;">
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

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(255,107,0,0.6);">
				ABOUT US
			</h1>
			<div class="w-48 h-1 bg-gradient-to-r from-transparent via-haunt-orange to-transparent mx-auto mb-6"></div>
		</div>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
			<!-- Left: Photo -->
			<div class="relative">
				<!-- Glow effect behind image -->
				<div class="absolute -inset-4 bg-gradient-to-r from-haunt-orange/20 via-orange-600/25 to-haunt-orange/20 blur-2xl opacity-50"></div>

				<!-- Image Container -->
				<div class="relative bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 rounded-2xl border-4 border-haunt-orange/50 p-4 md:p-6" style="box-shadow: 0 0 40px rgba(255,107,0,0.5), inset 0 0 20px rgba(0,0,0,0.8);">
					<!-- Image -->
					<div class="relative aspect-[3/4] overflow-hidden rounded-xl">
						<img
							src="/hjunkies.jpg"
							alt="Haunt Junkies Team"
							class="w-full h-full object-cover"
							style="object-position: center 15%;"
						/>
					</div>
				</div>
			</div>

			<!-- Right: Content -->
			<div class="space-y-6 text-gray-300 text-lg leading-relaxed">
				<h2 class="text-3xl md:text-4xl font-extrabold text-haunt-orange mb-6">
					WE ARE THE HAUNT JUNKIES!
				</h2>

				<p>
					Extremely passionate and die-hard fans of all things horror - movies, books, video games, you name it - but especially haunted attractions! We travel all over the country visiting and reviewing haunted attractions and we also do one of our own.
				</p>

				<p>
					Started by Megan Johnson and Vilonte McCloud, Haunt Junkies is more than just a home haunt and haunt review team... it's a LIFESTYLE! We're based outside of Atlanta, GA, but (as of 2021) have visited over 100 haunted attractions across 16 states, and we're just getting started! We pride ourselves in giving honest reviews, and we don't have any kind of weird ranking system. We try to keep our reviews interesting, conversational, and to the point versus making you feel like you're reading an editorial or dissertation... boringgggg!
				</p>

				<p>
					Every haunt is unique and offers its own special scares, so we reset our perceptions and expectations each time when rating them. We don't care about the size or amount of money spent, at the end of the day, all that matters to us is "was it scary or not?" The best of the best will have the honor of receiving a Golden Ghost Award.
				</p>

				<p>
					We were so inspired from visiting haunted attractions that in 2017 we decided to do one of our own. After a few trips to Spirit Halloween, Dollar Tree, and other local seasonal Halloween retailers, we had a quick walkthrough for trick or treaters. We had so much fun and received such great feedback from the community that we REALLY got to work to make the second go-round official AF! We learned how to build our own props from raw materials found at The Home Depot and other hardware stores and discovered professional haunted attraction retailers like FrightProps and Dapper Cadaver. Now Haunt Junkies Haunted House features props and effects that would rival any haunted attraction and gets better every year!
				</p>

				<p>
					We are always in need of our next fear fix so if you're a haunt owner who would like for us to come visit, hit us up!
				</p>

				<div class="pt-6">
					<p class="text-haunt-orange font-bold text-xl mb-4">
						Are you a Haunt Junkie too? Send us a message! We'd love to hear from you!
					</p>
					<a
						href="/contact"
						class="group inline-flex items-center gap-3 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-extrabold py-5 px-12 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden relative text-xl"
						style="box-shadow: 0 0 40px rgba(255,107,0,0.5);"
					>
						<!-- Animated shimmer -->
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

						<span class="relative z-10 tracking-wide">CONTACT US</span>
						<svg class="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
