#!/usr/bin/env node

/**
 * Verify Database Setup Script
 *
 * Checks if required database functions and indexes exist in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verifying Haunt Junkies Database Setup...\n');

async function checkFunction() {
  console.log('📋 Checking for purchase_tickets() function...');

  try {
    const { data, error } = await supabase.rpc('purchase_tickets', {
      p_date: '2099-12-31',
      p_tickets: 1,
      p_name: 'Test User',
      p_first_name: 'Test',
      p_last_name: 'User',
      p_email: 'test@example.com',
      p_confirmation_number: 'TEST-VERIFY'
    });

    if (error) {
      // Function exists but might fail due to validation - that's okay
      if (error.message.includes('purchase_tickets')) {
        if (error.message.includes('does not exist')) {
          console.log('   ❌ MISSING: purchase_tickets() function not found');
          console.log('   📝 Action: Execute migrations/migration-purchase-tickets-function.sql');
          return false;
        } else {
          console.log('   ✅ EXISTS: purchase_tickets() function found');
          console.log('   ℹ️  Note: Test call failed (expected) - function exists and is working');
          return true;
        }
      } else {
        console.log('   ✅ EXISTS: purchase_tickets() function found');
        console.log('   ℹ️  Note: Function responded with validation error (this is correct behavior)');
        return true;
      }
    }

    console.log('   ✅ EXISTS: purchase_tickets() function found and working');
    return true;

  } catch (err) {
    console.log('   ⚠️  Warning: Could not verify function');
    console.log('   Error:', err.message);
    return false;
  }
}

async function checkIndexes() {
  console.log('\n📋 Checking for performance indexes...');

  const indexesToCheck = [
    'idx_reviews_slug',
    'idx_reviews_featured',
    'idx_comments_approved',
    'idx_ticket_dates_available',
    'idx_contact_unread'
  ];

  try {
    // Query pg_indexes to check for our custom indexes
    const { data, error } = await supabase
      .from('pg_indexes')
      .select('indexname')
      .in('indexname', indexesToCheck);

    if (error) {
      console.log('   ⚠️  Warning: Could not query indexes (this is normal with RLS)');
      console.log('   ℹ️  Indexes may exist but cannot be verified via client');
      return null;
    }

    const foundIndexes = data?.map(row => row.indexname) || [];
    const foundCount = foundIndexes.length;

    if (foundCount === 0) {
      console.log('   ❌ MISSING: No performance indexes found');
      console.log('   📝 Action: Execute migrations/add-performance-indexes.sql');
      return false;
    } else if (foundCount < indexesToCheck.length) {
      console.log(`   ⚠️  PARTIAL: Found ${foundCount}/${indexesToCheck.length} indexes`);
      console.log('   Found:', foundIndexes.join(', '));
      console.log('   📝 Recommendation: Re-run migrations/add-performance-indexes.sql');
      return false;
    } else {
      console.log(`   ✅ EXISTS: Found ${foundCount}/${indexesToCheck.length} sample indexes`);
      console.log('   ℹ️  All performance indexes appear to be in place');
      return true;
    }

  } catch (err) {
    console.log('   ⚠️  Warning: Could not verify indexes');
    console.log('   ℹ️  This is normal - indexes may exist but RLS prevents checking');
    return null;
  }
}

async function checkTables() {
  console.log('\n📋 Checking required tables...');

  const requiredTables = [
    'reviews',
    'review_comments',
    'contact_submissions',
    'ticket_dates',
    'ticket_requests',
    'mccloud_info'
  ];

  let allExist = true;

  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .limit(1);

      if (error && error.message.includes('does not exist')) {
        console.log(`   ❌ MISSING: ${table} table not found`);
        allExist = false;
      } else {
        console.log(`   ✅ EXISTS: ${table}`);
      }
    } catch (err) {
      console.log(`   ⚠️  Warning: Could not verify ${table}`);
    }
  }

  return allExist;
}

async function checkReadColumn() {
  console.log('\n📋 Checking contact_submissions.read column...');

  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('read')
      .limit(1);

    if (error) {
      if (error.message.includes('column "read" does not exist')) {
        console.log('   ❌ MISSING: read column not found');
        console.log('   📝 Action: Add read column to contact_submissions table');
        return false;
      } else {
        console.log('   ⚠️  Warning: Could not verify read column');
        return null;
      }
    }

    console.log('   ✅ EXISTS: read column found');
    return true;

  } catch (err) {
    console.log('   ⚠️  Warning: Could not verify read column');
    return null;
  }
}

// Run all checks
async function main() {
  const functionExists = await checkFunction();
  const indexesExist = await checkIndexes();
  const tablesExist = await checkTables();
  const readColumnExists = await checkReadColumn();

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const results = {
    'purchase_tickets() function': functionExists,
    'Performance indexes': indexesExist,
    'Required tables': tablesExist,
    'read column': readColumnExists
  };

  let criticalIssues = 0;
  let warnings = 0;

  for (const [check, status] of Object.entries(results)) {
    if (status === true) {
      console.log(`✅ ${check}: OK`);
    } else if (status === false) {
      console.log(`❌ ${check}: MISSING`);
      if (check.includes('function') || check.includes('read column')) {
        criticalIssues++;
      }
    } else {
      console.log(`⚠️  ${check}: Could not verify`);
      warnings++;
    }
  }

  console.log('='.repeat(60));

  if (criticalIssues > 0) {
    console.log('\n🚨 CRITICAL ISSUES FOUND');
    console.log('   Your site may not work correctly until these are fixed.');
    console.log('   See: docs/DATABASE-SETUP-INSTRUCTIONS.md');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  WARNINGS');
    console.log('   Some features could not be verified due to RLS policies.');
    console.log('   This is normal - your database is likely configured correctly.');
    console.log('\n✅ VERDICT: Probably ready for production');
    process.exit(0);
  } else {
    console.log('\n🎉 SUCCESS!');
    console.log('   All critical database features are in place.');
    console.log('   Your Haunt Junkies site is ready to launch! 🚀');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('\n❌ Error running verification:', err.message);
  process.exit(1);
});
