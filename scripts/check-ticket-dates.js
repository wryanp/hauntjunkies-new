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

async function checkTicketDates() {
	console.log('🎫 Checking ticket_dates table...\n');

	const { data: dates, error, count } = await supabase
		.from('ticket_dates')
		.select('*', { count: 'exact' })
		.order('date', { ascending: true });

	if (error) {
		console.error('❌ Error fetching ticket dates:', error.message);
		process.exit(1);
	}

	console.log(`📊 Total ticket dates in database: ${count || 0}\n`);

	if (!dates || dates.length === 0) {
		console.log('⚠️  No ticket dates configured!');
		console.log('\nTo fix this, you need to:');
		console.log('1. Go to the admin panel at /admin/ticket-settings');
		console.log('2. Add available dates for ticket sales');
		console.log('3. Set capacity and availability for each date');
		console.log('\nOr run a script to add dates programmatically.');
		return;
	}

	const today = new Date().toISOString().split('T')[0];

	console.log('📅 All Ticket Dates:\n');
	dates.forEach((date, index) => {
		const isPast = date.date < today;
		const statusIcon = date.is_available ? '✅' : '❌';
		const pastIcon = isPast ? '⏰ PAST' : '';

		console.log(`${index + 1}. ${statusIcon} ${date.date} ${pastIcon}`);
		console.log(`   Capacity: ${date.capacity}`);
		console.log(`   Max per request: ${date.max_tickets_per_request}`);
		console.log(`   Available: ${date.is_available ? 'Yes' : 'No'}`);
		if (date.start_time) console.log(`   Time: ${date.start_time} - ${date.end_time}`);
		if (date.notes) console.log(`   Notes: ${date.notes}`);
		console.log('');
	});

	// Check available dates for future
	const availableFutureDates = dates.filter(d => d.is_available && d.date >= today);

	console.log('\n' + '='.repeat(50));
	console.log('📊 SUMMARY');
	console.log('='.repeat(50));
	console.log(`Total dates: ${dates.length}`);
	console.log(`Available future dates: ${availableFutureDates.length}`);
	console.log('='.repeat(50));

	if (availableFutureDates.length === 0) {
		console.log('\n⚠️  NO AVAILABLE FUTURE DATES!');
		console.log('\nThis is why the Reserve Tickets button is grayed out.');
		console.log('You need to add available dates in the admin panel.');
	} else {
		console.log('\n✅ Ticket dates are configured correctly!');
	}
}

checkTicketDates().catch(console.error);
