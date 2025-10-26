<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import GoogleMap from '$lib/components/GoogleMap.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Calculate the next haunt season year (October-November)
	// If we're currently before August, use current year; otherwise use next year
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth(); // 0-indexed (0 = January)
	const hauntYear = currentMonth < 7 ? currentYear : currentYear + 1; // Use next year if after July

	// Helper to check if a specific date has tickets available
	function hasTickets(year: number, month: number, day: number): boolean {
		const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return data.ticketDates?.some((td: any) => td.date === dateString) || false;
	}

	// Calculate what day of the week October 1st falls on (0 = Sunday, 6 = Saturday)
	const octFirstDayOfWeek = $derived.by(() => {
		const oct1 = new Date(hauntYear, 9, 1); // Month is 0-indexed (9 = October)
		return oct1.getDay(); // 0-6 (Sun-Sat)
	});

	// Calculate what day of the week November 1st falls on
	const novFirstDayOfWeek = $derived.by(() => {
		const nov1 = new Date(hauntYear, 10, 1); // Month is 0-indexed (10 = November)
		return nov1.getDay(); // 0-6 (Sun-Sat)
	});

	// Calculate which days of the week the haunt operates based on ticket dates
	const operatingDays = $derived.by(() => {
		if (!data.ticketDates || data.ticketDates.length === 0) return new Set();

		const daysOfWeek = new Set<number>();
		data.ticketDates.forEach((td: any) => {
			const date = new Date(td.date + 'T00:00:00'); // Force local timezone
			daysOfWeek.add(date.getDay()); // 0=Sun, 1=Mon, ..., 6=Sat
		});
		return daysOfWeek;
	});

	// Map day numbers to names
	const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

	// Default hours configuration (can be customized per day if needed)
	const hoursConfig: Record<number, string> = {
		0: '8PM - 11PM', // Sunday
		1: '8PM - 11PM', // Monday
		2: '8PM - 11PM', // Tuesday
		3: '8PM - 11PM', // Wednesday
		4: '8PM - 11PM', // Thursday
		5: '8PM - 12AM', // Friday
		6: '8PM - 12AM', // Saturday
	};

	// Get first available ticket date or fallback
	const firstAvailableDate = $derived(data.ticketDates?.[0]?.date || `${hauntYear}-10-29`);

	// Check if there are any active/future ticket dates
	const hasActiveDates = $derived(data.ticketDates && data.ticketDates.length > 0);

	// Get calendar OPEN dates from database or fallback to calculated year
	const oct29Date = $derived(data.ticketDates?.find(d => d.date.endsWith('-10-29'))?.date || `${hauntYear}-10-29`);
	const oct30Date = $derived(data.ticketDates?.find(d => d.date.endsWith('-10-30'))?.date || `${hauntYear}-10-30`);
	const oct31Date = $derived(data.ticketDates?.find(d => d.date.endsWith('-10-31'))?.date || `${hauntYear}-10-31`);
	const nov1Date = $derived(data.ticketDates?.find(d => d.date.endsWith('-11-01'))?.date || `${hauntYear}-11-01`);

	// Story expand/collapse state
	let storyExpanded = $state(false);

	// FAQ expand/collapse state
	let faqExpanded = $state(false);

	// Default story text (permanent content, won't change)
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

	function toggleStory() {
		storyExpanded = !storyExpanded;
		// If closing the story, scroll to the legend section
		if (!storyExpanded) {
			setTimeout(() => {
				const legendSection = document.getElementById('legend-section');
				if (legendSection) {
					legendSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}, 100);
		}
	}

	onMount(async () => {
		// Scroll to top when page loads
		window.scrollTo({ top: 0, behavior: 'instant' });

		// Check if URL hash is #faq-section and auto-expand FAQs
		if (window.location.hash === '#faq-section') {
			faqExpanded = true;
		}

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

		// Scroll-based video unmute for McCloud Manor video
		const mccloudVideo = document.querySelector('#mccloud-manor-video') as HTMLVideoElement;
		if (mccloudVideo) {
			// Ensure video has loaded
			mccloudVideo.load();

			let mccloudHasBeenInView = false;

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && !mccloudHasBeenInView) {
							// Only unmute the first time it comes into view (scrolling down)
							mccloudVideo.muted = false;
							mccloudVideo.volume = 1.0;
							// Ensure it's playing
							mccloudVideo.play().catch(() => {});
							mccloudHasBeenInView = true;
						} else if (!entry.isIntersecting && mccloudHasBeenInView) {
							// Mute when not visible
							mccloudVideo.muted = true;
						}
					});
				},
				{ threshold: 0.1 }
			);
			observer.observe(mccloudVideo);

			// Also add a click handler to unmute on user interaction
			let hasInteracted = false;
			const handleInteraction = () => {
				if (!hasInteracted) {
					hasInteracted = true;
					document.removeEventListener('click', handleInteraction);
					document.removeEventListener('touchstart', handleInteraction);
				}
			};
			document.addEventListener('click', handleInteraction);
			document.addEventListener('touchstart', handleInteraction);
		}

		// Scroll-based video unmute for Behind the Screams video
		const behindScreamsVideo = document.querySelector('#behind-screams-video') as HTMLVideoElement;
		if (behindScreamsVideo) {
			// Ensure video has loaded
			behindScreamsVideo.load();

			let behindHasBeenInView = false;

			const observerBehind = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && !behindHasBeenInView) {
							// Only unmute the first time it comes into view (scrolling down)
							behindScreamsVideo.muted = false;
							behindScreamsVideo.volume = 1.0;
							// Ensure it's playing
							behindScreamsVideo.play().catch(() => {});
							behindHasBeenInView = true;
						} else if (!entry.isIntersecting && behindHasBeenInView) {
							// Mute when not visible
							behindScreamsVideo.muted = true;
						}
					});
				},
				{ threshold: 0.1 }
			);
			observerBehind.observe(behindScreamsVideo);

			// Also add a click handler to unmute on user interaction
			let hasInteractedBehind = false;
			const handleInteractionBehind = () => {
				if (!hasInteractedBehind) {
					hasInteractedBehind = true;
					document.removeEventListener('click', handleInteractionBehind);
					document.removeEventListener('touchstart', handleInteractionBehind);
				}
			};
			document.addEventListener('click', handleInteractionBehind);
			document.addEventListener('touchstart', handleInteractionBehind);
		}
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

	.glitch-text-secondary {
		text-shadow:
			0 0 20px rgba(164, 18, 20, 0.8),
			0 0 40px rgba(164, 18, 20, 0.5),
			0 0 60px rgba(164, 18, 20, 0.3);
	}
