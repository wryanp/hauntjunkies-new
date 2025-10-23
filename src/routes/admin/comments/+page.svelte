<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let filterStatus = $state<'all' | 'pending' | 'approved'>('all');
	let selectedReview = $state<string>('all');
	let showSuccess = $state(false);
	let successMessage = $state('');

	// Use data from server
	let comments = $state(data.comments || []);

	// Update comments when data changes (after form actions)
	$effect(() => {
		if (data.comments) {
			comments = data.comments;
		}
	});

	// Show success message
	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			successMessage = form.message || 'Operation successful';
			setTimeout(() => {
				showSuccess = false;
			}, 3000);
		}
	});

	const filteredComments = $derived(() => {
		let filtered = comments;

		// Filter by approval status
		if (filterStatus === 'pending') {
			filtered = filtered.filter(c => !c.approved);
		} else if (filterStatus === 'approved') {
			filtered = filtered.filter(c => c.approved);
		}

		// Filter by review
		if (selectedReview !== 'all') {
			filtered = filtered.filter(c => c.reviewSlug === selectedReview);
		}

		return filtered;
	});

	const uniqueReviews = $derived(() => {
		const reviews = [...new Set(comments.map(c => ({ title: c.reviewTitle, slug: c.reviewSlug })))];
		return reviews.filter((review, index, self) =>
			index === self.findIndex(r => r.slug === review.slug)
		);
	});

	const pendingCount = $derived(comments.filter(c => !c.approved).length);

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Manage Comments - Admin Dashboard</title>
</svelte:head>

<div>
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-white mb-2">Manage Comments</h1>
		<p class="text-gray-400">Review and moderate comments from your visitors</p>
	</div>

	<!-- Success Message -->
	{#if showSuccess || form?.success}
		<div class="mb-6 bg-green-900/50 border-2 border-green-500 rounded-lg p-4 animate-fade-in">
			<h3 class="text-green-400 font-bold">{successMessage}</h3>
		</div>
	{/if}

	<!-- Error Message -->
	{#if form?.error}
		<div class="mb-6 bg-red-900/50 border-2 border-red-500 rounded-lg p-4">
			<h3 class="text-red-400 font-bold">Error</h3>
			<p class="text-red-300 text-sm">{form.error}</p>
		</div>
	{/if}

	<!-- Stats & Filters -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<!-- Total Comments -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-sm font-semibold uppercase mb-1">Total Comments</p>
					<p class="text-3xl font-bold text-white">{comments.length}</p>
				</div>
				<svg class="w-12 h-12 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</div>
		</div>

		<!-- Pending Comments -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-sm font-semibold uppercase mb-1">Pending Approval</p>
					<p class="text-3xl font-bold text-yellow-400">{pendingCount}</p>
				</div>
				<svg class="w-12 h-12 text-yellow-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
		</div>

		<!-- Approved Comments -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-green-500/30 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-sm font-semibold uppercase mb-1">Approved</p>
					<p class="text-3xl font-bold text-green-400">{comments.length - pendingCount}</p>
				</div>
				<svg class="w-12 h-12 text-green-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6 mb-8">
		<h2 class="text-xl font-bold text-white mb-4">Filters</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Status Filter -->
			<div>
				<label for="statusFilter" class="block text-white font-semibold mb-2">
					Status
				</label>
				<select
					id="statusFilter"
					bind:value={filterStatus}
					class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors"
				>
					<option value="all">All Comments</option>
					<option value="pending">Pending Approval</option>
					<option value="approved">Approved</option>
				</select>
			</div>

			<!-- Review Filter -->
			<div>
				<label for="reviewFilter" class="block text-white font-semibold mb-2">
					Review
				</label>
				<select
					id="reviewFilter"
					bind:value={selectedReview}
					class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors"
				>
					<option value="all">All Reviews</option>
					{#each uniqueReviews() as review}
						<option value={review.slug}>{review.title}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Comments List -->
	<div class="space-y-4">
		{#if filteredComments().length === 0}
			<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-12 text-center">
				<svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
				<p class="text-gray-400 text-lg">No comments found with the current filters</p>
			</div>
		{:else}
			{#each filteredComments() as comment (comment.id)}
				<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6 hover:border-haunt-orange/50 transition-all">
					<!-- Comment Header -->
					<div class="flex items-start justify-between mb-4">
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-2">
								<h3 class="text-lg font-bold text-white">{comment.name}</h3>
								{#if comment.approved}
									<span class="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded-full border border-green-500/50">
										Approved
									</span>
								{:else}
									<span class="px-3 py-1 bg-yellow-900/30 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/50">
										Pending
									</span>
								{/if}
							</div>
							<p class="text-gray-400 text-sm mb-1">{comment.email}</p>
							<a href="/reviews/{comment.reviewSlug}" class="text-haunt-orange hover:text-orange-400 text-sm font-semibold">
								Review: {comment.reviewTitle} →
							</a>
						</div>
						<p class="text-gray-500 text-sm">{formatDate(comment.created_at)}</p>
					</div>

					<!-- Comment Content -->
					<div class="bg-black/30 rounded-lg p-4 mb-4 border border-white/5">
						<p class="text-gray-300 leading-relaxed">{comment.comment}</p>
					</div>

					<!-- Actions -->
					<div class="flex gap-3">
						<!-- Toggle Approval Form -->
						<form method="POST" action="?/toggleApproval" use:enhance>
							<input type="hidden" name="id" value={comment.id} />
							<input type="hidden" name="approved" value={comment.approved} />
							<button
								type="submit"
								class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all {comment.approved
									? 'bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-400 border border-yellow-500/50'
									: 'bg-green-900/20 hover:bg-green-900/30 text-green-400 border border-green-500/50'}"
							>
								{#if comment.approved}
									<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Unapprove
								{:else}
									<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Approve
								{/if}
							</button>
						</form>

						<!-- Delete Form -->
						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								if (!confirm('Are you sure you want to delete this comment?')) {
									return ({ cancel }) => cancel();
								}
							}}
						>
							<input type="hidden" name="id" value={comment.id} />
							<button
								type="submit"
								class="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg border border-red-500/50 font-semibold transition-all"
							>
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
								Delete
							</button>
						</form>

						<a
							href="/reviews/{comment.reviewSlug}"
							class="flex items-center gap-2 px-4 py-2 bg-haunt-orange/20 hover:bg-haunt-orange/30 text-haunt-orange rounded-lg border border-haunt-orange/50 font-semibold transition-all ml-auto"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
							View Review
						</a>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
