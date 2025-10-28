/**
 * One-time migration script to parse existing full addresses
 * into separate street, city, state, and ZIP fields
 *
 * Run with: node scripts/migrate-addresses.js
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
	} else if (addressParts.length === 1) {
		// Try to extract state from single part
		const stateMatch = addressParts[0].match(/([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/i);
		if (stateMatch) {
			state = stateMatch[1].toUpperCase();
			zip = stateMatch[2] || '';
		}
	}

	return { streetAddress, city, state, zip };
}

async function migrateAddresses() {
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
		console.log('✅ No reviews found to migrate.');
		return;
	}

	console.log(`Found ${reviews.length} reviews to process.\n`);

	let updated = 0;
	let skipped = 0;
	let failed = 0;

	for (const review of reviews) {
		// Skip if city and state are already populated
		if (review.city && review.state) {
			console.log(`⏭️  Skipping "${review.name}" - already has city/state`);
			skipped++;
			continue;
		}

		// Skip if no address to parse
		if (!review.address || !review.address.trim()) {
			console.log(`⚠️  Skipping "${review.name}" - no address to parse`);
			skipped++;
			continue;
		}

		console.log(`\n📝 Processing: ${review.name}`);
		console.log(`   Current address: ${review.address}`);

		const parsed = parseAddress(review.address);

		console.log(`   Parsed:`);
		console.log(`     Street: ${parsed.streetAddress || '(none)'}`);
		console.log(`     City: ${parsed.city || '(none)'}`);
		console.log(`     State: ${parsed.state || '(none)'}`);
		console.log(`     ZIP: ${parsed.zip || '(none)'}`);

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
	console.log('📊 Migration Summary:');
	console.log(`   ✅ Updated: ${updated}`);
	console.log(`   ⏭️  Skipped: ${skipped}`);
	console.log(`   ❌ Failed: ${failed}`);
	console.log(`   📝 Total: ${reviews.length}`);
	console.log('='.repeat(60));

	if (updated > 0) {
		console.log('\n✨ Migration completed successfully!');
		console.log('City and state should now display on review cards and detail pages.');
	}
}

// Run the migration
migrateAddresses().catch(error => {
	console.error('❌ Migration failed:', error);
	process.exit(1);
});
