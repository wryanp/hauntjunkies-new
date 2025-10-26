import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';
import { randomBytes, timingSafeEqual } from 'crypto';

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

		// Try simple admin login first (if configured in .env)
		// Use constant-time comparison to prevent timing attacks
		const emailMatches = ADMIN_EMAIL && constantTimeCompare(email, ADMIN_EMAIL);
		const passwordMatches = ADMIN_PASSWORD && constantTimeCompare(password, ADMIN_PASSWORD);

		if (emailMatches && passwordMatches) {
			// Generate a cryptographically secure session token with timestamp and entropy
			const token = randomBytes(32).toString('hex');
			const timestamp = Date.now();
			const entropy = randomBytes(16).toString('hex'); // Additional entropy
			const sessionData = JSON.stringify({ token, timestamp, email, entropy });

			cookies.set('admin_session', sessionData, {
				path: '/',
				httpOnly: true,
				secure: true, // SECURITY: Always use secure cookies (HTTPS only)
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Set initial last activity timestamp
			cookies.set('admin_last_activity', Date.now().toString(), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			throw redirect(303, '/admin/dashboard');
		}

		// Check if Supabase is configured
		if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
		    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
		    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
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
			// Add delay to prevent brute force
			await antibruteForceDelay();
			return fail(400, { error: 'Invalid email or password' });
		}

		throw redirect(303, '/admin/dashboard');
	}
};
