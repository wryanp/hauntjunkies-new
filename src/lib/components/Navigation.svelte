<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

	// Determine which logo to show based on current page
	const isHauntPage = $derived($page.url.pathname === '/haunt');
	const logoSrc = $derived(isHauntPage ? '/mccloudmanor.png' : '/logo-url.png');
	const logoAlt = $derived(isHauntPage ? 'McCloud Manor' : 'Haunt Junkies');
	const logoHref = $derived(isHauntPage ? '/haunt' : '/');

	// Dynamic nav links based on current page
	const navLinks = $derived([
		{ href: '/', label: 'Home' },
		{ href: '/reviews', label: 'Reviews' },
		{ href: '/contact', label: 'Contact' },
		// Show opposite logo in nav: Haunt Junkies logo when on haunt page, McCloud logo when not
		{
			href: isHauntPage ? '/' : '/haunt',
			label: isHauntPage ? 'Haunt Junkies' : 'McCloud Manor',
			logoSrc: isHauntPage ? '/logo-url.png' : '/mccloudmanor.png',
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
		handleScroll();
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl pt-2' : 'pt-4'}">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between transition-all duration-300 {scrolled ? 'h-20' : 'h-24'}">
			<!-- Logo -->
			<a href={logoHref} class="flex-shrink-0">
				<img src={logoSrc} alt={logoAlt} class="transition-all duration-300 w-auto drop-shadow-xl {scrolled ? 'h-14 sm:h-16 md:h-18' : 'h-20 sm:h-24 md:h-28'}" />
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="hover:text-haunt-orange transition-colors
						       {link.isLogo ? 'flex items-center' : 'text-white text-lg font-medium drop-shadow-lg'}
						       {$page.url.pathname === link.href && !link.isLogo ? 'text-haunt-orange' : ''}"
					>
						{#if link.isLogo}
							<img
								src={link.logoSrc}
								alt={link.label}
								class="h-12 w-auto {$page.url.pathname === link.href ? 'opacity-100' : 'opacity-80 hover:opacity-100'} transition-opacity drop-shadow-xl"
							/>
						{:else}
							{link.label}
						{/if}
					</a>
				{/each}
			</div>

			<!-- Mobile menu button -->
			<button
				class="md:hidden text-white hover:text-haunt-orange p-2"
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<!-- Close icon -->
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<!-- Menu icon -->
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden bg-black/98 border-t border-haunt-orange/20">
			<div class="px-2 pt-2 pb-3 space-y-1">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={closeMobileMenu}
						class="block px-3 py-2 hover:bg-white/5 rounded-md transition-colors
						       {link.isLogo ? 'flex items-center justify-center' : 'text-white hover:text-haunt-orange text-base font-medium'}
						       {$page.url.pathname === link.href && !link.isLogo ? 'text-haunt-orange bg-white/5' : ''}"
					>
						{#if link.isLogo}
							<img
								src={link.logoSrc}
								alt={link.label}
								class="h-10 w-auto {$page.url.pathname === link.href ? 'opacity-100' : 'opacity-80'}"
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
