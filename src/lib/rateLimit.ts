// Simple in-memory rate limiter for serverless environments
// For production with multiple instances, consider using Redis (Upstash)

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

// In-memory store (resets on server restart, which is fine for serverless)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
	const now = Date.now();
	for (const [key, value] of rateLimitStore.entries()) {
		if (now > value.resetTime) {
			rateLimitStore.delete(key);
		}
	}
}, 5 * 60 * 1000);

export interface RateLimitConfig {
	/** Maximum requests allowed in the time window */
	maxRequests: number;
	/** Time window in milliseconds */
	windowMs: number;
	/** Unique identifier for this rate limit (e.g., 'contact-form', 'ticket-purchase') */
	identifier: string;
}

export interface RateLimitResult {
	success: boolean;
	limit: number;
	remaining: number;
	resetTime: number;
}

/**
 * Check if a request is within rate limits
 * @param key - Unique key for the request (usually IP address or user ID)
 * @param config - Rate limit configuration
 * @returns RateLimitResult indicating if request is allowed
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
	const identifier = `${config.identifier}:${key}`;
	const now = Date.now();

	// Get or create entry
	let entry = rateLimitStore.get(identifier);

	if (!entry || now > entry.resetTime) {
		// Create new entry or reset expired entry
		entry = {
			count: 1,
			resetTime: now + config.windowMs
		};
		rateLimitStore.set(identifier, entry);

		return {
			success: true,
			limit: config.maxRequests,
			remaining: config.maxRequests - 1,
			resetTime: entry.resetTime
		};
	}

	// Check if limit exceeded
	if (entry.count >= config.maxRequests) {
		return {
			success: false,
			limit: config.maxRequests,
			remaining: 0,
			resetTime: entry.resetTime
		};
	}

	// Increment count
	entry.count++;
	rateLimitStore.set(identifier, entry);

	return {
		success: true,
		limit: config.maxRequests,
		remaining: config.maxRequests - entry.count,
		resetTime: entry.resetTime
	};
}

/**
 * Get a user's IP address from the request
 * Works with Vercel, Netlify, Cloudflare, and standard Node.js
 */
export function getClientIP(request: Request): string {
	// Check various headers used by different platforms
	const headers = request.headers;

	return (
		headers.get('x-forwarded-for')?.split(',')[0].trim() ||
		headers.get('x-real-ip') ||
		headers.get('cf-connecting-ip') || // Cloudflare
		headers.get('true-client-ip') || // Cloudflare Enterprise
		headers.get('x-client-ip') ||
		'unknown'
	);
}

/**
 * Format time remaining for error messages
 */
export function formatTimeRemaining(resetTime: number): string {
	const now = Date.now();
	const remaining = Math.ceil((resetTime - now) / 1000);

	if (remaining < 60) {
		return `${remaining} seconds`;
	}

	const minutes = Math.ceil(remaining / 60);
	return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}
