import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	// Check for admin_session cookie (simple admin login)
	const adminSession = cookies.get('admin_session');

	// Check for Supabase session
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	const { data: { session } } = await supabase.auth.getSession();

	// User is authenticated if either admin_session cookie exists OR Supabase session exists
	return {
		isAuthenticated: !!(adminSession || session)
	};
};
