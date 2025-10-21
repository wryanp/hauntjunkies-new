<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		backgroundImage: string;
		title?: string;
		subtitle?: string;
		announcement?: string;
		height?: string;
		overlayOpacity?: number;
		children?: Snippet;
	}

	let {
		backgroundImage,
		title = '',
		subtitle = '',
		announcement = '',
		height = 'min-h-screen',
		overlayOpacity = 0.7,
		children
	}: Props = $props();
</script>

<section
	class="parallax relative {height} flex items-center justify-center bg-overlay-dark"
	style="background-image: url({backgroundImage});"
>
	<div class="content-over-overlay text-center px-4 max-w-4xl w-full">
		{#if title}
			<h1 class="text-6xl md:text-8xl font-creepster text-white mb-8 drop-shadow-2xl tracking-wide">
				{title}
			</h1>
		{/if}

		{#if announcement}
			<div class="mb-10 animate-fade-in">
				<div class="inline-block bg-haunt-orange/90 backdrop-blur-sm px-8 py-4 rounded-lg border-2 border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-300">
					<p class="text-xl md:text-2xl font-bold text-white font-creepster tracking-wide">
						{announcement}
					</p>
				</div>
			</div>
		{/if}

		{#if subtitle}
			<p class="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-2xl mx-auto">
				{subtitle}
			</p>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</div>
</section>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 1s ease-out 0.5s both;
	}
</style>
