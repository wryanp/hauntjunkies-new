#!/usr/bin/env node

/**
 * Post-migration verification script
 * Runs verification queries against Supabase to confirm migration success
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

async function verify() {
  console.log('📊 Post-Migration Verification');
  console.log('='.repeat(60));
  console.log('');

  // 1. Count total reviews
  console.log('1️⃣  Total Reviews Count:');
  const { count: totalCount, error: countError } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('   ❌ Error:', countError.message);
  } else {
    console.log(`   ✅ Total reviews: ${totalCount}`);
    console.log(`   📌 Expected: 90`);
    if (totalCount === 90) {
      console.log('   🎉 SUCCESS! Count matches!');
    } else {
      console.log(`   ⚠️  Warning: Count mismatch (got ${totalCount}, expected 90)`);
    }
  }
  console.log('');

  // 2. Check featured reviews
  console.log('2️⃣  Featured Reviews:');
  const { count: featuredCount, error: featuredError } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('featured', true);

  if (featuredError) {
    console.error('   ❌ Error:', featuredError.message);
  } else {
    console.log(`   ⭐ Featured reviews: ${featuredCount}`);
  }
  console.log('');

  // 3. Check NULL slugs
  console.log('3️⃣  NULL Slugs Check:');
  const { count: nullSlugCount, error: slugError } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .is('slug', null);

  if (slugError) {
    console.error('   ❌ Error:', slugError.message);
  } else {
    console.log(`   🔍 Reviews with NULL slugs: ${nullSlugCount}`);
    if (nullSlugCount > 0) {
      console.log('   ⚠️  Note: These will need slugs generated');
    }
  }
  console.log('');

  // 4. Sample reviews
  console.log('4️⃣  Sample Reviews (5 most recent):');
  const { data: samples, error: sampleError } = await supabase
    .from('reviews')
    .select('name, city, state, year, rating_overall, featured')
    .order('created_at', { ascending: false })
    .limit(5);

  if (sampleError) {
    console.error('   ❌ Error:', sampleError.message);
  } else if (samples && samples.length > 0) {
    samples.forEach((review, idx) => {
      console.log(`   ${idx + 1}. ${review.name} (${review.city}, ${review.state}) - ${review.year}`);
      console.log(`      Rating: ${review.rating_overall || 'N/A'} | Featured: ${review.featured ? 'Yes' : 'No'}`);
    });
  }
  console.log('');

  // 5. Date range
  console.log('5️⃣  Year Range:');
  const { data: yearData, error: yearError } = await supabase
    .from('reviews')
    .select('year')
    .order('year', { ascending: true });

  if (yearError) {
    console.error('   ❌ Error:', yearError.message);
  } else if (yearData && yearData.length > 0) {
    const years = yearData.map(r => r.year).filter(y => y != null);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    console.log(`   📅 Year range: ${minYear} - ${maxYear}`);
    console.log(`   📌 Expected: 2016-2023 range`);
  }
  console.log('');

  // 6. Social media URLs
  console.log('6️⃣  Social Media URL Distribution:');
  const { data: allReviews, error: urlError } = await supabase
    .from('reviews')
    .select('website_url, facebook_url, twitter_url, instagram_url, youtube_url');

  if (urlError) {
    console.error('   ❌ Error:', urlError.message);
  } else if (allReviews) {
    const total = allReviews.length;
    const hasWebsite = allReviews.filter(r => r.website_url).length;
    const hasFacebook = allReviews.filter(r => r.facebook_url).length;
    const hasTwitter = allReviews.filter(r => r.twitter_url).length;
    const hasInstagram = allReviews.filter(r => r.instagram_url).length;
    const hasYoutube = allReviews.filter(r => r.youtube_url).length;

    console.log(`   🌐 Total reviews: ${total}`);
    console.log(`   🌐 With website: ${hasWebsite}`);
    console.log(`   📘 With Facebook: ${hasFacebook}`);
    console.log(`   🐦 With Twitter: ${hasTwitter}`);
    console.log(`   📷 With Instagram: ${hasInstagram}`);
    console.log(`   📺 With YouTube: ${hasYoutube}`);
  }
  console.log('');

  console.log('='.repeat(60));
  console.log('✅ Verification Complete!');
  console.log('='.repeat(60));
}

verify()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
