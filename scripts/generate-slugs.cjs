#!/usr/bin/env node

/**
 * Generate slugs for all reviews with NULL slugs
 *
 * This script:
 * 1. Fetches all reviews with NULL slugs
 * 2. Generates URL-friendly slugs from review names
 * 3. Ensures uniqueness by appending numbers if needed
 * 4. Updates the reviews in Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Generate a URL-friendly slug from a review name
 * Example: "Woods Of Terror 2023" → "woods-of-terror-2023"
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    // Replace special characters and spaces with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-');
}

/**
 * Check if a slug already exists in the database
 */
async function slugExists(slug) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error;
  }

  return !!data;
}

/**
 * Generate a unique slug, appending a number if needed
 */
async function generateUniqueSlug(name, existingSlugs = new Set()) {
  let baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 2;

  // Check in-memory set first (for this batch)
  while (existingSlugs.has(slug) || await slugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  existingSlugs.add(slug);
  return slug;
}

async function generateAllSlugs() {
  console.log('🔍 Generating Slugs for All Reviews');
  console.log('='.repeat(60));
  console.log('');

  // Fetch all reviews with NULL slugs
  console.log('📊 Fetching reviews with NULL slugs...');
  const { data: reviews, error: fetchError } = await supabase
    .from('reviews')
    .select('id, name, slug')
    .is('slug', null);

  if (fetchError) {
    console.error('❌ Error fetching reviews:', fetchError.message);
    process.exit(1);
  }

  if (!reviews || reviews.length === 0) {
    console.log('✅ No reviews with NULL slugs found!');
    console.log('All reviews already have slugs.');
    return;
  }

  console.log(`📝 Found ${reviews.length} reviews needing slugs`);
  console.log('');

  const existingSlugs = new Set();
  const updates = [];
  let successCount = 0;
  let errorCount = 0;

  console.log('⚙️  Generating and updating slugs...');
  console.log('');

  // Process each review
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];

    try {
      // Generate unique slug
      const slug = await generateUniqueSlug(review.name, existingSlugs);

      // Update the review
      const { error: updateError } = await supabase
        .from('reviews')
        .update({ slug: slug })
        .eq('id', review.id);

      if (updateError) {
        console.error(`❌ Error updating "${review.name}":`, updateError.message);
        errorCount++;
      } else {
        updates.push({ name: review.name, slug });
        successCount++;

        // Log progress every 10 reviews
        if (successCount % 10 === 0) {
          console.log(`✅ Progress: ${successCount}/${reviews.length} slugs generated`);
        }
      }

    } catch (err) {
      console.error(`❌ Exception processing "${review.name}":`, err.message);
      errorCount++;
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('📊 Slug Generation Results');
  console.log('='.repeat(60));
  console.log(`✅ Successfully generated: ${successCount} slugs`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('');

  // Show some sample generated slugs
  if (updates.length > 0) {
    console.log('📝 Sample Generated Slugs (first 10):');
    console.log('-'.repeat(60));
    updates.slice(0, 10).forEach((update, idx) => {
      console.log(`${idx + 1}. "${update.name}"`);
      console.log(`   → ${update.slug}`);
    });
    console.log('');
  }

  // Verify all reviews now have slugs
  console.log('🔍 Verifying all reviews now have slugs...');
  const { count: remainingNulls, error: verifyError } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .is('slug', null);

  if (verifyError) {
    console.error('❌ Error during verification:', verifyError.message);
  } else {
    console.log(`📊 Reviews with NULL slugs: ${remainingNulls}`);

    if (remainingNulls === 0) {
      console.log('');
      console.log('🎉 SUCCESS! All reviews now have slugs!');
    } else {
      console.log('');
      console.log(`⚠️  Warning: ${remainingNulls} reviews still have NULL slugs`);
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ Slug Generation Complete!');
  console.log('='.repeat(60));
}

// Run the script
generateAllSlugs()
  .then(() => {
    console.log('');
    console.log('👋 Script finished successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('');
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
