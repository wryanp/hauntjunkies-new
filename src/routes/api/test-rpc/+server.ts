import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const GET: RequestHandler = async () => {
	try {
		// Call the purchase_tickets RPC function with test data
		const { data: result, error: rpcError } = await supabase.rpc('purchase_tickets', {
			p_date: '2025-10-29',
			p_tickets: 1,
			p_name: 'Test User',
			p_first_name: 'Test',
			p_last_name: 'User',
			p_email: 'test@example.com',
			p_confirmation_number: 'MCM-TEST-DEBUG'
		});

		return json({
			success: !rpcError,
			rpcError: rpcError || null,
			result: result,
			resultType: typeof result,
			resultKeys: result ? Object.keys(result) : [],
			ticketId: result?.ticket_id,
			ticketIdType: typeof result?.ticket_id
		});
	} catch (error) {
		return json({
			error: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
};
