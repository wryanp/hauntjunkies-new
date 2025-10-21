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

	// FAQ expand/collapse state
	let faqExpanded = $state(false);

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

				<h2 class="text-6xl md:text-7xl lg:text-8xl font-bold text-haunt-red mb-6 tracking-wide drop-shadow-[0_0_40px_rgba(164,18,20,0.8)]">
					The Legend of <span class="whitespace-nowrap">McCloud Manor</span>
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
								<p class="text-haunt-red text-2xl md:text-3xl font-bold mb-4 italic">
									"The blood remembers what the mind forgets..."
								</p>
								<footer class="text-gray-500 italic">
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

<!-- About Section -->
<section id="about" class="py-20 bg-black relative overflow-hidden">
	<!-- Smoky animated background -->
	<div class="absolute inset-0">
		<!-- Multiple smoke layers for depth -->
		<div class="absolute inset-0 opacity-20" style="background: radial-gradient(ellipse at 20% 30%, rgba(100,100,100,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(100,100,100,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(80,80,80,0.2) 0%, transparent 60%);"></div>
		<div class="absolute inset-0 opacity-15" style="background: radial-gradient(ellipse at 60% 40%, rgba(120,120,120,0.4) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(90,90,90,0.3) 0%, transparent 50%);"></div>

		<!-- Animated smoke wisps -->
		<div class="absolute inset-0 animate-pulse" style="animation-duration: 8s; background: radial-gradient(ellipse at 40% 60%, rgba(100,100,100,0.15) 0%, transparent 40%);"></div>
	</div>

	<!-- Red glow accents -->
	<div class="absolute inset-0 opacity-10" style="background: radial-gradient(ellipse at 50% 0%, rgba(164,18,20,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(164,18,20,0.4) 0%, transparent 50%);"></div>

	<!-- Texture overlay -->
	<div class="absolute inset-0 opacity-5" style="background-image: url('/calendar-bg.png'); background-size: cover;"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Striking Header -->
		<div class="text-center mb-16">
			<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
				THE EXPERIENCE
			</h2>
			<div class="w-32 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto mb-6"></div>
			<p class="text-2xl md:text-3xl text-white font-bold max-w-3xl mx-auto">
				Prepare yourself for a journey into darkness
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
			<!-- Haunted Mansion Card -->
			<div class="group relative">
				<div class="relative overflow-hidden rounded-2xl border-4 border-haunt-red/50 hover:border-haunt-red transition-all duration-500 transform hover:scale-105" style="aspect-ratio: 3/4; box-shadow: 0 0 30px rgba(164,18,20,0.4);">
					<img src="/mansion-bg.jpg" alt="Haunted Mansion" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
					<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

					<!-- Red glow effect -->
					<div class="absolute inset-0 bg-haunt-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

					<div class="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
						<h3 class="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-2xl tracking-wide">
							HAUNTED MANSION
						</h3>
						<p class="text-gray-200 text-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
							Explore the cursed halls of McCloud Manor, where every room holds a new terror
						</p>
					</div>
				</div>
			</div>

			<!-- Live Actors Card -->
			<div class="group relative">
				<div class="relative overflow-hidden rounded-2xl border-4 border-haunt-red/50 hover:border-haunt-red transition-all duration-500 transform hover:scale-105" style="aspect-ratio: 3/4; box-shadow: 0 0 30px rgba(164,18,20,0.4);">
					<img src="/live-actors-bg.jpg" alt="Live Actors" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
					<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

					<!-- Red glow effect -->
					<div class="absolute inset-0 bg-haunt-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

					<div class="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
						<h3 class="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-2xl tracking-wide">
							LIVE ACTORS
						</h3>
						<p class="text-gray-200 text-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
							Face your fears with our talented cast of creatures and spirits
						</p>
					</div>
				</div>
			</div>

			<!-- Special Effects Card -->
			<div class="group relative">
				<div class="relative overflow-hidden rounded-2xl border-4 border-haunt-red/50 hover:border-haunt-red transition-all duration-500 transform hover:scale-105" style="aspect-ratio: 3/4; box-shadow: 0 0 30px rgba(164,18,20,0.4);">
					<img src="/special-effects.jpg" alt="Special Effects" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
					<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

					<!-- Red glow effect -->
					<div class="absolute inset-0 bg-haunt-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

					<div class="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
						<h3 class="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-2xl tracking-wide">
							SPECIAL EFFECTS
						</h3>
						<p class="text-gray-200 text-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
							State-of-the-art lighting, sound, and animatronics create an immersive nightmare
						</p>
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

				<h2 class="text-6xl md:text-7xl lg:text-8xl font-bold text-haunt-red mb-6 tracking-wide drop-shadow-[0_0_40px_rgba(164,18,20,0.8)]">
					The Legend of <span class="whitespace-nowrap">McCloud Manor</span>
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
								<p class="text-haunt-red text-2xl md:text-3xl font-bold mb-4 italic">
									"The blood remembers what the mind forgets..."
								</p>
								<footer class="text-gray-500 italic">
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


