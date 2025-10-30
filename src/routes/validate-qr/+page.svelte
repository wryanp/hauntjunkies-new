<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.valid ? '✓ Valid Ticket' : '✗ Invalid Ticket'} - McCloud Manor</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="max-w-md w-full">
		{#if data.showScanner}
			<!-- QR Scanner Ready State -->
			<div class="bg-white rounded-lg shadow-xl p-8 text-center border-4 border-gray-300">
				<div class="mb-6">
					<div class="w-24 h-24 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
						<svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
						</svg>
					</div>
				</div>

				<h1 class="text-3xl font-bold text-gray-800 mb-2">QR Scanner Ready</h1>
				<p class="text-xl text-gray-600 mb-6">Scan ticket QR code to validate entry</p>

				<!-- Capacity Status Indicator -->
				{#if data.capacityStats && data.capacityStats.has_event_today}
					{@const stats = data.capacityStats}
					{@const colorClasses = {
						green: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', bar: 'bg-green-500', dot: 'bg-green-500' },
						yellow: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700', bar: 'bg-yellow-500', dot: 'bg-yellow-500' },
						red: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', bar: 'bg-red-500', dot: 'bg-red-500' },
						gray: { bg: 'bg-gray-50', border: 'border-gray-500', text: 'text-gray-700', bar: 'bg-gray-500', dot: 'bg-gray-500' }
					}}
					{@const colors = colorClasses[stats.color]}
					<div class="mb-6 {colors.bg} border-2 {colors.border} rounded-lg p-4">
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-2">
								<div class="w-3 h-3 {colors.dot} rounded-full animate-pulse"></div>
								<h3 class="text-sm font-bold {colors.text} uppercase">Today's Event Status</h3>
							</div>
							<span class="text-xs font-semibold {colors.text} px-2 py-1 bg-white/50 rounded">{stats.status}</span>
						</div>

						<div class="mb-3">
							<div class="flex justify-between items-baseline mb-2">
								<span class="text-2xl font-bold {colors.text}">{stats.tickets_scanned}</span>
								<span class="text-sm font-semibold text-gray-600">of {stats.tickets_sold} admitted</span>
							</div>

							<!-- Progress Bar -->
							<div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
								<div
									class="{colors.bar} h-3 rounded-full transition-all duration-500"
									style="width: {Math.min(stats.percentage_scanned, 100)}%"
								></div>
							</div>
							<div class="text-right mt-1">
								<span class="text-xs font-semibold {colors.text}">{stats.percentage_scanned}%</span>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-2 text-xs">
							<div class="bg-white/50 rounded px-2 py-1">
								<span class="text-gray-600">Remaining:</span>
								<span class="font-bold {colors.text} ml-1">{stats.tickets_remaining}</span>
							</div>
							<div class="bg-white/50 rounded px-2 py-1">
								<span class="text-gray-600">Capacity:</span>
								<span class="font-bold {colors.text} ml-1">{stats.total_capacity}</span>
							</div>
						</div>

						{#if stats.is_sold_out}
							<div class="mt-3 bg-red-100 border border-red-300 rounded px-3 py-2 text-center">
								<span class="text-xs font-bold text-red-700">🎫 SOLD OUT - All tickets claimed</span>
							</div>
						{/if}
					</div>
				{/if}

				<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-left">
					<h2 class="text-sm font-bold text-gray-600 uppercase mb-3">Instructions</h2>
					<ol class="space-y-2 text-gray-700">
						<li class="flex items-start">
							<span class="font-bold mr-2">1.</span>
							<span>Open your phone's camera app</span>
						</li>
						<li class="flex items-start">
							<span class="font-bold mr-2">2.</span>
							<span>Point camera at the QR code on guest's ticket</span>
						</li>
						<li class="flex items-start">
							<span class="font-bold mr-2">3.</span>
							<span>Tap the notification to validate</span>
						</li>
					</ol>
				</div>

				<div class="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
					<p class="font-semibold mb-1">Tip:</p>
					<p>Each QR code can only be scanned once. Previously scanned codes will be rejected.</p>
				</div>
			</div>
		{:else if data.valid}
			<!-- Valid Ticket -->
			<div class="bg-white rounded-lg shadow-xl p-8 text-center border-4 border-green-500">
				<div class="mb-6">
					<div class="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center">
						<svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
				</div>

				<h1 class="text-3xl font-bold text-green-600 mb-4">VALID TICKET</h1>

				{#if data.ticketInfo?.ticket_count}
					<div class="mb-4">
						<div class="inline-block bg-green-100 border-2 border-green-500 rounded-lg px-8 py-4">
							<div class="text-5xl font-bold text-green-700">{data.ticketInfo.ticket_count}</div>
							<div class="text-base font-bold text-green-600 uppercase mt-1">Ticket{data.ticketInfo.ticket_count !== 1 ? 's' : ''}</div>
						</div>
					</div>
				{/if}

				<p class="text-xl text-gray-700 mb-6">Entry Approved</p>

				{#if data.ticketInfo}
					<div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
						<h2 class="text-sm font-bold text-gray-600 uppercase mb-3">Ticket Details</h2>
						{#if data.ticketInfo.guest_name}
							<div class="mb-2">
								<span class="text-sm text-gray-600">Guest:</span>
								<span class="text-base font-semibold text-gray-900 ml-2">{data.ticketInfo.guest_name}</span>
							</div>
						{/if}
						{#if data.ticketInfo.event_date}
							<div class="mb-2">
								<span class="text-sm text-gray-600">Date:</span>
								<span class="text-base font-semibold text-gray-900 ml-2">{data.ticketInfo.event_date}</span>
							</div>
						{/if}
						{#if data.ticketInfo.ticket_count}
							<div>
								<span class="text-sm text-gray-600">Tickets:</span>
								<span class="text-base font-semibold text-gray-900 ml-2">{data.ticketInfo.ticket_count}</span>
							</div>
						{/if}
					</div>
				{/if}

				<div class="text-sm text-gray-500 mb-4">
					Scanned at {new Date(data.scannedAt).toLocaleTimeString()}
				</div>

				<div class="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
					✓ This QR code has been marked as used
				</div>
			</div>
		{:else}
			<!-- Invalid Ticket -->
			<div class="bg-white rounded-lg shadow-xl p-8 text-center border-4 border-red-500">
				<div class="mb-6">
					<div class="w-24 h-24 bg-red-500 rounded-full mx-auto flex items-center justify-center">
						<svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</div>
				</div>

				<h1 class="text-3xl font-bold text-red-600 mb-4">INVALID TICKET</h1>

				{#if data.message?.includes('already been used')}
					<!-- Large "ALREADY USED" badge for duplicate scans -->
					<div class="mb-4">
						<div class="inline-block bg-red-100 border-2 border-red-500 rounded-lg px-8 py-4">
							<div class="text-4xl font-bold text-red-700 uppercase">Already Used</div>
						</div>
					</div>
				{/if}

				<p class="text-xl text-gray-700 mb-6">Entry Denied</p>

				<div class="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
					<p class="text-red-900 font-bold text-lg mb-3">{data.message}</p>
					{#if data.message?.includes('already been used')}
						<p class="text-base text-red-800 font-semibold">This QR code was already scanned. Each ticket can only be used once.</p>
					{:else if data.message?.includes('not found')}
						<p class="text-base text-red-800 font-semibold">This QR code is not in our system. It may be fake or expired.</p>
					{:else}
						<p class="text-base text-red-800 font-semibold">Please verify the ticket with a manager.</p>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Action Buttons (only show after scan) -->
		{#if !data.showScanner}
			<div class="mt-6">
				<a
					href="/validate-qr"
					class="block w-full bg-haunt-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
				>
					Scan Next Ticket
				</a>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		background-color: #f9fafb;
	}
</style>
