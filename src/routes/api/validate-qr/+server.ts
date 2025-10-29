import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// Initialize Supabase client with service role key for database access
const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

export const GET: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get('token');

	// Validate token parameter
	if (!token) {
		return json({
			valid: false,
			error: 'Missing QR token'
		}, { status: 400 });
	}

	try {
		// Call PostgreSQL function to validate and mark QR code as used (atomic operation)
		const { data: result, error } = await supabase.rpc('validate_qr_code', {
			p_qr_token: token
		});

		if (error) {
			console.error('QR validation error:', error);
			return json({
				valid: false,
				error: 'Failed to validate QR code'
			}, { status: 500 });
		}

		// Return the validation result from the database function
		return json(result, {
			status: result.valid ? 200 : 400
		});
	} catch (error) {
		console.error('QR validation exception:', error);
		return json({
			valid: false,
			error: 'Internal server error'
		}, { status: 500 });
	}
};
