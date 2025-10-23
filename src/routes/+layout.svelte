<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
	let showScrollTop = $state(false);

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

		const handleScroll = () => {
			showScrollTop = window.scrollY > 300;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
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

<div class="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
	{#if !isAdminPage}
		<Navigation />
	{/if}

	<main class="flex-grow w-full max-w-full">
		{@render children?.()}
	</main>

	{#if !isAdminPage}
		<Footer isAuthenticated={data.isAuthenticated} />
	{/if}

	<!-- Scroll to Top Button -->
	{#if showScrollTop && !isAdminPage}
		<button
			onclick={scrollToTop}
			class="fixed bottom-8 right-8 {buttonColorClass} text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-50 group"
			aria-label="Scroll to top"
		>
			<svg
				class="w-6 h-6 transition-transform group-hover:-translate-y-1"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
			</svg>
		</button>
	{/if}
</div>
