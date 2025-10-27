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

async function deleteAllTestContacts() {
	console.log('🗑️  Deleting all remaining test contact messages...\n');

	// Delete contacts from vilonte1@gmail.com (test email)
	const { error: error1 } = await supabase
		.from('contact_submissions')
		.delete()
		.eq('email', 'vilonte1@gmail.com');

	if (error1) {
		console.error('❌ Error deleting vilonte1@gmail.com contacts:', error1.message);
	} else {
		console.log('✅ Deleted contacts from vilonte1@gmail.com');
	}

	// Delete contacts from timjim@jim.com (test email)
	const { error: error2 } = await supabase
		.from('contact_submissions')
		.delete()
		.eq('email', 'timjim@jim.com');

	if (error2) {
		console.error('❌ Error deleting timjim@jim.com contacts:', error2.message);
	} else {
		console.log('✅ Deleted contacts from timjim@jim.com');
	}

	// Verify cleanup
	const { count } = await supabase
		.from('contact_submissions')
		.select('*', { count: 'exact', head: true });

	console.log('\n📊 Final Database State:');
	console.log(`   Contact Messages: ${count || 0} records`);

	if (count === 0) {
		console.log('\n✅ All test contact messages deleted! Database is clean.');
	}
}

deleteAllTestContacts().catch(console.error);
