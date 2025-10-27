import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials in .env file');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteMockTickets() {
	console.log('🔍 Checking for mock ticket data...\n');

	// Get all ticket requests
	const { data: tickets, error: fetchError } = await supabase
		.from('ticket_requests')
		.select('*')
		.order('created_at', { ascending: false });

	if (fetchError) {
		console.error('❌ Error fetching tickets:', fetchError.message);
		process.exit(1);
	}

	if (!tickets || tickets.length === 0) {
		console.log('✅ No tickets found in database - already clean!');
		return;
	}

	console.log(`📊 Found ${tickets.length} ticket records:\n`);

	// Display all tickets
	tickets.forEach((ticket, index) => {
		console.log(`${index + 1}. ID: ${ticket.id}`);
		console.log(`   Name: ${ticket.name || ticket.first_name + ' ' + ticket.last_name}`);
		console.log(`   Email: ${ticket.email}`);
		console.log(`   Date: ${ticket.date || ticket.preferred_date}`);
		console.log(`   Created: ${ticket.created_at}`);
		console.log('');
	});

	// Identify potential mock data (tickets with mock emails, test data, etc.)
	const mockTickets = tickets.filter(ticket => {
		const email = ticket.email?.toLowerCase() || '';
		const name = ticket.name?.toLowerCase() || '';
		const firstName = ticket.first_name?.toLowerCase() || '';

		// Identify mock/test data patterns
		return (
			email.includes('test') ||
			email.includes('mock') ||
			email.includes('demo') ||
			email.includes('sample') ||
			email.includes('example') ||
			email.includes('@email.com') || // Generic email domain
			name.includes('test') ||
			name.includes('mock') ||
			firstName.includes('test')
		);
	});

	if (mockTickets.length === 0) {
		console.log('✅ No mock/test tickets identified - all tickets appear to be real!');
		return;
	}

	console.log(`⚠️  Identified ${mockTickets.length} potential mock/test tickets:\n`);

	mockTickets.forEach((ticket, index) => {
		console.log(`${index + 1}. ${ticket.name || ticket.first_name + ' ' + ticket.last_name} (${ticket.email})`);
	});

	console.log('\n🗑️  Deleting mock tickets...\n');

	// Delete mock tickets
	const mockIds = mockTickets.map(t => t.id);

	const { error: deleteError } = await supabase
		.from('ticket_requests')
		.delete()
		.in('id', mockIds);

	if (deleteError) {
		console.error('❌ Error deleting mock tickets:', deleteError.message);
		process.exit(1);
	}

	console.log(`✅ Successfully deleted ${mockTickets.length} mock ticket records!`);
	console.log('\n📊 Remaining tickets in database:');

	const remainingCount = tickets.length - mockTickets.length;
	console.log(`   Total: ${remainingCount} real ticket${remainingCount === 1 ? '' : 's'}`);
}

deleteMockTickets().catch(console.error);
