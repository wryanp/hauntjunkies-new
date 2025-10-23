import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const actions: Actions = {
	default: async ({ cookies }) => {
		// Clear simple admin session
		cookies.delete('admin_session', { path: '/' });

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

		// Try to sign out from Supabase, but don't fail if it times out
		try {
			await supabase.auth.signOut();
		} catch (error) {
			console.error('Error signing out from Supabase (but will clear local cookies anyway):', error);
		}

		// Manually clear all Supabase-related cookies to ensure logout
		const allCookies = cookies.getAll();
		allCookies.forEach(cookie => {
			if (cookie.name.startsWith('sb-')) {
				cookies.delete(cookie.name, { path: '/' });
			}
		});

		throw redirect(303, '/admin/login');
	}
};
