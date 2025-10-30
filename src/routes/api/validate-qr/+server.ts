import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// This API endpoint redirects to the visual validation page
// The actual validation logic is in /validate-qr/+page.server.ts
export const GET: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get('token');

	// Redirect to the visual confirmation page with the token
	throw redirect(302, `/validate-qr?token=${token || ''}`);
