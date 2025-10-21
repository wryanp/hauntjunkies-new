<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Contact Us - Haunt Junkies</title>
	<meta name="description" content="Get in touch with Haunt Junkies" />
</svelte:head>

<div class="bg-gradient-to-b from-gray-900 to-black min-h-screen py-20">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h1 class="text-5xl md:text-6xl font-bold text-white mb-4 font-creepster">
				Get in Touch
			</h1>
			<p class="text-xl text-gray-400">
				Have questions or want to share a haunt? We'd love to hear from you!
			</p>
		</div>

		<div class="bg-gray-800/50 rounded-2xl p-8 md:p-12 border border-gray-700">
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

			<form method="POST" use:enhance>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-400 mb-2">Name *</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-400 mb-2">Email *</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
						/>
					</div>
				</div>

				<div class="mb-4">
					<label for="subject" class="block text-sm font-medium text-gray-400 mb-2">Subject</label>
					<input
						type="text"
						id="subject"
						name="subject"
						class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
					/>
				</div>

				<div class="mb-6">
					<label for="message" class="block text-sm font-medium text-gray-400 mb-2">Message *</label>
					<textarea
						id="message"
						name="message"
						required
						rows="6"
						class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-haunt-orange"
					></textarea>
				</div>

				<button
					type="submit"
					class="w-full bg-haunt-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
				>
					Send Message
				</button>
			</form>
		</div>

		<!-- Contact Info -->
		<div class="mt-12 text-center">
			<p class="text-gray-400">
				We typically respond within 24-48 hours. Thank you for your interest in Haunt Junkies!
			</p>
		</div>
	</div>
</div>
