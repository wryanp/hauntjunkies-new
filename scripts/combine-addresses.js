/**
 * Script to combine separate address fields back into full address
 *
 * Combines address, city, state, and zip into a single full address field
 * Format: "address, city, state zip"
 *
 * Run with: node scripts/combine-addresses.js
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
 * Combine address components into full address
 */
function combineAddress(streetAddress, city, state, zip) {
	const parts = [];

	if (streetAddress && streetAddress.trim()) {
		parts.push(streetAddress.trim());
	}

	if (city && city.trim()) {
		parts.push(city.trim());
	}

	// Combine state and zip
	if (state && state.trim()) {
		const stateZip = zip && zip.trim()
			? `${state.trim()} ${zip.trim()}`
			: state.trim();
		parts.push(stateZip);
	} else if (zip && zip.trim()) {
		parts.push(zip.trim());
	}

	return parts.join(', ');
}

async function combineAddresses() {
	console.log('🔍 Fetching all reviews...\n');

	// Fetch all reviews
	const { data: reviews, error } = await supabase
		.from('reviews')
		.select('id, name, address, city, state, zip')
		.order('name');

	if (error) {
		console.error('❌ Error fetching reviews:', error);
		process.exit(1);
	}

	if (!reviews || reviews.length === 0) {
		console.log('✅ No reviews found to process.');
		return;
	}

	console.log(`Found ${reviews.length} reviews to process.\n`);

	let updated = 0;
	let skipped = 0;
	let failed = 0;

	for (const review of reviews) {
		console.log(`\n📝 Processing: ${review.name}`);
		console.log(`   Current fields:`);
		console.log(`     address: ${review.address || '(empty)'}`);
		console.log(`     city: ${review.city || '(empty)'}`);
		console.log(`     state: ${review.state || '(empty)'}`);
		console.log(`     zip: ${review.zip || '(empty)'}`);

		// Combine into full address
		const fullAddress = combineAddress(
			review.address,
			review.city,
			review.state,
			review.zip
		);

		if (!fullAddress || !fullAddress.trim()) {
			console.log(`   ⚠️  No address data to combine - skipping`);
			skipped++;
			continue;
		}

		console.log(`   New full address: ${fullAddress}`);

		// Update the review
		const { error: updateError } = await supabase
			.from('reviews')
			.update({
				address: fullAddress
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
	console.log('📊 Summary:');
	console.log(`   ✅ Updated: ${updated}`);
	console.log(`   ⏭️  Skipped: ${skipped}`);
	console.log(`   ❌ Failed: ${failed}`);
	console.log(`   📝 Total: ${reviews.length}`);
	console.log('='.repeat(60));

	if (updated > 0) {
		console.log('\n✨ Address combining completed successfully!');
		console.log('All reviews now have full addresses in the address field.');
	}
}

// Run the script
combineAddresses().catch(error => {
	console.error('❌ Script failed:', error);
	process.exit(1);
});