<!-- Video + Text Section -->
<section class="py-20 bg-black">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Striking Header -->
		<div class="text-center mb-12">
			<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
				BEHIND THE SCREAMS
			</h2>
			<div class="w-32 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto"></div>
		</div>

		<!-- Video Container -->
		<div class="mx-auto max-w-4xl w-full">
			<!-- Video -->
			<div class="aspect-video rounded-lg overflow-hidden shadow-2xl border-2 border-haunt-red/30">
				<video
					controls
					preload="metadata"
					class="w-full h-full object-cover bg-black"
				>
					<source src="/videos/fox5-news.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>

			<!-- Featured On Badge -->
			<div class="text-center mt-8">
				<h3 class="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-widest" style="text-shadow: 0 0 20px rgba(164,18,20,0.8);">
					FEATURED ON
				</h3>
				<div class="flex justify-center items-center">
					<div class="relative">
						<!-- Glow effect behind -->
						<div class="absolute inset-0 bg-haunt-red rounded-xl blur-2xl opacity-60" style="transform: scale(1.1);"></div>
						<!-- Logo container -->
						<div class="relative bg-white px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-transform" style="box-shadow: 0 0 30px rgba(164,18,20,0.5), 0 10px 40px rgba(0,0,0,0.5);">
							<img
								src="/fox5-logo.png"
								alt="FOX 5 Atlanta"
								class="h-12 md:h-16 w-auto"
							/>
						</div>
					</div>
				</div>
				<div class="w-24 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto mt-6"></div>
			</div>
		</div>
	</div>
</section>

