<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	let { onVerify = () => {}, onError = () => {} }: {
		onVerify?: (token: string) => void;
		onError?: () => void;
	} = $props();

	let widgetId: string | null = null;
	let containerRef: HTMLDivElement;
	let loading = $state(true);
	let error = $state(false);
	let debugInfo = $state('');

	onMount(() => {
		// Debug: Check if site key is available
		if (!PUBLIC_TURNSTILE_SITE_KEY) {
			debugInfo = 'ERROR: Site key not found';
			error = true;
			loading = false;
			return;
		}

		debugInfo = `Loading Turnstile... (key: ${PUBLIC_TURNSTILE_SITE_KEY.substring(0, 10)}...)`;

		// Load Turnstile script
		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		script.async = true;
		script.defer = true;
		script.crossOrigin = 'anonymous';
		script.onload = () => {
			debugInfo = 'Script loaded, rendering widget...';
			setTimeout(() => renderWidget(), 100);
		};
		script.onerror = () => {
			debugInfo = 'ERROR: Failed to load Turnstile script';
			error = true;
			loading = false;
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
		if (!containerRef) {
			debugInfo = 'ERROR: Container not ready';
			error = true;
			loading = false;
			return;
		}

		if (!(window as any).turnstile) {
			debugInfo = 'ERROR: Turnstile API not available';
			error = true;
			loading = false;
			return;
		}

		try {
			widgetId = (window as any).turnstile.render(containerRef, {
				sitekey: PUBLIC_TURNSTILE_SITE_KEY,
				theme: 'dark',
				callback: (token: string) => {
					debugInfo = 'CAPTCHA verified!';
					loading = false;
					onVerify(token);
				},
				'error-callback': () => {
					debugInfo = 'ERROR: CAPTCHA verification failed';
					error = true;
					loading = false;
					onError();
				}
			});
			debugInfo = 'Widget rendered successfully';
			loading = false;
		} catch (e) {
			debugInfo = `ERROR: ${e}`;
			error = true;
			loading = false;
		}
	}
</script>

<div class="turnstile-wrapper">
	{#if loading}
		<div class="loading-state">
			<svg class="spinner" viewBox="0 0 50 50">
				<circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" />
			</svg>
			<p>Loading security verification...</p>
		</div>
	{/if}
	{#if error}
		<div class="error-state">
			<p class="text-red-400">⚠️ CAPTCHA Error: {debugInfo}</p>
		</div>
	{/if}
	<div bind:this={containerRef} class="cf-turnstile"></div>
	<!-- Debug info (remove after fixing) -->
	<p class="debug-info text-xs text-gray-500 mt-2">{debugInfo}</p>
</div>

<style>
	.turnstile-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 1rem 0;
		min-height: 80px;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: #9ca3af;
	}

	.spinner {
		width: 40px;
		height: 40px;
		animation: rotate 1s linear infinite;
	}

	.spinner circle {
		stroke-dasharray: 1, 150;
		stroke-dashoffset: 0;
		stroke-linecap: round;
		animation: dash 1.5s ease-in-out infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -124;
		}
	}

	.error-state {
		padding: 1rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 0.5rem;
	}

	.cf-turnstile {
		display: flex;
		justify-content: center;
	}

	.debug-info {
		text-align: center;
	}
</style>
