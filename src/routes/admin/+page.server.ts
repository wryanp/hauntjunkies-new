import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Redirect to dashboard since user is authenticated (layout would have redirected to login otherwise)
	throw redirect(303, '/admin/dashboard');
};
