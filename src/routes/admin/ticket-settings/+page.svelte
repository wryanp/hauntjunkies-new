<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showAddForm = $state(false);
	let editingDate = $state<any>(null);
	let submitting = $state(false);

	let newDate = $state({
		date: '',
		startTime: '',
		endTime: '',
		capacity: 50,
		maxTicketsPerRequest: 10
	});

	function resetForm() {
		newDate = {
			date: '',
			startTime: '',
			endTime: '',
			capacity: 50,
			maxTicketsPerRequest: 10
		};
		showAddForm = false;
		editingDate = null;
	}

	function startEdit(dateObj: any) {
		editingDate = { ...dateObj };
	}

	function cancelEdit() {
		editingDate = null;
	}

	function formatDate(dateString: string) {
		// Parse date as local time to avoid timezone shifts
		const [year, month, day] = dateString.split('-').map(Number);
		const date = new Date(year, month - 1, day);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatTime(timeString: string) {
		if (!timeString) return 'Not set';
		return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	// Calculate stats
	const totalDates = $derived(data.ticketDates.length);
	const availableDates = $derived(data.ticketDates.filter(d => d.is_available).length);
	const totalCapacity = $derived(data.ticketDates.reduce((sum, d) => sum + d.capacity, 0));

	// Separate upcoming and past dates
	const today = new Date().toISOString().split('T')[0];
	const upcomingDates = $derived(data.ticketDates.filter(d => d.date >= today));
	const pastDates = $derived(data.ticketDates.filter(d => d.date < today));

	// Reset form on success
	$effect(() => {
		if (form?.success) {
			resetForm();
		}
	});
</script>

<svelte:head>
	<title>Ticket Settings - Admin Dashboard</title>
</svelte:head>

<div>
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-white mb-2">Ticket Settings</h1>
				<p class="text-gray-400">Manage available dates and ticket capacity</p>
			</div>
			<button
				type="button"
				onclick={() => showAddForm = !showAddForm}
				class="px-6 py-3 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-bold rounded-xl transition-all"
			>
				{showAddForm ? 'Cancel' : '+ Add Date'}
			</button>
		</div>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-sm font-semibold uppercase mb-1">Total Dates</p>
					<p class="text-3xl font-bold text-white">{totalDates}</p>
				</div>
				<svg class="w-12 h-12 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
		</div>

		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-green-500/30 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-sm font-semibold uppercase mb-1">Available</p>
					<p class="text-3xl font-bold text-green-400">{availableDates}</p>
				</div>
				<svg class="w-12 h-12 text-green-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
		</div>

		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-400 text-sm font-semibold uppercase mb-1">Total Capacity</p>
					<p class="text-3xl font-bold text-haunt-orange">{totalCapacity}</p>
				</div>
				<svg class="w-12 h-12 text-haunt-orange/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			</div>
		</div>
	</div>

	{#if form?.error}
		<div class="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-8">
			<p class="text-red-400 font-semibold">{form.error}</p>
		</div>
	{/if}

	{#if form?.success}
		<div class="bg-green-900/20 border border-green-500/50 rounded-lg p-4 mb-8">
			<p class="text-green-400 font-semibold">Changes saved successfully!</p>
		</div>
	{/if}

	<!-- Add Date Form -->
	{#if showAddForm}
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-8 mb-8">
			<h2 class="text-2xl font-bold text-white mb-6">Add New Date</h2>
			<form method="POST" action="?/addDate" use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<label for="date" class="block text-white font-semibold mb-2">
							Date <span class="text-haunt-red">*</span>
						</label>
						<input
							type="date"
							id="date"
							name="date"
							bind:value={newDate.date}
							required
							class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors"
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="startTime" class="block text-white font-semibold mb-2">
								Start Time
							</label>
							<input
								type="time"
								id="startTime"
								name="startTime"
								bind:value={newDate.startTime}
								class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors"
							/>
						</div>
						<div>
							<label for="endTime" class="block text-white font-semibold mb-2">
								End Time
							</label>
							<input
								type="time"
								id="endTime"
								name="endTime"
								bind:value={newDate.endTime}
								class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors"
							/>
						</div>
					</div>

					<div>
						<label for="capacity" class="block text-white font-semibold mb-2">
							Total Capacity <span class="text-haunt-red">*</span>
						</label>
						<input
							type="number"
							id="capacity"
							name="capacity"
							bind:value={newDate.capacity}
							min="1"
							required
							class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors"
						/>
					</div>

					<div>
						<label for="maxTicketsPerRequest" class="block text-white font-semibold mb-2">
							Max Tickets Per Request <span class="text-haunt-red">*</span>
						</label>
						<input
							type="number"
							id="maxTicketsPerRequest"
							name="maxTicketsPerRequest"
							bind:value={newDate.maxTicketsPerRequest}
							min="1"
							required
							class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors"
						/>
					</div>
				</div>


				<div class="flex gap-4">
					<button
						type="submit"
						disabled={submitting}
						class="px-6 py-3 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-bold rounded-xl transition-all disabled:opacity-50"
					>
						{submitting ? 'Adding...' : 'Add Date'}
					</button>
					<button
						type="button"
						onclick={resetForm}
						class="px-6 py-3 bg-black/50 hover:bg-black/70 text-white font-bold rounded-xl border-2 border-haunt-orange/30 hover:border-haunt-orange/50 transition-all"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Upcoming Dates -->
	{#if upcomingDates.length > 0}
		<div class="mb-8">
			<h2 class="text-2xl font-bold text-white mb-4">Upcoming Dates</h2>
			<div class="space-y-4">
				{#each upcomingDates as dateObj (dateObj.id)}
					{#if editingDate?.id === dateObj.id}
						<!-- Edit Form -->
						<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange p-6">
							<form method="POST" action="?/updateDate" use:enhance={() => {
								submitting = true;
								return async ({ update }) => {
									await update();
									submitting = false;
								};
							}}>
								<input type="hidden" name="id" value={editingDate.id} />
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label class="block text-white font-semibold mb-2 text-sm">Start Time</label>
											<input
												type="time"
												name="startTime"
												bind:value={editingDate.start_time}
												class="w-full px-3 py-2 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors text-sm"
											/>
										</div>
										<div>
											<label class="block text-white font-semibold mb-2 text-sm">End Time</label>
											<input
												type="time"
												name="endTime"
												bind:value={editingDate.end_time}
												class="w-full px-3 py-2 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors text-sm"
											/>
										</div>
									</div>

									<div class="grid grid-cols-2 gap-4">
										<div>
											<label class="block text-white font-semibold mb-2 text-sm">Capacity</label>
											<input
												type="number"
												name="capacity"
												bind:value={editingDate.capacity}
												min="1"
												required
												class="w-full px-3 py-2 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors text-sm"
											/>
										</div>
										<div>
											<label class="block text-white font-semibold mb-2 text-sm">Max Per Request</label>
											<input
												type="number"
												name="maxTicketsPerRequest"
												bind:value={editingDate.max_tickets_per_request}
												min="1"
												required
												class="w-full px-3 py-2 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors text-sm"
											/>
										</div>
									</div>
								</div>

								<div class="mb-4">
									<label class="block text-white font-semibold mb-2 text-sm">Notes</label>
									<textarea
										name="notes"
										bind:value={editingDate.notes}
										rows="2"
										class="w-full px-3 py-2 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white focus:outline-none focus:border-haunt-orange transition-colors resize-none text-sm"
									></textarea>
								</div>

								<div class="flex gap-2">
									<button
										type="submit"
										disabled={submitting}
										class="px-4 py-2 bg-green-900/20 hover:bg-green-900/30 text-green-400 rounded-lg border border-green-500/50 font-semibold transition-all text-sm disabled:opacity-50"
									>
										{submitting ? 'Saving...' : 'Save'}
									</button>
									<button
										type="button"
										onclick={cancelEdit}
										class="px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg border border-white/10 font-semibold transition-all text-sm"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					{:else}
						<!-- Display Mode -->
						<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 {dateObj.is_available ? 'border-haunt-orange/30' : 'border-gray-700/30'} p-6">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<h3 class="text-xl font-bold text-white">{formatDate(dateObj.date)}</h3>
										{#if dateObj.is_available}
											<span class="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded-full border border-green-500/50">
												Available
											</span>
										{:else}
											<span class="px-3 py-1 bg-gray-700/30 text-gray-400 text-xs font-semibold rounded-full border border-gray-600/50">
												Unavailable
											</span>
										{/if}
									</div>

									<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
										<div>
											<p class="text-gray-400">
												<span class="text-white font-semibold">Time:</span> {formatTime(dateObj.start_time)} - {formatTime(dateObj.end_time)}
											</p>
										</div>
										<div>
											<p class="text-gray-400">
												<span class="text-white font-semibold">Capacity:</span> <span class="text-blue-400">{dateObj.capacity}</span> tickets
											</p>
										</div>
										<div>
											<p class="text-gray-400">
												<span class="text-white font-semibold">Max Per Request:</span> <span class="text-haunt-orange">{dateObj.max_tickets_per_request}</span>
											</p>
										</div>
									</div>

									{#if dateObj.notes}
										<div class="mt-3 bg-black/30 rounded-lg p-3 border border-white/5">
											<p class="text-gray-300 text-sm">{dateObj.notes}</p>
										</div>
									{/if}
								</div>

								<div class="flex flex-col gap-2 ml-4">
									<button
										type="button"
										onclick={() => startEdit(dateObj)}
										class="px-4 py-2 bg-haunt-orange/20 hover:bg-haunt-orange/30 text-haunt-orange rounded-lg border border-haunt-orange/50 font-semibold transition-all text-sm"
									>
										Edit
									</button>
									<form method="POST" action="?/toggleAvailability" use:enhance>
										<input type="hidden" name="id" value={dateObj.id} />
										<input type="hidden" name="isAvailable" value={(!dateObj.is_available).toString()} />
										<button
											type="submit"
											class="w-full px-4 py-2 rounded-lg border font-semibold transition-all text-sm {dateObj.is_available
												? 'bg-gray-700/20 hover:bg-gray-700/30 text-gray-400 border-gray-600/50'
												: 'bg-green-900/20 hover:bg-green-900/30 text-green-400 border-green-500/50'}"
										>
											{dateObj.is_available ? 'Disable' : 'Enable'}
										</button>
									</form>
									<form method="POST" action="?/deleteDate" use:enhance={({ cancel }) => {
										if (!confirm('Are you sure you want to delete this date? This cannot be undone.')) {
											cancel();
										}
									}}>
										<input type="hidden" name="id" value={dateObj.id} />
										<button
											type="submit"
											class="w-full px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg border border-red-500/50 font-semibold transition-all text-sm"
										>
											Delete
										</button>
									</form>
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/if}

	<!-- Past Dates -->
	{#if pastDates.length > 0}
		<div>
			<h2 class="text-2xl font-bold text-gray-500 mb-4">Past Dates</h2>
			<div class="space-y-4">
				{#each pastDates as dateObj (dateObj.id)}
					<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-gray-700/30 p-6 opacity-60">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="text-lg font-bold text-gray-400 mb-2">{formatDate(dateObj.date)}</h3>
								<p class="text-gray-500 text-sm">
									Capacity: {dateObj.capacity} | Max Per Request: {dateObj.max_tickets_per_request}
								</p>
							</div>
							<form method="POST" action="?/deleteDate" use:enhance={({ cancel }) => {
								if (!confirm('Delete this past date?')) {
									cancel();
								}
							}}>
								<input type="hidden" name="id" value={dateObj.id} />
								<button
									type="submit"
									class="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg border border-red-500/50 font-semibold transition-all text-sm"
								>
									Delete
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if upcomingDates.length === 0 && pastDates.length === 0}
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-12 text-center">
			<svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
			<p class="text-gray-400 text-lg mb-4">No dates configured yet</p>
			<button
				type="button"
				onclick={() => showAddForm = true}
				class="px-6 py-3 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-bold rounded-xl transition-all"
			>
				Add Your First Date
			</button>
		</div>
	{/if}
</div>
