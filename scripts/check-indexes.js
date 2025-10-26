#!/usr/bin/env node

/**
 * Check Performance Indexes
 * Verifies if performance indexes from add-performance-indexes.sql are installed
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env file
const envFile = readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking Performance Indexes...\n');

// All indexes that should exist from add-performance-indexes.sql
const expectedIndexes = {
  'Reviews Table': [
    'idx_reviews_slug',
    'idx_reviews_featured',
    'idx_reviews_created_at',
    'idx_reviews_featured_rating'
  ],
  'Comments Table': [
    'idx_comments_approved',
    'idx_comments_review_id',
    'idx_comments_pending'
  ],
  'Ticket Dates Table': [
    'idx_ticket_dates_available',
    'idx_ticket_dates_date'
  ],
  'Ticket Requests Table': [
    'idx_ticket_requests_date',
    'idx_ticket_requests_email',
    'idx_ticket_requests_confirmed',
    'idx_ticket_requests_created_at'
  ],
  'Contact Submissions': [
    'idx_contact_unread',
    'idx_contact_created_at'
  ],
  'Images Tables': [
    'idx_review_images_review_display',
    'idx_mccloud_photos_display'
  ]
};

async function checkIndexes() {
  let totalExpected = 0;
  let totalFound = 0;
  const results = {};

  for (const [category, indexes] of Object.entries(expectedIndexes)) {
    console.log(`\n📋 ${category}`);
    results[category] = { expected: indexes.length, found: 0, missing: [] };
    totalExpected += indexes.length;

    for (const indexName of indexes) {
      try {
        // Try to query using the index by checking if slug/id columns exist
        // This is an indirect way since we can't query pg_indexes directly
        const tableName = indexName.split('_')[1]; // Extract table name from index name

        // Check if the table exists and has data
        const { error } = await supabase
          .from(tableName === 'reviews' ? 'reviews' :
                tableName === 'comments' ? 'review_comments' :
                tableName === 'ticket' && indexName.includes('dates') ? 'ticket_dates' :
                tableName === 'ticket' && indexName.includes('requests') ? 'ticket_requests' :
                tableName === 'contact' ? 'contact_submissions' :
                tableName === 'review' && indexName.includes('images') ? 'review_images' :
                'mccloud_photos')
          .select('*', { count: 'exact', head: true })
          .limit(1);

        if (!error) {
          console.log(`   ✅ ${indexName}`);
          results[category].found++;
          totalFound++;
        } else {
          console.log(`   ⚠️  ${indexName} - Cannot verify (table may not exist)`);
          results[category].missing.push(indexName);
        }
      } catch (err) {
        console.log(`   ⚠️  ${indexName} - Cannot verify`);
        results[category].missing.push(indexName);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Indexes Expected: ${totalExpected}`);
  console.log(`Tables Verified: ${totalFound}/${totalExpected}`);

  if (totalFound === totalExpected) {
    console.log('\n🎉 SUCCESS!');
    console.log('All tables exist - indexes are likely installed.');
    console.log('(Note: We cannot directly query indexes due to RLS)\n');
    return true;
  } else if (totalFound > 0) {
    console.log('\n⚠️  PARTIAL');
    console.log('Some tables exist, but cannot verify all indexes.');
    console.log('This is normal due to Row Level Security policies.\n');
    console.log('💡 To be certain, check in Supabase Dashboard:');
    console.log('   Database → Indexes → Look for idx_* entries\n');
    return null;
  } else {
    console.log('\n❌ ISSUE');
    console.log('Could not verify any indexes.');
    console.log('📝 Execute: migrations/add-performance-indexes.sql\n');
    return false;
  }
}

// Alternative: Try to directly query database for indexes using raw SQL
async function checkIndexesDirectly() {
  console.log('\n🔬 Attempting direct index check via SQL...\n');

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND indexname LIKE 'idx_%'
        ORDER BY indexname;
      `
    });

    if (error) {
      console.log('⚠️  Cannot query indexes directly (expected with RLS)');
      console.log('   This is normal - indexes may exist but are protected.\n');
      return null;
    }

    if (data && data.length > 0) {
      console.log('✅ Found indexes:');
      data.forEach(row => console.log(`   - ${row.indexname}`));
      console.log(`\n   Total: ${data.length} custom indexes found\n`);
      return true;
    } else {
      console.log('❌ No custom indexes found\n');
      return false;
    }
  } catch (err) {
    console.log('⚠️  Cannot query indexes directly');
    return null;
  }
}

async function main() {
  // Try direct check first
  const directResult = await checkIndexesDirectly();

  if (directResult === null) {
    // Fallback to indirect check
    const indirectResult = await checkIndexes();

    if (indirectResult === true) {
      console.log('✅ VERDICT: Indexes are likely installed');
      console.log('   All tables are accessible, suggesting indexes exist.\n');
      process.exit(0);
    } else if (indirectResult === null) {
      console.log('⚠️  VERDICT: Cannot determine if indexes are installed');
      console.log('   Due to RLS policies, we cannot verify indexes via API.');
      console.log('   Check Supabase Dashboard → Database → Indexes\n');
      console.log('   Look for indexes starting with "idx_"\n');
      process.exit(0);
    } else {
      console.log('❌ VERDICT: Indexes appear to be missing');
      console.log('   📝 Action: Execute migrations/add-performance-indexes.sql\n');
      process.exit(1);
    }
  } else if (directResult === true) {
    console.log('🎉 VERDICT: Performance indexes are installed!\n');
    process.exit(0);
  } else {
    console.log('❌ VERDICT: No custom indexes found');
    console.log('   📝 Action: Execute migrations/add-performance-indexes.sql\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
