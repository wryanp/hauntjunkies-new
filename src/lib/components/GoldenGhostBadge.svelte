<script lang="ts">
	import type { AwardCategory } from '$lib/types';
	import { getAwardInfo } from '$lib/utils/awards';

	interface Props {
		category: AwardCategory;
		year: number;
		size?: 'small' | 'medium' | 'large';
		animation?: 'none' | 'sequential' | 'hover' | 'particle';
		delay?: number; // For sequential animations
		showLabel?: boolean;
	}

	let {
		category,
		year,
		size = 'medium',
		animation = 'none',
		delay = 0,
		showLabel = true
	}: Props = $props();

	const awardInfo = $derived(getAwardInfo(category, year));

	// Size classes
	const sizeClasses = $derived({
		small: 'w-48 h-48 md:w-48 md:h-48',
		medium: 'w-56 h-56 md:w-96 md:h-96',
		large: 'w-64 h-64 md:w-[28rem] md:h-[28rem]'
	}[size]);

	const textSizeClasses = $derived({
		small: 'text-base md:text-xl',
		medium: 'text-lg md:text-2xl',
		large: 'text-xl md:text-3xl'
	}[size]);
</script>

<div
	class="golden-ghost-badge flex flex-col items-center gap-0 {animation !== 'none'
		? 'award-animation'
		: ''}"
	class:sequential-reveal={animation === 'sequential'}
	class:hover-flip={animation === 'hover'}
	class:particle-effect={animation === 'particle'}
	style="--animation-delay: {delay}ms"
	role="img"
	aria-label="{awardInfo.label} - {year}"
>
	<!-- Award Image -->
	<div class="award-image-container {sizeClasses} relative flex-shrink-0" style="filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.3)) drop-shadow(0 0 4px rgba(251, 191, 36, 0.15));">
		<img
			src={awardInfo.imagePath}
			alt="{awardInfo.label} Award"
			class="w-full h-full object-cover"
		/>
	</div>

	<!-- Award Label -->
	{#if showLabel}
		<div class="text-center">
			<div class="award-label font-bold text-yellow-500 {textSizeClasses}">
				<span class="award-icon" aria-hidden="true">{awardInfo.icon}</span>
				{awardInfo.label}
			</div>
			{#if size !== 'small'}
				<div class="award-year text-gray-300 text-xs mt-1">{year}</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Base animation styles */
	.award-animation {
		transition: all 0.3s ease;
	}

	/* Sequential Reveal Animation */
	.sequential-reveal {
		opacity: 0;
		transform: translateY(20px) scale(0.8);
		animation: sequentialReveal 0.6s ease-out forwards;
		animation-delay: var(--animation-delay);
	}

	@keyframes sequentialReveal {
		0% {
			opacity: 0;
			transform: translateY(20px) scale(0.8);
		}
		50% {
			transform: translateY(-5px) scale(1.1);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* Hover Flip Animation */
	.hover-flip .award-image-container {
		perspective: 1000px;
		transform-style: preserve-3d;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.hover-flip:hover .award-image-container {
		transform: rotateY(360deg);
	}

	.hover-flip:hover {
		transform: scale(1.05);
	}

	/* Particle Effect Animation */
	.particle-effect {
		position: relative;
	}

	.particle-effect::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			circle,
			rgba(251, 191, 36, 0.3) 0%,
			rgba(251, 191, 36, 0) 70%
		);
		transform: translate(-50%, -50%) scale(0);
		border-radius: 50%;
		animation: particlePulse 2s ease-out infinite;
		animation-delay: var(--animation-delay);
		pointer-events: none;
	}

	@keyframes particlePulse {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
		100% {
			transform: translate(-50%, -50%) scale(2);
			opacity: 0;
		}
	}

	.particle-effect .award-image-container {
		animation: floatGlow 3s ease-in-out infinite;
		animation-delay: var(--animation-delay);
	}

	@keyframes floatGlow {
		0%,
		100% {
			transform: translateY(0);
			filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
		}
		50% {
			transform: translateY(-10px);
			filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8));
		}
	}

	/* Gold shimmer effect */
	.award-label {
		text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
	}

	.award-icon {
		display: inline-block;
		margin-right: 0.25rem;
	}
</style>
