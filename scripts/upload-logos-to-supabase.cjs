#!/usr/bin/env node

/**
 * Upload review logo images to Supabase Storage
 *
 * This script:
 * 1. Creates 'review-logos' bucket in Supabase Storage (if needed)
 * 2. Uploads all downloaded images from /tmp/review-logos/
 * 3. Generates manifest with Supabase Storage URLs
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

const BUCKET_NAME = 'review-logos';
const SOURCE_DIR = '/tmp/review-logos';

/**
 * Create storage bucket if it doesn't exist
 */
async function ensureBucket() {
  console.log(`🪣  Checking if bucket "${BUCKET_NAME}" exists...`);

  // List all buckets
  const { data: buckets, error: listError } = await supabase
    .storage
    .listBuckets();

  if (listError) {
    console.error('❌ Error listing buckets:', listError.message);
    throw listError;
  }

  const bucketExists = buckets.some(b => b.name === BUCKET_NAME);

  if (bucketExists) {
    console.log(`✅ Bucket "${BUCKET_NAME}" already exists`);
    return;
  }

  console.log(`📦 Creating bucket "${BUCKET_NAME}"...`);

  // Create public bucket
  const { data, error: createError } = await supabase
    .storage
    .createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    });

  if (createError) {
    console.error('❌ Error creating bucket:', createError.message);
    throw createError;
  }

  console.log(`✅ Bucket "${BUCKET_NAME}" created successfully`);
}

/**
 * Upload a single image to Supabase Storage
 */
async function uploadImage(localPath, filename) {
  const fileBuffer = fs.readFileSync(localPath);

  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(filename, fileBuffer, {
      contentType: getMimeType(filename),
      upsert: true
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename);

  return publicUrl;
}

/**
 * Get MIME type from filename
 */
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Main upload function
 */
async function uploadLogos() {
  console.log('🚀 Starting Review Logo Upload to Supabase Storage');
  console.log('='.repeat(60));
  console.log('');

  // Ensure bucket exists
  await ensureBucket();

  console.log('');
  console.log('📂 Reading local images...');

  // Get all image files
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => /\.(png|jpg|jpeg|webp|JPG)$/i.test(f));

  console.log(`✅ Found ${files.length} images to upload`);
  console.log('');

  console.log('📤 Uploading images to Supabase Storage...');
  console.log('');

  let successCount = 0;
  let errorCount = 0;
  const uploadedImages = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const localPath = path.join(SOURCE_DIR, filename);

    console.log(`[${i + 1}/${files.length}] ${filename}...`);

    try {
      const publicUrl = await uploadImage(localPath, filename);

      console.log(`   ✅ Uploaded: ${publicUrl}`);

      uploadedImages.push({
        filename,
        publicUrl,
        supabaseId: path.parse(filename).name // UUID without extension
      });

      successCount++;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('📊 Upload Results');
  console.log('='.repeat(60));
  console.log(`✅ Successfully uploaded: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('');

  // Save upload manifest
  const manifestPath = path.join(SOURCE_DIR, 'supabase-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(uploadedImages, null, 2));
  console.log(`📝 Manifest saved: ${manifestPath}`);

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ Upload Complete!');
  console.log('='.repeat(60));

  return uploadedImages;
}

// Run the script
uploadLogos()
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
