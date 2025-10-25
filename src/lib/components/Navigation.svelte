<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false); // false = transparent, true = black background

	// Determine which logo to show based on current page
	const isHauntPage = $derived($page.url.pathname === '/haunt' || $page.url.pathname === '/tickets');
	const isMcCloudContact = $derived($page.url.pathname === '/contact' && $page.url.searchParams.get('theme') === 'mccloud');
	const logoSrc = $derived((isHauntPage || isMcCloudContact) ? '/mccloudmanor.png' : '/logo-url.png');
	const logoAlt = $derived((isHauntPage || isMcCloudContact) ? 'McCloud Manor' : 'Haunt Junkies');
	const logoHref = $derived((isHauntPage || isMcCloudContact) ? '/haunt' : '/');

	// Dynamic hamburger menu color based on current page
	const hamburgerBgColor = $derived((isHauntPage || isMcCloudContact) ? 'bg-haunt-red/50 hover:bg-haunt-red/60' : 'bg-haunt-orange/50 hover:bg-haunt-orange/60');
	const hamburgerBorderColor = $derived((isHauntPage || isMcCloudContact) ? 'border-haunt-red/50' : 'border-haunt-orange/50');
	const hamburgerShadow = $derived((isHauntPage || isMcCloudContact) ? '0 0 20px rgba(164, 18, 20, 0.3)' : '0 0 20px rgba(252, 116, 3, 0.3)');
	const hamburgerHoverColor = $derived((isHauntPage || isMcCloudContact) ? 'hover:text-haunt-red' : 'hover:text-haunt-orange');

	// Dynamic hover color for nav links
	const hoverColor = $derived((isHauntPage || isMcCloudContact) ? 'hover:text-haunt-red/80' : 'hover:text-haunt-orange');
	const activeColor = $derived((isHauntPage || isMcCloudContact) ? 'text-haunt-red/80' : 'text-haunt-orange');

	// Dynamic nav links based on current page
	const navLinks = $derived([
		{ href: '/', label: 'Home' },
		{ href: '/reviews', label: 'Reviews' },
		{ href: '/awards', label: 'Awards' },
		{ href: (isHauntPage || isMcCloudContact) ? '/contact?theme=mccloud' : '/contact', label: 'Contact' },
		// Show opposite logo in nav: Haunt Junkies logo when on haunt/mccloud pages, McCloud logo when not
		{
			href: (isHauntPage || isMcCloudContact) ? '/' : '/haunt',
			label: (isHauntPage || isMcCloudContact) ? 'Haunt Junkies' : 'McCloud Manor',
			logoSrc: (isHauntPage || isMcCloudContact) ? '/logo-url.png' : '/mccloudmanor.png',
			isLogo: true
		}
	]);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleScroll() {
		scrolled = window.scrollY > 50;
	}

	onMount(() => {
		// Set initial state based on current scroll position
		scrolled = window.scrollY > 50;

		// Add scroll listener after a small delay
		setTimeout(() => {
			window.addEventListener('scroll', handleScroll, { passive: true });
		}, 100);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<nav class="sticky md:fixed top-0 left-0 right-0 z-50 pt-2 mobile-landscape:pt-1 {scrolled ? 'nav-scrolled' : 'nav-transparent'}" aria-label="Main navigation">
	<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between transition-all duration-300 {scrolled ? (isHauntPage ? 'h-20 mobile-landscape:h-18 sm:h-18 md:h-16' : 'h-20 mobile-landscape:h-18 sm:h-18 md:h-16') : (isHauntPage ? 'h-28 mobile-landscape:h-24 sm:h-24 md:h-20' : 'h-28 mobile-landscape:h-24 sm:h-24 md:h-20')}">
			<!-- Logo -->
			<a href={logoHref} class="flex-shrink-0 transform hover:scale-110 transition-transform duration-300" aria-label="Go to {logoAlt} homepage">
				<img src={logoSrc} alt={logoAlt} draggable="false" class="select-none pointer-events-none transition-all duration-300 w-auto drop-shadow-xl {scrolled ? (isHauntPage ? 'h-14 mobile-landscape:h-12 sm:h-16 md:h-16' : 'h-14 mobile-landscape:h-12 sm:h-16 md:h-16') : (isHauntPage ? 'h-20 mobile-landscape:h-16 sm:h-24 md:h-24' : 'h-20 mobile-landscape:h-16 sm:h-24 md:h-24')}" />
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8" role="navigation" aria-label="Primary">
				{#each navLinks as link}
					<a
						href={link.href}
						aria-label={link.isLogo ? `Go to ${link.label}` : `Navigate to ${link.label} page`}
						aria-current={$page.url.pathname === link.href && !link.isLogo ? 'page' : undefined}
						class="{hoverColor} transition-all transform hover:scale-110
						       {link.isLogo ? 'flex items-center' : 'text-white text-lg font-medium drop-shadow-lg'}
						       {$page.url.pathname === link.href && !link.isLogo ? activeColor : ''}"
					>
						{#if link.isLogo}
							<img
								src={link.logoSrc}
								alt={link.label}
								draggable="false"
								class="select-none pointer-events-none h-12 w-auto mt-1 {$page.url.pathname === link.href ? 'opacity-100' : 'opacity-80 hover:opacity-100'} transition-all hover:scale-110 drop-shadow-xl"
							/>
						{:else}
							{link.label}
						{/if}
					</a>
				{/each}
			</div>

			<!-- Mobile menu button -->
			<button
				class="md:hidden text-white {hamburgerHoverColor} p-3 transition-all transform hover:scale-110 active:scale-95"
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<!-- Close icon -->
					<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<!-- Menu icon -->
					<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden bg-black/50 border-t border-haunt-orange/20" role="navigation" aria-label="Mobile navigation menu">
			<div class="px-2 pt-1 pb-1 space-y-0">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={closeMobileMenu}
						aria-label={link.isLogo ? `Go to ${link.label}` : `Navigate to ${link.label} page`}
						aria-current={$page.url.pathname === link.href && !link.isLogo ? 'page' : undefined}
						class="block px-3 py-0.5 hover:bg-white/5 rounded-md transition-colors
						       {link.isLogo ? 'flex items-center' : `text-white ${hoverColor} text-base font-medium`}
						       {$page.url.pathname === link.href && !link.isLogo ? `${activeColor} bg-white/5` : ''}"
					>
						{#if link.isLogo}
							<img
								src={link.logoSrc}
								alt={link.label}
								draggable="false"
								class="select-none pointer-events-none h-10 w-auto {$page.url.pathname === link.href ? 'opacity-100' : 'opacity-80'}"
							/>
						{:else}
							{link.label}
						{/if}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>

<style>
	.nav-transparent {
		background: transparent !important;
		transition: background 0.3s ease;
	}

	.nav-transparent > div,
	.nav-transparent > div > div {
		background: transparent !important;
	}

	.nav-scrolled {
		background: rgba(0, 0, 0, 0.95) !important;
		backdrop-filter: blur(12px);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		transition: background 0.3s ease;
	}

	/* Mobile only: smoother logo transitions, 50% transparent background, and remove padding when scrolled */
	@media (max-width: 767px) {
		.nav-scrolled {
			background: rgba(0, 0, 0, 0.5) !important;
			padding-top: 0 !important;
		}

		nav img {
			transition: height 0.3s ease-out, width 0.3s ease-out !important;
		}
	}
</style>
