<script lang="ts">
	interface Props {
		address: string;
		name?: string;
		height?: string;
	}

	let { address, name, height = '400px' }: Props = $props();

	// Encode address for Google Maps URL
	const encodedAddress = $derived(encodeURIComponent(address));
	const mapUrl = $derived(`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`);

	// Alternative: Use iframe embed without API key (search mode)
	const mapUrlNoKey = $derived(`https://maps.google.com/maps?q=${encodedAddress}&output=embed`);
</script>

<div class="google-map-container rounded-lg overflow-hidden border-2 border-gray-700 shadow-xl">
	<iframe
		title={name ? `Map location for ${name}` : 'Location map'}
		src={mapUrlNoKey}
		width="100%"
		height={height}
		style="border:0;"
		allowfullscreen=""
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
	></iframe>
</div>

<style>
	.google-map-container {
		position: relative;
		width: 100%;
	}

	iframe {
		display: block;
		width: 100%;
	}
</style>
