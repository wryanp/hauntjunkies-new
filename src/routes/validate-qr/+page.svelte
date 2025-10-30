<script lang="ts">
	let { data } = $props();

	// Auto-reload after 5 seconds to allow scanning next ticket
	import { onMount } from 'svelte';
	let countdown = $state(5);

	onMount(() => {
		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				window.location.href = '/validate-qr';
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{data.valid ? '✓ Valid Ticket' : '✗ Invalid Ticket'} - McCloud Manor</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="max-w-md w-full">
		{#if data.valid}
			<!-- Valid Ticket -->
			<div class="bg-white rounded-lg shadow-xl p-8 text-center border-4 border-green-500">
				<div class="mb-6">
					<div class="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center">
						<svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
				</div>

				<h1 class="text-3xl font-bold text-green-600 mb-2">VALID TICKET</h1>
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

				<h1 class="text-3xl font-bold text-red-600 mb-2">INVALID TICKET</h1>
				<p class="text-xl text-gray-700 mb-6">Entry Denied</p>

				<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<p class="text-red-800 font-semibold mb-2">{data.message}</p>
					{#if data.message?.includes('already been used')}
						<p class="text-sm text-red-700">This QR code was already scanned. Each ticket can only be used once.</p>
					{:else if data.message?.includes('not found')}
						<p class="text-sm text-red-700">This QR code is not in our system. It may be fake or expired.</p>
					{:else}
						<p class="text-sm text-red-700">Please verify the ticket with a manager.</p>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="mt-6 space-y-3">
			<a
				href="/validate-qr"
				class="block w-full bg-haunt-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
			>
				Scan Next Ticket
			</a>

			<div class="text-center text-sm text-gray-500">
				Auto-refreshing in {countdown} second{countdown !== 1 ? 's' : ''}...
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #f9fafb;
	}
</style>
