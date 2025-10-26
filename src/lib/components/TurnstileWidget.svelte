<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	export let onVerify: (token: string) => void = () => {};
	export let onError: () => void = () => {};

	let widgetId: string | null = null;
	let containerRef: HTMLDivElement;

	onMount(() => {
		// Load Turnstile script
		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		script.async = true;
		script.defer = true;
		script.crossOrigin = 'anonymous'; // Enable CORS for better security
		script.onload = () => {
			renderWidget();
		};
		document.head.appendChild(script);

		return () => {
			// Cleanup
			if (widgetId && (window as any).turnstile) {
				(window as any).turnstile.remove(widgetId);
			}
		};
	});

	function renderWidget() {
		if (!containerRef || !(window as any).turnstile) return;

		widgetId = (window as any).turnstile.render(containerRef, {
			sitekey: PUBLIC_TURNSTILE_SITE_KEY,
			theme: 'auto',
			callback: (token: string) => {
				onVerify(token);
			},
			'error-callback': () => {
				onError();
			}
		});
	}
</script>

<div bind:this={containerRef} class="cf-turnstile"></div>

<style>
	/* Center the widget */
	div {
		display: flex;
		justify-content: center;
		margin: 1rem 0;
	}
</style>
