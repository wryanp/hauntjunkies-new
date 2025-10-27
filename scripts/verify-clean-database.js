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

async function verifyCleanDatabase() {
	console.log('🔍 Verifying production database is clean of test data...\n');

	// Check ticket_requests
	const { data: tickets, count: ticketCount } = await supabase
		.from('ticket_requests')
		.select('*', { count: 'exact' });

	console.log('🎫 Ticket Requests:');
	console.log(`   Total: ${ticketCount || 0} records`);
	if (ticketCount === 0) {
		console.log('   ✅ Clean - no test data');
	} else {
		console.log('   ⚠️  Still has data:');
		tickets?.forEach((t, i) => {
			console.log(`   ${i + 1}. ${t.name} (${t.email})`);
		});
	}

	// Check contact_submissions
	const { data: contacts, count: contactCount } = await supabase
		.from('contact_submissions')
		.select('*', { count: 'exact' });

	console.log('\n📧 Contact Submissions:');
	console.log(`   Total: ${contactCount || 0} records`);
	if (contactCount === 0) {
		console.log('   ✅ Clean - no test data');
	} else {
		console.log('   ⚠️  Still has data:');
		contacts?.forEach((c, i) => {
			console.log(`   ${i + 1}. ${c.name} (${c.email})`);
		});
	}

	// Check review_comments
	const { count: commentCount } = await supabase
		.from('review_comments')
		.select('*', { count: 'exact', head: true });

	console.log('\n💬 Review Comments:');
	console.log(`   Total: ${commentCount || 0} records`);

	// Check reviews
	const { count: reviewCount } = await supabase
		.from('reviews')
		.select('*', { count: 'exact', head: true });

	console.log('\n⭐ Reviews:');
	console.log(`   Total: ${reviewCount || 0} records`);

	// Final summary
	console.log('\n' + '='.repeat(50));
	console.log('📊 PRODUCTION DATABASE STATUS');
	console.log('='.repeat(50));
	console.log(`Ticket Requests:      ${ticketCount || 0} (${ticketCount === 0 ? '✅ Clean' : '⚠️  Has data'})`);
	console.log(`Contact Messages:     ${contactCount || 0} (${contactCount === 0 ? '✅ Clean' : '⚠️  Has data'})`);
	console.log(`Review Comments:      ${commentCount || 0}`);
	console.log(`Reviews:              ${reviewCount || 0}`);
	console.log('='.repeat(50));

	if (ticketCount === 0 && contactCount === 0) {
		console.log('\n✅ SUCCESS! Database is clean of all test/mock data.');
		console.log('   Dashboard will now show empty states for tickets and contact messages.');
	}
}

verifyCleanDatabase().catch(console.error);