<!-- Schedule Section -->
<section class="py-16 bg-black relative overflow-hidden" style="background-image: url('/calendar-bg.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
	<!-- Red glow overlay -->
	<div class="absolute inset-0 bg-gradient-radial from-haunt-red/30 via-haunt-red/10 to-transparent" style="background: radial-gradient(circle at center, rgba(164,18,20,0.4) 0%, rgba(164,18,20,0.2) 40%, transparent 70%);"></div>
	<!-- Overlay for better text readability -->
	<div class="absolute inset-0 bg-black/30"></div>

	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="text-center mb-10">
			<h2 class="glitch-text text-4xl md:text-5xl font-bold text-white mb-3 tracking-wider">
				2026 SCHEDULE
			</h2>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Calendar (Left - 2 columns) -->
			<div class="lg:col-span-2">
				<div class="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg overflow-hidden shadow-2xl border-4 border-haunt-red/50 relative" style="box-shadow: 0 0 30px rgba(164,18,20,0.5), inset 0 0 20px rgba(0,0,0,0.8);">
					<!-- Blood drips effect -->
					<div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-haunt-red/80 to-transparent"></div>

					<!-- Calendar Header -->
					<div class="bg-gradient-to-b from-haunt-red to-red-900 text-white text-center py-2 border-b-4 border-black relative">
						<h3 class="text-lg md:text-xl font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">OCTOBER 2026</h3>
						<div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent"></div>
					</div>

					<!-- Days of Week -->
					<div class="grid grid-cols-7 bg-black text-white border-b-2 border-haunt-red/30">
						<div class="text-center py-2 text-xs font-bold border-r border-gray-800 text-gray-400">SUN</div>
						<div class="text-center py-2 text-xs font-bold border-r border-gray-800 text-gray-400">MON</div>
						<div class="text-center py-2 text-xs font-bold border-r border-gray-800 text-gray-400">TUE</div>
						<div class="text-center py-2 text-xs font-bold border-r border-gray-800 text-gray-400">WED</div>
						<div class="text-center py-2 text-xs font-bold border-r border-gray-800 text-gray-400">THU</div>
						<div class="text-center py-2 text-xs font-bold border-r border-gray-800 text-gray-400">FRI</div>
						<div class="text-center py-2 text-xs font-bold text-gray-400">SAT</div>
					</div>

					<!-- Calendar Days -->
					<div class="grid grid-cols-7">
						<!-- Week 1 -->
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">1</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">2</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">3</span></div>

						<!-- Week 2 -->
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">4</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">5</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">6</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">7</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">8</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">9</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">10</span></div>

						<!-- Week 3 -->
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">11</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">12</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">13</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">14</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">15</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">16</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">17</span></div>

						<!-- Week 4 -->
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">18</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">19</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">20</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">21</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">22</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">23</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">24</span></div>

						<!-- Week 5 -->
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">25</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">26</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">27</span></div>
						<div class="bg-gray-900 border-2 border-gray-800 p-3 h-16 hover:bg-gray-800 transition-colors"><span class="text-base md:text-lg font-extrabold text-gray-400">28</span></div>
						<!-- Oct 29 - HIGHLIGHTED -->
						<a href="#tickets" class="block bg-gradient-to-br from-haunt-red via-red-900 to-black border-4 border-haunt-red p-3 h-16 relative transform hover:scale-110 transition-all cursor-pointer" style="box-shadow: 0 0 20px rgba(164,18,20,1), inset 0 0 10px rgba(164,18,20,0.5);">
							<span class="font-extrabold text-white text-xl md:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">29</span>
							<div class="absolute bottom-1 right-1 text-white text-xs font-extrabold bg-black/70 px-2 py-0.5 rounded">OPEN</div>
						</a>
						<!-- Oct 30 - HIGHLIGHTED -->
						<a href="#tickets" class="block bg-gradient-to-br from-haunt-red via-red-900 to-black border-4 border-haunt-red p-3 h-16 relative transform hover:scale-110 transition-all cursor-pointer" style="box-shadow: 0 0 20px rgba(164,18,20,1), inset 0 0 10px rgba(164,18,20,0.5);">
							<span class="font-extrabold text-white text-xl md:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">30</span>
							<div class="absolute bottom-1 right-1 text-white text-xs font-extrabold bg-black/70 px-2 py-0.5 rounded">OPEN</div>
						</a>
						<!-- Oct 31 - HIGHLIGHTED -->
						<a href="#tickets" class="block bg-gradient-to-br from-haunt-red via-red-900 to-black border-4 border-haunt-red p-3 h-16 relative transform hover:scale-110 transition-all cursor-pointer" style="box-shadow: 0 0 20px rgba(164,18,20,1), inset 0 0 10px rgba(164,18,20,0.5);">
							<span class="font-extrabold text-white text-xl md:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">31</span>
							<div class="absolute bottom-1 right-1 text-white text-xs font-extrabold bg-black/70 px-2 py-0.5 rounded">OPEN</div>
						</a>
					</div>

					<!-- November Row -->
					<div class="grid grid-cols-7 border-t-4 border-haunt-red/80" style="box-shadow: inset 0 4px 8px rgba(164,18,20,0.3);">
						<!-- Nov 1 - HIGHLIGHTED -->
						<a href="#tickets" class="block bg-gradient-to-br from-haunt-red via-red-900 to-black border-4 border-haunt-red p-3 h-16 relative transform hover:scale-110 transition-all cursor-pointer" style="box-shadow: 0 0 20px rgba(164,18,20,1), inset 0 0 10px rgba(164,18,20,0.5);">
							<span class="font-extrabold text-white text-xl md:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">1</span>
							<div class="absolute bottom-1 right-1 text-white text-xs font-extrabold bg-black/70 px-2 py-0.5 rounded">OPEN</div>
						</a>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
						<div class="bg-gray-900/30 border border-gray-800/50 p-3 h-16"></div>
					</div>
				</div>

				<!-- Disclaimer Text -->
				<div class="mt-6">
					<p class="text-gray-400 text-sm text-center leading-relaxed">
						Times are subject to change based on weather. Follow us on social media for real-time updates.
					</p>
				</div>
			</div>

			<!-- Schedule Info (Right - 1 column) -->
			<div class="lg:col-span-1">
				<div class="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg overflow-hidden shadow-2xl border-4 border-haunt-red/50 relative flex flex-col" style="box-shadow: 0 0 30px rgba(164,18,20,0.5), inset 0 0 20px rgba(0,0,0,0.8);">
					<!-- Blood drips effect -->
					<div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-haunt-red/80 to-transparent"></div>

					<!-- Header -->
					<div class="bg-gradient-to-b from-haunt-red to-red-900 text-white text-center py-4 border-b-4 border-black relative">
						<h3 class="text-2xl md:text-3xl font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">HOURS</h3>
						<div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent"></div>
					</div>

					<!-- Hours Content -->
					<div class="flex-1 flex flex-col justify-center p-8 space-y-8">
						<!-- Thursday -->
						<div class="border-b-2 border-haunt-red/30 pb-6">
							<div class="text-xl md:text-2xl font-bold text-haunt-red mb-3 tracking-wider drop-shadow-lg">THURSDAY</div>
							<div class="text-3xl md:text-4xl font-bold text-white drop-shadow-xl">8PM - 11PM</div>
						</div>

						<!-- Friday -->
						<div class="border-b-2 border-haunt-red/30 pb-6">
							<div class="text-xl md:text-2xl font-bold text-haunt-red mb-3 tracking-wider drop-shadow-lg">FRIDAY</div>
							<div class="text-3xl md:text-4xl font-bold text-white drop-shadow-xl">8PM - 12AM</div>
						</div>

						<!-- Saturday -->
						<div class="border-b-2 border-haunt-red/30 pb-6">
							<div class="text-xl md:text-2xl font-bold text-haunt-red mb-3 tracking-wider drop-shadow-lg">SATURDAY</div>
							<div class="text-3xl md:text-4xl font-bold text-white drop-shadow-xl">8PM - 12AM</div>
						</div>

						<!-- Sunday -->
						<div class="pb-6">
							<div class="text-xl md:text-2xl font-bold text-haunt-red mb-3 tracking-wider drop-shadow-lg">SUNDAY</div>
							<div class="text-3xl md:text-4xl font-bold text-white drop-shadow-xl">8PM - 11PM</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FAQs Section -->
