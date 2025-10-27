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

async function deleteTestData() {
	console.log('🧹 Cleaning up test data from production database...\n');

	// Delete test tickets
	console.log('🎫 Checking ticket_requests table...');

	const { data: tickets, error: ticketFetchError } = await supabase
		.from('ticket_requests')
		.select('*');

	if (ticketFetchError) {
		console.error('❌ Error fetching tickets:', ticketFetchError.message);
	} else if (tickets && tickets.length > 0) {
		console.log(`   Found ${tickets.length} ticket records`);

		// Delete all tickets with hauntjunkies@gmail.com email (test data)
		const { error: ticketDeleteError, count } = await supabase
			.from('ticket_requests')
			.delete()
			.eq('email', 'hauntjunkies@gmail.com');

		if (ticketDeleteError) {
			console.error('❌ Error deleting tickets:', ticketDeleteError.message);
		} else {
			console.log(`   ✅ Deleted all test tickets with hauntjunkies@gmail.com`);
		}
	} else {
		console.log('   ✅ No tickets found - already clean!');
	}

	// Delete test contact messages
	console.log('\n📧 Checking contact_submissions table...');

	const { data: contacts, error: contactFetchError } = await supabase
		.from('contact_submissions')
		.select('*');

	if (contactFetchError) {
		console.error('❌ Error fetching contact messages:', contactFetchError.message);
	} else if (contacts && contacts.length > 0) {
		console.log(`   Found ${contacts.length} contact message records`);

		contacts.forEach((contact, index) => {
			console.log(`   ${index + 1}. ${contact.name} (${contact.email}) - ${contact.subject || 'No subject'}`);
		});

		// Delete all contact messages with hauntjunkies@gmail.com email (test data)
		const { error: contactDeleteError } = await supabase
			.from('contact_submissions')
			.delete()
			.eq('email', 'hauntjunkies@gmail.com');

		if (contactDeleteError) {
			console.error('❌ Error deleting contact messages:', contactDeleteError.message);
		} else {
			console.log(`   ✅ Deleted all test contact messages with hauntjunkies@gmail.com`);
		}
	} else {
		console.log('   ✅ No contact messages found - already clean!');
	}

	// Check for any other test patterns
	console.log('\n🔍 Checking for other test data patterns...');

	const testPatterns = ['test@', 'demo@', 'sample@', 'mock@', 'example@'];

	for (const pattern of testPatterns) {
		const { data: testTickets } = await supabase
			.from('ticket_requests')
			.select('email')
			.ilike('email', `${pattern}%`);

		if (testTickets && testTickets.length > 0) {
			console.log(`   ⚠️  Found ${testTickets.length} tickets with "${pattern}" emails`);

			const { error } = await supabase
				.from('ticket_requests')
				.delete()
				.ilike('email', `${pattern}%`);

			if (!error) {
				console.log(`   ✅ Deleted tickets with "${pattern}" emails`);
			}
		}

		const { data: testContacts } = await supabase
			.from('contact_submissions')
			.select('email')
			.ilike('email', `${pattern}%`);

		if (testContacts && testContacts.length > 0) {
			console.log(`   ⚠️  Found ${testContacts.length} contact messages with "${pattern}" emails`);

			const { error } = await supabase
				.from('contact_submissions')
				.delete()
				.ilike('email', `${pattern}%`);

			if (!error) {
				console.log(`   ✅ Deleted contact messages with "${pattern}" emails`);
			}
		}
	}

	// Final summary
	console.log('\n📊 Final Database State:');

	const { count: ticketCount } = await supabase
		.from('ticket_requests')
		.select('*', { count: 'exact', head: true });

	const { count: contactCount } = await supabase
		.from('contact_submissions')
		.select('*', { count: 'exact', head: true });

	console.log(`   Tickets: ${ticketCount || 0} records`);
	console.log(`   Contact Messages: ${contactCount || 0} records`);

	console.log('\n✅ Test data cleanup complete!');
}

deleteTestData().catch(console.error);