</style>

<SEO
	title="McCloud Manor"
	description="Experience the terror of McCloud Manor - A haunted attraction like no other. Professional haunted house in Atlanta featuring extreme scares, interactive actors, and unforgettable horror. Book your tickets now!"
	url="/haunt"
	image="/og.png"
	type="website"
/>

<!-- Video Hero Section -->
<section class="relative overflow-hidden" style="min-height: 100vh;">
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
	<div class="relative z-10 h-full min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
		<!-- Glitch Text -->
		<div class="mb-8 md:mb-12">
			<h1 class="glitch-text text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 tracking-wider leading-tight">
				LAWRENCEVILLE'S MOST TERRIFYING
			</h1>
			<h2 class="glitch-text-secondary text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-haunt-red tracking-widest leading-tight">
				HOME HAUNT EXPERIENCE
			</h2>
		</div>

		<!-- Buttons -->
		<div class="flex flex-row gap-3 sm:gap-6 justify-center items-center">
			{#if hasActiveDates}
				<a
					href="/tickets?date={firstAvailableDate}"
					class="bg-haunt-red/30 backdrop-blur-sm hover:bg-haunt-red/40 text-white font-bold py-4 px-6 sm:py-6 sm:px-12 rounded-xl transition-all border-2 border-haunt-red text-lg sm:text-xl flex items-center justify-center touch-target"
				>
					Get Tickets
				</a>
			{/if}
			<a
				href="#about"
				class="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-6 sm:py-6 sm:px-12 rounded-xl transition-all border-2 border-white/30 text-lg sm:text-xl flex items-center justify-center touch-target"
			>
				Learn More
			</a>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="about" class="py-16 relative overflow-hidden">
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

	<!-- Red glow accents -->
	<div class="absolute inset-0 opacity-10" style="background: radial-gradient(ellipse at 50% 0%, rgba(164,18,20,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(164,18,20,0.4) 0%, transparent 50%);"></div>

	<!-- Texture overlay -->
	<div class="texture-overlay"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Striking Header -->
		<div class="text-center">
			<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
				THE EXPERIENCE
			</h2>
			<div class="w-32 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto mb-6"></div>
			<p class="text-2xl md:text-3xl text-white font-bold max-w-3xl mx-auto">
				Prepare yourself for a journey into darkness
			</p>
		</div>
	</div>
</section>

<!-- McCloud Manor Video Section -->
<section class="relative w-full overflow-hidden">
	<!-- Background Video -->
	<div class="relative w-full" style="padding-bottom: 56.25%; /* 16:9 aspect ratio */">
		<video
			id="mccloud-manor-video"
			autoplay
			loop
			playsinline
			muted
			class="absolute top-0 left-0 w-full h-full object-contain md:object-cover"
		>
			<source src="/videos/mccloud-manor.mp4" type="video/mp4" />
		</video>
	</div>
</section>

<!-- The Story Section -->
<section id="legend-section" class="py-20 bg-black relative overflow-hidden">
	<!-- Background Image (same as quote section) -->
	<div class="absolute inset-0 bg-cover bg-center md:bg-center" style="background-image: url('/legend-bg.webp');"></div>

	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-black/50 md:bg-black/40"></div>

	<!-- Vignette effect -->
	<div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50"></div>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Story Header -->
		<div class="text-center mb-8">
			<h2 class="text-[2.6rem] md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-4 tracking-tight leading-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
				THE LEGEND OF McCLOUD&nbsp;MANOR
			</h2>
			<div class="w-48 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto mb-6"></div>
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
				<div class="grid {storyExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} transition-all duration-300 ease-out">
					<div class="overflow-hidden">
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
	</div>
</section>


<!-- Video + Text Section -->
<section class="py-20 bg-black">
	<div class="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
		<!-- Striking Header -->
		<div class="text-center mb-12 px-2">
			<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
				BEHIND THE SCREAMS
			</h2>
			<div class="w-32 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto"></div>
		</div>

		<!-- Video Container -->
		<div class="relative mx-auto w-full sm:max-w-5xl">
			<!-- Subtle red glow behind video -->
			<div class="absolute -inset-4 bg-gradient-to-r from-haunt-red/20 via-red-600/25 to-haunt-red/20 blur-2xl opacity-50"></div>

			<!-- Clean video frame -->
			<div class="relative bg-gradient-to-br from-red-900/20 via-black/40 to-red-900/20 rounded-2xl border-2 border-haunt-red/40 p-0.5 sm:p-6" style="box-shadow: 0 0 30px rgba(164,18,20,0.3), inset 0 0 20px rgba(0,0,0,0.5);">
			<!-- Video Wrapper -->
			<div class="relative rounded-2xl overflow-hidden" style="aspect-ratio: 16/9; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
				<video
					id="behind-screams-video"
					autoplay
					muted
					controls
					playsinline
					preload="metadata"
					class="absolute inset-0 w-full h-full bg-black"
					style="object-fit: cover;"
					onmouseenter={(e) => { e.currentTarget.muted = false; }}
					onmouseleave={(e) => { e.currentTarget.muted = true; }}
				>
					<source src="/videos/fox5-news.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>
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
							src="/fox5-logo.webp"
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

{#if hasActiveDates}
<!-- Schedule Section -->
<section class="pt-16 pb-64 lg:pb-24 bg-black relative" style="background-image: url('/calendar-bg.webp'); background-size: cover; background-position: center center; background-repeat: no-repeat; background-attachment: scroll;">
	<!-- Red glow overlay -->
	<div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at center, rgba(164,18,20,0.4) 0%, rgba(164,18,20,0.2) 40%, transparent 70%);"></div>
	<!-- Overlay for better text readability -->
	<div class="absolute inset-0 bg-black/30 pointer-events-none"></div>

	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="text-center mb-12">
			<h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
				{hauntYear} SCHEDULE
			</h2>
			<div class="w-32 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto"></div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
			<!-- Calendar (Left - 2 columns) -->
			<div class="lg:col-span-2">
				<div class="rounded-none lg:rounded-lg overflow-hidden shadow-2xl border-0 lg:border-4 border-haunt-red/70 relative" style="background-image: url('/schedule-bg.webp'); background-size: cover; background-position: center center; background-repeat: no-repeat; box-shadow: 0 0 40px rgba(164,18,20,0.8), inset 0 0 30px rgba(0,0,0,0.9);">
					<!-- Dark overlay for readability -->
					<div class="absolute inset-0 bg-black/50"></div>
					<!-- Blood drips effect -->
					<div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-haunt-red to-transparent z-10" style="filter: drop-shadow(0 2px 4px rgba(164,18,20,0.8));"></div>

					<!-- Vignette effect -->
					<div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
					<div class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>

					<!-- Calendar Header -->
					<div class="bg-gradient-to-b from-haunt-red via-red-900 to-black text-white text-center py-3 border-b-4 border-haunt-red/80 relative" style="box-shadow: 0 4px 8px rgba(0,0,0,0.8);">
						<h3 class="text-base md:text-xl font-bold tracking-wider md:tracking-[0.3em] drop-shadow-[0_0_8px_rgba(164,18,20,0.4)] uppercase">OCTOBER {hauntYear}</h3>
						<div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-haunt-red to-transparent"></div>
					</div>

					<!-- Days of Week -->
					<div class="grid grid-cols-7 bg-black/40 text-white border-b border-haunt-red/50 relative">
						<div class="text-center py-2 text-xs font-bold border-r border-red-900/40 text-white relative z-10 tracking-wider">SUN</div>
						<div class="text-center py-2 text-xs font-bold border-r border-red-900/40 text-white relative z-10 tracking-wider">MON</div>
						<div class="text-center py-2 text-xs font-bold border-r border-red-900/40 text-white relative z-10 tracking-wider">TUE</div>
						<div class="text-center py-2 text-xs font-bold border-r border-red-900/40 text-white relative z-10 tracking-wider">WED</div>
						<div class="text-center py-2 text-xs font-bold border-r border-red-900/40 text-white relative z-10 tracking-wider">THU</div>
						<div class="text-center py-2 text-xs font-bold border-r border-red-900/40 text-white relative z-10 tracking-wider">FRI</div>
						<div class="text-center py-2 text-xs font-bold text-white relative z-10 tracking-wider">SAT</div>
					</div>

					<!-- Calendar Days - Dynamically generated for any year -->
					<div class="grid grid-cols-7 relative">
						<!-- Empty cells before Oct 1st (based on what day of week it falls on) -->
						{#each Array(octFirstDayOfWeek) as _, i}
							<div class="bg-transparent border border-red-900/30 p-1 h-14 md:h-16 md:p-3"></div>
						{/each}

						<!-- All 31 days of October -->
						{#each Array(31) as _, index}
							{@const day = index + 1}
							{@const dayPadded = String(day).padStart(2, '0')}
							{@const dayDate = data.ticketDates?.find(d => d.date.endsWith('-10-' + dayPadded))?.date}
							{#if hasTickets(hauntYear, 10, day)}
								<a href="/tickets?date={dayDate}" class="block bg-gradient-to-br from-haunt-red/40 via-red-900/30 to-black border-2 border-haunt-red/40 p-1 h-14 md:h-16 relative transform hover:scale-105 transition-all cursor-pointer overflow-hidden" style="box-shadow: 0 0 10px rgba(164,18,20,0.3), inset 0 0 8px rgba(164,18,20,0.2);">
									<span class="font-extrabold text-white text-xl md:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">{day}</span>
									<div class="absolute bottom-0.5 right-0.5 text-haunt-red text-[11px] md:text-[12px] font-bold uppercase tracking-tight bg-black/80 px-1 py-0.5" style="text-shadow: 0 0 4px rgba(164,18,20,0.8); line-height: 1;">OPEN</div>
								</a>
							{:else}
								<div class="bg-black/20 border border-red-900/40 p-1 h-14 md:h-16 md:p-3 hover:bg-black/40 hover:border-haunt-red/60 transition-all relative" style="text-shadow: 0 0 4px rgba(164,18,20,0.25);"><span class="text-base md:text-lg font-extrabold text-gray-200 relative z-10">{day}</span></div>
							{/if}
						{/each}
					</div>

					<!-- November Row - Dynamically generated -->
					<div class="grid grid-cols-7 border-t-4 border-haunt-red/80 relative" style="box-shadow: inset 0 4px 8px rgba(164,18,20,0.3);">
						<!-- Empty cells before Nov 1st (based on what day of week it falls on) -->
						{#each Array(novFirstDayOfWeek) as _, i}
							<div class="bg-transparent border border-red-900/30 p-1 h-14 md:h-16 md:p-3"></div>
						{/each}

						<!-- Nov 1st with availability check -->
						{#if hasTickets(hauntYear, 11, 1)}
							<a href="/tickets?date={data.ticketDates?.find(d => d.date.endsWith('-11-01'))?.date}" class="block bg-gradient-to-br from-haunt-red/40 via-red-900/30 to-black border-2 border-haunt-red/40 p-1 h-14 md:h-16 relative transform hover:scale-105 transition-all cursor-pointer overflow-hidden" style="box-shadow: 0 0 10px rgba(164,18,20,0.3), inset 0 0 8px rgba(164,18,20,0.2);">
								<span class="font-extrabold text-white text-xl md:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">1</span>
								<div class="absolute bottom-0.5 right-0.5 text-haunt-red text-[11px] md:text-[12px] font-bold uppercase tracking-tight bg-black/80 px-1 py-0.5" style="text-shadow: 0 0 4px rgba(164,18,20,0.8); line-height: 1;">OPEN</div>
							</a>
						{:else}
							<div class="bg-transparent border border-red-900/30 p-1 h-14 md:h-16 md:p-3">
								<span class="text-base md:text-lg font-extrabold text-gray-400 relative z-10">1</span>
							</div>
						{/if}

						<!-- Empty cells after Nov 1st to complete the week -->
						{#each Array(6 - novFirstDayOfWeek) as _, i}
							<div class="bg-transparent border border-red-900/30 p-1 h-14 md:h-16 md:p-3"></div>
						{/each}
					</div>
				</div>

				<!-- Disclaimer Text -->
				<div class="mt-3 md:mt-6 mb-0">
					<p class="text-gray-400 text-sm text-center leading-relaxed px-2">
						Times are subject to change based on weather. Follow us on social media for real-time updates.
					</p>
				</div>
			</div>

			<!-- Schedule Info (Right - 1 column) -->
			<div class="lg:col-span-1">
				<div class="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg overflow-hidden shadow-2xl border-4 border-haunt-red/70 relative flex flex-col" style="background-image: url('/schedule-bg.webp'); background-size: cover; background-position: center; box-shadow: 0 0 40px rgba(164,18,20,0.8), inset 0 0 30px rgba(0,0,0,0.9);">
					<!-- Dark overlay for readability -->
					<div class="absolute inset-0 bg-black/50"></div>
					<!-- Blood drips effect -->
					<div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-haunt-red to-transparent z-10" style="filter: drop-shadow(0 2px 4px rgba(164,18,20,0.8));"></div>

					<!-- Vignette effect -->
					<div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
					<div class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>

					<!-- Header -->
					<div class="bg-gradient-to-b from-haunt-red via-red-900 to-black text-white text-center py-3 border-b-4 border-haunt-red/80 relative" style="box-shadow: 0 4px 8px rgba(0,0,0,0.8);">
						<h3 class="text-base md:text-xl font-bold tracking-wider md:tracking-[0.3em] drop-shadow-[0_0_10px_rgba(164,18,20,0.8)] uppercase">HOURS</h3>
					</div>

					<!-- Hours Content - Dynamically generated based on operating days -->
					<div class="flex flex-col justify-center p-4 md:p-6 space-y-6 md:space-y-6 relative z-10 flex-grow">
						{#if operatingDays.size > 0}
							{#each [0, 1, 2, 3, 4, 5, 6] as dayNum, index}
								{#if operatingDays.has(dayNum)}
									{@const isLast = index === 6 || !Array.from({length: 7 - index - 1}, (_, i) => i + index + 1).some(d => operatingDays.has(d))}
									<div class="{isLast ? 'pb-0 md:pb-4' : 'border-b-2 border-haunt-red/50 pb-4 md:pb-4'}">
										<div class="text-base md:text-lg font-bold text-haunt-red mb-2 tracking-wider" style="text-shadow: 0 0 10px rgba(164,18,20,0.8);">{dayNames[dayNum]}</div>
										<div class="text-xl md:text-2xl font-extrabold text-white" style="text-shadow: 0 0 8px rgba(255,255,255,0.5);">{hoursConfig[dayNum]}</div>
									</div>
								{/if}
							{/each}
						{:else}
							<!-- Fallback if no dates are set -->
							<div class="border-b-2 border-haunt-red/50 pb-4 md:pb-4">
								<div class="text-base md:text-lg font-bold text-haunt-red mb-2 tracking-wider" style="text-shadow: 0 0 10px rgba(164,18,20,0.8);">THURSDAY</div>
								<div class="text-xl md:text-2xl font-extrabold text-white" style="text-shadow: 0 0 8px rgba(255,255,255,0.5);">8PM - 11PM</div>
							</div>
							<div class="border-b-2 border-haunt-red/50 pb-4 md:pb-4">
								<div class="text-base md:text-lg font-bold text-haunt-red mb-2 tracking-wider" style="text-shadow: 0 0 10px rgba(164,18,20,0.8);">FRIDAY</div>
								<div class="text-xl md:text-2xl font-extrabold text-white" style="text-shadow: 0 0 8px rgba(255,255,255,0.5);">8PM - 12AM</div>
							</div>
							<div class="border-b-2 border-haunt-red/50 pb-4 md:pb-4">
								<div class="text-base md:text-lg font-bold text-haunt-red mb-2 tracking-wider" style="text-shadow: 0 0 10px rgba(164,18,20,0.8);">SATURDAY</div>
								<div class="text-xl md:text-2xl font-extrabold text-white" style="text-shadow: 0 0 8px rgba(255,255,255,0.5);">8PM - 12AM</div>
							</div>
							<div class="pb-0 md:pb-4">
								<div class="text-base md:text-lg font-bold text-haunt-red mb-2 tracking-wider" style="text-shadow: 0 0 10px rgba(164,18,20,0.8);">SUNDAY</div>
								<div class="text-xl md:text-2xl font-extrabold text-white" style="text-shadow: 0 0 8px rgba(255,255,255,0.5);">8PM - 11PM</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
{/if}

<!-- FAQs Section -->
<section id="faq-section" class="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden {hasActiveDates ? '' : 'mt-0'}" style={hasActiveDates ? 'margin-top: -12rem;' : ''}>
	{#if hasActiveDates}
	<style>
		@media (min-width: 1024px) {
			#faq-section {
				margin-top: -4rem !important;
			}
		}
	</style>
	{/if}
	<!-- Background texture overlay -->
	<div class="texture-overlay"></div>

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Striking Header -->
		<div class="text-center mb-12">
			<h2 class="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
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

				<span class="text-2xl relative z-10 tracking-wide">
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
				{ q: 'Where do I park? Do you charge for parking?', a: 'Parking is free but EXTREMELY limited! Please carpool or even Uber/Lyft if possible. Do not park in or block any of our neighbors driveways.' },
				{ q: 'What are the hours?', a: 'We open at 8 PM. Entry closes at 11 PM on Thursdays and Sundays, and 12 AM on Fridays and Saturdays. Anyone in line before closing will be admitted.' },
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
					<summary class="cursor-pointer list-none p-4 md:p-8 flex items-center justify-between gap-4 hover:bg-haunt-red/10 transition-colors">
						<h3 class="text-base md:text-xl lg:text-2xl font-extrabold text-white group-hover:text-haunt-red transition-colors tracking-wide flex-1">
							{faq.q}
						</h3>
						<svg
							class="w-6 h-6 md:w-8 md:h-8 text-haunt-red transform transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="3"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-4 pb-4 pt-2 md:px-8 md:pb-8">
						<div class="pr-6 md:pr-10">
							<div class="h-px bg-gradient-to-r from-haunt-red/50 via-haunt-red to-haunt-red/50 mb-4 md:mb-6"></div>
							<p class="text-gray-300 text-base md:text-xl leading-relaxed font-medium">
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

{#if hasActiveDates}
<!-- Ticket Request Form -->
<section id="tickets" class="py-20 relative overflow-hidden">
	<!-- Ticket background image -->
	<div class="absolute inset-0 bg-center" style="background-image: url('/ticketbg.webp'); background-size: 120%;"></div>

	<!-- Dark overlay for better text readability -->
	<div class="absolute inset-0 bg-black/50 md:bg-black/40"></div>

	<!-- Vignette effect -->
	<div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>

	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="text-center mb-12">
			<h2 class="glitch-text text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl">
				GET YOUR TICKETS
			</h2>
			<p class="text-xl text-gray-400 drop-shadow-lg">
				Tickets are LIMITED!
			</p>
		</div>

		<div class="text-center">
			<a
				href="/tickets?date={firstAvailableDate}"
				class="group inline-flex items-center gap-3 bg-gradient-to-r from-haunt-red to-red-900 hover:from-red-900 hover:to-haunt-red text-white font-extrabold py-5 px-12 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden relative text-xl"
				style="box-shadow: 0 0 40px rgba(164,18,20,0.6);"
			>
				<!-- Animated shimmer -->
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

				<span class="relative z-10 tracking-wide">GET TICKETS</span>
				<svg class="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
</section>
{/if}

{#if hasActiveDates}
<!-- Directions Section -->
<section class="py-20 bg-black relative overflow-hidden">
	<!-- Texture overlay -->
	<div class="texture-overlay"></div>

	<!-- Animated background effects -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0" style="background: radial-gradient(circle at 30% 50%, rgba(164,18,20,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(164,18,20,0.4) 0%, transparent 50%);"></div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Header -->
		<div class="text-center mb-6 md:mb-12">
			<h2 class="text-3xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-600 to-haunt-red mb-2 md:mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164,18,20,0.6);">
				FIND US
			</h2>
			<div class="w-32 h-1 bg-gradient-to-r from-transparent via-haunt-red to-transparent mx-auto mb-3 md:mb-6"></div>
			<p class="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
				McCloud Manor awaits your arrival
			</p>
		</div>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
			<!-- Left: Address & Info -->
			<div class="space-y-8">
				<!-- Address Card -->
				<div class="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border-2 border-haunt-red/40 p-8" style="box-shadow: 0 0 30px rgba(164,18,20,0.3), inset 0 0 20px rgba(0,0,0,0.5);">
					<div class="flex items-start gap-4 mb-6">
						<svg class="w-8 h-8 text-haunt-red flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
						<div>
							<h3 class="text-2xl font-bold text-white mb-2">Address</h3>
							<p class="text-lg text-gray-300">2100 Carlysle Park Lane</p>
							<p class="text-lg text-gray-300">Lawrenceville, GA 30044</p>
						</div>
					</div>

					<!-- Map on Mobile -->
					<a
						href="https://maps.google.com/?q=2100+Carlysle+Park+Lane,+Lawrenceville,+GA+30044"
						target="_blank"
						rel="noopener noreferrer"
						class="sm:hidden relative inline-block w-full rounded-xl overflow-hidden group cursor-pointer leading-none"
					>
						<img
							src="/mccloud-map.webp"
							alt="Map showing McCloud Manor at 2100 Carlysle Park Lane"
							class="w-full h-auto block align-bottom"
						/>

						<!-- Overlay (red background appears on tap/click, button always visible) -->
						<div class="absolute inset-0 bg-haunt-red/0 group-hover:bg-haunt-red/20 group-active:bg-haunt-red/20 transition-all duration-300 flex items-center justify-center">
							<div class="bg-black/90 px-8 py-5 rounded-xl border-2 border-haunt-red">
								<p class="text-white font-bold text-xl flex items-center gap-3">
									<span>Click for directions</span>
									<svg class="w-6 h-6 text-haunt-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</p>
							</div>
						</div>
					</a>

					<!-- Get Directions Button (Desktop only) -->
					<a
						href="https://maps.google.com/maps?q=2100+Carlysle+Park+Lane,+Lawrenceville,+GA+30044"
						target="_blank"
						rel="noopener noreferrer"
						class="hidden sm:inline-flex group items-center gap-3 bg-gradient-to-r from-haunt-red to-red-900 hover:from-red-900 hover:to-haunt-red text-white font-extrabold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-2xl overflow-hidden relative text-lg w-full justify-center"
						style="box-shadow: 0 0 40px rgba(164,18,20,0.6);"
					>
						<!-- Animated shimmer -->
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

						<span class="relative z-10 tracking-wide">GET DIRECTIONS</span>
						<svg class="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>

				<!-- Parking Info -->
				<div class="bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 rounded-xl border border-haunt-red/30 p-6">
					<div class="flex items-start gap-3">
						<svg class="w-8 h-8 text-haunt-red flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 512 512">
							<path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm192 96c44.2 0 80 35.8 80 80c0 44.2-35.8 80-80 80H224v64c0 8.8-7.2 16-16 16s-16-7.2-16-16V368 240 144c0-8.8 7.2-16 16-16h64zm0 128c26.5 0 48-21.5 48-48s-21.5-48-48-48H224v96h32z"/>
						</svg>
						<div>
							<h4 class="text-2xl font-bold text-white mb-2">Parking Information</h4>
							<p class="text-gray-400">Parking is free but EXTREMELY limited! Please carpool or even Uber/Lyft if possible. Do not park in or block any of our neighbors driveways.</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Right: Google Maps Embed -->
			<div class="relative hidden sm:block">
				<!-- Glow effect behind map -->
				<div class="absolute -inset-4 bg-gradient-to-r from-haunt-red/20 via-red-600/25 to-haunt-red/20 blur-2xl opacity-50"></div>

				<!-- Map Container -->
				<div class="relative bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 rounded-2xl border-2 border-haunt-red/40 p-0 sm:p-4" style="box-shadow: 0 0 30px rgba(164,18,20,0.3), inset 0 0 20px rgba(0,0,0,0.5);">
					<a
						href="https://maps.google.com/maps?q=2100+Carlysle+Park+Lane,+Lawrenceville,+GA+30044"
						target="_blank"
						rel="noopener noreferrer"
						class="relative block rounded-xl overflow-hidden w-full aspect-video sm:aspect-auto sm:h-[400px] group cursor-pointer"
					>
						<!-- OpenStreetMap Static Map -->
						<div class="w-full h-full relative flex items-center justify-center">
							<img
								src="/mccloud-map.webp"
									alt="Map showing McCloud Manor at 2100 Carlysle Park Lane"
								class="w-full h-full object-cover"
								/>

							<!-- Fallback if map doesn't load -->
							<div class="w-full h-full absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black hidden flex-col items-center justify-center p-8 text-center">
								<div class="relative mb-6">
									<div class="absolute inset-0 blur-xl bg-haunt-red opacity-50 scale-150"></div>
									<svg class="w-24 h-24 text-haunt-red relative z-10 drop-shadow-2xl" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
									</svg>
								</div>
								<h3 class="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">2100 Carlysle Park Lane</h3>
								<p class="text-gray-300 text-lg mb-6">Lawrenceville, GA 30044</p>
								<div class="inline-flex items-center gap-3 bg-haunt-red/20 border-2 border-haunt-red px-6 py-3 rounded-xl">
									<span class="text-white font-bold text-lg">Click to open in Google Maps</span>
									<svg class="w-5 h-5 text-haunt-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</div>
							</div>
						</div>

						<!-- Hover Overlay -->
						<div class="absolute inset-0 bg-haunt-red/0 group-hover:bg-haunt-red/20 transition-all duration-300 flex items-center justify-center">
							<div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/90 px-8 py-5 rounded-xl border-2 border-haunt-red">
								<p class="text-white font-bold text-xl flex items-center gap-3">
									<span>Click for directions</span>
									<svg class="w-6 h-6 text-haunt-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</p>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
{/if}

