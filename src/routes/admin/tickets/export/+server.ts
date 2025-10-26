import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	// Verify admin authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		throw error(401, 'Unauthorized');
	}

	// Create Supabase client with service role
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	// Fetch all ticket requests
	const { data: tickets, error: fetchError } = await supabase
		.from('ticket_requests')
		.select('*')
		.order('date', { ascending: true })
		.order('created_at', { ascending: true });

	if (fetchError) {
		throw error(500, 'Failed to fetch ticket data');
	}

	if (!tickets || tickets.length === 0) {
		throw error(404, 'No tickets found to export');
	}

	// Create CSV content
	const headers = ['Date', 'Name', 'Email', 'Tickets', 'Status', 'Confirmation Number', 'Created At'];
	const rows = tickets.map(ticket => {
		const name = ticket.first_name && ticket.last_name
			? `${ticket.first_name} ${ticket.last_name}`
			: ticket.name || 'Unknown';

		const date = ticket.date || ticket.preferred_date || 'N/A';
		const ticketCount = ticket.tickets || ticket.quantity || ticket.number_of_tickets || 0;
		const status = ticket.status || 'unknown';
		const confirmationNumber = ticket.confirmation_number || 'N/A';
		const createdAt = ticket.created_at
			? new Date(ticket.created_at).toLocaleString('en-US')
			: 'N/A';

		// Escape commas and quotes in CSV values
		const escapeCSV = (value: string | number) => {
			const str = String(value);
			if (str.includes(',') || str.includes('"') || str.includes('\n')) {
				return `"${str.replace(/"/g, '""')}"`;
			}
			return str;
		};

		return [
			escapeCSV(date),
			escapeCSV(name),
			escapeCSV(ticket.email || 'N/A'),
			escapeCSV(ticketCount),
			escapeCSV(status),
			escapeCSV(confirmationNumber),
			escapeCSV(createdAt)
		].join(',');
	});

	const csvContent = [headers.join(','), ...rows].join('\n');

	// Generate filename with current date
	const dateStr = new Date().toISOString().split('T')[0];
	const filename = `ticket-requests-${dateStr}.csv`;

	// Return CSV file
	return new Response(csvContent, {
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
