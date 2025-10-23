<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';
	import TurnstileWidget from '$lib/components/TurnstileWidget.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { dev } from '$app/environment';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);
	let captchaToken = $state(dev ? 'dev-mode' : ''); // Auto-pass in dev mode

	// Detect theme from URL parameter (theme=mccloud for red theme)
	const isMcCloudTheme = $derived($page.url.searchParams.get('theme') === 'mccloud');

	// Scroll to top when success or error message appears
	$effect(() => {
		if (form?.success || form?.error) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	});
</script>

<SEO
	title="Contact Us"
	description="Contact Haunt Junkies for haunt reviews, partnerships, or questions about haunted attractions. We'd love to hear from fellow horror enthusiasts and haunt owners."
	url="/contact"
	image="/og-contact.jpg"
	type="website"
/>

<section class="relative pt-32 pb-20 md:pt-32 md:pb-20 overflow-hidden" style="min-height: 100vh; min-height: -webkit-fill-available; min-height: 100dvh;">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img src="/experience-bg.jpg" alt="" role="presentation" class="w-full h-full object-cover" style="object-position: center;" />
	</div>

	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-black/60"></div>

	<!-- Smoky animated background -->
	<div class="absolute inset-0">
		<!-- Multiple smoke layers for depth -->
		<div class="absolute inset-0 opacity-20" style="background: radial-gradient(ellipse at 20% 30%, rgba(100,100,100,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(100,100,100,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(80,80,80,0.2) 0%, transparent 60%);"></div>
		<div class="absolute inset-0 opacity-15" style="background: radial-gradient(ellipse at 60% 40%, rgba(120,120,120,0.4) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(90,90,90,0.3) 0%, transparent 50%);"></div>

		<!-- Animated smoke wisps -->
		<div class="absolute inset-0 animate-pulse" style="animation-duration: 8s; background: radial-gradient(ellipse at 40% 60%, rgba(100,100,100,0.15) 0%, transparent 40%);"></div>
	</div>

	<!-- Glow accents - Orange for homepage, Red for McCloud -->
	<div class="absolute inset-0 opacity-10" style="background: radial-gradient(ellipse at 50% 0%, {isMcCloudTheme ? 'rgba(164,18,20,0.4)' : 'rgba(252,116,3,0.4)'} 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, {isMcCloudTheme ? 'rgba(164,18,20,0.4)' : 'rgba(252,116,3,0.4)'} 0%, transparent 50%);"></div>

	<!-- Texture overlay -->
	<div class="absolute inset-0 opacity-5" style="background-image: url('/calendar-bg.png'); background-size: cover;"></div>

	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="text-center mb-16">
			<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text mb-4 tracking-tight {isMcCloudTheme ? 'bg-gradient-to-r from-haunt-red via-red-500 to-haunt-red' : 'bg-gradient-to-r from-haunt-orange via-orange-500 to-haunt-orange'}" style="text-shadow: 0 0 40px {isMcCloudTheme ? 'rgba(164,18,20,0.6)' : 'rgba(255,107,0,0.6)'};">
				GET IN TOUCH
			</h1>
			<div class="w-48 h-1 bg-gradient-to-r from-transparent to-transparent mx-auto mb-6 {isMcCloudTheme ? 'via-haunt-red' : 'via-haunt-orange'}"></div>
			<p class="text-xl text-gray-400">
				Have questions or want to share a haunt? We'd love to hear from you!
			</p>
		</div>

		<div class="relative">
			<!-- Glow effect behind form -->
			<div class="absolute -inset-4 blur-2xl opacity-30 {isMcCloudTheme ? 'bg-gradient-to-r from-haunt-red/20 via-red-600/25 to-haunt-red/20' : 'bg-gradient-to-r from-haunt-orange/20 via-orange-600/25 to-haunt-orange/20'}"></div>

			<!-- Form Container -->
			<div class="relative bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 rounded-2xl border-4 p-8 md:p-12 {isMcCloudTheme ? 'border-haunt-red/50' : 'border-haunt-orange/50'}" style="box-shadow: 0 0 20px {isMcCloudTheme ? 'rgba(164,18,20,0.3)' : 'rgba(255,107,0,0.3)'}, inset 0 0 20px rgba(0,0,0,0.8);">
			{#if form?.success}
				<div class="mb-6 p-6 bg-green-900/30 border border-green-700 rounded-lg">
					<h3 class="text-green-300 font-bold text-xl mb-2">Message Sent!</h3>
					<p class="text-green-200">
						Thank you for contacting us. We'll get back to you as soon as possible.
					</p>
				</div>
			{/if}

			{#if form?.error}
				<div class="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
					{form.error}
				</div>
			{/if}

			<form method="POST" use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					await update();
					submitting = false;
					// Reset CAPTCHA only on success
					if (result.type === 'success') {
						captchaToken = dev ? 'dev-mode' : '';
					}
				};
			}}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-400 mb-2">Name *</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							class="w-full px-4 py-3 rounded-lg bg-black/50 border-2 border-gray-600 text-white focus:outline-none {isMcCloudTheme ? 'focus:border-haunt-red' : 'focus:border-haunt-orange'}"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-400 mb-2">Email *</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							class="w-full px-4 py-3 rounded-lg bg-black/50 border-2 border-gray-600 text-white focus:outline-none {isMcCloudTheme ? 'focus:border-haunt-red' : 'focus:border-haunt-orange'}"
						/>
					</div>
				</div>

				<div class="mb-4">
					<label for="subject" class="block text-sm font-medium text-gray-400 mb-2">Subject</label>
					<input
						type="text"
						id="subject"
						name="subject"
						class="w-full px-4 py-3 rounded-lg bg-black/50 border-2 border-gray-600 text-white focus:outline-none {isMcCloudTheme ? 'focus:border-haunt-red' : 'focus:border-haunt-orange'}"
					/>
				</div>

				<div class="mb-6">
					<label for="message" class="block text-sm font-medium text-gray-400 mb-2">Message *</label>
					<textarea
						id="message"
						name="message"
						required
						rows="6"
						class="w-full px-4 py-3 rounded-lg bg-black/50 border-2 border-gray-600 text-white focus:outline-none {isMcCloudTheme ? 'focus:border-haunt-red' : 'focus:border-haunt-orange'}"
					></textarea>
				</div>

				<!-- CAPTCHA Widget (hidden in dev mode) -->
				{#if !dev}
					<div class="mb-6">
						<TurnstileWidget
							onVerify={(token) => captchaToken = token}
							onError={() => captchaToken = ''}
						/>
					</div>
				{/if}

				<button
					type="submit"
					disabled={submitting || !captchaToken}
					class="w-full text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed {isMcCloudTheme ? 'bg-haunt-red hover:bg-red-700' : 'bg-haunt-orange hover:bg-orange-600'}"
				>
					{submitting ? 'Sending...' : 'Send Message'}
				</button>
			</form>
			</div>
		</div>

		<!-- Contact Info -->
		<div class="mt-12 text-center">
			<p class="text-gray-400">
				We typically respond within 24-48 hours. Thank you for your interest in Haunt Junkies!
			</p>
		</div>
	</div>
</section>
