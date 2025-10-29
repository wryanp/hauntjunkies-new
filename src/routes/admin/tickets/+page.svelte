<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let filterStatus = $state<'all' | 'confirmed'>('all');
	let searchQuery = $state('');
	let showSuccess = $state(false);
	let successMessage = $state('');
	let selectedTickets = $state<Set<string>>(new Set());
	let bulkDeleting = $state(false);

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

		// Filter out tickets without a date (check both date and preferred_date fields)
		filtered = filtered.filter(t => t.date || t.preferred_date);

		// Filter by status
		if (filterStatus !== 'all') {
			filtered = filtered.filter(t => t.status === filterStatus);
		}

		// Filter by search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				t =>
					t.name?.toLowerCase().includes(query) ||
					t.first_name?.toLowerCase().includes(query) ||
					t.last_name?.toLowerCase().includes(query) ||
					t.email?.toLowerCase().includes(query) ||
					t.phone?.toLowerCase().includes(query) ||
					t.date?.includes(query) ||
					t.preferred_date?.includes(query)
			);
		}

		return filtered;
	});

	// Calculate stats
	const stats = $derived.by(() => {
		const total = data.tickets.length;
		const confirmed = data.tickets.filter(t => t.status === 'confirmed').length;
		const scanned = data.tickets.filter(t => t.ticket_qr_codes && t.ticket_qr_codes[0]?.used_at).length;
		const totalTickets = data.tickets.reduce((sum, t) => sum + (t.tickets || t.quantity || t.number_of_tickets || 0), 0);

		return { total, confirmed, scanned, totalTickets };
	});

	// Group by date
	const groupedByDate = $derived.by(() => {
		const groups = new Map<string, typeof data.tickets>();
		filteredTickets.forEach(ticket => {
			const date = (ticket.preferred_date || ticket.date)!; // Use preferred_date first, fallback to date
			if (!groups.has(date)) {
				groups.set(date, []);
			}
			groups.get(date)!.push(ticket);
		});
		return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
	});

	function formatDate(dateString: string) {
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

	// Bulk selection helpers
	const allFilteredIds = $derived(filteredTickets.map(t => t.id));
	const allSelected = $derived(
		allFilteredIds.length > 0 && allFilteredIds.every(id => selectedTickets.has(id))
	);

	function toggleAll() {
		if (allSelected) {
			selectedTickets = new Set();
		} else {
			selectedTickets = new Set(allFilteredIds);
		}
	}

	function toggleTicket(id: string) {
		const newSet = new Set(selectedTickets);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		selectedTickets = newSet;
	}

	async function bulkDelete() {
		if (selectedTickets.size === 0) return;

		const count = selectedTickets.size;
		if (!confirm(`Are you sure you want to delete ${count} ticket${count === 1 ? '' : 's'}?`)) {
			return;
		}

		bulkDeleting = true;

		try {
			const response = await fetch('/admin/tickets?/bulkDelete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					ids: Array.from(selectedTickets).join(',')
				})
			});

			if (response.ok) {
				showSuccess = true;
				successMessage = `${count} ticket${count === 1 ? '' : 's'} deleted successfully`;
				selectedTickets = new Set();
				// Reload page to refresh data
				window.location.reload();
			} else {
				alert('Failed to delete tickets');
			}
		} catch (error) {
			// Silently handle bulk delete errors
			alert('An error occurred while deleting tickets');
		} finally{
			bulkDeleting = false;
		}
	}
</script>

<svelte:head>
	<title>Ticket Requests - Admin Dashboard</title>
</svelte:head>

