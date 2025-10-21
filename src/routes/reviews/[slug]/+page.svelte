<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let commentFormVisible = $state(false);
</script>

<svelte:head>
	<title>{data.review.name} - Haunt Junkies</title>
	<meta name="description" content={data.review.description || `Review of ${data.review.name}`} />
</svelte:head>

<div class="bg-gradient-to-b from-gray-900 to-black min-h-screen">
	<!-- Hero Image -->
	{#if data.review.cover_image_url}
		<div class="relative h-96 overflow-hidden">
			<img
				src={data.review.cover_image_url}
				alt={data.review.name}
				class="w-full h-full object-cover"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
		</div>
	{/if}

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 {data.review.cover_image_url ? '-mt-32' : 'pt-12'} pb-20 relative">
		<!-- Review Header -->
		<div class="mb-8">
			<h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
				{data.review.name}
			</h1>

			<div class="flex flex-wrap gap-4 items-center text-gray-400 mb-4">
				{#if data.review.city && data.review.state}
					<div class="flex items-center gap-1">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
						<span>{data.review.city}, {data.review.state}</span>
					</div>
				{/if}
				{#if data.review.year}
					<div class="flex items-center gap-1">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
						</svg>
						<span>{data.review.year}</span>
					</div>
				{/if}
			</div>

			<!-- Ratings -->
			{#if data.review.rating_overall}
				<div class="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
					<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">Overall Rating</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<div class="text-5xl font-bold text-white mb-2">{data.review.rating_overall.toFixed(1)}</div>
							<div class="flex">
								{#each Array(5) as _, i}
									<svg
										class="w-6 h-6 {i < Math.round(data.review.rating_overall) ? 'text-haunt-orange' : 'text-gray-600'}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								{/each}
							</div>
						</div>
						<div class="space-y-2">
							{#if data.review.rating_scares}
								<div class="flex justify-between">
									<span class="text-gray-400">Scares</span>
									<span class="text-white font-medium">{data.review.rating_scares.toFixed(1)}</span>
								</div>
							{/if}
							{#if data.review.rating_atmosphere}
								<div class="flex justify-between">
									<span class="text-gray-400">Atmosphere</span>
									<span class="text-white font-medium">{data.review.rating_atmosphere.toFixed(1)}</span>
								</div>
							{/if}
							{#if data.review.rating_value}
								<div class="flex justify-between">
									<span class="text-gray-400">Value</span>
									<span class="text-white font-medium">{data.review.rating_value.toFixed(1)}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- Links -->
			{#if data.review.website_url || data.review.facebook_url || data.review.instagram_url}
				<div class="flex flex-wrap gap-3 mb-6">
					{#if data.review.website_url}
						<a
							href={data.review.website_url}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-haunt-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd" />
							</svg>
							Website
						</a>
					{/if}
					{#if data.review.facebook_url}
						<a
							href={data.review.facebook_url}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
						>
							Facebook
						</a>
					{/if}
					{#if data.review.instagram_url}
						<a
							href={data.review.instagram_url}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
						>
							Instagram
						</a>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Description -->
		{#if data.review.description}
			<div class="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
				<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">About</h2>
				<p class="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
					{data.review.description}
				</p>
			</div>
		{/if}

		<!-- Review Text -->
		{#if data.review.review_text}
			<div class="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
				<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">Our Review</h2>
				<div class="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
					{data.review.review_text}
				</div>
			</div>
		{/if}

		<!-- Gallery -->
		{#if data.images && data.images.length > 0}
			<div class="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
				<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">Gallery</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					{#each data.images as image}
						<div class="aspect-square overflow-hidden rounded-lg">
							<img
								src={image.image_url}
								alt={image.caption || data.review.name}
								class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Comments Section -->
		<div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
			<h2 class="text-2xl font-bold text-haunt-orange mb-4 font-creepster">
				Comments ({data.comments.length})
			</h2>

			<!-- Add Comment Button -->
			{#if !commentFormVisible}
				<button
					onclick={() => commentFormVisible = true}
					class="mb-6 bg-haunt-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
				>
					Leave a Comment
				</button>
			{/if}

			<!-- Comment Form -->
			{#if commentFormVisible}
				<form method="POST" action="?/comment" use:enhance class="mb-8 bg-gray-900/50 rounded-lg p-6 border border-gray-700">
					{#if form?.success}
						<div class="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
							Thank you! Your comment has been submitted and is awaiting approval.
						</div>
					{/if}
					{#if form?.error}
						<div class="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
							{form.error}
						</div>
					{/if}

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label for="author_name" class="block text-sm font-medium text-gray-400 mb-2">Name</label>
							<input
								type="text"
								id="author_name"
								name="author_name"
								required
								class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
							/>
						</div>
						<div>
							<label for="author_email" class="block text-sm font-medium text-gray-400 mb-2">Email</label>
							<input
								type="email"
								id="author_email"
								name="author_email"
								required
								class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
							/>
						</div>
					</div>
					<div class="mb-4">
						<label for="comment_text" class="block text-sm font-medium text-gray-400 mb-2">Comment</label>
						<textarea
							id="comment_text"
							name="comment_text"
							required
							rows="4"
							class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
						></textarea>
					</div>
					<div class="flex gap-3">
						<button
							type="submit"
							class="bg-haunt-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
						>
							Submit Comment
						</button>
						<button
							type="button"
							onclick={() => commentFormVisible = false}
							class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
						>
							Cancel
						</button>
					</div>
				</form>
			{/if}

			<!-- Comments List -->
			{#if data.comments.length > 0}
				<div class="space-y-4">
					{#each data.comments as comment}
						<div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
							<div class="flex justify-between items-start mb-2">
								<div class="font-medium text-white">{comment.author_name}</div>
								<div class="text-sm text-gray-500">
									{new Date(comment.created_at).toLocaleDateString()}
								</div>
							</div>
							<p class="text-gray-300 whitespace-pre-line">{comment.comment_text}</p>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-gray-400">No comments yet. Be the first to leave a comment!</p>
			{/if}
		</div>

		<!-- Back Button -->
		<div class="mt-8">
			<a
				href="/reviews"
				class="inline-flex items-center gap-2 text-haunt-orange hover:text-orange-400 transition-colors"
			>
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Reviews
			</a>
		</div>
	</div>
</div>
