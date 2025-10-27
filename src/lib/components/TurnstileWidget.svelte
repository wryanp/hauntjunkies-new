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
			widgetId = (window as any).turnstile.render(containerRef, {
				sitekey: '0x4AAAAAAB8070IGyeAePBEj',
				theme: 'dark',
				callback: (token: string) => {
					onVerify(token);
				},
				'error-callback': () => {
					onError();
				}
			});
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
