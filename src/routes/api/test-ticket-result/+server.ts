import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const GET: RequestHandler = async () => {
	try {
		// Get the most recent ticket
		const { data: recentTickets, error } = await supabase
			.from('ticket_requests')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(1);

		if (error) throw error;

		if (!recentTickets || recentTickets.length === 0) {
			return json({ error: 'No tickets found' });
		}

		const ticket = recentTickets[0];

		// Check if this ticket has a QR code
		const { data: qrCodes, error: qrError } = await supabase
			.from('ticket_qr_codes')
			.select('*')
			.eq('ticket_request_id', ticket.id);

		return json({
			ticket: {
				id: ticket.id,
				confirmation_number: ticket.confirmation_number,
				first_name: ticket.first_name,
				last_name: ticket.last_name,
				created_at: ticket.created_at
			},
			qrCodes: qrCodes || [],
			hasQRCode: qrCodes && qrCodes.length > 0
		});
	} catch (error) {
		return json({
			error: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
};
