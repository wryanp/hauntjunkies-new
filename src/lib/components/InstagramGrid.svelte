<script lang="ts">
	import { onMount } from 'svelte';

	let posts = $state<any[]>([]);
	let loading = $state(true);
	let error = $state(false);

	onMount(async () => {
		try {
			const response = await fetch('/api/instagram');
			if (!response.ok) {
				throw new Error('Failed to fetch Instagram posts');
			}
			const data = await response.json();
			posts = data.posts || [];
			loading = false;
		} catch (err) {
			console.error('Error loading Instagram posts:', err);
			error = true;
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="flex items-center justify-center h-[260px] md:h-[650px]">
		<div class="flex flex-col items-center gap-4">
			<svg class="animate-spin h-12 w-12 text-haunt-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<p class="text-gray-400">Loading Instagram posts...</p>
		</div>
	</div>
{:else if error}
	<div class="flex items-center justify-center h-[260px] md:h-[650px]">
		<div class="text-center">
			<p class="text-gray-400 mb-2">Unable to load Instagram posts</p>
			<p class="text-sm text-gray-500">Please check back later</p>
		</div>
	</div>
{:else if posts.length === 0}
	<div class="flex items-center justify-center h-[260px] md:h-[650px]">
		<p class="text-gray-400">No posts available</p>
	</div>
{:else}
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
		{#each posts as post (post.id)}
			<a
				href={post.permalink}
				target="_blank"
				rel="noopener noreferrer"
				class="group relative aspect-square overflow-hidden rounded-lg bg-gray-900 transition-transform hover:scale-105"
			>
				<!-- Image -->
				<img
					src={post.mediaUrl}
					alt={post.caption ? post.caption.substring(0, 100) : 'Instagram post'}
					class="absolute inset-0 w-full h-full object-cover transition-all group-hover:scale-110"
					loading="lazy"
				/>

				<!-- Overlay on hover -->
				<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
					<div class="text-center">
						<!-- Instagram icon -->
						<svg class="w-10 h-10 mx-auto mb-2 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
						</svg>
						{#if post.caption}
							<p class="text-white text-xs line-clamp-3">
								{post.caption.substring(0, 100)}{post.caption.length > 100 ? '...' : ''}
							</p>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
{/if}
