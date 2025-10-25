<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Scroll to top when error message appears
	$effect(() => {
		if (form?.error) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	});
</script>

<svelte:head>
	<title>Admin Login - Haunt Junkies</title>
</svelte:head>

<!-- Login Section -->
<section class="relative bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden flex items-center justify-center" style="min-height: 100vh; min-height: -webkit-fill-available; min-height: 100dvh;">
	<!-- Background Image -->
	<div class="absolute inset-0" style="background-image: url('/bg.jpg'); background-size: cover; background-position: center;"></div>

	<!-- Overlay -->
	<div class="absolute inset-0 bg-black/80"></div>

	<!-- Content -->
	<div class="relative z-10 w-full max-w-md px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
		<!-- Header -->
		<div class="text-center mb-8">
			<!-- Logo -->
			<div class="mb-4">
				<img src="/logo-url.png" alt="Haunt Junkies" class="max-h-32 sm:max-h-40 md:max-h-48 w-auto mx-auto object-contain" />
			</div>
			<h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange tracking-tight" style="text-shadow: 0 0 40px rgba(255,107,0,0.6);">
				ADMIN LOGIN
			</h1>
		</div>

		<!-- Login Form -->
		<div class="bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border-2 border-haunt-orange/40 p-8 shadow-2xl" style="box-shadow: 0 0 40px rgba(252,116,3,0.3), inset 0 0 20px rgba(0,0,0,0.5);">
			<!-- Supabase Not Configured Warning -->
			{#if data.supabaseConfigured === false}
				<div class="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
					<h3 class="text-yellow-200 font-semibold mb-2">⚠️ Setup Required</h3>
					<p class="text-yellow-200/80 text-sm mb-3">
						Supabase is not configured. To use the admin panel:
					</p>
					<ol class="text-yellow-200/80 text-sm space-y-2 ml-4 list-decimal">
						<li>Create a <code class="bg-black/30 px-1 rounded">.env</code> file in your project root</li>
						<li>Add your Supabase credentials from <a href="https://supabase.com/dashboard" target="_blank" class="text-haunt-orange hover:underline">supabase.com/dashboard</a></li>
						<li>Restart your development server</li>
					</ol>
				</div>
			{/if}

			<form method="POST" use:enhance>
				<!-- Error Message -->
				{#if form?.error}
					<div class="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
						{form.error}
					</div>
				{/if}

				<!-- Email Field -->
				<div class="mb-6">
					<label for="email" class="block text-white font-semibold mb-2">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
					/>
				</div>

				<!-- Password Field -->
				<div class="mb-6">
					<label for="password" class="block text-white font-semibold mb-2">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						class="w-full px-4 py-3 bg-black/50 border-2 border-haunt-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-haunt-orange transition-colors"
					/>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					class="w-full bg-gradient-to-r from-haunt-orange to-orange-600 hover:from-orange-600 hover:to-haunt-orange text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
					style="box-shadow: 0 0 30px rgba(252,116,3,0.4);"
				>
					Login
				</button>
			</form>

			<!-- Back to Home Link -->
			<div class="mt-6 text-center">
				<a href="/" class="text-gray-400 hover:text-haunt-orange transition-colors text-sm">
					← Back to Home
				</a>
			</div>
		</div>
	</div>
</section>
