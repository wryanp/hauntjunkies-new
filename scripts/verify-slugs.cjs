#!/usr/bin/env node

/**
 * Verify all reviews have unique slugs
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyUniqueSlugs() {
  console.log('🔍 Verifying Slug Uniqueness');
  console.log('='.repeat(60));
  console.log('');

  // 1. Check for NULL slugs
  const { count: nullCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .is('slug', null);

  console.log(`1️⃣  NULL Slugs: ${nullCount}`);
  if (nullCount === 0) {
    console.log('   ✅ No NULL slugs found');
  } else {
    console.log(`   ❌ ${nullCount} reviews still have NULL slugs`);
  }
  console.log('');

  // 2. Check for duplicate slugs
  const { data: allSlugs } = await supabase
    .from('reviews')
    .select('slug, name');

  if (allSlugs) {
    const slugCounts = {};
    allSlugs.forEach(review => {
      if (review.slug) {
        slugCounts[review.slug] = (slugCounts[review.slug] || 0) + 1;
      }
    });

    const duplicates = Object.entries(slugCounts)
      .filter(([slug, count]) => count > 1);

    console.log(`2️⃣  Duplicate Slugs: ${duplicates.length}`);
    if (duplicates.length === 0) {
      console.log('   ✅ All slugs are unique');
    } else {
      console.log('   ❌ Found duplicate slugs:');
      duplicates.forEach(([slug, count]) => {
        console.log(`   - "${slug}": ${count} occurrences`);
      });
    }
    console.log('');

    // 3. Show total count
    console.log(`3️⃣  Total Reviews: ${allSlugs.length}`);
    console.log(`   Total with slugs: ${allSlugs.filter(r => r.slug).length}`);
    console.log('');

    // 4. Sample slugs
    console.log('4️⃣  Sample Slugs (first 5):');
    allSlugs.slice(0, 5).forEach((review, idx) => {
      console.log(`   ${idx + 1}. ${review.slug || 'NULL'}`);
      console.log(`      (${review.name})`);
    });
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ Verification Complete');
  console.log('='.repeat(60));
}

verifyUniqueSlugs()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Error:', err);
    process.exit(1);
  });
