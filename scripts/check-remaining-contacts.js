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

async function checkContacts() {
	console.log('📧 Checking remaining contact messages...\n');

	const { data: contacts, error } = await supabase
		.from('contact_submissions')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('❌ Error fetching contacts:', error.message);
		process.exit(1);
	}

	if (!contacts || contacts.length === 0) {
		console.log('✅ No contact messages in database - clean!');
		return;
	}

	console.log(`Found ${contacts.length} contact messages:\n`);

	contacts.forEach((contact, index) => {
		console.log(`${index + 1}. ID: ${contact.id}`);
		console.log(`   Name: ${contact.name}`);
		console.log(`   Email: ${contact.email}`);
		console.log(`   Subject: ${contact.subject || 'No subject'}`);
		console.log(`   Message: ${contact.message?.substring(0, 100)}...`);
		console.log(`   Created: ${contact.created_at}`);
		console.log('');
	});

	// Ask which ones to delete
	console.log('\nThese appear to be test messages. Delete all? (The script will delete all remaining contacts)');
}

checkContacts().catch(console.error);
