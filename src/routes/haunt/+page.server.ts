import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// 301 permanent redirect to new /mccloudmanor route
	throw redirect(301, '/mccloudmanor');
};
