import type { Handle } from '@sveltejs/kit';

/**
 * SvelteKit server hooks
 * Add security headers to all responses
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Only apply security headers in production
	// In development, CSP can interfere with hot module reloading and local assets
	const isProduction = process.env.NODE_ENV === 'production';

	if (isProduction) {
		// Content Security Policy (CSP)
		// Prevents XSS attacks by controlling which resources can be loaded
		//
		// SECURITY NOTE: CSP unsafe directives justification
		// ================================================
		// 'unsafe-inline' in script-src:
		//   - Required by Cloudflare Turnstile CAPTCHA (challenges.cloudflare.com)
		//   - Required by Google Analytics (www.googletagmanager.com)
		//   - Both are trusted third-party services essential for spam prevention and analytics
		//
		// 'unsafe-eval' in script-src:
		//   - Required by Google Analytics for dynamic script execution
		//   - Needed for GA4 measurement and event tracking
		//
		// 'unsafe-inline' in style-src:
		//   - Required by Cloudflare Turnstile for widget styling
		//   - Required by Google Fonts for dynamic font loading
		//
		// FUTURE IMPROVEMENT: Implement CSP nonces
		// ========================================
		// To remove 'unsafe-inline' while maintaining functionality:
		// 1. Generate a cryptographic nonce per request
		// 2. Add nonce to all inline scripts/styles
		// 3. Replace 'unsafe-inline' with 'nonce-{value}'
		// 4. Verify Turnstile and GA4 support nonce-based CSP
		//
		// Example implementation:
		//   const nonce = crypto.randomBytes(16).toString('base64');
		//   event.locals.cspNonce = nonce;
		//   script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com ...
		//   Then in HTML: <script nonce="${locals.cspNonce}">...</script>
		//
		const cspDirectives = [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"font-src 'self' https://fonts.gstatic.com data:",
			"img-src 'self' data: https: blob:", // Allow images from any HTTPS source
			"connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://challenges.cloudflare.com wss://*.supabase.co", // Added wss for Supabase realtime
			"frame-src 'self' https://www.youtube.com https://challenges.cloudflare.com",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'none'",
			"upgrade-insecure-requests" // Only upgrade in production
		];

		response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
	}

	// Basic security headers (safe for both dev and production)
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.delete('X-Powered-By');

	// Production-only security headers
	if (isProduction) {
		// X-Frame-Options: Prevent clickjacking by blocking iframes
		response.headers.set('X-Frame-Options', 'DENY');

		// Referrer-Policy: Control how much referrer information is sent
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

		// X-XSS-Protection: Enable browser's XSS filter (for older browsers)
		response.headers.set('X-XSS-Protection', '1; mode=block');

		// Permissions-Policy: Control browser features and APIs
		const permissionsPolicyDirectives = [
			'geolocation=()',
			'microphone=()',
			'camera=()',
			'payment=()',
			'usb=()',
			'magnetometer=()',
			'gyroscope=()',
			'accelerometer=()',
			'fullscreen=(self)'
		];
		response.headers.set('Permissions-Policy', permissionsPolicyDirectives.join(', '));

		// Strict-Transport-Security (HSTS): Force HTTPS
		response.headers.set(
			'Strict-Transport-Security',
			'max-age=31536000; includeSubDomains; preload'
		);
	}

	return response;
};
