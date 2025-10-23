<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let filterStatus = $state<'all' | 'pending' | 'confirmed'>('all');
	let searchQuery = $state('');
	let showSuccess = $state(false);
	let successMessage = $state('');

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

	// Filter tickets
	const filteredTickets = $derived.by(() => {
		let filtered = data.tickets;

		// Filter by status
		if (filterStatus !== 'all') {
			filtered = filtered.filter(t => t.status === filterStatus);
		}

		// Filter by search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				t =>
					t.first_name?.toLowerCase().includes(query) ||
					t.last_name?.toLowerCase().includes(query) ||
					t.email?.toLowerCase().includes(query) ||
					t.phone?.toLowerCase().includes(query) ||
					t.preferred_date?.includes(query)
			);
		}

		return filtered;
	});

	// Calculate stats
	const stats = $derived.by(() => {
		const total = data.tickets.length;
		const pending = data.tickets.filter(t => t.status === 'pending').length;
		const confirmed = data.tickets.filter(t => t.status === 'confirmed').length;
		const totalTickets = data.tickets.reduce((sum, t) => sum + (t.number_of_tickets || 0), 0);

		return { total, pending, confirmed, totalTickets };
	});

	// Group by date
	const groupedByDate = $derived.by(() => {
		const groups = new Map<string, typeof data.tickets>();
		filteredTickets.forEach(ticket => {
			const date = ticket.preferred_date || 'No date';
			if (!groups.has(date)) {
				groups.set(date, []);
			}
			groups.get(date)!.push(ticket);
		});
		return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
	});

	function formatDate(dateString: string) {
		if (!dateString || dateString === 'No date') return 'No date specified';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatDateTime(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Ticket Requests - Admin Dashboard</title>
</svelte:head>

<div class="max-w-[1600px] mx-auto">
	<!-- Header -->
	<div class="mb-6 sm:mb-8">
		<h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Ticket Requests</h1>
		<p class="text-gray-400 text-sm sm:text-base">Manage McCloud Manor ticket reservations</p>
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

	<!-- Stats Overview -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
		<!-- Total Requests -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-4 sm:p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-1">Total Requests</p>
					<p class="text-2xl sm:text-3xl font-bold text-white">{stats.total}</p>
				</div>
				<svg class="w-8 h-8 sm:w-12 sm:h-12 text-haunt-orange/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
				</svg>
			</div>
		</div>

		<!-- Pending -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 p-4 sm:p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-1">Pending</p>
					<p class="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.pending}</p>
				</div>
				<svg class="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
		</div>

		<!-- Confirmed -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-green-500/30 p-4 sm:p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-1">Confirmed</p>
					<p class="text-2xl sm:text-3xl font-bold text-green-400">{stats.confirmed}</p>
				</div>
				<svg class="w-8 h-8 sm:w-12 sm:h-12 text-green-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
		</div>

		<!-- Total Tickets -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-blue-500/30 p-4 sm:p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-1">Total Tickets</p>
					<p class="text-2xl sm:text-3xl font-bold text-blue-400">{stats.totalTickets}</p>
				</div>
				<svg class="w-8 h-8 sm:w-12 sm:h-12 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-4 sm:p-6 mb-6">
		<div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
			<!-- Status Filter Tabs -->
			<div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
				<button
					type="button"
					onclick={() => (filterStatus = 'all')}
					class="px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all {filterStatus === 'all'
						? 'bg-haunt-orange text-white'
						: 'bg-black/30 text-gray-400 hover:text-white'}"
				>
					All ({stats.total})
				</button>
				<button
					type="button"
					onclick={() => (filterStatus = 'pending')}
					class="px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all {filterStatus === 'pending'
						? 'bg-yellow-500 text-black'
						: 'bg-black/30 text-gray-400 hover:text-white'}"
				>
					Pending ({stats.pending})
				</button>
				<button
					type="button"
					onclick={() => (filterStatus = 'confirmed')}
					class="px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all {filterStatus === 'confirmed'
						? 'bg-green-500 text-black'
						: 'bg-black/30 text-gray-400 hover:text-white'}"
				>
					Confirmed ({stats.confirmed})
				</button>
			</div>

			<!-- Search -->
			<div class="flex-1">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search by name, email, phone, or date..."
					class="w-full px-4 py-2 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors text-sm sm:text-base"
				/>
			</div>
		</div>
	</div>

	<!-- Tickets Grouped by Date -->
	{#if filteredTickets.length === 0}
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-8 sm:p-12 text-center">
			<svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
			</svg>
			<p class="text-gray-400 text-base sm:text-lg">No ticket requests found</p>
		</div>
	{:else}
		{#each groupedByDate as [date, tickets]}
			<div class="mb-6 sm:mb-8">
				<!-- Date Header -->
				<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
					<h2 class="text-lg sm:text-xl font-bold text-white">{formatDate(date)}</h2>
					<span class="px-3 py-1 bg-haunt-orange/20 text-haunt-orange text-xs sm:text-sm font-semibold rounded-full inline-block w-fit">
						{tickets.length} request{tickets.length !== 1 ? 's' : ''} • {tickets.reduce((sum, t) => sum + (t.number_of_tickets || 0), 0)} tickets
					</span>
				</div>

				<!-- Tickets Table -->
				<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 overflow-hidden">
					<!-- Mobile scroll hint -->
					<div class="sm:hidden bg-black/60 px-4 py-2 text-center border-b border-haunt-orange/20">
						<p class="text-xs text-gray-400">← Scroll horizontally to see all details →</p>
					</div>
					<div class="overflow-x-auto scrollbar-thin scrollbar-thumb-haunt-orange/50 scrollbar-track-black/20">
						<table class="w-full min-w-[800px]">
							<thead class="bg-black/40">
								<tr class="border-b border-haunt-orange/20">
									<th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Guest</th>
									<th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
									<th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
									<th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tickets</th>
									<th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
									<th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Requested</th>
									<th class="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-haunt-orange/10">
								{#each tickets as ticket}
									<tr class="hover:bg-haunt-orange/5 transition-colors">
										<!-- Guest Name -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="font-semibold text-white text-sm sm:text-base">{ticket.first_name} {ticket.last_name}</div>
											{#if ticket.special_requests}
												<div class="text-xs sm:text-sm text-gray-400 mt-1">
													<span class="text-haunt-orange">•</span> {ticket.special_requests}
												</div>
											{/if}
										</td>

										<!-- Contact -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="text-xs sm:text-sm text-gray-300">{ticket.email}</div>
											{#if ticket.phone}
												<div class="text-xs sm:text-sm text-gray-400 mt-1">{ticket.phone}</div>
											{/if}
										</td>

										<!-- Time -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="text-xs sm:text-sm text-gray-300">{ticket.preferred_time || 'Any time'}</div>
										</td>

										<!-- Tickets -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="text-base sm:text-lg font-bold text-white">{ticket.number_of_tickets}</div>
										</td>

										<!-- Status -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											{#if ticket.status === 'pending'}
												<span class="px-2 sm:px-3 py-1 bg-yellow-900/30 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/50 whitespace-nowrap">
													Pending
												</span>
											{:else if ticket.status === 'confirmed'}
												<span class="px-2 sm:px-3 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded-full border border-green-500/50 whitespace-nowrap">
													Confirmed
												</span>
											{/if}
										</td>

										<!-- Requested Date -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="text-xs sm:text-sm text-gray-400 whitespace-nowrap">{formatDateTime(ticket.created_at)}</div>
										</td>

										<!-- Actions -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="flex items-center justify-end gap-1 sm:gap-2">
												<!-- Email Reply -->
												<a
													href="https://mail.google.com/mail/?view=cm&fs=1&to={encodeURIComponent(ticket.email)}&su={encodeURIComponent('Re: McCloud Manor Ticket Request')}&tf=1&authuser=hauntjunkies@gmail.com"
													target="_blank"
													rel="noopener noreferrer"
													class="p-1.5 sm:p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
													title="Reply via email"
												>
													<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
													</svg>
												</a>

												<!-- Toggle Status -->
												<form method="POST" action="?/updateStatus" use:enhance>
													<input type="hidden" name="id" value={ticket.id} />
													<input type="hidden" name="status" value={ticket.status === 'pending' ? 'confirmed' : 'pending'} />
													<button
														type="submit"
														class="p-1.5 sm:p-2 {ticket.status === 'pending' ? 'text-green-400 hover:bg-green-900/20' : 'text-yellow-400 hover:bg-yellow-900/20'} rounded-lg transition-colors"
														title={ticket.status === 'pending' ? 'Mark as confirmed' : 'Mark as pending'}
													>
														{#if ticket.status === 'pending'}
															<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														{:else}
															<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														{/if}
													</button>
												</form>

												<!-- Delete -->
												<form
													method="POST"
													action="?/delete"
													use:enhance={() => {
														if (!confirm('Are you sure you want to delete this ticket request?')) {
															return ({ cancel }) => cancel();
														}
													}}
												>
													<input type="hidden" name="id" value={ticket.id} />
													<button
														type="submit"
														class="p-1.5 sm:p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
														title="Delete request"
													>
														<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
														</svg>
													</button>
												</form>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
