import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';
import { randomBytes } from 'crypto';

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

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		// Try simple admin login first (if configured in .env)
		if (ADMIN_EMAIL && ADMIN_PASSWORD && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
			// Generate a secure session token with timestamp
			const token = randomBytes(32).toString('hex');
			const timestamp = Date.now();
			const sessionData = JSON.stringify({ token, timestamp, email });

			cookies.set('admin_session', sessionData, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});
			throw redirect(303, '/admin/dashboard');
		}

		// Check if Supabase is configured
		if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
		    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
		    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
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
			return fail(400, { error: 'Invalid email or password' });
		}

		throw redirect(303, '/admin/dashboard');
	}
};