<div class="max-w-[1600px] mx-auto">
	<!-- Header -->
	<div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Ticket Requests</h1>
			<p class="text-gray-400 text-sm sm:text-base">Manage McCloud Manor ticket reservations</p>
		</div>
		<a
			href="/admin/tickets/export"
			class="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center gap-2 justify-center sm:w-auto"
		>
			<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<span>Export CSV</span>
		</a>
	</div>

	<!-- Success Message -->
	{#if showSuccess || form?.success}
		<div class="mb-6 bg-green-900/50 border-2 border-green-500 rounded-lg p-4 animate-fade-in">
			<p class="text-green-400 font-bold">{successMessage}</p>
		</div>
	{/if}

	<!-- Error Message -->
	{#if form?.error}
		<div class="mb-6 bg-red-900/50 border-2 border-red-500 rounded-lg p-4">
			<p class="text-red-400 font-bold">Error</p>
			<p class="text-red-300 text-sm">{form.error}</p>
		</div>
	{/if}

	<!-- Stats Overview -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
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

		<!-- Scanned -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-blue-500/30 p-4 sm:p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-1">Scanned</p>
					<p class="text-2xl sm:text-3xl font-bold text-blue-400">{stats.scanned}</p>
				</div>
				<svg class="w-8 h-8 sm:w-12 sm:h-12 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
				</svg>
			</div>
		</div>

		<!-- Total Tickets -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-purple-500/30 p-4 sm:p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-1">Total Tickets</p>
					<p class="text-2xl sm:text-3xl font-bold text-purple-400">{stats.totalTickets}</p>
				</div>
				<svg class="w-8 h-8 sm:w-12 sm:h-12 text-purple-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					placeholder="Search by name, email or date..."
					class="w-full px-4 py-2 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors text-sm sm:text-base"
				/>
			</div>
		</div>
	</div>

	<!-- Bulk Actions -->
	{#if selectedTickets.size > 0}
		<div class="bg-gradient-to-r from-red-900/40 to-red-800/40 backdrop-blur-sm rounded-lg border-2 border-red-500/50 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
			<div class="flex items-center gap-3">
				<svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
				</svg>
				<span class="text-white font-semibold">
					{selectedTickets.size} ticket{selectedTickets.size === 1 ? '' : 's'} selected
				</span>
			</div>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={() => (selectedTickets = new Set())}
					class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
				>
					Clear Selection
				</button>
				<button
					type="button"
					onclick={bulkDelete}
					disabled={bulkDeleting}
					class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
				>
					{#if bulkDeleting}
						<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Deleting...
					{:else}
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
						Delete Selected
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<!-- Tickets Grouped by Date -->
	{#if filteredTickets.length === 0}
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-8 sm:p-12 text-center">
			<svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
			</svg>
			<p class="text-gray-400 text-base sm:text-lg">No ticket requests found</p>
		</div>
	{:else}
		<!-- Section Title -->
		<div class="mb-6">
			<h2 class="text-2xl sm:text-3xl font-bold text-white">Recent Ticket Reservations</h2>
		</div>

		{#each groupedByDate as [date, tickets]}
			<div class="mb-6 sm:mb-8">
				<!-- Date Header -->
				<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
					<h2 class="text-lg sm:text-xl font-bold text-white">{formatDate(date)}</h2>
					<span class="px-3 py-1 bg-haunt-orange/20 text-haunt-orange text-xs sm:text-sm font-semibold rounded-full inline-block w-fit">
						{tickets.length} request{tickets.length !== 1 ? 's' : ''} • {tickets.reduce((sum, t) => sum + (t.tickets || t.quantity || t.number_of_tickets || 0), 0)} tickets
					</span>
				</div>

				<!-- Tickets Table -->
				<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 overflow-hidden max-h-[500px] flex flex-col">
					<!-- Mobile scroll hint -->
					<div class="sm:hidden bg-black/60 px-4 py-2 text-center border-b border-haunt-orange/20">
						<p class="text-xs text-gray-400">← Scroll horizontally to see all details →</p>
					</div>
					<div class="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-haunt-orange/50 scrollbar-track-black/20">
						<table class="w-full min-w-[800px]">
							<thead class="bg-black/40">
								<tr class="border-b border-haunt-orange/20">
									<th class="px-4 py-3 sm:py-4 text-center w-12">
										<input
											type="checkbox"
											checked={allSelected}
											onchange={toggleAll}
											class="w-4 h-4 cursor-pointer accent-haunt-orange"
											title="Select all"
										/>
									</th>
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
										<!-- Checkbox -->
										<td class="px-4 py-3 sm:py-4 text-center">
											<input
												type="checkbox"
												checked={selectedTickets.has(ticket.id)}
												onchange={() => toggleTicket(ticket.id)}
												class="w-4 h-4 cursor-pointer accent-haunt-orange"
											/>
										</td>
										<!-- Guest Name -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="font-semibold text-white text-sm sm:text-base">
												{#if ticket.first_name && ticket.last_name}
													{ticket.first_name} {ticket.last_name}
												{:else}
													{ticket.name || 'Unknown'}
												{/if}
											</div>
										</td>

										<!-- Contact -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="text-xs sm:text-sm text-gray-300">{ticket.email || 'No email'}</div>
										</td>

										<!-- Time -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="text-xs sm:text-sm text-gray-300">Any time</div>
										</td>

										<!-- Tickets -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											<div class="text-base sm:text-lg font-bold text-white">{ticket.tickets || ticket.quantity || ticket.number_of_tickets || 0}</div>
										</td>

										<!-- Status -->
										<td class="px-4 sm:px-6 py-3 sm:py-4">
											{#if ticket.ticket_qr_codes && ticket.ticket_qr_codes[0]?.used_at}
												<span class="px-2 sm:px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/50 whitespace-nowrap">
													✓ Scanned
												</span>
											{:else}
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

												<!-- Delete -->
												<form
													method="POST"
													action="?/delete"
													use:enhance={({ cancel }) => {
														if (!confirm('Are you sure you want to delete this ticket request?')) {
															cancel();
															return;
														}
														return async ({ update }) => {
															await update();
															await invalidateAll();
														};
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
