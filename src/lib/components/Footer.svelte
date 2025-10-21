<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-black border-t border-haunt-orange/20 py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- About -->
			<div>
				<h3 class="text-haunt-orange text-xl font-bold mb-4">Haunt Junkies</h3>
				<p class="text-gray-400">
					Your trusted source for haunted attraction reviews and the home of McCloud Manor.
				</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="text-haunt-orange text-xl font-bold mb-4">Quick Links</h3>
				<ul class="space-y-2">
					<li><a href="/reviews" class="text-gray-400 hover:text-haunt-orange transition-colors">Reviews</a></li>
					<li><a href="/haunt" class="text-gray-400 hover:text-haunt-orange transition-colors">Our Haunt</a></li>
					<li><a href="/shop" class="text-gray-400 hover:text-haunt-orange transition-colors">Shop</a></li>
					<li><a href="/contact" class="text-gray-400 hover:text-haunt-orange transition-colors">Contact</a></li>
				</ul>
			</div>

			<!-- Social (placeholder) -->
			<div>
				<h3 class="text-haunt-orange text-xl font-bold mb-4">Follow Us</h3>
				<p class="text-gray-400 text-sm">
					Connect with us on social media for the latest haunt news and updates!
				</p>
			</div>
		</div>

		<div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
			<p>&copy; {currentYear} Haunt Junkies. All rights reserved.</p>
		</div>
	</div>
</footer>
