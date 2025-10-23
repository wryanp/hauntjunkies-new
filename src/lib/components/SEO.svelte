<script lang="ts">
	interface SEOProps {
		title: string;
		description: string;
		image?: string;
		url?: string;
		type?: 'website' | 'article';
		article?: {
			publishedTime?: string;
			modifiedTime?: string;
			author?: string;
			section?: string;
			tags?: string[];
		};
		noindex?: boolean;
	}

	let {
		title,
		description,
		image = 'https://hauntjunkies.com/og-default.jpg',
		url,
		type = 'website',
		article,
		noindex = false
	}: SEOProps = $props();

	// Get base URL - fallback for local dev
	const baseUrl = typeof window !== 'undefined'
		? window.location.origin
		: 'https://hauntjunkies.com';

	// Construct full URL if relative path provided
	const fullUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : baseUrl;

	// Construct full image URL if relative path provided
	const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

	// Ensure proper meta title format
	const metaTitle = title.includes('Haunt Junkies') ? title : `${title} | Haunt Junkies`;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{metaTitle}</title>
	<meta name="title" content={metaTitle} />
	<meta name="description" content={description} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={fullUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={fullUrl} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={fullImageUrl} />
	<meta property="og:site_name" content="Haunt Junkies" />

	{#if article}
		{#if article.publishedTime}
			<meta property="article:published_time" content={article.publishedTime} />
		{/if}
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		{#if article.author}
			<meta property="article:author" content={article.author} />
		{/if}
		{#if article.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#if article.tags}
			{#each article.tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={fullUrl} />
	<meta name="twitter:title" content={metaTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={fullImageUrl} />

	<!-- Additional Meta -->
	<meta name="theme-color" content="#FC7403" />
</svelte:head>
