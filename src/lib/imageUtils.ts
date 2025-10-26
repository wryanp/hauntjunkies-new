/**
 * Image utility functions for validating and handling image URLs
 */

/**
 * Validates if an image URL is valid and not a placeholder
 * @param url - The image URL to validate
 * @returns true if the URL is valid and not a placeholder
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
	if (!url) return false;

	// Check if URL is empty or whitespace only
	if (url.trim() === '') return false;

	// Check for common placeholder patterns
	const placeholderPatterns = [
		'placeholder',
		'example.com',
		'http://example',
		'https://example',
		'your-image',
		'image.jpg',
		'default',
		'no-image'
	];

	const lowerUrl = url.toLowerCase();
	const hasPlaceholderPattern = placeholderPatterns.some(pattern =>
		lowerUrl.includes(pattern)
	);

	if (hasPlaceholderPattern) return false;

	// Check if URL has a valid protocol
	try {
		const urlObj = new URL(url);
		const validProtocols = ['http:', 'https:'];
		if (!validProtocols.includes(urlObj.protocol)) return false;
	} catch {
		// If URL parsing fails, it's not a valid URL
		return false;
	}

	// Check if URL ends with a valid image extension
	const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
	const hasValidExtension = validExtensions.some(ext =>
		lowerUrl.endsWith(ext)
	);

	// If no valid extension but is a Supabase storage URL, consider it valid
	if (!hasValidExtension && lowerUrl.includes('supabase.co/storage')) {
		return true;
	}

	return hasValidExtension;
}

/**
 * Gets a fallback image URL for reviews
 * @returns The fallback image URL
 */
export function getFallbackReviewImage(): string {
	return '/logo-transback.PNG';
}
