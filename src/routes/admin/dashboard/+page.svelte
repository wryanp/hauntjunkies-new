<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Format date helper
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
	<title>Admin Dashboard - Haunt Junkies</title>
</svelte:head>

<div class="max-w-7xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange mb-2">
			Dashboard
		</h1>
		<p class="text-gray-400">Welcome back! Here's what's happening with your site.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
		<!-- Total Reviews -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-4 sm:p-6 shadow-lg">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-gray-400 text-xs sm:text-sm font-semibold uppercase">Total Reviews</h3>
				<svg class="w-6 h-6 sm:w-8 sm:h-8 text-haunt-orange/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
				</svg>
			</div>
			<p class="text-3xl sm:text-4xl font-bold text-white">{data.stats.reviews}</p>
		</div>

		<!-- Comments -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-4 sm:p-6 shadow-lg">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-gray-400 text-xs sm:text-sm font-semibold uppercase">Comments</h3>
				<svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</div>
			<p class="text-3xl sm:text-4xl font-bold text-white">{data.stats.comments}</p>
			{#if data.pending.comments > 0}
				<p class="text-yellow-400 text-xs sm:text-sm mt-2">{data.pending.comments} pending approval</p>
			{/if}
		</div>

		<!-- Ticket Requests -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-4 sm:p-6 shadow-lg">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-gray-400 text-xs sm:text-sm font-semibold uppercase">Ticket Requests</h3>
				<svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
				</svg>
			</div>
			<p class="text-3xl sm:text-4xl font-bold text-white">{data.stats.tickets}</p>
			{#if data.pending.tickets > 0}
				<p class="text-yellow-400 text-xs sm:text-sm mt-2">{data.pending.tickets} pending</p>
			{/if}
		</div>

		<!-- Contact Messages -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-4 sm:p-6 shadow-lg">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-gray-400 text-xs sm:text-sm font-semibold uppercase">Contact Messages</h3>
				<svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
			</div>
			<p class="text-3xl sm:text-4xl font-bold text-white">{data.stats.contactMessages}</p>
			{#if data.pending.contactMessages > 0}
				<p class="text-yellow-400 text-xs sm:text-sm mt-2">{data.pending.contactMessages} unread</p>
			{/if}
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Recent Reviews -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6 shadow-lg">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-xl font-bold text-white">Recent Reviews</h2>
				<a href="/admin/reviews" class="text-haunt-orange hover:text-orange-400 text-sm font-semibold">View All →</a>
			</div>
			<div class="space-y-3">
				{#if data.recentActivity.reviews.length > 0}
					{#each data.recentActivity.reviews as review}
						<div class="bg-black/30 rounded-lg p-4 border border-white/10 hover:border-haunt-orange/30 transition-colors">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h3 class="text-white font-semibold mb-1">{review.title}</h3>
									<p class="text-gray-400 text-sm">{review.location}</p>
								</div>
								{#if review.featured}
									<span class="text-xs bg-haunt-orange/20 text-haunt-orange px-2 py-1 rounded">Featured</span>
								{/if}
							</div>
							<p class="text-gray-500 text-xs mt-2">{formatDate(review.created_at)}</p>
						</div>
					{/each}
				{:else}
					<p class="text-gray-500 text-center py-8">No reviews yet</p>
				{/if}
			</div>
		</div>

		<!-- Recent Comments -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6 shadow-lg">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-xl font-bold text-white">Recent Comments</h2>
				<a href="/admin/comments" class="text-haunt-orange hover:text-orange-400 text-sm font-semibold">View All →</a>
			</div>
			<div class="space-y-3">
				{#if data.recentActivity.comments.length > 0}
					{#each data.recentActivity.comments as comment}
						<div class="bg-black/30 rounded-lg p-4 border border-white/10 hover:border-haunt-orange/30 transition-colors">
							<div class="flex items-start justify-between mb-2">
								<h3 class="text-white font-semibold">{comment.name}</h3>
								{#if !comment.approved}
									<span class="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded">Pending</span>
								{/if}
							</div>
							<p class="text-gray-400 text-sm line-clamp-2">{comment.comment}</p>
							<p class="text-gray-500 text-xs mt-2">{formatDate(comment.created_at)}</p>
						</div>
					{/each}
				{:else}
					<p class="text-gray-500 text-center py-8">No comments yet</p>
				{/if}
			</div>
		</div>

		<!-- Recent Ticket Requests -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6 shadow-lg lg:col-span-2">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-xl font-bold text-white">Recent Ticket Requests</h2>
				<a href="/admin/tickets" class="text-haunt-orange hover:text-orange-400 text-sm font-semibold">View All →</a>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				{#if data.recentActivity.tickets.length > 0}
					{#each data.recentActivity.tickets as ticket}
						<div class="bg-black/30 rounded-lg p-4 border border-white/10 hover:border-haunt-orange/30 transition-colors">
							<div class="flex items-start justify-between mb-2">
								<div>
									<h3 class="text-white font-semibold">{ticket.name}</h3>
									<p class="text-gray-400 text-sm">{ticket.email}</p>
								</div>
								<span class="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded">{ticket.tickets} tickets</span>
							</div>
							<p class="text-gray-500 text-xs mt-2">{formatDate(ticket.created_at)}</p>
						</div>
					{/each}
				{:else}
					<p class="text-gray-500 text-center py-8 md:col-span-2">No ticket requests yet</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="mt-8 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-4 sm:p-6 shadow-lg">
		<h2 class="text-lg sm:text-xl font-bold text-white mb-4">Quick Actions</h2>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
			<a href="/admin/reviews" class="flex flex-col items-center justify-center p-3 sm:p-4 bg-black/30 rounded-lg border border-white/10 hover:border-haunt-orange/50 transition-all hover:scale-105 min-h-[80px] sm:min-h-[100px]">
				<svg class="w-6 h-6 sm:w-8 sm:h-8 text-haunt-orange mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span class="text-white text-xs sm:text-sm text-center whitespace-nowrap">Reviews</span>
			</a>
			<a href="/admin/comments" class="flex flex-col items-center justify-center p-3 sm:p-4 bg-black/30 rounded-lg border border-white/10 hover:border-haunt-orange/50 transition-all hover:scale-105 min-h-[80px] sm:min-h-[100px]">
				<svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span class="text-white text-xs sm:text-sm text-center whitespace-nowrap">Comments</span>
			</a>
			<a href="/admin/tickets" class="flex flex-col items-center justify-center p-3 sm:p-4 bg-black/30 rounded-lg border border-white/10 hover:border-haunt-orange/50 transition-all hover:scale-105 min-h-[80px] sm:min-h-[100px]">
				<div class="flex items-center justify-center mb-2">
					<svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
					</svg>
				</div>
				<span class="text-white text-xs sm:text-sm text-center whitespace-nowrap">Tickets</span>
			</a>
			<a href="/admin/contact" class="flex flex-col items-center justify-center p-3 sm:p-4 bg-black/30 rounded-lg border border-white/10 hover:border-haunt-orange/50 transition-all hover:scale-105 min-h-[80px] sm:min-h-[100px]">
				<div class="flex items-center justify-center mb-2">
					<svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
				<span class="text-white text-xs sm:text-sm text-center whitespace-nowrap">Messages</span>
			</a>
			<a href="/admin/mccloud" class="flex flex-col items-center justify-center p-3 sm:p-4 bg-black/30 rounded-lg border border-white/10 hover:border-haunt-orange/50 transition-all hover:scale-105 min-h-[80px] sm:min-h-[100px]">
				<svg class="w-6 h-6 sm:w-8 sm:h-8 text-haunt-red mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
				</svg>
				<span class="text-white text-xs sm:text-sm text-center whitespace-nowrap">McCloud</span>
			</a>
			<a href="/" class="flex flex-col items-center justify-center p-3 sm:p-4 bg-black/30 rounded-lg border border-white/10 hover:border-haunt-orange/50 transition-all hover:scale-105 min-h-[80px] sm:min-h-[100px]">
				<svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
				</svg>
				<span class="text-white text-xs sm:text-sm text-center whitespace-nowrap">View Site</span>
			</a>
		</div>
	</div>
</div>
