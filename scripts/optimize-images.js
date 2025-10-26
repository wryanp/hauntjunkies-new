#!/usr/bin/env node

/**
 * Image Optimization Script for Haunt Junkies
 *
 * This script:
 * 1. Compresses all images in static/ directory
 * 2. Converts to WebP format
 * 3. Creates responsive versions (400px, 800px, 1200px)
 * 4. Preserves originals as fallbacks
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

const STATIC_DIR = 'static';
const OUTPUT_DIR = 'static/optimized';

// Image processing config
const CONFIG = {
  webp: {
    quality: 80,
    effort: 6 // 0-6, higher = better compression but slower
  },
  jpeg: {
    quality: 85,
    mozjpeg: true
  },
  png: {
    quality: 85,
    compressionLevel: 9
  },
  // Responsive breakpoints (width in pixels)
  breakpoints: [400, 800, 1200],
  // Max width for hero/background images
  maxWidth: 1920
};

// Files to skip
const SKIP_FILES = [
  'favicon.png', // Keep original favicon
  '.DS_Store',
  'optimized' // Don't process already optimized images
];

/**
 * Get all image files recursively
 */
async function getImageFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stats = await stat(filePath);

    // Skip files/dirs in skip list
    if (SKIP_FILES.some(skip => file.includes(skip))) {
      continue;
    }

    if (stats.isDirectory()) {
      await getImageFiles(filePath, fileList);
    } else {
      const ext = extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

/**
 * Get file size in human-readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath) {
  const filename = basename(inputPath, extname(inputPath));
  const ext = extname(inputPath).toLowerCase();
  const relativePath = inputPath.replace(`${STATIC_DIR}/`, '');

  console.log(`\n📸 Processing: ${relativePath}`);

  try {
    const originalStats = await stat(inputPath);
    const originalSize = originalStats.size;
    console.log(`   Original size: ${formatBytes(originalSize)}`);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`   Dimensions: ${metadata.width}x${metadata.height}`);

    let totalSaved = 0;
    const outputs = [];

    // 1. Create WebP version (full size, max 1920px wide)
    const webpWidth = Math.min(metadata.width, CONFIG.maxWidth);
    const webpPath = inputPath.replace(ext, '.webp');

    await sharp(inputPath)
      .resize(webpWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp(CONFIG.webp)
      .toFile(webpPath);

    const webpStats = await stat(webpPath);
    const webpSaved = originalSize - webpStats.size;
    totalSaved += webpSaved;

    console.log(`   ✅ WebP: ${formatBytes(webpStats.size)} (saved ${formatBytes(webpSaved)})`);
    outputs.push({
      path: webpPath,
      size: webpStats.size,
      saved: webpSaved
    });

    // 2. Compress original format (keep as fallback)
    let compressedPath = inputPath;
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(inputPath)
        .jpeg(CONFIG.jpeg)
        .toFile(inputPath + '.tmp');

      const compressedStats = await stat(inputPath + '.tmp');

      // Only replace if it's actually smaller
      if (compressedStats.size < originalSize) {
        await sharp(inputPath + '.tmp').toFile(inputPath);
        const saved = originalSize - compressedStats.size;
        totalSaved += saved;
        console.log(`   ✅ JPEG: ${formatBytes(compressedStats.size)} (saved ${formatBytes(saved)})`);
      }

      // Clean up temp file
      try {
        await import('fs/promises').then(fs => fs.unlink(inputPath + '.tmp'));
      } catch (e) {
        // Ignore errors
      }
    } else if (ext === '.png') {
      await sharp(inputPath)
        .png(CONFIG.png)
        .toFile(inputPath + '.tmp');

      const compressedStats = await stat(inputPath + '.tmp');

      if (compressedStats.size < originalSize) {
        await sharp(inputPath + '.tmp').toFile(inputPath);
        const saved = originalSize - compressedStats.size;
        totalSaved += saved;
        console.log(`   ✅ PNG: ${formatBytes(compressedStats.size)} (saved ${formatBytes(saved)})`);
      }

      // Clean up temp file
      try {
        await import('fs/promises').then(fs => fs.unlink(inputPath + '.tmp'));
      } catch (e) {
        // Ignore errors
      }
    }

    // 3. Create responsive versions (only for large images)
    if (metadata.width > 800) {
      for (const width of CONFIG.breakpoints) {
        if (width < metadata.width) {
          const responsivePath = inputPath.replace(ext, `-${width}w.webp`);

          await sharp(inputPath)
            .resize(width, null, {
              withoutEnlargement: true,
              fit: 'inside'
            })
            .webp(CONFIG.webp)
            .toFile(responsivePath);

          const stats = await stat(responsivePath);
          console.log(`   ✅ Responsive ${width}w: ${formatBytes(stats.size)}`);

          outputs.push({
            path: responsivePath,
            size: stats.size,
            width: width
          });
        }
      }
    }

    console.log(`   💾 Total saved: ${formatBytes(totalSaved)} (${Math.round((totalSaved / originalSize) * 100)}%)`);

    return {
      original: inputPath,
      originalSize,
      outputs,
      totalSaved
    };

  } catch (error) {
    console.error(`   ❌ Error processing ${relativePath}:`, error.message);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🎃 Haunt Junkies Image Optimization\n');
  console.log('Finding images...');

  const imageFiles = await getImageFiles(STATIC_DIR);
  console.log(`\nFound ${imageFiles.length} images to optimize\n`);
  console.log('=' .repeat(60));

  let totalOriginalSize = 0;
  let totalSaved = 0;
  const results = [];

  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (result) {
      results.push(result);
      totalOriginalSize += result.originalSize;
      totalSaved += result.totalSaved;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 OPTIMIZATION SUMMARY\n');
  console.log(`Images processed: ${results.length}`);
  console.log(`Original total size: ${formatBytes(totalOriginalSize)}`);
  console.log(`Total saved: ${formatBytes(totalSaved)}`);
  console.log(`Compression ratio: ${Math.round((totalSaved / totalOriginalSize) * 100)}%\n`);

  // Top 5 biggest savings
  const sorted = results.sort((a, b) => b.totalSaved - a.totalSaved);
  console.log('🏆 Top 5 biggest savings:\n');
  sorted.slice(0, 5).forEach((result, i) => {
    const filename = basename(result.original);
    const percent = Math.round((result.totalSaved / result.originalSize) * 100);
    console.log(`${i + 1}. ${filename}: ${formatBytes(result.totalSaved)} saved (${percent}%)`);
  });

  console.log('\n✅ Optimization complete!\n');
  console.log('Next steps:');
  console.log('1. Test the site with optimized images');
  console.log('2. Update image references to use .webp versions');
  console.log('3. Add <picture> elements for responsive images');
  console.log('4. Deploy to production\n');
}

main().catch(console.error);
