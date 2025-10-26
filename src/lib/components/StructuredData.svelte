<script lang="ts">
	import type { Review } from '$lib/types';

	interface StructuredDataProps {
		review: Review;
	}

	let { review }: StructuredDataProps = $props();

	// Get base URL
	const baseUrl = 'https://hauntjunkies.com'; // Update with your actual domain

	// Generate JSON-LD structured data for review
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Review',
		'itemReviewed': {
			'@type': 'LocalBusiness',
			'@id': `${baseUrl}/reviews/${review.slug}`,
			'name': review.name,
			'address': {
				'@type': 'PostalAddress',
				'addressLocality': review.city,
				'addressRegion': review.state,
				'streetAddress': review.address || ''
			},
			'image': review.cover_image_url,
			'url': review.website_url || `${baseUrl}/reviews/${review.slug}`,
			'aggregateRating': review.rating_overall ? {
				'@type': 'AggregateRating',
				'ratingValue': review.rating_overall,
				'bestRating': '5',
				'worstRating': '0',
				'ratingCount': '1'
			} : undefined
		},
		'author': {
			'@type': 'Organization',
			'name': 'Haunt Junkies',
			'url': baseUrl
		},
		'datePublished': review.created_at,
		'dateModified': review.updated_at || review.created_at,
		'description': review.description,
		'reviewBody': review.review_text,
		'reviewRating': review.rating_overall ? {
			'@type': 'Rating',
			'ratingValue': review.rating_overall,
			'bestRating': '5',
			'worstRating': '0'
		} : undefined,
		'publisher': {
			'@type': 'Organization',
			'name': 'Haunt Junkies',
			'logo': {
				'@type': 'ImageObject',
				'url': `${baseUrl}/logo-url.webp`
			}
		}
	};

	// Also add TouristAttraction schema for haunted houses
	const attractionData = {
		'@context': 'https://schema.org',
		'@type': 'TouristAttraction',
		'@id': `${baseUrl}/reviews/${review.slug}#attraction`,
		'name': review.name,
		'description': review.description,
		'image': review.cover_image_url,
		'url': review.website_url || `${baseUrl}/reviews/${review.slug}`,
		'address': {
			'@type': 'PostalAddress',
			'addressLocality': review.city,
			'addressRegion': review.state,
			'streetAddress': review.address || ''
		},
		'aggregateRating': review.rating_overall ? {
			'@type': 'AggregateRating',
			'ratingValue': review.rating_overall,
			'bestRating': '5',
			'worstRating': '0',
			'ratingCount': '1'
		} : undefined,
		'isAccessibleForFree': false,
		'touristType': ['Horror Enthusiasts', 'Thrill Seekers']
	};

	// Breadcrumb structured data
	const breadcrumbData = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		'itemListElement': [
			{
				'@type': 'ListItem',
				'position': 1,
				'name': 'Home',
				'item': baseUrl
			},
			{
				'@type': 'ListItem',
				'position': 2,
				'name': 'Reviews',
				'item': `${baseUrl}/reviews`
			},
			{
				'@type': 'ListItem',
				'position': 3,
				'name': review.name,
				'item': `${baseUrl}/reviews/${review.slug}`
			}
		]
	};

	const jsonLd = JSON.stringify([structuredData, attractionData, breadcrumbData]);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</` + `script>`}
</svelte:head>
