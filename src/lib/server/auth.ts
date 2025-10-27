/**
 * Server-side authentication utilities for admin routes
 */
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

/**
 * Verify admin authentication by checking both:
 * 1. Supabase Auth session (current auth system)
 * 2. Legacy admin_session cookie (for backwards compatibility)
 *
 * @param cookies - SvelteKit cookies object
 * @returns Promise<boolean> - true if authenticated, false otherwise
 */
export async function verifyAdminAuth(cookies: any): Promise<boolean> {
	// Check Supabase session first
	const supabaseClient = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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

	const { data: { session } } = await supabaseClient.auth.getSession();
	if (session) return true;

	// Fallback to admin_session cookie
	const adminSession = cookies.get('admin_session');
	return !!adminSession;
}
