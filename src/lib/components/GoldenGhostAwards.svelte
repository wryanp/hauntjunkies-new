<script lang="ts">
	import type { Review } from '$lib/types';
	import { getAwards } from '$lib/utils/awards';
	import GoldenGhostBadge from './GoldenGhostBadge.svelte';

	interface Props {
		review: Review;
		layout?: 'horizontal' | 'vertical' | 'grid';
		size?: 'small' | 'medium' | 'large';
		animation?: 'none' | 'sequential' | 'hover' | 'particle';
		showLabel?: boolean;
	}

	let {
		review,
		layout = 'horizontal',
		size = 'medium',
		animation = 'none',
		showLabel = true
	}: Props = $props();

	const awards = $derived(getAwards(review));

	// Layout classes
	const layoutClasses = $derived({
		horizontal: 'flex flex-row flex-nowrap justify-center -space-x-14 md:-space-x-12',
		vertical: 'flex flex-col items-center gap-0',
		grid: 'grid grid-cols-2 md:grid-cols-3 gap-6'
	}[layout]);
</script>

{#if awards.length > 0}
	<div class="golden-ghost-awards {layoutClasses}" role="list" aria-label="Golden Ghost Awards">
		{#each awards as award, index}
			<div role="listitem">
				<GoldenGhostBadge
					category={award.category}
					year={award.year}
					{size}
					{animation}
					delay={animation === 'sequential' ? index * 200 : 0}
					{showLabel}
				/>
			</div>
		{/each}
	</div>
{/if}

<style>
	.golden-ghost-awards {
		padding: 0;
	}
</style>
