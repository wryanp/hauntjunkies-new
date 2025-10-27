<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
	let showScrollTop = $state(false);
	let portalButton: HTMLDivElement | null = null;

	// Check if we're on an admin page
	const isAdminPage = $derived($page.url.pathname.startsWith('/admin'));

	// Determine button color based on current page
	const isHauntPage = $derived($page.url.pathname === '/haunt' || $page.url.pathname === '/tickets');
	const buttonColorClass = $derived(isHauntPage ? 'bg-haunt-red/40 hover:bg-haunt-red' : 'bg-haunt-orange/40 hover:bg-haunt-orange');

	onMount(() => {
		// Check for ?admin URL parameter and redirect to admin login
		if ($page.url.searchParams.has('admin')) {
			window.location.href = '/admin/login';
			return;
		}

		// Create button using DOM APIs
		const button = document.createElement('button');
		button.setAttribute('aria-label', 'Scroll to top');
		button.setAttribute('class', 'scroll-top-button');

		button.style.cssText = `
			position: fixed !important;
			bottom: 2rem !important;
			right: 2rem !important;
			background: rgba(164, 18, 20, 0.4);
			color: white;
			padding: 1rem;
			border-radius: 9999px;
			border: none;
			cursor: pointer;
			box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
			transition: background 0.3s ease, transform 0.3s ease;
			z-index: 99999 !important;
			display: none;
			margin: 0 !important;
			transform: translateZ(0);
		-webkit-transform: translateZ(0);
		will-change: transform;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		pointer-events: auto;
		`;

		// SECURITY FIX: Use DOM methods instead of innerHTML to prevent XSS
		// Create SVG element and path using proper DOM APIs
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '24');
		svg.setAttribute('height', '24');
		svg.setAttribute('fill', 'none');
		svg.setAttribute('viewBox', '0 0 24 24');
		svg.setAttribute('stroke', 'currentColor');
		svg.style.display = 'block';

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('stroke-linecap', 'round');
		path.setAttribute('stroke-linejoin', 'round');
		path.setAttribute('stroke-width', '2');
		path.setAttribute('d', 'M5 10l7-7m0 0l7 7m-7-7v18');

		svg.appendChild(path);
		button.appendChild(svg);

		button.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});

		button.addEventListener('mouseenter', () => {
			const isHaunt = $page.url.pathname === '/haunt' || $page.url.pathname === '/tickets';
			button.style.background = isHaunt ? 'rgba(164, 18, 20, 1)' : 'rgba(252, 116, 3, 1)';
			button.style.transform = 'scale(1.1)';
		});

		button.addEventListener('mouseleave', () => {
			const isHaunt = $page.url.pathname === '/haunt' || $page.url.pathname === '/tickets';
			button.style.background = isHaunt ? 'rgba(164, 18, 20, 0.4)' : 'rgba(252, 116, 3, 0.4)';
			button.style.transform = 'scale(1)';
		});

		document.body.appendChild(button);

		const handleScroll = () => {
			const shouldShow = window.scrollY > 300;
			const isAdmin = $page.url.pathname.startsWith('/admin');
			button.style.display = shouldShow && !isAdmin ? 'block' : 'none';

			// Update color based on page
			const isHaunt = $page.url.pathname === '/haunt' || $page.url.pathname === '/tickets';
			button.style.background = isHaunt ? 'rgba(164, 18, 20, 0.4)' : 'rgba(252, 116, 3, 0.4)';
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial check

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (button.parentNode) {
				button.parentNode.removeChild(button);
			}
		};
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<!-- Favicon is set in app.html with multi-format support -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
	<!-- PERFORMANCE FIX: Added display=swap to prevent font blocking -->
	<link href="https://fonts.googleapis.com/css2?family=Creepster&family=Eater&family=Nosifer&family=IM+Fell+English:ital@0;1&display=swap" rel="stylesheet">
	<title>Haunt Junkies - Haunted Attraction Reviews</title>
</svelte:head>

<!-- Skip to main content link for keyboard navigation accessibility -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-haunt-orange focus:text-white focus:rounded-md focus:font-bold"
>
	Skip to main content
</a>

{#if !isAdminPage}
	<Navigation />
{/if}

<div class="flex flex-col min-h-screen w-full max-w-full md:overflow-x-hidden">
	<main id="main-content" class="flex-grow w-full max-w-full">
		{@render children?.()}
	</main>

	{#if !isAdminPage}
		<Footer isAuthenticated={data.isAuthenticated} />
	{/if}
</div>

<!-- Scroll to Top Button is injected via JavaScript portal to document.body -->
