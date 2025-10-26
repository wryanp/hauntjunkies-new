<script lang="ts">
	import { page } from '$app/stores';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Get error status and message
	const status = $derived($page.status);
	const message = $derived($page.error?.message || 'An unexpected error occurred');
	const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));

	// Get error title based on status code
	const getErrorTitle = (code: number): string => {
		switch (code) {
			case 404:
				return 'Page Not Found';
			case 403:
				return 'Access Forbidden';
			case 401:
				return 'Unauthorized';
			case 500:
				return 'Internal Server Error';
			case 503:
				return 'Service Unavailable';
			default:
				return 'Error';
		}
	};

	// Get spooky error message based on status code
	const getSpookyMessage = (code: number): string => {
		switch (code) {
			case 404:
				return "This page has vanished into the darkness...";
			case 403:
				return "You shall not pass this haunted threshold...";
			case 500:
				return "Something wicked went wrong on our end...";
			case 503:
				return "Our ghosts are temporarily unavailable...";
			default:
				return "The spirits are restless...";
		}
	};

	const title = $derived(getErrorTitle(status));
	const spookyMessage = $derived(getSpookyMessage(status));
</script>

<svelte:head>
	<title>{status} - {title} | {isAdminRoute ? 'Admin | ' : ''}Haunt Junkies</title>
	<meta name="description" content={message} />
</svelte:head>

{#if isAdminRoute}
	<!-- ADMIN ERROR PAGE -->
	<div class="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-16">
		<div class="max-w-xl w-full">
			<!-- Admin Error Card -->
			<div class="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-8">
				<!-- Admin Indicator Badge -->
				<div class="text-center mb-4">
					<span class="inline-block px-4 py-2 bg-haunt-orange text-white text-sm font-bold rounded-full shadow-lg">
						🔧 ADMIN ERROR PAGE
					</span>
				</div>

				<!-- Header -->
				<div class="text-center mb-6">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
						<svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					<h1 class="text-6xl font-bold text-red-500 mb-2">
						{status}
					</h1>
					<h2 class="text-2xl font-semibold text-white mb-2">
						{title}
					</h2>
				</div>

				<!-- Separator -->
				<div class="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6"></div>

				<!-- Error Message -->
				{#if message}
					<div class="mb-6 p-4 bg-gray-900/50 border border-red-500/30 rounded-lg">
						<p class="text-gray-300 text-center">
							{message}
						</p>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex flex-col gap-3">
					<a
						href="/admin/dashboard"
						class="w-full px-6 py-3 bg-haunt-orange hover:bg-haunt-orange/80 text-white font-semibold rounded-lg transition-all duration-300 text-center"
					>
						Go to Dashboard
					</a>


					{#if status === 401 || status === 403}
						<a
							href="/admin/login"
							class="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 text-center border border-gray-600"
						>
							Login
						</a>
					{/if}
				</div>
			</div>

			<!-- Additional Info -->
			<div class="mt-6 text-center text-gray-500 text-sm">
				<p>
					If this problem persists, please check the logs or
					<a href="/" class="text-haunt-orange hover:underline">return to the main site</a>.
				</p>
			</div>
		</div>
	</div>
{:else}
	<!-- PUBLIC ERROR PAGE -->
	<div class="min-h-screen bg-black text-white flex flex-col">
		<!-- Show navigation -->
		<Navigation />

		<main class="flex-grow flex items-center justify-center px-4 py-16">
		<div class="max-w-2xl w-full text-center">
			<!-- Error Code -->
			<div class="mb-8">
				<h1 class="text-9xl font-bold text-haunt-orange drop-shadow-[0_0_30px_rgba(252,116,3,0.5)] font-['Creepster'] mb-4">
					{status}
				</h1>
				<h2 class="text-4xl font-bold text-white mb-2 font-['IM_Fell_English']">
					{title}
				</h2>
				<p class="text-xl text-gray-400 italic font-['IM_Fell_English']">
					{spookyMessage}
				</p>
			</div>

			<!-- Separator -->
			<div class="w-32 h-1 bg-gradient-to-r from-transparent via-haunt-orange to-transparent mx-auto mb-8"></div>

			<!-- Error Message -->
			{#if message && message !== 'Not Found'}
				<div class="mb-8 p-6 bg-gray-900/50 border border-haunt-orange/30 rounded-lg">
					<p class="text-gray-300 text-lg">
						{message}
					</p>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a
					href="/"
					class="px-8 py-3 bg-haunt-orange hover:bg-haunt-orange/80 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-haunt-orange/50 transform hover:scale-105"
				>
					Return Home
				</a>

			</div>

			<!-- Additional Help -->
			<div class="mt-12 text-gray-500 text-sm">
				<p>Need help? <a href="/contact" class="text-haunt-orange hover:underline">Contact us</a></p>
			</div>
		</div>
		</main>

		<!-- Show footer -->
		<Footer isAuthenticated={false} />
	</div>
{/if}

<style>
	/* Ensure Creepster font is loaded */
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
</style>
