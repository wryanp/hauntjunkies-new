#!/usr/bin/env node

/**
 * Script to execute the Heroku to Supabase migration
 *
 * This script reads the migration SQL file and executes it using the Supabase client
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  console.error('Required: PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('❌ SQL Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('❌ Execution Error:', err);
    return { success: false, error: err };
  }
}

async function executeMigration() {
  console.log('🚀 Starting Heroku to Supabase Reviews Migration');
  console.log('=' .repeat(60));
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🔗 Supabase URL: ${SUPABASE_URL}`);
  console.log('=' .repeat(60));
  console.log('');

  // Read migration file
  const migrationFile = path.join(__dirname, '..', 'migrations', 'import-heroku-reviews.sql');
  console.log(`📄 Reading migration file: ${migrationFile}`);

  let migrationSQL;
  try {
    migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    console.log(`✅ Migration file loaded (${(migrationSQL.length / 1024).toFixed(2)} KB)`);
  } catch (err) {
    console.error('❌ Error reading migration file:', err.message);
    process.exit(1);
  }

  // Pre-migration check - count current reviews
  console.log('');
  console.log('📊 Pre-Migration Check:');
  console.log('-'.repeat(60));

  const { data: preCount, error: preCountError } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true });

  if (preCountError) {
    console.log(`⚠️  Could not count existing reviews: ${preCountError.message}`);
  } else {
    console.log(`📈 Current reviews in database: ${preCount || 0}`);
  }

  // Execute migration
  console.log('');
  console.log('⚡ Executing Migration:');
  console.log('-'.repeat(60));
  console.log('⏳ This may take 30-60 seconds...');
  console.log('');

  // Split SQL into individual statements
  // We need to execute DELETE and each INSERT separately
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;
  let deleteExecuted = false;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];

    // Skip comments and empty statements
    if (stmt.startsWith('--') || stmt.length < 10) {
      continue;
    }

    // Log progress for DELETE and every 10 INSERTs
    if (stmt.includes('DELETE FROM reviews')) {
      console.log('🗑️  Deleting existing reviews...');
      deleteExecuted = true;
    } else if (stmt.includes('INSERT INTO reviews') && successCount % 10 === 0) {
      console.log(`📝 Inserting reviews... (${successCount} completed)`);
    }

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: stmt + ';' });

      if (error) {
        console.error(`❌ Error executing statement ${i}:`, error.message);
        errorCount++;

        // If it's a function not found error, we need a different approach
        if (error.message.includes('function') || error.message.includes('does not exist')) {
          console.log('');
          console.log('⚠️  Direct SQL execution via RPC not available.');
          console.log('📝 Please execute the migration manually in Supabase SQL Editor.');
          console.log('');
          console.log('Instructions:');
          console.log('1. Go to your Supabase project dashboard');
          console.log('2. Navigate to SQL Editor');
          console.log('3. Open migrations/import-heroku-reviews.sql');
          console.log('4. Copy and paste the entire file');
          console.log('5. Click "Run"');
          console.log('');
          process.exit(1);
        }

        if (errorCount > 5) {
          console.error('❌ Too many errors, stopping migration');
          process.exit(1);
        }
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception executing statement ${i}:`, err.message);
      errorCount++;
    }
  }

  console.log('');
  console.log('✅ Migration execution completed!');
  console.log(`📊 Statements executed successfully: ${successCount}`);
  if (errorCount > 0) {
    console.log(`⚠️  Statements with errors: ${errorCount}`);
  }

  // Post-migration verification
  console.log('');
  console.log('📊 Post-Migration Verification:');
  console.log('-'.repeat(60));

  const { count: totalReviews, error: countError } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error counting reviews:', countError.message);
  } else {
    console.log(`✅ Total reviews in database: ${totalReviews}`);
    console.log(`📌 Expected: 90`);

    if (totalReviews === 90) {
      console.log('🎉 SUCCESS! All 90 reviews imported correctly!');
    } else if (totalReviews > 0) {
      console.log(`⚠️  Warning: Review count (${totalReviews}) doesn't match expected (90)`);
    } else {
      console.log('❌ Error: No reviews found after migration');
    }
  }

  // Check featured reviews
  const { count: featuredCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('featured', true);

  if (featuredCount !== null) {
    console.log(`⭐ Featured reviews: ${featuredCount}`);
  }

  // Get sample reviews
  const { data: samples } = await supabase
    .from('reviews')
    .select('name, city, state, year, rating_overall, featured')
    .order('created_at', { ascending: false })
    .limit(5);

  if (samples && samples.length > 0) {
    console.log('');
    console.log('📝 Sample Reviews (5 most recent):');
    console.log('-'.repeat(60));
    samples.forEach((review, idx) => {
      console.log(`${idx + 1}. ${review.name} (${review.city}, ${review.state}) - ${review.year}`);
      console.log(`   Rating: ${review.rating_overall || 'N/A'} | Featured: ${review.featured ? 'Yes' : 'No'}`);
    });
  }

  console.log('');
  console.log('=' .repeat(60));
  console.log('✅ Migration Complete!');
  console.log('=' .repeat(60));
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Check review pages on your website');
  console.log('2. Update migration log (migrations/migration-log.md)');
  console.log('3. Migrate images to Supabase Storage');
  console.log('4. Generate slugs for reviews with NULL slugs');
  console.log('');
}

// Run migration
executeMigration()
  .then(() => {
    console.log('👋 Migration script finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
