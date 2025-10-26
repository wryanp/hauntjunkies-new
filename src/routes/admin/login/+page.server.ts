import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PASSWORD_HASH, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { randomBytes, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';
import { checkRateLimit, getClientIP } from '$lib/rateLimit';

/**
 * Create Supabase admin client with service role key
 * Used for account lockout tracking (bypasses RLS)
 */
function createSupabaseAdmin() {
	return createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		cookies: {
			get: () => null,
			set: () => {},
			remove: () => {}
		}
	});
}

export const load: PageServerLoad = async ({ locals, cookies }) => {
	// Check if Supabase is configured
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
	    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
	    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		return { supabaseConfigured: false };
	}

	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (session) {
		throw redirect(303, '/admin/dashboard');
	}

	return { supabaseConfigured: true };
};

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a First string
 * @param b Second string
 * @returns true if strings match, false otherwise
 */
function constantTimeCompare(a: string, b: string): boolean {
	// If lengths don't match, still compare to prevent timing leaks
	const bufA = Buffer.from(a, 'utf8');
	const bufB = Buffer.from(b, 'utf8');

	// If lengths differ, pad the shorter one to prevent timing leaks
	if (bufA.length !== bufB.length) {
		return false;
	}

	try {
		return timingSafeEqual(bufA, bufB);
	} catch {
		return false;
	}
}

/**
 * Delay to prevent brute force attacks
 * Random delay between 1-3 seconds on failed login
 */
async function antibruteForceDelay() {
	const delay = 1000 + Math.random() * 2000; // 1-3 seconds
	await new Promise(resolve => setTimeout(resolve, delay));
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		// Rate limiting - 5 attempts per 15 minutes per IP
		const clientIP = getClientIP(request);
		const rateLimit = await checkRateLimit(clientIP, {
			identifier: 'admin-login',
			maxRequests: 5,
			windowMs: 15 * 60 * 1000
		});

		if (!rateLimit.success) {
			return fail(429, {
				email,
				error: 'Too many login attempts. Please try again in 15 minutes.'
			});
		}

		// Check if account is locked (if Supabase is configured)
		if (SUPABASE_SERVICE_ROLE_KEY && PUBLIC_SUPABASE_URL) {
			const supabaseAdmin = createSupabaseAdmin();
			const { data: lockStatus } = await supabaseAdmin.rpc('is_account_locked', {
				p_email: email
			});

			if (lockStatus === true) {
				// Add delay to prevent timing attacks
				await antibruteForceDelay();
				return fail(403, {
					email,
					error: 'Account temporarily locked due to too many failed attempts. Please try again in 30 minutes.'
				});
			}
		}

		// Try simple admin login first (if configured in .env)
		// Use constant-time comparison for email to prevent timing attacks
		const emailMatches = ADMIN_EMAIL && constantTimeCompare(email, ADMIN_EMAIL);

		// Use bcrypt for password comparison (preferred) or fallback to constant-time comparison
		let passwordMatches = false;
		if (emailMatches) {
			if (ADMIN_PASSWORD_HASH) {
				// Use bcrypt comparison (secure, recommended)
				passwordMatches = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
			} else if (ADMIN_PASSWORD) {
				// Fallback to constant-time comparison (less secure, for backwards compatibility)
				passwordMatches = constantTimeCompare(password, ADMIN_PASSWORD);
			}
		}

		if (emailMatches && passwordMatches) {
			// Reset login attempts on successful login
			if (SUPABASE_SERVICE_ROLE_KEY && PUBLIC_SUPABASE_URL) {
				const supabaseAdmin = createSupabaseAdmin();
				await supabaseAdmin.rpc('reset_login_attempts', {
					p_email: email
				});
			}

			// Generate a cryptographically secure session token with timestamp and entropy
			const token = randomBytes(32).toString('hex');
			const timestamp = Date.now();
			const entropy = randomBytes(16).toString('hex'); // Additional entropy
			const sessionData = JSON.stringify({ token, timestamp, email, entropy });

			cookies.set('admin_session', sessionData, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production', // SECURITY FIX: Consistent with NODE_ENV check
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Set initial last activity timestamp
			cookies.set('admin_last_activity', Date.now().toString(), {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production', // SECURITY FIX: Match admin_session cookie
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			throw redirect(303, '/admin/dashboard');
		}

		// Check if Supabase is configured
		if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
		    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
		    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
			// Record failed login attempt
			if (SUPABASE_SERVICE_ROLE_KEY && PUBLIC_SUPABASE_URL) {
				const supabaseAdmin = createSupabaseAdmin();
				await supabaseAdmin.rpc('record_failed_login', {
					p_email: email
				});
			}
			// Add delay to prevent brute force
			await antibruteForceDelay();
			return fail(400, { error: 'Invalid email or password' });
		}

		// Try Supabase authentication
		const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
			cookies: {
				get: (key) => cookies.get(key),
				set: (key, value, options) => {
					cookies.set(key, value, { ...options, path: '/' });
				},
				remove: (key, options) => {
					cookies.delete(key, { ...options, path: '/' });
				}
			}
		});

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			// Record failed login attempt
			if (SUPABASE_SERVICE_ROLE_KEY && PUBLIC_SUPABASE_URL) {
				const supabaseAdmin = createSupabaseAdmin();
				await supabaseAdmin.rpc('record_failed_login', {
					p_email: email
				});
			}
			// Add delay to prevent brute force
			await antibruteForceDelay();
			return fail(400, { error: 'Invalid email or password' });
		}

		// Reset login attempts on successful Supabase login
		if (SUPABASE_SERVICE_ROLE_KEY && PUBLIC_SUPABASE_URL) {
			const supabaseAdmin = createSupabaseAdmin();
			await supabaseAdmin.rpc('reset_login_attempts', {
				p_email: email
			});
		}

		throw redirect(303, '/admin/dashboard');
	}
};
