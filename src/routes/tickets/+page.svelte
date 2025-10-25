<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import TurnstileWidget from '$lib/components/TurnstileWidget.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { dev } from '$app/environment';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let formData = $state({
		firstName: '',
		lastName: '',
		email: '',
		date: '',
		tickets: 1
	});

	let submitting = $state(false);
	let captchaToken = $state(dev ? 'dev-mode' : ''); // Auto-pass in dev mode

	// Check for pre-selected date from URL parameter
	onMount(() => {
		const urlDate = $page.url.searchParams.get('date');
		if (urlDate && data.availableDates.some(d => d.date === urlDate)) {
			formData.date = urlDate;
		}
	});

	// Scroll to top when success or error message appears
	$effect(() => {
		if (form?.success || form?.error) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	});

	// Get selected date info
	const selectedDateInfo = $derived(() => {
		if (!formData.date) return null;
		return data.availableDates.find(d => d.date === formData.date);
	});

	// Calculate remaining tickets for selected date
	const remainingTickets = $derived(() => {
		const dateInfo = selectedDateInfo();
		if (!dateInfo) return 0;
		return dateInfo.capacity - (dateInfo.tickets_sold || 0);
	});

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
		if (!timeString) return '';
		return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}
</script>

<style>
	/* Hide default spinner buttons */
	#custom-tickets::-webkit-inner-spin-button,
	#custom-tickets::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	#custom-tickets {
		-moz-appearance: textfield;
	}
</style>

<SEO
	title="Reserve Tickets - McCloud Manor"
	description="Reserve tickets for McCloud Manor, a terrifying haunted attraction by Haunt Junkies. Check availability, select your date, and secure your spot for an unforgettable horror experience in Atlanta."
	url="/tickets"
	image="/og-tickets.jpg"
	type="website"
/>

