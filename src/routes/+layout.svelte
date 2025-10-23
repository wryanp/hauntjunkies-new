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
	const isHauntPage = $derived($page.url.pathname === '/haunt');
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
			position: fixed;
			bottom: 2rem;
			right: 2rem;
			background: rgba(164, 18, 20, 0.4);
			color: white;
			padding: 1rem;
			border-radius: 9999px;
			border: none;
			cursor: pointer;
			box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
			transition: background 0.3s ease, transform 0.3s ease;
			z-index: 99999;
			display: none;
		`;

		button.innerHTML = `
			<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="display: block;">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
			</svg>
		`;

		button.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});

		button.addEventListener('mouseenter', () => {
			const isHaunt = $page.url.pathname === '/haunt';
			button.style.background = isHaunt ? 'rgba(164, 18, 20, 1)' : 'rgba(252, 116, 3, 1)';
			button.style.transform = 'scale(1.1)';
		});

		button.addEventListener('mouseleave', () => {
			const isHaunt = $page.url.pathname === '/haunt';
			button.style.background = isHaunt ? 'rgba(164, 18, 20, 0.4)' : 'rgba(252, 116, 3, 0.4)';
			button.style.transform = 'scale(1)';
		});

		document.body.appendChild(button);

		const handleScroll = () => {
			const shouldShow = window.scrollY > 300;
			const isAdmin = $page.url.pathname.startsWith('/admin');
			button.style.display = shouldShow && !isAdmin ? 'block' : 'none';

			// Update color based on page
			const isHaunt = $page.url.pathname === '/haunt';
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
	<link rel="icon" href="/favicon.png" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
	<link href="https://fonts.googleapis.com/css2?family=Creepster&family=Eater&family=Nosifer&family=IM+Fell+English:ital@0;1&display=swap" rel="stylesheet">
	<title>Haunt Junkies - Haunted Attraction Reviews</title>
</svelte:head>

{#if !isAdminPage}
	<Navigation />
{/if}

<div class="flex flex-col min-h-screen w-full max-w-full md:overflow-x-hidden">
	<main class="flex-grow w-full max-w-full">
		{@render children?.()}
	</main>

	{#if !isAdminPage}
		<Footer isAuthenticated={data.isAuthenticated} />
	{/if}
</div>

<!-- Scroll to Top Button is injected via JavaScript portal to document.body -->
