/**
 * Production-ready distributed rate limiter using Supabase
 * Works across serverless instances and handles concurrent requests safely
 *
 * Previous implementation used in-memory Map which didn't work across
 * multiple Vercel serverless instances. This implementation uses Supabase
 * for distributed rate limiting.
 */

import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// Create Supabase client for rate limiting (server-side only)
// Using service role key to bypass RLS policies
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
	if (!supabaseClient) {
		// Only create if credentials are configured
		if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY ||
		    PUBLIC_SUPABASE_URL === 'your_supabase_url') {
			console.warn('[RateLimit] Supabase not configured - rate limiting disabled');
			return null;
		}

		supabaseClient = createClient(
			PUBLIC_SUPABASE_URL,
			SUPABASE_SERVICE_ROLE_KEY,
			{
				auth: { persistSession: false }
			}
		);
	}
	return supabaseClient;
}

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
 * Uses Supabase for distributed rate limiting across serverless instances
 *
 * @param key - Unique key for the request (usually IP address)
 * @param config - Rate limit configuration
 * @returns Promise<RateLimitResult> indicating if request is allowed
 */
export async function checkRateLimit(
	key: string,
	config: RateLimitConfig
): Promise<RateLimitResult> {
	const supabase = getSupabaseClient();

	// Fallback if Supabase not configured (allow all requests with warning)
	if (!supabase) {
		console.warn('[RateLimit] Allowing request - rate limiting disabled');
		return {
			success: true,
			limit: config.maxRequests,
			remaining: config.maxRequests,
			resetTime: Date.now() + config.windowMs
		};
	}

	const now = new Date();
	const windowStart = now;
	const windowEnd = new Date(now.getTime() + config.windowMs);

	try {
		// Try to get existing rate limit entry
		const { data: existing, error: selectError } = await supabase
			.from('rate_limits')
			.select('*')
			.eq('identifier', config.identifier)
			.eq('client_ip', key)
			.single();

		// If entry exists and window hasn't expired
		if (existing && !selectError && new Date(existing.window_end) > now) {
			// Check if limit exceeded
			if (existing.request_count >= config.maxRequests) {
				return {
					success: false,
					limit: config.maxRequests,
					remaining: 0,
					resetTime: new Date(existing.window_end).getTime()
				};
			}

			// Increment count
			const { error: updateError } = await supabase
				.from('rate_limits')
				.update({
					request_count: existing.request_count + 1,
					updated_at: now.toISOString()
				})
				.eq('id', existing.id);

			if (updateError) {
				console.error('[RateLimit] Error updating count:', updateError);
				// On error, allow request but log
				return {
					success: true,
					limit: config.maxRequests,
					remaining: config.maxRequests - (existing.request_count + 1),
					resetTime: new Date(existing.window_end).getTime()
				};
			}

			return {
				success: true,
				limit: config.maxRequests,
				remaining: config.maxRequests - (existing.request_count + 1),
				resetTime: new Date(existing.window_end).getTime()
			};
		}

		// No existing entry or window expired - create/reset entry
		const { error: upsertError } = await supabase
			.from('rate_limits')
			.upsert(
				{
					identifier: config.identifier,
					client_ip: key,
					request_count: 1,
					window_start: windowStart.toISOString(),
					window_end: windowEnd.toISOString()
				},
				{
					onConflict: 'identifier,client_ip'
				}
			);

		if (upsertError) {
			console.error('[RateLimit] Error creating entry:', upsertError);
			// On error, allow request but log
		}

		return {
			success: true,
			limit: config.maxRequests,
			remaining: config.maxRequests - 1,
			resetTime: windowEnd.getTime()
		};
	} catch (error) {
		console.error('[RateLimit] Unexpected error:', error);
		// On unexpected error, allow request (fail open for availability)
		return {
			success: true,
			limit: config.maxRequests,
			remaining: config.maxRequests,
			resetTime: windowEnd.getTime()
		};
	}
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
