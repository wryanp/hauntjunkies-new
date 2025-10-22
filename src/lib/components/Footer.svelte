<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="relative border-t border-haunt-orange/20 py-12 overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0" style="background-image: url('/bg.jpg'); background-size: cover; background-position: center;"></div>

	<!-- Overlay -->
	<div class="absolute inset-0 bg-black/40"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- About -->
			<div>
				<h3 class="text-haunt-orange text-xl font-bold mb-4">Haunt Junkies</h3>
				<p class="text-gray-400 mb-4">
					Your trusted source for haunted attraction reviews and the home of McCloud Manor.
				</p>
				<img src="/logo-transback.PNG" alt="Haunt Junkies" class="h-20 w-auto drop-shadow-xl" />
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="text-haunt-orange text-xl font-bold mb-4">Quick Links</h3>
				<ul class="space-y-2">
					<li><a href="/about" class="text-gray-400 hover:text-haunt-orange transition-colors">About</a></li>
				<li><a href="/reviews" class="text-gray-400 hover:text-haunt-orange transition-colors">Reviews</a></li>
					<li><a href="/haunt" class="text-gray-400 hover:text-haunt-orange transition-colors">Our Haunt</a></li>
					<li><a href="/shop" class="text-gray-400 hover:text-haunt-orange transition-colors">Shop</a></li>
					<li><a href="/contact" class="text-gray-400 hover:text-haunt-orange transition-colors">Contact</a></li>
				</ul>
			</div>

			<!-- Social -->
			<div>
				<h3 class="text-haunt-orange text-xl font-bold mb-4">Follow Us</h3>
				<p class="text-gray-400 text-sm mb-4">
					Connect with us on social media for the news and updates!
				</p>
				<div class="flex gap-4">
					<!-- Facebook -->
					<a
						href="https://www.facebook.com/Hauntjunkies"
						target="_blank"
						rel="noopener noreferrer"
						class="text-haunt-orange hover:text-orange-400 transition-all transform hover:scale-110"
						aria-label="Follow us on Facebook"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
						</svg>
					</a>

					<!-- Instagram -->
					<a
						href="https://www.instagram.com/hauntjunkies/?hl=en"
						target="_blank"
						rel="noopener noreferrer"
						class="text-haunt-orange hover:text-orange-400 transition-all transform hover:scale-110"
						aria-label="Follow us on Instagram"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
						</svg>
					</a>

					<!-- TikTok -->
					<a
						href="https://www.tiktok.com/@hauntjunkies"
						target="_blank"
						rel="noopener noreferrer"
						class="text-haunt-orange hover:text-orange-400 transition-all transform hover:scale-110"
						aria-label="Follow us on TikTok"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
						</svg>
					</a>
				</div>
			</div>
		</div>

		<div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
			<p>&copy; {currentYear} Haunt Junkies. All rights reserved.</p>
		</div>
	</div>
</footer>
