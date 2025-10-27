#!/usr/bin/env node

/**
 * Scrape full review text from live hauntjunkies.com site
 * and update the database with complete review content
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LIVE_SITE = 'https://hauntjunkies.com';

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

/**
 * Fetch HTML from a URL
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Extract review text from HTML
 * This looks for the main review content in the page
 */
function extractReviewText(html, reviewName) {
  // Remove script and style tags
  let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Look for common review content patterns
  // This is a basic extraction - may need refinement based on actual HTML structure

  // Try to find article content
  let articleMatch = cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    return cleanHtml(articleMatch[1]);
  }

  // Try to find main content
  let mainMatch = cleaned.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    return cleanHtml(mainMatch[1]);
  }

  // Try to find content with specific class (common in Heroku apps)
  let contentMatch = cleaned.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (contentMatch) {
    return cleanHtml(contentMatch[1]);
  }

  return null;
}

/**
 * Clean extracted HTML
 */
function cleanHtml(html) {
  return html
    .trim()
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Clean up common navigation/footer elements
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
}

/**
 * Scrape all reviews from the live site
 */
async function scrapeReviews() {
  console.log('🌐 Scraping Full Review Text from hauntjunkies.com');
  console.log('='.repeat(60));
  console.log('');

  // Get all reviews from database
  console.log('📊 Fetching reviews from database...');
  const { data: reviews, error: fetchError } = await supabase
    .from('reviews')
    .select('id, name, slug, review_text, website_url')
    .order('name');

  if (fetchError) {
    console.error('❌ Error fetching reviews:', fetchError.message);
    process.exit(1);
  }

  console.log(`📝 Found ${reviews.length} reviews to process`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  let updatedCount = 0;

  console.log('🔍 Scraping individual review pages...');
  console.log('This may take several minutes...');
  console.log('');

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];

    // Skip if no slug
    if (!review.slug) {
      console.log(`⚠️  Skipping "${review.name}" - no slug`);
      skippedCount++;
      continue;
    }

    try {
      const url = `${LIVE_SITE}/reviews/${review.slug}`;

      // Fetch the review page
      console.log(`[${i + 1}/${reviews.length}] Fetching: ${review.name}`);

      const html = await fetchUrl(url);
      const reviewText = extractReviewText(html, review.name);

      if (!reviewText || reviewText.length < 100) {
        console.log(`   ⚠️  Could not extract review text (got ${reviewText?.length || 0} chars)`);
        errorCount++;
        continue;
      }

      // Compare with current database text
      const currentLength = review.review_text?.length || 0;
      const newLength = reviewText.length;

      if (newLength > currentLength) {
        // Update database
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ review_text: reviewText })
          .eq('id', review.id);

        if (updateError) {
          console.log(`   ❌ Error updating: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Updated (${currentLength} → ${newLength} chars)`);
          updatedCount++;
          successCount++;
        }
      } else {
        console.log(`   ℹ️  Kept existing (${currentLength} chars >= ${newLength} chars)`);
        successCount++;
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('📊 Scraping Results');
  console.log('='.repeat(60));
  console.log(`✅ Successfully processed: ${successCount}`);
  console.log(`📝 Updated with new text: ${updatedCount}`);
  console.log(`⚠️  Skipped: ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('');
  console.log('='.repeat(60));
  console.log('✅ Scraping Complete!');
  console.log('='.repeat(60));
}

// Run the script
scrapeReviews()
  .then(() => {
    console.log('');
    console.log('👋 Script finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('');
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