<section class="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
	<!-- Background texture overlay -->
	<div class="absolute inset-0 opacity-5" style="background-image: url('/calendar-bg.png'); background-size: cover;"></div>

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Striking Header -->
		<div class="text-center mb-12">
			<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
				FREQUENTLY ASKED QUESTIONS
			</h2>
			<div class="w-32 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto"></div>
		</div>

		<!-- Expand/Collapse Button -->
		<div class="text-center mb-12">
			<button
				onclick={() => faqExpanded = !faqExpanded}
				class="group relative inline-flex items-center gap-4 bg-gradient-to-r from-haunt-red to-red-900 hover:from-red-900 hover:to-haunt-red text-white font-extrabold py-5 px-12 rounded-xl transition-all transform hover:scale-110 shadow-2xl overflow-hidden border-2 border-haunt-red/50"
				style="box-shadow: 0 0 30px rgba(164,18,20,0.6), 0 10px 40px rgba(0,0,0,0.5);"
			>
				<!-- Animated background -->
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

				<span class="text-xl md:text-2xl relative z-10 tracking-wide">
					{faqExpanded ? 'HIDE FAQs' : 'SHOW FAQs'}
				</span>
				<svg
					class="w-6 h-6 transition-transform duration-300 relative z-10 {faqExpanded ? 'rotate-180' : ''}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>

		<div class="space-y-4 overflow-hidden transition-all duration-700 ease-in-out {faqExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}">
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
				<details class="group bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl border-4 border-haunt-red/30 hover:border-haunt-red transition-all duration-300 overflow-hidden shadow-xl" style="box-shadow: 0 0 20px rgba(164,18,20,0.3);">
					<summary class="cursor-pointer list-none p-6 md:p-8 flex items-center justify-between gap-4 hover:bg-haunt-red/10 transition-colors">
						<h3 class="text-xl md:text-2xl font-extrabold text-white group-hover:text-haunt-red transition-colors tracking-wide flex-1">
							{faq.q}
						</h3>
						<svg
							class="w-7 h-7 md:w-8 md:h-8 text-haunt-red transform transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="3"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-6 md:px-8 pb-6 md:pb-8 pt-2">
						<div class="pr-4 md:pr-10">
							<div class="h-1 bg-gradient-to-r from-haunt-red/50 via-haunt-red to-haunt-red/50 mb-6 rounded-full"></div>
							<p class="text-gray-300 text-lg md:text-xl leading-relaxed font-medium">
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
		</div>
	</div>
</section>

<!-- Ticket Request Form -->
<section id="tickets" class="py-20 bg-black">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="glitch-text text-5xl md:text-6xl font-bold text-white mb-4 tracking-wider">
				GET YOUR TICKETS
			</h2>
			<p class="text-xl text-gray-400">
				Tickets are LIMITED!
			</p>
		</div>

		<div class="text-center">
			<a
				href="#"
				class="inline-block bg-haunt-red hover:bg-red-900 text-white font-bold py-4 px-12 rounded-lg transition-all transform hover:scale-105 text-lg shadow-xl"
			>
				Get Tickets
			</a>
		</div>
	</div>
</section>

