import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return {
			showScanner: true
		};
	}

	try {
		// Call PostgreSQL function to validate and mark QR code as used (atomic operation)
		const { data: result, error } = await supabase.rpc('validate_qr_code', {
			p_qr_token: token
		});

		if (error) {
			console.error('QR validation error:', error);
			return {
				valid: false,
				error: 'Database error',
				message: 'Failed to validate QR code'
			};
		}

		// Return the validation result with ticket details
		return {
			valid: result.valid,
			message: result.message,
			ticketInfo: result.ticket_info || null,
			scannedAt: new Date().toISOString()
		};
	} catch (error) {
		console.error('QR validation exception:', error);
		return {
			valid: false,
			error: 'System error',
			message: 'Internal server error'
		};
	}
};
