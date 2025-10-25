<script lang="ts">
	// Test page to show half-ghost implementation
	const rating = 4.5;
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-8">
	<div class="text-center">
		<h1 class="text-4xl font-bold text-white mb-8">Half Ghost Test</h1>
		<p class="text-gray-400 mb-4">Rating: {rating}</p>

		<div class="flex items-center justify-center gap-1 mb-8">
			{#each Array(5) as _, i}
				{@const isHalf = i === Math.floor(rating) && rating % 1 !== 0}
				{@const isFull = i < Math.floor(rating)}

				{#if isHalf}
					<!-- Mobile: Use half-ghost image -->
					<img
						src="/half-ghost.png"
						alt="Rating ghost"
						class="w-14 h-14 object-contain opacity-100 brightness-150 md:hidden"
						style="filter: drop-shadow(0 4px 8px rgba(252, 116, 3, 0.8)) contrast(1.2);"
					/>
					<!-- Desktop: Use clip-path -->
					<div class="relative w-14 h-14 hidden md:block">
						<!-- Dim background ghost -->
						<img
							src="/ghost.png"
							alt="Rating ghost"
							class="absolute inset-0 w-14 h-14 object-contain opacity-30 grayscale"
						/>
						<!-- Bright half ghost (clipped to left 50%) -->
						<img
							src="/ghost.png"
							alt="Rating ghost"
							class="absolute inset-0 w-14 h-14 object-contain opacity-100 brightness-150"
							style="clip-path: inset(0 50% 0 0); filter: drop-shadow(0 4px 8px rgba(252, 116, 3, 0.8)) contrast(1.2);"
						/>
					</div>
				{:else}
					<img
						src="/ghost.png"
						alt="Rating ghost"
						class="w-14 h-14 object-contain transition-all {isFull ? 'opacity-100 brightness-110' : 'opacity-20 grayscale'}"
						style="filter: {isFull ? 'drop-shadow(0 3px 6px rgba(252, 116, 3, 0.5))' : 'none'};"
					/>
				{/if}
			{/each}
		</div>

		<div class="text-gray-400 text-sm">
			<p>On mobile: Uses half-ghost.png image</p>
			<p>On desktop: Uses clip-path CSS</p>
		</div>
	</div>
</div>
