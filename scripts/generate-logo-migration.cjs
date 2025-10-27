#!/usr/bin/env node

/**
 * Generate migration SQL to insert review logos into review_images table
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = '/tmp/review-logos/supabase-manifest.json';
const OUTPUT_FILE = path.join(__dirname, '../supabase/migrations/20251026220000_import_review_logos.sql');

function generateMigration() {
  console.log('🔨 Generating Review Logo Migration SQL');
  console.log('='.repeat(60));
  console.log('');

  // Read manifest
  console.log('📖 Reading upload manifest...');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  console.log(`✅ Found ${manifest.length} uploaded images`);
  console.log('');

  // Generate SQL
  console.log('✍️  Generating INSERT statements...');

  const sqlLines = [
    '-- Import review logo images into review_images table',
    '-- Migrated from AWS S3 to Supabase Storage',
    '--',
    '-- Total images: ' + manifest.length,
    '-- Migration date: ' + new Date().toISOString(),
    '',
    '-- Insert review logo images',
    'INSERT INTO review_images (review_id, image_url, caption, display_order)',
    'VALUES'
  ];

  // Generate VALUES entries
  const values = manifest.map((img, idx) => {
    const reviewId = img.supabaseId;
    const imageUrl = img.publicUrl;
    const isLast = idx === manifest.length - 1;

    return `  ('${reviewId}', '${imageUrl}', 'Review Logo', 0)${isLast ? ';' : ','}`;
  });

  sqlLines.push(...values);
  sqlLines.push('');
  sqlLines.push('-- Verify insert');
  sqlLines.push('DO $$');
  sqlLines.push('DECLARE');
  sqlLines.push('  inserted_count INTEGER;');
  sqlLines.push('BEGIN');
  sqlLines.push('  SELECT COUNT(*) INTO inserted_count');
  sqlLines.push('  FROM review_images');
  sqlLines.push('  WHERE caption = \'Review Logo\';');
  sqlLines.push('');
  sqlLines.push('  RAISE NOTICE \'Migration complete:\';');
  sqlLines.push('  RAISE NOTICE \'  - Review logos inserted: %\', inserted_count;');
  sqlLines.push('END $$;');
  sqlLines.push('');

  const sql = sqlLines.join('\n');

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, sql);

  console.log(`✅ Migration SQL generated: ${OUTPUT_FILE}`);
  console.log('');
  console.log('📊 Migration Summary:');
  console.log(`   - Total images: ${manifest.length}`);
  console.log(`   - Table: review_images`);
  console.log(`   - Caption: "Review Logo"`);
  console.log(`   - Display order: 0`);
  console.log('');
  console.log('='.repeat(60));
  console.log('✅ Migration file ready!');
  console.log('='.repeat(60));
}

// Run the script
try {
  generateMigration();
  console.log('');
  console.log('👋 Next step: Run `supabase db push` to execute the migration');
  process.exit(0);
} catch (err) {
  console.error('');
  console.error('💥 Fatal error:', err);
  process.exit(1);
}
