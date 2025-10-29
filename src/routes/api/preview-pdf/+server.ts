import type { RequestHandler } from './$types';
import { generateTicketPDF } from '$lib/pdfTicket';

export const GET: RequestHandler = async () => {
	try {
		// Generate a sample PDF with test data
		const pdfBuffer = await generateTicketPDF({
			confirmationNumber: 'MCM-20251029-SMPL',
			firstName: 'Preview',
			lastName: 'Test',
			email: 'preview@example.com',
			date: '2025-10-29',
			startTime: '19:00:00',
			endTime: '22:00:00',
			tickets: 2,
			ticketRequestId: '00000000-0000-0000-0000-000000000000' // Dummy UUID for preview
		});

		return new Response(pdfBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'inline; filename="McCloud-Manor-Ticket-Preview.pdf"',
				'Content-Length': pdfBuffer.length.toString()
			}
		});
	} catch (error) {
		console.error('Error generating preview PDF:', error);
		return new Response(JSON.stringify({
			error: 'Failed to generate PDF preview',
			details: error instanceof Error ? error.message : String(error)
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
