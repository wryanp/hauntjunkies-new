#!/usr/bin/env node

/**
 * Verify caption field migration was successful
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

async function verifyCaptionFix() {
  console.log('🔍 Verifying Caption Field Migration');
  console.log('='.repeat(60));
  console.log('');

  // Get all reviews
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('id, name, caption, description, review_text')
    .order('name')
    .limit(10);

  if (error) {
    console.error('❌ Error fetching reviews:', error.message);
    process.exit(1);
  }

  console.log('📊 Sample Reviews (first 10):');
  console.log('-'.repeat(60));
  console.log('');

  reviews.forEach((review, idx) => {
    console.log(`${idx + 1}. ${review.name}`);
    console.log(`   Caption: ${review.caption ? (review.caption.substring(0, 60) + '...') : 'NULL'}`);
    console.log(`   Description: ${review.description || 'NULL'}`);
    console.log(`   Review Text Length: ${review.review_text ? review.review_text.length : 0} chars`);
    console.log('');
  });

  // Count stats
  const { count: totalCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true });

  const { count: captionCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .not('caption', 'is', null);

  const { count: descriptionCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .not('description', 'is', null);

  console.log('='.repeat(60));
  console.log('📊 Migration Results');
  console.log('='.repeat(60));
  console.log(`Total Reviews: ${totalCount}`);
  console.log(`Reviews with Caption: ${captionCount} ${captionCount === totalCount ? '✅' : '⚠️'}`);
  console.log(`Reviews with Description: ${descriptionCount} ${descriptionCount === 0 ? '✅' : '⚠️'}`);
  console.log('');

  if (captionCount === totalCount && descriptionCount === 0) {
    console.log('🎉 SUCCESS! All reviews have caption, description is NULL');
  } else {
    console.log('⚠️  Warning: Migration may not be complete');
  }

  console.log('='.repeat(60));
}

verifyCaptionFix()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Error:', err);
    process.exit(1);
  });
