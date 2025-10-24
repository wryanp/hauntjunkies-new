<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let submitting = $state(false);

	// Success message handling
	let showSuccess = $state(false);
	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			setTimeout(() => {
				showSuccess = false;
			}, 3000);
		}
	});
</script>

<svelte:head>
	<title>Manage McCloud Manor - Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-white mb-2">McCloud Manor Settings</h1>
			<p class="text-gray-400">Manage McCloud Manor information and photos</p>
		</div>

		<!-- Success Message -->
		{#if showSuccess}
			<div class="mb-6 bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg">
				✓ Changes saved successfully!
			</div>
		{/if}

		<!-- Error Message -->
		{#if form?.error}
			<div class="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
				{form.error}
			</div>
		{/if}

		<!-- Main Info Form -->
		<div class="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
			<h2 class="text-2xl font-semibold text-white mb-6">General Information</h2>

			<form method="POST" action="?/updateInfo" use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}>
				<div class="space-y-6">
					<!-- Story -->
					<div>
						<label for="story" class="block text-sm font-medium text-gray-300 mb-2">
							Story (full legend text)
						</label>
						<textarea
							id="story"
							name="story"
							rows="10"
							class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-haunt-red font-mono text-sm"
							placeholder="Leave empty to use default story"
						>{data.info?.story || ''}</textarea>
						<p class="text-gray-500 text-sm mt-1">Use \n\n for paragraph breaks</p>
					</div>

					<!-- Submit Button -->
					<div class="flex justify-end">
						<button
							type="submit"
							disabled={submitting}
							class="px-6 py-2 bg-haunt-red hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</div>
			</form>
		</div>

		<!-- Photos Section -->
		<div class="bg-gray-800 rounded-lg shadow-xl p-6">
			<h2 class="text-2xl font-semibold text-white mb-6">Photo Gallery</h2>

			{#if data.photos && data.photos.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each data.photos as photo}
						<div class="relative group">
							<img
								src={photo.image_url}
								alt={photo.caption || 'McCloud Manor photo'}
								class="w-full h-48 object-cover rounded-lg"
							/>
							{#if photo.caption}
								<p class="text-sm text-gray-400 mt-2">{photo.caption}</p>
							{/if}
							<form method="POST" action="?/deletePhoto" use:enhance={({ cancel }) => {
								if (!confirm('Delete this photo? This cannot be undone.')) {
									cancel();
								}
								return async ({ update }) => {
									await update();
								};
							}}>
								<input type="hidden" name="photoId" value={photo.id} />
								<button
									type="submit"
									class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-12 text-gray-500">
					<p>No photos yet. Photos are managed through Supabase Storage.</p>
					<p class="text-sm mt-2">Upload images to the 'mccloud-photos' bucket and add entries to the mccloud_photos table.</p>
				</div>
			{/if}
		</div>

		<!-- Instructions -->
		<div class="mt-6 bg-blue-900/30 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg">
			<p class="font-semibold mb-1">Note:</p>
			<p class="text-sm">Photos are managed through Supabase. To add new photos:</p>
			<ol class="text-sm mt-2 ml-4 list-decimal">
				<li>Upload images to the 'mccloud-photos' storage bucket in Supabase</li>
				<li>Add entries to the 'mccloud_photos' table with image URLs and display order</li>
			</ol>
		</div>
	</div>
</div>
