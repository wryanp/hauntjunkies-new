<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		viewCount?: number;
		size?: 'sm' | 'md' | 'lg';
		showLabel?: boolean;
		animated?: boolean;
	}

	let { viewCount = 0, size = 'md', showLabel = true, animated = true }: Props = $props();

	// Format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
	function formatViewCount(count: number): string {
		if (count >= 1000000) {
			return (count / 1000000).toFixed(1) + 'M';
		} else if (count >= 1000) {
			return (count / 1000).toFixed(1) + 'K';
		}
		return count.toString();
	}

	// Size classes
	const sizeClasses = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};

	const iconSizes = {
		sm: 'w-3 h-3',
		md: 'w-4 h-4',
		lg: 'w-5 h-5'
	};

	// Animation state
	let mounted = $state(false);

	onMount(() => {
		if (animated) {
			setTimeout(() => {
				mounted = true;
			}, 100);
		} else {
			mounted = true;
		}
	});

	const displayCount = $derived(formatViewCount(viewCount));
</script>

<div
	class="inline-flex items-center gap-1.5 text-gray-400 transition-all duration-300 {sizeClasses[size]}"
	class:opacity-0={animated && !mounted}
	class:opacity-100={!animated || mounted}
	class:translate-y-1={animated && !mounted}
	class:translate-y-0={!animated || mounted}
	title="{viewCount.toLocaleString()} {viewCount === 1 ? 'view' : 'views'}"
>
	<!-- Eye icon -->
	<svg
		class="{iconSizes[size]} text-haunt-orange/70 transition-colors group-hover:text-haunt-orange"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
		/>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
		/>
	</svg>

	<!-- View count -->
	<span class="font-medium tabular-nums">
		{displayCount}
	</span>

	<!-- Optional label -->
	{#if showLabel && viewCount > 0}
		<span class="text-gray-500">
			{viewCount === 1 ? 'view' : 'views'}
		</span>
	{/if}
</div>

<style>
	/* Smooth number transitions */
	span {
		transition: all 0.3s ease;
	}
</style>
