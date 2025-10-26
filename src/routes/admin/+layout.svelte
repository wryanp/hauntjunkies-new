<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';

	let { data, children }: { data: LayoutData; children: any } = $props();

	// Don't show admin layout on login page
	const isLoginPage = $derived($page.url.pathname === '/admin/login');

	// Navigation links
	const navLinks = [
		{ href: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/admin/reviews', label: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
		{ href: '/admin/comments', label: 'Comments', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
		{ href: '/admin/tickets', label: 'Tickets', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
		{ href: '/admin/contact', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
		{ href: '/admin/ticket-settings', label: 'Schedule', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
		{ href: '/admin/mccloud', label: 'Manor', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
	];

	// Auto-logout on inactivity (30 minutes)
	let inactivityTimeout: NodeJS.Timeout | null = null;
	const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in milliseconds

	async function logout() {
		if (browser) {
			try {
				// Call logout endpoint
				await fetch('/admin/logout', { method: 'POST' });
			} catch (e) {
				// Silently handle logout errors
			} finally {
				// Redirect to login regardless of API result
				goto('/admin/login');
			}
		}
	}

	function resetInactivityTimer() {
		// Clear existing timeout
		if (inactivityTimeout) {
			clearTimeout(inactivityTimeout);
		}

		// Set new timeout
		inactivityTimeout = setTimeout(() => {
			// Session expired due to inactivity
			logout();
		}, INACTIVITY_LIMIT);
	}

	function handleActivity() {
		resetInactivityTimer();
	}

	onMount(() => {
		if (!isLoginPage) {
			// Start inactivity timer
			resetInactivityTimer();

			// Track user activity
			const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
			events.forEach(event => {
				window.addEventListener(event, handleActivity);
			});

			// Handle browser/tab close or visibility change
			const handleVisibilityChange = () => {
				if (document.hidden) {
					// Tab hidden - keep timer running
				} else {
					// Tab visible again - reset timer
					resetInactivityTimer();
				}
			};

			document.addEventListener('visibilitychange', handleVisibilityChange);

			// Cleanup on unmount
			return () => {
				if (inactivityTimeout) {
					clearTimeout(inactivityTimeout);
				}
				events.forEach(event => {
					window.removeEventListener(event, handleActivity);
				});
				document.removeEventListener('visibilitychange', handleVisibilityChange);
			};
		}
	});

</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
		<!-- Admin Navigation -->
		<nav class="bg-black/90 border-b border-haunt-orange/30 sticky top-0 z-50 backdrop-blur-sm">
			<div class="px-4 sm:px-6 lg:px-10">
				<div class="flex items-center justify-between h-14 md:h-16">
					<!-- Logo and Brand -->
					<div class="flex items-center space-x-3 md:space-x-4">
						<a href="/" class="transform hover:scale-110 transition-transform duration-300">
							<img src="/logo-url.png" alt="Haunt Junkies" class="h-9 md:h-10 w-auto" />
						</a>
						<span class="text-haunt-orange font-bold text-lg md:text-xl hidden sm:block">Admin Dashboard</span>
					</div>

					<!-- User Info and Logout -->
					<div class="flex items-center space-x-2 md:space-x-4">
						<span class="text-gray-400 text-xs md:text-sm hidden md:block">{data.user?.email}</span>
						<form action="/admin/logout" method="POST">
							<button
								type="submit"
								class="bg-haunt-red/20 hover:bg-haunt-red/30 text-white px-1 md:px-4 py-0.5 md:py-2 rounded md:rounded-lg border border-haunt-red/50 transition-all text-[11px] md:text-sm leading-tight font-bold"
							>
								Logout
							</button>
						</form>
					</div>
				</div>
			</div>
		</nav>

		<div class="flex">
			<!-- Sidebar -->
			<aside class="w-64 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900/80 to-black/80 border-r border-haunt-orange/20 hidden lg:block">
				<nav class="p-4 space-y-2">
					{#each navLinks as link}
						<a
							href={link.href}
							class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
							       {$page.url.pathname === link.href
							         ? 'bg-haunt-orange/20 text-haunt-orange border border-haunt-orange/40'
							         : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={link.icon} />
							</svg>
							<span class="font-medium">{link.label}</span>
						</a>
					{/each}
				</nav>
			</aside>

			<!-- Mobile Navigation -->
			<div class="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 border-t border-haunt-orange/30 backdrop-blur-sm z-40 safe-area-inset-bottom">
				<nav class="flex justify-around items-center py-1.5 px-1">
					{#each navLinks.slice(0, 5) as link}
						<a
							href={link.href}
							class="flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[60px]
							       {$page.url.pathname === link.href
							         ? 'text-haunt-orange'
							         : 'text-gray-400'}"
						>
							<div class="flex items-center justify-center h-5 w-5 shrink-0">
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={link.icon} />
								</svg>
							</div>
							<span class="text-[10px] leading-tight text-center whitespace-nowrap">{link.label}</span>
						</a>
					{/each}
				</nav>
			</div>

			<!-- Main Content -->
			<main class="flex-1 p-4 md:p-6 lg:p-10 pb-20 lg:pb-8 overflow-x-hidden">
				<div class="max-w-7xl mx-auto">
					{@render children()}
				</div>
			</main>
		</div>

		<!-- Footer -->
		<Footer isAuthenticated={true} />
	</div>
{/if}
