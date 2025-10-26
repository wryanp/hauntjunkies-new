<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { Review } from '$lib/types';
	import { AWARD_CATEGORIES } from '$lib/types';
	import { getAwards } from '$lib/utils/awards';

	interface Props {
		review: Review;
		onClose: () => void;
	}

	let { review, onClose }: Props = $props();

	// Initialize award values from the review
	let awardYears = $state({
		award_best_actors_year: review.award_best_actors_year?.toString() || '',
		award_best_makeup_year: review.award_best_makeup_year?.toString() || '',
		award_best_set_design_year: review.award_best_set_design_year?.toString() || '',
		award_best_story_year: review.award_best_story_year?.toString() || '',
		award_scariest_year: review.award_scariest_year?.toString() || '',
		award_best_overall_year: review.award_best_overall_year?.toString() || ''
	});

	let submitting = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');

	const currentAwards = $derived(getAwards(review));

	// Generate year options (last 10 years + next year)
	const currentYear = new Date().getFullYear();
	const yearOptions = $derived(
		Array.from({ length: 12 }, (_, i) => currentYear - 10 + i).reverse()
	);

	function handleSubmit() {
		submitting = true;
		successMessage = '';
		errorMessage = '';
		return async ({ result, update }: any) => {
			await update();
			submitting = false;

			if (result.type === 'success') {
				successMessage = 'Awards updated successfully!';
				// Redirect to the review page
				goto(`/reviews/${review.slug}`);
			} else if (result.type === 'failure') {
				errorMessage = result.data?.error || 'Failed to update awards';
			}
		};
	}
</script>

<!-- Modal Backdrop -->
<div
	class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
	onclick={onClose}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	role="dialog"
	aria-modal="true"
	aria-labelledby="awards-modal-title"
	tabindex="-1"
>
	<!-- Modal Content -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border-2 border-yellow-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="document"
		style="box-shadow: 0 0 60px rgba(255,215,0,0.3);"
	>
		<!-- Header -->
		<div class="sticky top-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b-2 border-yellow-500/30 p-6 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<img src="/golden-ghost-award.png" alt="Golden Ghost Award" class="w-12 h-12 drop-shadow-xl" />
				<div>
					<h2 id="awards-modal-title" class="text-2xl md:text-3xl font-bold text-yellow-400">
						Manage Golden Ghost Awards
					</h2>
					<p class="text-gray-400 text-sm mt-1">{review.name}</p>
				</div>
			</div>
			<button
				onclick={onClose}
				class="text-gray-400 hover:text-white transition-colors p-2"
				aria-label="Close modal"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Form -->
		<form
			method="POST"
			action="?/updateAwards"
			use:enhance={handleSubmit}
			class="p-6 space-y-6"
		>
			<input type="hidden" name="id" value={review.id} />

			<!-- Success/Error Messages -->
			{#if successMessage}
				<div class="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
					{successMessage}
				</div>
			{/if}
			{#if errorMessage}
				<div class="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
					{errorMessage}
				</div>
			{/if}

			<!-- Current Awards Display -->
			{#if currentAwards.length > 0}
				<div class="bg-gray-800/50 rounded-lg p-4 border border-yellow-500/30">
					<h3 class="text-lg font-bold text-yellow-400 mb-3">Current Awards ({currentAwards.length})</h3>
					<div class="flex flex-wrap gap-2">
						{#each currentAwards as award}
							<div class="bg-yellow-900/30 border border-yellow-600/50 rounded-lg px-3 py-2 flex items-center gap-2">
								<span class="text-2xl">{AWARD_CATEGORIES[award.category].icon}</span>
								<div>
									<div class="text-sm font-bold text-yellow-300">{AWARD_CATEGORIES[award.category].label}</div>
									<div class="text-xs text-gray-400">{award.year}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Award Fields Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each Object.entries(AWARD_CATEGORIES) as [key, info]}
					<div class="bg-gray-800/30 rounded-lg p-4 border border-gray-700 hover:border-yellow-500/50 transition-colors">
						<label class="block mb-3">
							<div class="flex items-center gap-2 mb-2">
								<span class="text-3xl">{info.icon}</span>
								<div class="flex-1">
									<div class="text-sm font-bold text-white">{info.label}</div>
									<div class="text-xs text-gray-400">{info.description}</div>
								</div>
							</div>
							<select
								name={info.fieldName}
								bind:value={awardYears[info.fieldName as keyof typeof awardYears]}
								class="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-500"
							>
								<option value="">No Award</option>
								{#each yearOptions as year}
									<option value={year}>{year}</option>
								{/each}
							</select>
						</label>
					</div>
				{/each}
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-4 justify-end pt-4 border-t border-gray-700">
				<button
					type="button"
					onclick={onClose}
					class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
					disabled={submitting}
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={submitting}
					class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
					style="box-shadow: 0 0 20px rgba(255,215,0,0.4);"
				>
					{submitting ? 'Saving...' : 'Save Awards'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	/* Prevent body scroll when modal is open */
	:global(body:has(.fixed.inset-0)) {
		overflow: hidden;
	}
</style>
