<script lang="ts">
	interface BreadcrumbItem {
		label: string;
		href: string;
	}

	interface BreadcrumbsProps {
		items: BreadcrumbItem[];
	}

	let { items }: BreadcrumbsProps = $props();
</script>

<nav aria-label="Breadcrumb" class="mb-6">
	<ol class="flex items-center space-x-2 text-sm">
		<!-- Home link (always present) -->
		<li>
			<a
				href="/"
				class="text-gray-400 hover:text-haunt-orange transition-colors flex items-center"
			>
				<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
				</svg>
				Home
			</a>
		</li>

		<!-- Breadcrumb items -->
		{#each items as item, index}
			<li class="flex items-center">
				<svg class="w-4 h-4 text-gray-600 mx-2" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
				</svg>

				{#if index === items.length - 1}
					<!-- Last item (current page) - not a link -->
					<span class="text-haunt-orange font-semibold" aria-current="page">
						{item.label}
					</span>
				{:else}
					<!-- Intermediate items - links -->
					<a
						href={item.href}
						class="text-gray-400 hover:text-haunt-orange transition-colors"
					>
						{item.label}
					</a>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
