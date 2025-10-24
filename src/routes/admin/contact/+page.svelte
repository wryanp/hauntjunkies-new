<script lang="ts">
	// Mock data - replace with actual Supabase data
	let messages = $state([
		{
			id: 1,
			name: 'Emily Johnson',
			email: 'emily.j@example.com',
			subject: 'Question about McCloud Manor',
			message: 'Hi! I was wondering if McCloud Manor is open on weekends? Also, are there age restrictions? My kids are 10 and 12. Thanks!',
			read: false,
			created_at: '2024-10-22T15:30:00Z'
		},
		{
			id: 2,
			name: 'David Chen',
			email: 'david.chen@example.com',
			subject: 'Partnership Opportunity',
			message: 'Hello Haunt Junkies team, I represent a haunted attraction in Tennessee and would love to discuss a potential partnership. Please let me know the best way to reach you.',
			read: false,
			created_at: '2024-10-22T10:15:00Z'
		},
		{
			id: 3,
			name: 'Rachel Martinez',
			email: 'rachel.m@example.com',
			subject: 'Review Request',
			message: 'We recently opened a new haunted house in Florida and would love for you to come review it! We can arrange complimentary tickets for your team. Looking forward to hearing from you.',
			read: true,
			created_at: '2024-10-21T14:20:00Z'
		},
		{
			id: 4,
			name: 'Tom Wilson',
			email: 'tom.w@example.com',
			subject: 'Website Feedback',
			message: 'Love your site! The reviews are so detailed and helpful. Keep up the great work!',
			read: true,
			created_at: '2024-10-20T09:45:00Z'
		},
		{
			id: 5,
			name: 'Lisa Anderson',
			email: 'lisa.a@example.com',
			subject: 'Group Booking Inquiry',
			message: 'Hi, I am planning a birthday party for 15 people at McCloud Manor. Do you offer group discounts? What is the best way to book for a large group?',
			read: false,
			created_at: '2024-10-22T16:50:00Z'
		}
	]);

	let filterStatus = $state<'all' | 'unread' | 'read'>('all');
	let selectedMessage = $state<number | null>(null);

	const filteredMessages = $derived(() => {
		if (filterStatus === 'unread') {
			return messages.filter(m => !m.read);
		} else if (filterStatus === 'read') {
			return messages.filter(m => m.read);
		}
		return messages;
	});

	const unreadCount = $derived(messages.filter(m => !m.read).length);

	function toggleRead(messageId: number) {
		messages = messages.map(m =>
			m.id === messageId ? { ...m, read: !m.read } : m
		);
	}

	function markAllAsRead() {
		if (confirm('Mark all messages as read?')) {
			messages = messages.map(m => ({ ...m, read: true }));
		}
	}

	function deleteMessage(messageId: number) {
		if (confirm('Are you sure you want to delete this message?')) {
			messages = messages.filter(m => m.id !== messageId);
			if (selectedMessage === messageId) {
				selectedMessage = null;
			}
		}
	}

	function viewMessage(messageId: number) {
		selectedMessage = messageId;
		// Mark as read when viewing
		messages = messages.map(m =>
			m.id === messageId ? { ...m, read: true } : m
		);
	}

	function closeMessageView() {
		selectedMessage = null;
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const currentMessage = $derived(() => {
		return messages.find(m => m.id === selectedMessage);
	});
</script>

<svelte:head>
	<title>Contact Messages - Admin Dashboard</title>
</svelte:head>

<div>
	<!-- Header -->
	<div class="mb-6 sm:mb-8">
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div class="min-w-0">
				<h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Contact Messages</h1>
				<p class="text-sm sm:text-base text-gray-400">Manage messages from your contact form</p>
			</div>
			{#if unreadCount > 0}
				<button
					type="button"
					onclick={markAllAsRead}
					class="px-3 sm:px-4 py-2 bg-haunt-orange/20 hover:bg-haunt-orange/30 text-haunt-orange rounded-lg border border-haunt-orange/50 font-semibold transition-all text-sm sm:text-base whitespace-nowrap shrink-0"
				>
					Mark All as Read
				</button>
			{/if}
		</div>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
		<!-- Unread Messages -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 p-4 sm:p-6">
			<div class="flex items-center justify-between">
				<div class="min-w-0">
					<p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-1">Unread</p>
					<p class="text-2xl sm:text-3xl font-bold text-yellow-400">{unreadCount}</p>
				</div>
				<svg class="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
				</svg>
			</div>
		</div>

		<!-- Read Messages -->
		<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-blue-500/30 p-4 sm:p-6">
			<div class="flex items-center justify-between">
				<div class="min-w-0">
					<p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-1">Read</p>
					<p class="text-2xl sm:text-3xl font-bold text-blue-400">{messages.length - unreadCount}</p>
				</div>
				<svg class="w-10 h-10 sm:w-12 sm:h-12 text-blue-400/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Filter -->
	<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-4 sm:p-6 mb-6 sm:mb-8">
		<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
			<label class="text-white font-semibold text-sm sm:text-base shrink-0">Filter:</label>
			<div class="flex flex-wrap gap-2 w-full sm:w-auto">
				<button
					type="button"
					onclick={() => filterStatus = 'all'}
					class="px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm {filterStatus === 'all'
						? 'bg-haunt-orange text-white'
						: 'bg-black/50 text-gray-400 hover:bg-black/70 hover:text-white'}"
				>
					All ({messages.length})
				</button>
				<button
					type="button"
					onclick={() => filterStatus = 'unread'}
					class="px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm {filterStatus === 'unread'
						? 'bg-yellow-600 text-white'
						: 'bg-black/50 text-gray-400 hover:bg-black/70 hover:text-white'}"
				>
					Unread ({unreadCount})
				</button>
				<button
					type="button"
					onclick={() => filterStatus = 'read'}
					class="px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm {filterStatus === 'read'
						? 'bg-blue-600 text-white'
						: 'bg-black/50 text-gray-400 hover:bg-black/70 hover:text-white'}"
				>
					Read ({messages.length - unreadCount})
				</button>
			</div>
		</div>
	</div>

	<!-- Messages List -->
	<div class="space-y-4">
		{#if filteredMessages().length === 0}
			<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 border-haunt-orange/30 p-12 text-center">
				<svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
				<p class="text-gray-400 text-lg">No messages found</p>
			</div>
		{:else}
			{#each filteredMessages() as message (message.id)}
				<div class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border-2 {message.read ? 'border-haunt-orange/20' : 'border-yellow-500/40'} p-4 sm:p-6 hover:border-haunt-orange/50 transition-all overflow-hidden">
					<div class="flex flex-col sm:flex-row items-start justify-between gap-4">
						<!-- Message Info -->
						<div class="flex-1 min-w-0 w-full sm:w-auto">
							<div class="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
								{#if !message.read}
									<div class="w-2 h-2 bg-yellow-400 rounded-full shrink-0"></div>
								{/if}
								<h3 class="text-base sm:text-lg font-bold text-white truncate max-w-full">{message.name}</h3>
								{#if !message.read}
									<span class="px-2 sm:px-3 py-1 bg-yellow-900/30 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/50 shrink-0">
										New
									</span>
								{/if}
							</div>
							<p class="text-gray-400 text-xs sm:text-sm mb-2 break-all">{message.email}</p>
							<p class="text-haunt-orange font-semibold mb-2 text-sm sm:text-base truncate">{message.subject}</p>
							<p class="text-gray-400 text-xs sm:text-sm line-clamp-2 break-words">{message.message}</p>
						</div>

						<!-- Date & Actions -->
						<div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto sm:ml-4 shrink-0">
							<p class="text-gray-500 text-xs sm:text-sm whitespace-nowrap">{formatDate(message.created_at)}</p>
							<div class="flex gap-2">
								<button
									type="button"
									onclick={() => viewMessage(message.id)}
									class="px-3 sm:px-4 py-2 bg-haunt-orange/20 hover:bg-haunt-orange/30 text-haunt-orange rounded-lg border border-haunt-orange/50 font-semibold transition-all text-xs sm:text-sm"
								>
									View
								</button>
								<button
									type="button"
									onclick={() => toggleRead(message.id)}
									class="px-2 sm:px-4 py-2 rounded-lg border font-semibold transition-all text-xs sm:text-sm {message.read
										? 'bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-400 border-yellow-500/50'
										: 'bg-blue-900/20 hover:bg-blue-900/30 text-blue-400 border-blue-500/50'}"
									title={message.read ? 'Mark as unread' : 'Mark as read'}
								>
									{message.read ? '✉️' : '📭'}
								</button>
								<button
									type="button"
									onclick={() => deleteMessage(message.id)}
									class="px-2 sm:px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg border border-red-500/50 font-semibold transition-all text-xs sm:text-sm"
								>
									🗑️
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<!-- Message Detail Modal -->
{#if selectedMessage && currentMessage()}
	<div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick={closeMessageView}>
		<div class="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-haunt-orange/50 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onclick={(e) => e.stopPropagation()}>
			<!-- Header -->
			<div class="flex items-start justify-between mb-6">
				<div class="flex-1">
					<h2 class="text-2xl font-bold text-white mb-2">{currentMessage().subject}</h2>
					<div class="flex items-center gap-4 text-sm text-gray-400">
						<span class="font-semibold text-haunt-orange">{currentMessage().name}</span>
						<span>{currentMessage().email}</span>
						<span>{formatDate(currentMessage().created_at)}</span>
					</div>
				</div>
				<button
					type="button"
					onclick={closeMessageView}
					class="text-gray-400 hover:text-white transition-colors"
				>
					<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Message Content -->
			<div class="bg-black/30 rounded-xl border border-white/10 p-6 mb-6">
				<p class="text-gray-300 leading-relaxed whitespace-pre-wrap">{currentMessage().message}</p>
			</div>

			<!-- Actions -->
			<div class="flex gap-3">
				<a
					href="https://mail.google.com/mail/?view=cm&fs=1&to={encodeURIComponent(currentMessage().email)}&su={encodeURIComponent('Re: ' + currentMessage().subject)}&tf=1&authuser=hauntjunkies@gmail.com"
					target="_blank"
					rel="noopener noreferrer"
					class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-bold rounded-xl transition-all"
				>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
					</svg>
					Reply via Email
				</a>
				<button
					type="button"
					onclick={() => deleteMessage(currentMessage().id)}
					class="px-6 py-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-xl border border-red-500/50 font-bold transition-all"
				>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}