<div class="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8" style="min-height: 100vh; min-height: -webkit-fill-available; min-height: 100dvh;">
	<!-- Background Video -->
	<video
		autoplay
		muted
		loop
		playsinline
		preload="auto"
		webkit-playsinline
		x5-playsinline
		class="fixed inset-0 w-full h-full object-cover -z-10"
	>
		<source src="/videos/haunt.mp4" type="video/mp4" />
		Your browser does not support the video tag.
	</video>

	<!-- Dark overlay for readability -->
	<div class="fixed inset-0 bg-black/70 -z-10"></div>

	<div class="max-w-4xl mx-auto relative z-10">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-red via-red-500 to-haunt-red mb-4 tracking-tight" style="text-shadow: 0 0 40px rgba(164, 18, 20, 0.6);">
				RESERVE TICKETS
			</h1>
			<p class="text-gray-400 text-lg">Reserve your spot at McCloud Manor</p>
		</div>

		{#if form?.success}
			<!-- Success Message -->
			<div class="bg-gradient-to-br from-green-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-green-500/50 p-8">
				<div class="text-center mb-8">
					<svg class="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h2 class="text-2xl font-bold text-white mb-2">Tickets Confirmed!</h2>
					<p class="text-gray-300">
						Your tickets have been confirmed! Check your email for your digital tickets.
					</p>
				</div>

				<!-- Ticket Details -->
				{#if form.ticketDetails}
					<div class="bg-black/50 rounded-xl border-2 border-haunt-red/30 p-6 mb-6">
						<h3 class="text-xl font-bold text-haunt-red mb-4 text-center">Your Ticket Details</h3>

						<div class="space-y-3">
							{#if form.ticketDetails.firstName && form.ticketDetails.lastName}
								<div class="flex justify-between items-center border-b border-gray-700 pb-2">
									<span class="text-gray-400">Guest Name:</span>
									<span class="text-white font-bold">{form.ticketDetails.firstName} {form.ticketDetails.lastName}</span>
								</div>
							{/if}

							{#if form.ticketDetails.date}
								<div class="flex justify-between items-center border-b border-gray-700 pb-2">
									<span class="text-gray-400">Date:</span>
									<span class="text-white font-bold">{formatDate(form.ticketDetails.date)}</span>
								</div>
							{/if}

							{#if form.ticketDetails.tickets}
								<div class="flex justify-between items-center">
									<span class="text-gray-400">Number of Tickets:</span>
									<span class="text-white font-bold">{form.ticketDetails.tickets}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<div class="flex flex-col gap-4">
					<a
						href="/haunt"
						class="px-6 py-3 bg-gradient-to-r from-haunt-red to-red-600 hover:from-red-600 hover:to-haunt-red text-white font-bold rounded-xl transition-all text-center"
					>
						Back to McCloud Manor
					</a>
					<a
						href="/haunt#faq-section"
						class="px-6 py-3 bg-black/50 hover:bg-black/70 text-haunt-red font-bold rounded-xl border-2 border-haunt-red/50 hover:border-haunt-red transition-all text-center"
					>
						View FAQ
					</a>
				</div>
			</div>
		{:else}
			<!-- Ticket Reservation Form -->
			<form method="POST" use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					if (result.type === 'success') {
						// Invalidate all data before showing success to ensure fresh data on next visit
						await invalidateAll();
						// Reset CAPTCHA only on success
						captchaToken = dev ? 'dev-mode' : '';
					}
					await update();
					submitting = false;
				};
			}}>
				<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-red/30 p-8 space-y-8">

					{#if form?.error}
						<div class="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
							<p class="text-red-400 font-semibold">{form.error}</p>
						</div>
					{/if}

					<!-- Step 1: Select Date -->
					<div>
						<h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
							<span class="flex items-center justify-center w-8 h-8 bg-haunt-red/20 text-haunt-red rounded-full text-sm font-bold border border-haunt-red/50">1</span>
							Select Your Date
						</h2>

						{#if data.availableDates.length === 0}
							<div class="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
								<p class="text-yellow-400">No dates currently available. Please check back later.</p>
							</div>
						{:else}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								{#each data.availableDates as dateOption}
									{@const remaining = dateOption.capacity - (dateOption.tickets_sold || 0)}
									{@const isLowCapacity = remaining <= 10}
									{@const isSoldOut = remaining <= 0}
									<label
										class="relative cursor-pointer group"
										class:opacity-50={isSoldOut}
									>
										<input
											type="radio"
											name="date"
											value={dateOption.date}
											bind:group={formData.date}
											disabled={isSoldOut}
											class="peer sr-only"
											required
										/>
										<div class="bg-black/50 border-2 border-haunt-red/30 rounded-lg p-4 transition-all peer-checked:border-haunt-red peer-checked:bg-haunt-red/10 hover:border-haunt-red/50">
											<div class="flex justify-between items-center mb-2">
												<div>
													<p class="text-white font-bold">{formatDate(dateOption.date)}</p>
													{#if dateOption.start_time && dateOption.end_time}
														<p class="text-gray-400 text-sm">
															{formatTime(dateOption.start_time)} - {formatTime(dateOption.end_time)}
														</p>
													{/if}
												</div>
												<div class="flex items-center">
													{#if isSoldOut}
														<span class="px-2 py-1 bg-red-900/30 text-red-500 text-xs font-semibold rounded border border-red-600/50">
															Sold Out
														</span>
													{:else if isLowCapacity}
														<span class="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs font-semibold rounded border border-yellow-500/50">
															{remaining} left
														</span>
													{:else}
														<span class="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded border border-green-500/50">
															Available
														</span>
													{/if}
												</div>
											</div>
											{#if dateOption.notes}
												<p class="text-gray-400 text-sm mt-2">{dateOption.notes}</p>
											{/if}
										</div>
									</label>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Step 2: Select Tickets -->
					{#if formData.date}
						<div>
							<h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
								<span class="flex items-center justify-center w-8 h-8 bg-haunt-red/20 text-haunt-red rounded-full text-sm font-bold border border-haunt-red/50">2</span>
								How Many Souls Are Entering?
							</h2>

							{#if selectedDateInfo()}
								{@const maxTickets = Math.min(selectedDateInfo().max_tickets_per_request, remainingTickets())}
								<div class="mb-4">
									<label for="tickets" class="block text-white font-semibold mb-3 text-lg">
										Select your party size
									</label>

									<!-- Visual Ticket Selector -->
									<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
										{#each Array(Math.min(maxTickets, 4)) as _, i}
											{@const ticketNum = i + 1}
											<label class="relative cursor-pointer group">
												<input
													type="radio"
													name="tickets"
													value={ticketNum}
													bind:group={formData.tickets}
													class="peer sr-only"
												/>
												<div class="bg-black/50 border-2 border-haunt-red/30 rounded-lg p-4 transition-all peer-checked:border-haunt-red peer-checked:bg-haunt-red/20 hover:border-haunt-red/50 hover:scale-105 transform">
													<div class="text-center">
														<div class="text-3xl font-bold text-white mb-1">{ticketNum}</div>
														<div class="text-xs text-gray-400 uppercase tracking-wider">
															{ticketNum === 1 ? 'Ticket' : 'Tickets'}
														</div>
													</div>
												</div>
											</label>
										{/each}
									</div>

									{#if maxTickets > 4}
										<div class="mb-4">
											<label for="custom-tickets" class="block text-white font-semibold mb-2">
												Or enter a custom amount (up to {maxTickets})
											</label>
											<div class="flex gap-2 sm:gap-3 items-stretch">
												<!-- Decrement Button -->
												<button type="button" aria-label="Decrease ticket quantity"
													onclick={() => {
														if (formData.tickets > 1) {
															formData.tickets--;
														}
													}}
													disabled={formData.tickets <= 1}
													class="w-14 sm:w-16 h-12 sm:h-12 bg-transparent hover:bg-haunt-red/10 active:bg-haunt-red/20 border-2 border-haunt-red/40 hover:border-haunt-red active:border-haunt-red rounded-lg text-haunt-red hover:text-white active:text-white text-xl transition-all hover:shadow-[0_0_15px_rgba(164,18,20,0.4)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation"
												>
													<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
														<path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
													</svg>
												</button>

												<!-- Number Input -->
												<input
													type="number"
													id="custom-tickets"
													name="tickets"
													bind:value={formData.tickets}
													min="1"
													max={maxTickets}
													placeholder="Enter quantity..."
													class="flex-1 px-3 sm:px-4 py-3 bg-black/50 border-2 border-haunt-red/30 rounded-lg text-white text-lg sm:text-xl font-semibold text-center focus:outline-none focus:border-haunt-red transition-colors"
												/>

												<!-- Increment Button -->
												<button type="button" aria-label="Increase ticket quantity"
													onclick={() => {
														if (formData.tickets < maxTickets) {
															formData.tickets++;
														}
													}}
													disabled={formData.tickets >= maxTickets}
													class="w-14 sm:w-16 h-12 sm:h-12 bg-transparent hover:bg-haunt-red/10 active:bg-haunt-red/20 border-2 border-haunt-red/40 hover:border-haunt-red active:border-haunt-red rounded-lg text-haunt-red hover:text-white active:text-white text-xl transition-all hover:shadow-[0_0_15px_rgba(164,18,20,0.4)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation"
												>
													<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
														<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
													</svg>
												</button>
											</div>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{/if}

					<!-- Step 3: Contact Information -->
					{#if formData.date && formData.tickets > 0}
						<div>
							<h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
								<span class="flex items-center justify-center w-8 h-8 bg-haunt-red/20 text-haunt-red rounded-full text-sm font-bold border border-haunt-red/50">3</span>
								Your Information
							</h2>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div>
									<label for="firstName" class="block text-white font-semibold mb-2">
										First Name <span class="text-haunt-red">*</span>
									</label>
									<input
										type="text"
										id="firstName"
										name="firstName"
										autocomplete="given-name"
										bind:value={formData.firstName}
										required
										class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-red/30 rounded-lg text-white focus:outline-none focus:border-haunt-red transition-colors"
									/>
								</div>

								<div>
									<label for="lastName" class="block text-white font-semibold mb-2">
										Last Name <span class="text-haunt-red">*</span>
									</label>
									<input
										type="text"
										id="lastName"
										name="lastName"
										autocomplete="family-name"
										bind:value={formData.lastName}
										required
										class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-red/30 rounded-lg text-white focus:outline-none focus:border-haunt-red transition-colors"
									/>
								</div>
							</div>

							<div class="mb-4">
								<label for="email" class="block text-white font-semibold mb-2">
									Email Address <span class="text-haunt-red">*</span>
								</label>
								<input
									type="email"
									id="email"
									name="email"
									autocomplete="email"
									bind:value={formData.email}
									required
									class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-red/30 rounded-lg text-white focus:outline-none focus:border-haunt-red transition-colors"
								/>
								<p class="text-gray-400 text-sm mt-2">
									Your tickets will be sent to this email address
								</p>
							</div>
						</div>
					{/if}

					<!-- CAPTCHA Widget (hidden in dev mode) -->
					{#if !dev && formData.date && formData.tickets > 0 && data.availableDates.length > 0}
						<div class="mt-6">
							<TurnstileWidget
								onVerify={(token) => captchaToken = token}
								onError={() => captchaToken = ''}
							/>
						</div>
					{/if}

					<!-- Submit Button -->
					{#if formData.date && formData.tickets > 0 && data.availableDates.length > 0}
						<div class="flex flex-col gap-3 pt-4">
							<button
								type="submit"
								disabled={submitting || !captchaToken}
								class="w-full px-8 py-4 bg-gradient-to-r from-haunt-red to-red-600 hover:from-red-600 hover:to-haunt-red text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
							>
								{submitting ? 'Processing...' : 'Reserve Tickets'}
							</button>
							<a
								href="/haunt"
								class="w-full px-8 py-4 bg-black/50 hover:bg-black/70 text-white font-bold rounded-xl border-2 border-haunt-red/30 hover:border-haunt-red/50 transition-all text-lg text-center"
							>
								Cancel
							</a>
						</div>
					{/if}
				</div>
			</form>
		{/if}
	</div>
</div>
