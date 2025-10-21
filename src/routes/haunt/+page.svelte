<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Image slider state
	let currentSlide = $state(0);
	const placeholderImages = [
		{ url: '/placeholder-1.jpg', caption: 'Gallery Image 1' },
		{ url: '/placeholder-2.jpg', caption: 'Gallery Image 2' },
		{ url: '/placeholder-3.jpg', caption: 'Gallery Image 3' },
		{ url: '/placeholder-4.jpg', caption: 'Gallery Image 4' }
	];

	// Story expand/collapse state
	let storyExpanded = $state(false);

	// Default story text if not in database
	const defaultStory = `The year was 1665. Dr. William McCloud, a successful black hematologist, was on the cutting edge of blood transfusion research and managed his own medical facility in the small town of Madeline Cove.

One evening, while Dr. McCloud was locking up for the night, he was approached by a mysterious young woman who begged to be seen by him. She was visibly weak and her skin eerily pale, so Dr. McCloud reluctantly obliged and invited her in.

The young woman's name was Louise, and she was from one of the oldest families in Madeline Cove. She informed him that she had a very rare blood condition and heard about his advancements from the local townsmen who insisted that he could help her.

As Louise explained her symptoms, Dr. McCloud drew a sample of blood to examine. Despite her weakened state, William found her to be intoxicatingly beautiful and was saddened by her condition given her age. Upon examination, he realized her blood was unlike anything he'd ever seen before!

At this point, he could no longer deny her. Dr. McCloud explained a procedure that he believed would theoretically work, but it had never been fully tested. Louise was desperate and willing to try anything, so she agreed to the experimental blood transfusion.

Louise began visiting Dr. McCloud over the next few weeks and his infatuation continued to grow, as did her need for frequent transfusions to maintain her condition.

Then, suddenly Louise disappeared…

Several weeks passed with no word, and Dr. McCloud became extremely concerned. Obsessed with the idea that he was on the verge of a breakthrough, he had no choice but to set out in search of Louise.

While scouring the streets of Madeline Cove, he heard commotion in a nearby alley and rushed towards the sound. Engulfed in complete darkness, he pulled a match from his pocket to see what he had stumbled upon.

William saw a body, splayed in the most unnatural way; the neck was clearly broken and blood stained the front of the shirt. The attacker, crouched over the victim, menacingly looked up with blood dripping from their chin. At that moment, William realized he was staring into the eyes of Louise. Ashamed and embarrassed, she quickly vanished into the night.

Dr. McCloud ran back to his facility in horror and disbelief. After locking the door behind him, he found Louise standing there covered in the blood of her victim. She looked different – strong, powerful, and terrifying. William turned to run, but Louise forcefully grabbed him… and calmed him down.

She told Dr. McCloud that she had not been completely honest with him about her condition. She was born a child of the night and hated herself for what she had to do to survive. Louise pleaded with William to not tell a soul and said she would understand if he chose not to continue the treatments, but William didn't care. He confessed his undying love for her and swore not only to keep her condition a secret but also to find a cure.

William and Louise were quickly married and started their family. They had 2 healthy boys and a beautiful baby girl.

In spite of Dr. McCloud's tireless research, the treatments only offered temporary relief. Louise's thirst continued to intensify. Then, to their dismay, they realized her condition had been passed down to all three children. Each of them would also require transfusions to control their insatiable cravings. With four McClouds receiving treatments, the blood supply quickly dwindled, so finding an alternative method for replenishing their reserve became unavoidable. Dr. McCloud began luring people to his facility and draining them of life to keep his family innocent and their condition under control.

It wasn't long before the townspeople uncovered Dr. McCloud's crimes. A mob assembled to hunt down and kill the family. When Dr. and Mrs. McCloud were captured, they drove a stake through Louise's heart and then burned her and the research facility to the ground forcing William to watch in agony. All his research and medical advancements were consumed by flames along with his beloved Louise. The townsmen then strung William up to the nearest tree and hung him. With his last breath, Dr. William McCloud cursed the town of Madeline Cove.

Their children, full of anger and resentment, escaped the mob and fled, vowing to uphold their father's curse and avenge their parents' deaths. Without their father's treatments, the blood lust of the McCloud children continued to grow rapidly and became stronger in each generation. In 2012, the McClouds relocated to Lawrenceville, GA.

It has been said that the tortured spirit of Dr. William McCloud lives on, and the family's thirst for blood still remains…`;

	// Get story from database or use default
	const storyText = $derived(data.info?.story || defaultStory);

	// Split story into teaser (first paragraph) and full content
	const storyParagraphs = $derived(storyText.split('\n\n').filter(p => p.trim()));
	const storyTeaser = $derived(storyParagraphs[0] || '');
	const storyBody = $derived(storyParagraphs.slice(1));

	function nextSlide() {
		currentSlide = (currentSlide + 1) % placeholderImages.length;
	}

	function prevSlide() {
		currentSlide = currentSlide === 0 ? placeholderImages.length - 1 : currentSlide - 1;
	}

	function goToSlide(index: number) {
		currentSlide = index;
	}

	function toggleStory() {
		storyExpanded = !storyExpanded;
	}

	onMount(async () => {
		const { PowerGlitch } = await import('powerglitch');

		// Apply glitch to primary text
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

		// Apply glitch to secondary text
		PowerGlitch.glitch('.glitch-text-secondary', {
			playMode: 'always',
			createContainers: true,
			hideOverflow: false,
			timing: {
				duration: 2500,
				iterations: Infinity,
				easing: 'ease-in-out',
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
	});

	// Flip card toggle for mobile
	onMount(() => {
		const flipCards = document.querySelectorAll('.flip-card');
		flipCards.forEach(card => {
			card.addEventListener('click', function(this: HTMLElement) {
				this.classList.toggle('flipped');
			});
		});
	});
</script>

<style>
	.flip-card {
		perspective: 1000px;
		cursor: pointer;
	}

	.flip-card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.6s;
		transform-style: preserve-3d;
	}

	.flip-card:hover .flip-card-inner,
	.flip-card.flipped .flip-card-inner { /* .flipped is added dynamically via JavaScript */
		transform: rotateY(180deg);
	}

	.flip-card-front,
	.flip-card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.flip-card-back {
		transform: rotateY(180deg);
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0) translateX(-50%);
		}
		50% {
			transform: translateY(-10px) translateX(-50%);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}

	.animate-fade-in {
		animation: fade-in 0.5s ease-out;
	}

	.glitch-text {
		text-shadow:
			0 0 20px rgba(255, 255, 255, 0.5),
			0 0 40px rgba(255, 255, 255, 0.3),
			0 0 60px rgba(255, 255, 255, 0.2);
	}

	.glitch-text-secondary {
		text-shadow:
			0 0 20px rgba(164, 18, 20, 0.8),
			0 0 40px rgba(164, 18, 20, 0.5),
			0 0 60px rgba(164, 18, 20, 0.3);
	}
</style>

<svelte:head>
	<title>McCloud Manor - Haunt Junkies</title>
	<meta name="description" content="Experience the terror of McCloud Manor - A haunted attraction like no other" />
</svelte:head>

<!-- Video Hero Section -->
<section class="relative h-screen overflow-hidden">
	<!-- Background Video -->
	<video
		autoplay
		muted
		loop
		playsinline
		preload="auto"
		class="absolute inset-0 w-full h-full object-cover"
	>
		<source src="/videos/haunt.mp4" type="video/mp4" />
		Your browser does not support the video tag.
	</video>

	<!-- Hero Content -->
	<div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
		<!-- Glitch Text -->
		<div class="mb-12">
			<h1 class="glitch-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wider">
				LAWRENCEVILLE'S MOST TERRIFYING
			</h1>
			<h2 class="glitch-text-secondary text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-haunt-red tracking-widest">
				HOME HAUNT EXPERIENCE
			</h2>
		</div>

		<!-- Buttons -->
		<div class="flex flex-col sm:flex-row gap-6">
			<a
				href="#tickets"
				class="bg-haunt-red/40 hover:bg-haunt-red text-white font-bold py-6 px-12 rounded-xl transition-all transform hover:scale-105 text-xl shadow-2xl"
			>
				Get Tickets
			</a>
			<a
				href="#about"
				class="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-6 px-12 rounded-xl transition-all border-2 border-white/30 text-xl"
			>
				Learn More
			</a>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
		<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
		</svg>
	</div>
</section>

<!-- About Section -->
<section id="about" class="py-20 bg-black">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="text-5xl md:text-6xl font-creepster text-haunt-red mb-4">
				The Experience
			</h2>
			<p class="text-xl text-gray-400 max-w-3xl mx-auto">
				Prepare yourself for a journey into darkness
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Haunted Mansion Card -->
			<div class="flip-card border border-haunt-red/30 rounded-lg" style="aspect-ratio: 3/4;">
				<div class="flip-card-inner">
					<!-- Front -->
					<div class="flip-card-front">
						<img src="/mansion-bg.jpg" alt="Haunted Mansion" class="absolute inset-0 w-full h-full object-cover" />
						<div class="absolute inset-0 bg-black/40"></div>
						<div class="relative z-10 h-full flex items-center justify-center p-8">
							<h3 class="text-2xl font-creepster text-white drop-shadow-lg">Haunted Mansion</h3>
						</div>
					</div>
					<!-- Back -->
					<div class="flip-card-back">
						<div class="absolute inset-0 bg-gray-900"></div>
						<div class="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
							<h3 class="text-2xl font-creepster text-white mb-3">Haunted Mansion</h3>
							<p class="text-gray-400">
								Explore the cursed halls of McCloud Manor, where every room holds a new terror
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Live Actors Card -->
			<div class="flip-card border border-haunt-red/30 rounded-lg" style="aspect-ratio: 3/4;">
				<div class="flip-card-inner">
					<!-- Front -->
					<div class="flip-card-front">
						<img src="/live-actors-bg.jpg" alt="Live Actors" class="absolute inset-0 w-full h-full object-cover" />
						<div class="absolute inset-0 bg-black/40"></div>
						<div class="relative z-10 h-full flex items-center justify-center p-8">
							<h3 class="text-2xl font-creepster text-white drop-shadow-lg">Live Actors</h3>
						</div>
					</div>
					<!-- Back -->
					<div class="flip-card-back">
						<div class="absolute inset-0 bg-gray-900"></div>
						<div class="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
							<h3 class="text-2xl font-creepster text-white mb-3">Live Actors</h3>
							<p class="text-gray-400">
								Face your fears with our talented cast of creatures and spirits
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Special Effects Card -->
			<div class="flip-card border border-haunt-red/30 rounded-lg" style="aspect-ratio: 3/4;">
				<div class="flip-card-inner">
					<!-- Front -->
					<div class="flip-card-front">
						<img src="/special-effects.jpg" alt="Special Effects" class="absolute inset-0 w-full h-full object-cover" />
						<div class="absolute inset-0 bg-black/40"></div>
						<div class="relative z-10 h-full flex items-center justify-center p-8">
							<h3 class="text-2xl font-creepster text-white drop-shadow-lg">Special Effects</h3>
						</div>
					</div>
					<!-- Back -->
					<div class="flip-card-back">
						<div class="absolute inset-0 bg-gray-900"></div>
						<div class="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
							<h3 class="text-2xl font-creepster text-white mb-3">Special Effects</h3>
							<p class="text-gray-400">
								State-of-the-art lighting, sound, and animatronics create an immersive nightmare
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- McCloud Manor Video Section -->
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
			<source src="/videos/mccloud-manor.mp4" type="video/mp4" />
		</video>
	</div>
</section>

<!-- The Story Section -->
<section class="py-20 bg-black relative overflow-hidden">
	<!-- Atmospheric background with blood drips effect -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0" style="background: radial-gradient(circle at 20% 50%, rgba(164,18,20,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(164,18,20,0.3) 0%, transparent 50%);"></div>
	</div>

	<!-- Vignette effect -->
	<div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50"></div>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Story Header -->
		<div class="text-center mb-16">
			<div class="relative inline-block">
				<!-- Decorative line -->
				<div class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-haunt-red to-transparent"></div>

				<h2 class="text-6xl md:text-7xl lg:text-8xl font-bold text-haunt-red mb-6 tracking-wide drop-shadow-[0_0_30px_rgba(164,18,20,0.8)]">
					The Legend of McCloud Manor
				</h2>

				<!-- Decorative line -->
				<div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-haunt-red to-transparent"></div>
			</div>

			<p class="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mt-8 italic font-fell">
				Madeline Cove, 1665 — A tale of forbidden love, cursed blood, and eternal vengeance
			</p>
		</div>

		<!-- Story Content -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
			<!-- Left accent -->
			<div class="hidden lg:block lg:col-span-1">
				<div class="sticky top-8 h-full border-l-2 border-haunt-red/30"></div>
			</div>

			<!-- Main content -->
			<div class="lg:col-span-10">
				<!-- Opening paragraph with dramatic styling -->
				<div class="mb-10 relative">
					<div class="absolute -left-8 top-0 text-8xl text-haunt-red/20 font-fell leading-none select-none">"</div>
					<p class="text-white text-2xl md:text-3xl leading-relaxed font-fell italic bg-gradient-to-r from-haunt-red/10 to-transparent p-8 rounded-r-2xl border-l-4 border-haunt-red">
						{storyTeaser}
					</p>
				</div>

				<!-- Expandable story content -->
				<div class="overflow-hidden transition-all duration-700 ease-in-out {storyExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}">
					<div class="space-y-8">
						{#each storyBody as paragraph, index}
							<div class="group relative">
								<!-- Chapter markers for key paragraphs -->
								{#if index === 0 || index === 10 || index === 20}
									<div class="absolute -left-12 top-0 w-8 h-8 rounded-full bg-haunt-red/20 border-2 border-haunt-red flex items-center justify-center hidden lg:flex">
										<div class="w-2 h-2 rounded-full bg-haunt-red"></div>
									</div>
								{/if}

								<p class="text-gray-300 text-lg md:text-xl leading-relaxed font-fell {paragraph.startsWith('Some say') ? 'text-haunt-red font-bold italic text-2xl mt-8 text-center' : ''}">
									{paragraph}
								</p>
							</div>
						{/each}

						<!-- Dramatic closing -->
						<div class="mt-12 pt-8 border-t-2 border-haunt-red/30">
							<blockquote class="text-center">
								<p class="text-haunt-red text-2xl md:text-3xl font-creepster mb-4 tracking-wide">
									"The blood remembers what the mind forgets..."
								</p>
								<footer class="text-gray-500 italic font-fell">
									— Dr. William McCloud's final journal entry, 1665
								</footer>
							</blockquote>
						</div>
					</div>
				</div>

				<!-- Read More/Less Button -->
				<div class="mt-12 text-center">
					<button
						onclick={toggleStory}
						class="group relative inline-flex items-center gap-4 bg-gradient-to-r from-haunt-red/80 to-red-900/80 hover:from-haunt-red hover:to-red-900 text-white font-bold py-5 px-10 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden"
					>
						<!-- Animated background -->
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

						<span class="text-xl relative z-10">
							{storyExpanded ? 'Close the Chapter' : 'Uncover the Dark History'}
						</span>
						<svg
							class="w-6 h-6 transition-transform duration-300 relative z-10 {storyExpanded ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Right accent -->
			<div class="hidden lg:block lg:col-span-1">
				<div class="sticky top-8 h-full border-r-2 border-haunt-red/30"></div>
			</div>
		</div>

		<!-- Warning banner when story is expanded -->
		{#if storyExpanded}
			<div class="mt-12 animate-fade-in">
				<div class="bg-gradient-to-r from-transparent via-haunt-red/20 to-transparent p-8 rounded-xl border-y-2 border-haunt-red/50">
					<p class="text-center text-gray-400 text-lg italic">
						The McClouds relocated to Lawrenceville, GA in 2012...<br/>
						<span class="text-haunt-red font-bold text-xl">Their thirst for blood still remains.</span>
					</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Image Slider Section -->
<section class="py-20 bg-gradient-to-b from-black to-gray-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-5xl md:text-6xl font-creepster text-haunt-red mb-12 text-center">
			Gallery
		</h2>

		<div class="relative max-w-5xl mx-auto">
			<!-- Slider Container -->
			<div class="relative h-96 md:h-[600px] overflow-hidden rounded-lg bg-gray-800">
				{#each placeholderImages as image, index}
					<div
						class="absolute inset-0 transition-opacity duration-500 {index === currentSlide ? 'opacity-100' : 'opacity-0'}"
					>
						<div class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
							<div class="text-center">
								<div class="text-8xl mb-4">🖼️</div>
								<p class="text-gray-400 text-xl">{image.caption}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Previous Button -->
			<button
				onclick={prevSlide}
				class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all"
				aria-label="Previous slide"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<!-- Next Button -->
			<button
				onclick={nextSlide}
				class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all"
				aria-label="Next slide"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>

			<!-- Dots Indicator -->
			<div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
				{#each placeholderImages as _, index}
					<button
						onclick={() => goToSlide(index)}
						class="w-3 h-3 rounded-full transition-all {index === currentSlide ? 'bg-haunt-red w-8' : 'bg-white/50 hover:bg-white/75'}"
						aria-label="Go to slide {index + 1}"
					></button>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Video + Text Section -->
<section class="py-20 bg-black">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<!-- Text Content (Left on Desktop) -->
			<div class="order-2 lg:order-1">
				<h2 class="text-4xl md:text-5xl font-creepster text-haunt-red mb-6">
					Behind the Screams
				</h2>
				<p class="text-gray-300 text-lg mb-6 leading-relaxed">
					McCloud Manor has been terrifying visitors for over a decade. What started as a small home haunt
					has evolved into one of the region's most talked-about haunted attractions.
				</p>
				<p class="text-gray-300 text-lg mb-6 leading-relaxed">
					Our team of dedicated horror enthusiasts work year-round to create new scares,
					build detailed sets, and perfect every spine-chilling moment of your visit.
				</p>
				<p class="text-gray-300 text-lg mb-8 leading-relaxed">
					With over 5,000 square feet of terror, featuring 15+ rooms of horror,
					professional actors, and cutting-edge special effects, we guarantee an experience
					you'll never forget... no matter how hard you try.
				</p>
				<a
					href="#tickets"
					class="inline-block bg-haunt-red hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
				>
					Reserve Your Spot
				</a>
			</div>

			<!-- YouTube Video (Right on Desktop) -->
			<div class="order-1 lg:order-2">
				<div class="aspect-video rounded-lg overflow-hidden shadow-2xl border-2 border-haunt-red/30">
					<div class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
						<div class="text-center">
							<svg class="w-24 h-24 text-haunt-red mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
							</svg>
							<p class="text-gray-400 text-xl">YouTube Video Placeholder</p>
							<p class="text-gray-500 text-sm mt-2">Add your YouTube embed URL</p>
						</div>
					</div>
					<!-- Replace the placeholder above with actual YouTube embed: -->
					<!-- <iframe
						src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
						title="McCloud Manor Video"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						class="w-full h-full"
					></iframe> -->
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Reviews Section -->
<section class="relative py-20 bg-black overflow-hidden">
	<!-- Atmospheric background -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(164,18,20,0.5) 2px, rgba(164,18,20,0.5) 4px);"></div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Section Header -->
		<div class="text-center mb-16">
			<div class="inline-block relative">
				<h2 class="text-5xl md:text-7xl font-creepster text-haunt-red mb-4 drop-shadow-lg">
					What Our Victims Say
				</h2>
				<div class="absolute -left-16 top-1/2 transform -translate-y-1/2 text-5xl opacity-60">💀</div>
				<div class="absolute -right-16 top-1/2 transform -translate-y-1/2 text-5xl opacity-60">💀</div>
			</div>
			<p class="text-xl md:text-2xl text-gray-300 mt-6 font-bold">
				Rated one of Georgia's Best Haunts
			</p>
		</div>

		<!-- Featured Quote -->
		<div class="mb-12">
			<div class="relative max-w-4xl mx-auto">
				<div class="absolute -top-8 -left-4 text-9xl text-haunt-red opacity-30 font-serif">"</div>
				<div class="bg-gradient-to-br from-haunt-red/20 via-black to-haunt-red/20 border-4 border-haunt-red rounded-2xl p-12 shadow-2xl">
					<blockquote class="text-center">
						<p class="text-2xl md:text-3xl text-white font-bold mb-6 italic">
							Honestly, the best haunt we have been to. Even better than some of the big commercialized haunted houses!
						</p>
						<footer class="text-lg text-gray-400">
							— Verified Visitor
						</footer>
					</blockquote>
				</div>
				<div class="absolute -bottom-8 -right-4 text-9xl text-haunt-red opacity-30 font-serif">"</div>
			</div>
		</div>

		<!-- Reviews Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
			<!-- Review Card 1 -->
			<div class="bg-gradient-to-b from-gray-900 to-black border-2 border-haunt-red/40 rounded-xl p-8 shadow-xl hover:border-haunt-red transition-all duration-300 transform hover:scale-105">
				<div class="flex items-center gap-2 mb-4">
					{#each Array(5) as _}
						<svg class="w-6 h-6 text-haunt-red" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					{/each}
				</div>
				<p class="text-gray-300 text-lg mb-4 leading-relaxed">
					"The actors are very interactive and no other groups are around to ruin your experience! You will definitely get the scare you are looking for!"
				</p>
				<p class="text-haunt-red font-bold">— Happy Haunter</p>
			</div>

			<!-- Review Card 2 -->
			<div class="bg-gradient-to-b from-gray-900 to-black border-2 border-haunt-red/40 rounded-xl p-8 shadow-xl hover:border-haunt-red transition-all duration-300 transform hover:scale-105">
				<div class="flex items-center gap-2 mb-4">
					{#each Array(5) as _}
						<svg class="w-6 h-6 text-haunt-red" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					{/each}
				</div>
				<p class="text-gray-300 text-lg mb-4 leading-relaxed">
					"Every year we look forward to visiting their haunt. While it's a little bit shorter due to being a home haunt, the quality of it is awesome!"
				</p>
				<p class="text-haunt-red font-bold">— Annual Visitor</p>
			</div>

			<!-- Review Card 3 -->
			<div class="bg-gradient-to-b from-gray-900 to-black border-2 border-haunt-red/40 rounded-xl p-8 shadow-xl hover:border-haunt-red transition-all duration-300 transform hover:scale-105">
				<div class="flex items-center gap-2 mb-4">
					{#each Array(5) as _}
						<svg class="w-6 h-6 text-haunt-red" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					{/each}
				</div>
				<p class="text-gray-300 text-lg mb-4 leading-relaxed">
					"Cannot recommend this haunt enough! People don't expect it because they think it's a regular old house in a cul-de-sac, but you're in for a terrifying surprise!"
				</p>
				<p class="text-haunt-red font-bold">— Scream Enthusiast</p>
			</div>
		</div>

		<!-- Bottom CTA -->
		<div class="text-center">
			<div class="inline-block bg-gradient-to-r from-haunt-red via-red-700 to-haunt-red p-1 rounded-xl">
				<div class="bg-black rounded-lg px-8 py-4">
					<p class="text-white text-xl font-bold">
						Think you can handle it?
						<a href="#tickets" class="text-haunt-red hover:text-red-500 transition-colors ml-2 underline">
							Get Your Tickets →
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Info Cards Section -->
<section class="py-20 bg-gradient-to-b from-gray-900 to-black">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="bg-black/50 rounded-lg p-8 border border-haunt-red/30">
				<div class="flex items-center gap-3 mb-4">
					<svg class="w-8 h-8 text-haunt-red" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
					</svg>
					<h3 class="text-2xl font-creepster text-white">Dates</h3>
				</div>
				<p class="text-gray-300 text-lg">{data.info?.dates || 'October 2025'}</p>
			</div>

			<div class="bg-black/50 rounded-lg p-8 border border-haunt-red/30">
				<div class="flex items-center gap-3 mb-4">
					<svg class="w-8 h-8 text-haunt-red" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
					</svg>
					<h3 class="text-2xl font-creepster text-white">Hours</h3>
				</div>
				<p class="text-gray-300 text-lg">{data.info?.hours || '7:00 PM - 11:00 PM'}</p>
			</div>

			<div class="bg-black/50 rounded-lg p-8 border border-haunt-red/30">
				<div class="flex items-center gap-3 mb-4">
					<svg class="w-8 h-8 text-haunt-red" fill="currentColor" viewBox="0 0 20 20">
						<path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
					</svg>
					<h3 class="text-2xl font-creepster text-white">Pricing</h3>
				</div>
				<p class="text-gray-300 text-lg">{data.info?.pricing || 'TBD'}</p>
			</div>
		</div>
	</div>
</section>

<!-- FAQs Section -->
<section class="py-20 bg-gradient-to-b from-gray-900 to-black">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<div class="inline-block relative mb-6">
				<h2 class="text-5xl md:text-6xl font-creepster text-haunt-red">
					Frequently Asked Questions
				</h2>
				<div class="absolute -left-16 top-1/2 transform -translate-y-1/2 text-4xl opacity-50">❓</div>
				<div class="absolute -right-16 top-1/2 transform -translate-y-1/2 text-4xl opacity-50">❓</div>
			</div>
			<p class="text-xl text-gray-400">
				Everything you need to know before your visit
			</p>
		</div>

		<div class="space-y-4">
			{#each [
				{ q: 'Does it cost?', a: 'This is a free event but we do accept donations and canned goods which we donate to local Gwinnett county charities.' },
				{ q: 'Where do I park? Do you charge for parking?', a: 'Parking is free but extremely limited being this is a home haunt! We suggest carpooling if possible or even an Uber/Lyft.' },
				{ q: 'What are the hours?', a: 'We open at 8pm and will not accept entry after 11pm. Everyone in line before that time will go through.' },
				{ q: 'Are you open if it rains?', a: 'Yes we are open when it rains but our line is not covered. Plan accordingly.' },
				{ q: 'Is it scary?', a: 'Don\'t let the location fool you…' },
				{ q: 'Are there any age restrictions?', a: 'We leave this up to the parents discretion but do not recommend young children' },
				{ q: 'How long does it take to walk through?', a: '10 min max' },
				{ q: 'What\'s the largest group allowed at one time?', a: '4 people maximum at a time. No exceptions as this is our home.' },
				{ q: 'Can I go if I\'m pregnant?', a: 'Unfortunately no, the nature of our attraction is not ideal for women who are pregnant' },
				{ q: 'Is it handicap accessible?', a: 'Unfortunately no, the nature of our attraction is not ideal for anyone with a mobility issue.' },
				{ q: 'Do you sell beverages and food?', a: 'No we do not sell food or beverages' },
				{ q: 'Can we take pictures?', a: 'Pictures are not allowed when walking through the haunt but we do allow pictures in the queue line and have a few photo ops available as well.' },
				{ q: 'Is there a bathroom on-site?', a: 'Unfortunately no, but there are several gas stations nearby.' }
			] as faq, index}
				<details class="group bg-gradient-to-br from-black via-gray-900 to-black rounded-xl border-2 border-haunt-red/20 hover:border-haunt-red/50 transition-all duration-300 overflow-hidden">
					<summary class="cursor-pointer list-none p-6 flex items-center justify-between gap-4">
						<div class="flex items-center gap-4 flex-1">
							<div class="flex-shrink-0 w-10 h-10 bg-haunt-red rounded-full flex items-center justify-center font-bold text-white shadow-lg">
								{index + 1}
							</div>
							<h3 class="text-lg md:text-xl font-bold text-white group-hover:text-haunt-red transition-colors">
								{faq.q}
							</h3>
						</div>
						<svg
							class="w-6 h-6 text-haunt-red transform transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-6 pb-6 pt-2">
						<div class="pl-14 pr-10">
							<div class="h-px bg-gradient-to-r from-haunt-red/50 via-haunt-red to-haunt-red/50 mb-4"></div>
							<p class="text-gray-300 text-lg leading-relaxed">
								{faq.a}
							</p>
						</div>
					</div>
				</details>
			{/each}
		</div>

		<!-- Decorative divider -->
		<div class="mt-16 flex items-center justify-center gap-4">
			<div class="h-px flex-1 bg-gradient-to-r from-transparent via-haunt-red/50 to-transparent"></div>
			<div class="text-haunt-red text-3xl">🎃</div>
			<div class="h-px flex-1 bg-gradient-to-r from-transparent via-haunt-red/50 to-transparent"></div>
		</div>
	</div>
</section>

<!-- Ticket Request Form -->
<section id="tickets" class="py-20 bg-black">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="text-5xl md:text-6xl font-creepster text-haunt-red mb-4">
				Get Your Tickets
			</h2>
			<p class="text-xl text-gray-400">
				Request tickets and we'll contact you with availability
			</p>
		</div>

		<div class="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 md:p-12 border border-haunt-red/30">
			{#if form?.success}
				<div class="mb-6 p-6 bg-green-900/30 border border-green-700 rounded-lg">
					<h3 class="text-green-300 font-bold text-xl mb-2">Request Received!</h3>
					<p class="text-green-200">
						Thank you for your interest. We'll contact you soon with ticket information.
					</p>
				</div>
			{/if}

			{#if form?.error}
				<div class="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
					{form.error}
				</div>
			{/if}

			<form method="POST" action="?/requestTickets" use:enhance>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-400 mb-2">Name *</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-haunt-red transition-colors"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-400 mb-2">Email *</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-haunt-red transition-colors"
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<label for="phone" class="block text-sm font-medium text-gray-400 mb-2">Phone</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-haunt-red transition-colors"
						/>
					</div>
					<div>
						<label for="quantity" class="block text-sm font-medium text-gray-400 mb-2">Number of Tickets *</label>
						<input
							type="number"
							id="quantity"
							name="quantity"
							min="1"
							required
							class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-haunt-red transition-colors"
						/>
					</div>
				</div>

				<div class="mb-6">
					<label for="preferred_date" class="block text-sm font-medium text-gray-400 mb-2">Preferred Date</label>
					<input
						type="date"
						id="preferred_date"
						name="preferred_date"
						class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-haunt-red transition-colors"
					/>
				</div>

				<div class="mb-8">
					<label for="message" class="block text-sm font-medium text-gray-400 mb-2">Message</label>
					<textarea
						id="message"
						name="message"
						rows="4"
						class="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-haunt-red transition-colors"
					></textarea>
				</div>

				<button
					type="submit"
					class="w-full bg-haunt-red hover:bg-red-900 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 text-lg shadow-xl"
				>
					Request Tickets
				</button>
			</form>
		</div>
	</div>
</section>

