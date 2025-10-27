<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';

	let { onVerify = () => {}, onError = () => {} }: {
		onVerify?: (token: string) => void;
		onError?: () => void;
	} = $props();

	let containerRef: HTMLDivElement;
	let widgetId: string | null = null;

	onMount(() => {
		// Wait for Turnstile to be available
		const checkTurnstile = setInterval(() => {
			if ((window as any).turnstile) {
				clearInterval(checkTurnstile);
				renderWidget();
			}
		}, 100);

		return () => {
			clearInterval(checkTurnstile);
			if (widgetId && (window as any).turnstile) {
				(window as any).turnstile.remove(widgetId);
			}
		};
	});

	function renderWidget() {
		if (!containerRef || !(window as any).turnstile) {
			return;
		}

		try {
			// Create a plain object with no TypeScript annotations
			const opts: Record<string, any> = {};
			opts['sitekey'] = '0x4AAAAAAB8070IGyeAePBEj';
			opts['theme'] = 'dark';
			opts['callback'] = function(token: string) {
				onVerify(token);
			};
			opts['error-callback'] = function() {
				onError();
			};

			console.log('Calling turnstile.render with:', opts);
			console.log('sitekey type:', typeof opts['sitekey']);
			console.log('sitekey value:', opts['sitekey']);

			widgetId = (window as any).turnstile.render(containerRef, opts);
			console.log('Widget rendered successfully, ID:', widgetId);
		} catch (e) {
			console.error('Turnstile render error:', e);
		}
	}
</script>

<div class="turnstile-wrapper">
	<div bind:this={containerRef} class="cf-turnstile"></div>
</div>

<style>
	.turnstile-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 1rem 0;
	}

	.cf-turnstile {
		display: flex;
		justify-content: center;
	}
</style>
