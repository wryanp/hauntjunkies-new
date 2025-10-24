import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: LayoutServerLoad = async ({ url, cookies }) => {
	// Allow access to login page without authentication
	if (url.pathname === '/admin/login') {
		return { session: null, user: null };
	}

	// Try Supabase authentication FIRST
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
		// Clear old admin_session cookie if it exists
		cookies.delete('admin_session', { path: '/' });
		return {
			session,
			user: session.user
		};
	}

	// Fallback to simple admin session cookie (for backward compatibility)
	const adminSession = cookies.get('admin_session');
	const lastActivity = cookies.get('admin_last_activity');

	if (adminSession) {
		try {
			// Try parsing as JSON (new format with token and timestamp)
			const sessionData = JSON.parse(adminSession);
			const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds
			const inactivityLimit = 30 * 60 * 1000; // 30 minutes in milliseconds

			// Check if session has been inactive for more than 30 minutes
			if (lastActivity) {
				const lastActivityTime = parseInt(lastActivity);
				if (!isNaN(lastActivityTime) && (Date.now() - lastActivityTime) > inactivityLimit) {
					// Session expired due to inactivity
					cookies.delete('admin_session', { path: '/' });
					cookies.delete('admin_last_activity', { path: '/' });
					throw redirect(303, '/admin/login');
				}
			}

			// Validate timestamp - session expires after 7 days
			if (sessionData.timestamp && sessionData.token &&
			    (Date.now() - sessionData.timestamp) < maxAge) {
				// Update last activity timestamp
				cookies.set('admin_last_activity', Date.now().toString(), {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					maxAge: 60 * 60 * 24 * 7 // 7 days
				});

				return {
					session: { user: { email: sessionData.email || 'admin@hauntjunkies.com' } },
					user: { email: sessionData.email || 'admin@hauntjunkies.com' }
				};
			}
		} catch (e) {
			// Old format (just "authenticated" string) - for backward compatibility
			if (adminSession === 'authenticated') {
				// Update last activity for old format too
				cookies.set('admin_last_activity', Date.now().toString(), {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					maxAge: 60 * 60 * 24 * 7
				});

				return {
					session: { user: { email: 'admin@hauntjunkies.com' } },
					user: { email: 'admin@hauntjunkies.com' }
				};
			}
		}

		// Invalid or expired session - clear the cookie
		cookies.delete('admin_session', { path: '/' });
		cookies.delete('admin_last_activity', { path: '/' });
	}

	// No authentication found, redirect to login
	throw redirect(303, '/admin/login');
};
