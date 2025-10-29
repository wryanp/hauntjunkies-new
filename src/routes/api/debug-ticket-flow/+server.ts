import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { sendTicketConfirmation } from '$lib/email';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const GET: RequestHandler = async () => {
	try {
		console.log('[DEBUG] Starting ticket flow test');

		// Step 1: Call purchase_tickets with a valid future date
		const testDate = '2025-10-29'; // Today's date (should be available for testing)
		const { data: result, error: rpcError } = await supabase.rpc('purchase_tickets', {
			p_date: testDate,
			p_tickets: 1,
			p_name: 'Debug Test',
			p_first_name: 'Debug',
			p_last_name: 'Test',
			p_email: 'debug-test@example.com',
			p_confirmation_number: 'MCM-DEBUG-FLOW-' + Date.now()
		});

		console.log('[DEBUG] RPC result:', JSON.stringify(result));
		console.log('[DEBUG] RPC error:', rpcError);

		if (rpcError) {
			return json({
				step: 'purchase_tickets_call',
				error: rpcError.message,
				details: rpcError
			}, { status: 500 });
		}

		// Step 2: Extract ticket_id
		const ticketId = result?.ticket_id;
		console.log('[DEBUG] Extracted ticket_id:', ticketId);
		console.log('[DEBUG] ticket_id type:', typeof ticketId);
		console.log('[DEBUG] ticket_id exists?', !!ticketId);
		console.log('[DEBUG] Full result object:', result);

		// Step 3: Check if we can read it back from database
		let dbTicket = null;
		if (ticketId) {
			const { data: fetchedTicket } = await supabase
				.from('ticket_requests')
				.select('*')
				.eq('id', ticketId)
				.single();
			dbTicket = fetchedTicket;
			console.log('[DEBUG] Ticket from DB:', fetchedTicket);
		}

		// Step 4: Try to call sendTicketConfirmation with this ID
		console.log('[DEBUG] About to call sendTicketConfirmation with ticketRequestId:', ticketId);

		const emailResult = await sendTicketConfirmation({
			confirmationNumber: 'MCM-DEBUG-FLOW-' + Date.now(),
			firstName: 'Debug',
			lastName: 'Test',
			email: 'debug-test@example.com',
			date: testDate,
			startTime: '19:00:00',
			endTime: '22:00:00',
			tickets: 1,
			ticketRequestId: ticketId || undefined
		});

		console.log('[DEBUG] Email result:', emailResult);

		// Step 5: Check if QR code was created
		let qrCode = null;
		if (ticketId) {
			const { data: qrData } = await supabase
				.from('ticket_qr_codes')
				.select('*')
				.eq('ticket_request_id', ticketId)
				.maybeSingle();
			qrCode = qrData;
			console.log('[DEBUG] QR code created?', qrData);
		}

		return json({
			success: true,
			steps: {
				step1_rpc_call: {
					result: result,
					error: rpcError
				},
				step2_ticket_id_extraction: {
					ticketId: ticketId,
					ticketIdType: typeof ticketId,
					ticketIdExists: !!ticketId,
					ticketIdValue: String(ticketId)
				},
				step3_database_fetch: {
					ticket: dbTicket,
					foundInDb: !!dbTicket
				},
				step4_email_call: {
					ticketRequestIdPassed: ticketId,
					emailResult: emailResult,
					emailSuccess: emailResult.success
				},
				step5_qr_verification: {
					qrCode: qrCode,
					qrCodeCreated: !!qrCode
				}
			},
			conclusion: {
				ticketWasCreated: !!dbTicket,
				ticketIdWasReturned: !!ticketId,
				emailWasSent: emailResult.success,
				qrCodeWasGenerated: !!qrCode
			}
		});

	} catch (error) {
		console.error('[DEBUG] Error in debug flow:', error);
		return json({
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		}, { status: 500 });
	}
};
