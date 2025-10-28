/**
 * Script to fix the 7 reviews with incomplete addresses
 *
 * Run with: node scripts/fix-incomplete-addresses.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing environment variables!');
	console.error('Make sure PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Parse full address into components
 */
function parseAddress(fullAddress) {
	if (!fullAddress || !fullAddress.trim()) {
		return { streetAddress: '', city: '', state: '', zip: '' };
	}

	let city = '';
	let state = '';
	let zip = '';
	let streetAddress = fullAddress;

	const addressParts = fullAddress.split(',').map(p => p.trim());

	if (addressParts.length >= 3) {
		// Format: "Street, City, State ZIP"
		streetAddress = addressParts[0];
		city = addressParts[addressParts.length - 2];
		const lastPart = addressParts[addressParts.length - 1];

		// Extract state and ZIP
		const stateZipMatch = lastPart.match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/i);
		if (stateZipMatch) {
			state = stateZipMatch[1].toUpperCase();
			zip = stateZipMatch[2] || '';
		}
	} else if (addressParts.length === 2) {
		// Format: "City, State ZIP"
		city = addressParts[0];
		const lastPart = addressParts[1];
		const stateZipMatch = lastPart.match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/i);
		if (stateZipMatch) {
			state = stateZipMatch[1].toUpperCase();
			zip = stateZipMatch[2] || '';
		}
		streetAddress = '';
	}

	return { streetAddress, city, state, zip };
}

// Map of review names to their complete addresses
const addressUpdates = {
	'Woods Of Terror 2023': '5601 N Church St, Greensboro, NC 27455',
	'Extreme Fear ScareGrounds 2023': '401 Fairgrounds Rd, Kinston, NC 28504',
	'Hollerin Haunts Hayride 2023': '2914 Bud Johnson Rd, Clinton, NC 28328',
	'Kersey Valley Spookywoods 2023': '1615 Kersey Valley Rd, Archdale, NC 27263',
	'Lake Hickory Haunts 2023': '520 Carolina Ave, Hickory, NC 28601',
	'Rotten Manor 2022': '13245 Dixie Hwy, Holly, MI 48442',
	'The Haunted Farm 2023': '624 Townsend Rd, Hendersonville, NC 28792'
};

async function fixIncompleteAddresses() {
	console.log('🔧 Fixing incomplete addresses for 7 reviews...\n');

	let updated = 0;
	let notFound = 0;
	let failed = 0;

	for (const [reviewName, fullAddress] of Object.entries(addressUpdates)) {
		console.log(`\n📝 Processing: ${reviewName}`);

		// Find the review by name
		const { data: reviews, error: fetchError } = await supabase
			.from('reviews')
			.select('id, name, address, city, state, zip')
			.eq('name', reviewName)
			.limit(1);

		if (fetchError) {
			console.error(`   ❌ Error fetching review: ${fetchError.message}`);
			failed++;
			continue;
		}

		if (!reviews || reviews.length === 0) {
			console.error(`   ⚠️  Review not found in database`);
			notFound++;
			continue;
		}

		const review = reviews[0];
		console.log(`   Current address: ${review.address || '(empty)'}`);
		console.log(`   Current city: ${review.city || '(empty)'}`);
		console.log(`   Current state: ${review.state || '(empty)'}`);
		console.log(`   Current zip: ${review.zip || '(empty)'}`);
		console.log(`   New full address: ${fullAddress}`);

		// Parse the full address
		const parsed = parseAddress(fullAddress);

		console.log(`   Parsed components:`);
		console.log(`     Street: ${parsed.streetAddress}`);
		console.log(`     City: ${parsed.city}`);
		console.log(`     State: ${parsed.state}`);
		console.log(`     ZIP: ${parsed.zip}`);

		// Update the review
		const { error: updateError } = await supabase
			.from('reviews')
			.update({
				address: parsed.streetAddress,
				city: parsed.city,
				state: parsed.state,
				zip: parsed.zip
			})
			.eq('id', review.id);

		if (updateError) {
			console.error(`   ❌ Failed to update: ${updateError.message}`);
			failed++;
		} else {
			console.log(`   ✅ Updated successfully`);
			updated++;
		}
	}

	console.log('\n' + '='.repeat(60));
	console.log('📊 Fix Summary:');
	console.log(`   ✅ Updated: ${updated}`);
	console.log(`   ⚠️  Not Found: ${notFound}`);
	console.log(`   ❌ Failed: ${failed}`);
	console.log(`   📝 Total Attempted: ${Object.keys(addressUpdates).length}`);
	console.log('='.repeat(60));

	if (updated === Object.keys(addressUpdates).length) {
		console.log('\n✨ All addresses fixed successfully!');
		console.log('City and state should now display correctly on all review cards and detail pages.');
	} else if (updated > 0) {
		console.log(`\n⚠️  Partial success: ${updated} out of ${Object.keys(addressUpdates).length} reviews updated.`);
		if (notFound > 0) {
			console.log(`${notFound} reviews were not found - they may have been renamed or deleted.`);
		}
	} else {
		console.log('\n❌ No reviews were updated. Please check the errors above.');
	}
}

// Run the fix
fixIncompleteAddresses().catch(error => {
	console.error('❌ Script failed:', error);
	process.exit(1);
});
