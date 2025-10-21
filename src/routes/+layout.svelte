<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let showScrollTop = $state(false);

	onMount(() => {
		const handleScroll = () => {
			showScrollTop = window.scrollY > 300;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
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

<div class="flex flex-col min-h-screen">
	<Navigation />

	<main class="flex-grow">
		{@render children?.()}
	</main>

	<Footer />

	<!-- Scroll to Top Button -->
	{#if showScrollTop}
		<button
			onclick={scrollToTop}
			class="fixed bottom-8 right-8 bg-haunt-red/40 hover:bg-haunt-red text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-50 group"
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
