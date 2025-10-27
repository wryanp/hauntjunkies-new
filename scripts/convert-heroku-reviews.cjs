#!/usr/bin/env node

/**
 * Script to convert Heroku reviews dump to Supabase INSERT statements
 *
 * This script parses the heroku-reviews-data.sql file and generates
 * SQL INSERT statements compatible with the Supabase reviews table.
 */

const fs = require('fs');
const path = require('path');

// Field mapping from Heroku to Supabase
const FIELD_MAP = {
  0: 'id',  // Will be replaced with UUID
  1: 'name',
  2: 'address1',
  3: 'address2',
  4: 'city',
  5: 'state',
  6: 'zip',
  7: 'url',  // → website_url
  8: 'facebook',  // → facebook_url
  9: 'twitter',  // → twitter_url
  10: 'instagram',  // → instagram_url
  11: 'review_video',  // Not used
  12: 'description',
  13: 'article',  // → review_text
  14: 'created_at',
  15: 'updated_at',
  16: 'review_photo_file_name',  // Not used
  17: 'review_photo_content_type',  // Not used
  18: 'review_photo_file_size',  // Not used
  19: 'review_photo_updated_at',  // Not used
  20: 'phone',  // Not used
  21: 'slug',
  22: 'rating',  // → rating_overall
  23: 'year',
  24: 'latitude',  // Not used
  25: 'longitude',  // Not used
  26: 'featured',
  27: 'featured_order',  // Not used
  28: 'featured_link_to_review',  // Not used
  29: 'by',  // Not used
  30: 'string',  // Not used
  31: 'youtube',  // → youtube_url
  32: 'award'  // Not used
};

// SQL escape function
function escapeSql(value) {
  if (value === null || value === undefined || value === '\\N') {
    return 'NULL';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  // Escape single quotes and backslashes
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''");

  return `'${escaped}'`;
}

// Parse tab-delimited line
function parseCopyLine(line) {
  // Split by tabs, but respect escaped tabs
  const fields = [];
  let currentField = '';
  let inEscape = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '\\' && !inEscape) {
      inEscape = true;
      if (nextChar === 't') {
        currentField += '\t';
        i++; // Skip the 't'
      } else if (nextChar === 'n') {
        currentField += '\n';
        i++; // Skip the 'n'
      } else if (nextChar === '\\') {
        currentField += '\\';
        i++; // Skip the second backslash
      } else if (nextChar === 'N') {
        // \N means NULL in PostgreSQL COPY format
        currentField = null;
        i++; // Skip the 'N'
      }
      inEscape = false;
    } else if (char === '\t' && !inEscape) {
      fields.push(currentField === '' ? null : currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Don't forget the last field
  fields.push(currentField === '' ? null : currentField);

  return fields;
}

// Convert Heroku review to Supabase INSERT
function convertReview(fields) {
  // Map fields
  const name = fields[1];
  const address1 = fields[2] || '';
  const address2 = fields[3] || '';
  const address = (address1 + ' ' + address2).trim() || null;
  const city = fields[4];
  const state = fields[5];
  const zip = fields[6];
  const website_url = fields[7];
  const facebook_url = fields[8];
  const twitter_url = fields[9];
  const instagram_url = fields[10];
  const description = fields[12];
  const review_text = fields[13];
  const created_at = fields[14];
  const updated_at = fields[15];
  const slug = fields[21] || null;
  const rating_overall = fields[22];
  const year = fields[23];
  const featured = fields[26] === 't' || fields[26] === 'true';
  const youtube_url = fields[31];

  // Generate INSERT statement
  return `INSERT INTO reviews (
  id, name, address, city, state, zip, year, description, review_text, slug,
  rating_overall, website_url, facebook_url, twitter_url, instagram_url, youtube_url,
  featured, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  ${escapeSql(name)},
  ${escapeSql(address)},
  ${escapeSql(city)},
  ${escapeSql(state)},
  ${escapeSql(zip)},
  ${year && year !== '\\N' ? parseInt(year) : 'NULL'},
  ${escapeSql(description)},
  ${escapeSql(review_text)},
  ${escapeSql(slug)},
  ${rating_overall && rating_overall !== '\\N' ? rating_overall : 'NULL'},
  ${escapeSql(website_url)},
  ${escapeSql(facebook_url)},
  ${escapeSql(twitter_url)},
  ${escapeSql(instagram_url)},
  ${escapeSql(youtube_url)},
  ${featured},
  ${escapeSql(created_at)},
  ${escapeSql(updated_at)}
);`;
}

// Main function
function main() {
  const inputFile = path.join(__dirname, '..', 'heroku-reviews-data.sql');
  const outputFile = path.join(__dirname, '..', 'migrations', 'import-heroku-reviews.sql');

  console.log('Reading Heroku reviews data...');
  const content = fs.readFileSync(inputFile, 'utf8');

  // Find the COPY data section
  const copyStart = content.indexOf('COPY "public"."reviews"');
  const dataStart = content.indexOf('FROM stdin;', copyStart) + 'FROM stdin;'.length;
  const dataEnd = content.indexOf('\\.', dataStart);

  const dataSection = content.substring(dataStart, dataEnd).trim();
  const lines = dataSection.split('\n').filter(line => line.trim());

  console.log(`Found ${lines.length} reviews to convert`);

  // Convert each line to INSERT statement
  const inserts = [];
  for (const line of lines) {
    const fields = parseCopyLine(line);
    const insertStatement = convertReview(fields);
    inserts.push(insertStatement);
  }

  // Read the template
  let template = fs.readFileSync(outputFile, 'utf8');

  // Replace the placeholder with actual INSERT statements
  const placeholderStart = template.indexOf('-- ==================================================================');
  const placeholderEnd = template.indexOf('-- After adding the INSERT statements above');

  const beforePlaceholder = template.substring(0, placeholderStart);
  const afterPlaceholder = template.substring(placeholderEnd);

  const finalScript = beforePlaceholder +
    '-- ==================================================================\n' +
    '-- INSERT STATEMENTS GENERATED FROM HEROKU DATA\n' +
    '-- Generated: ' + new Date().toISOString() + '\n' +
    '-- Total reviews: ' + inserts.length + '\n' +
    '-- ==================================================================\n\n' +
    inserts.join('\n\n') +
    '\n\n' +
    afterPlaceholder;

  // Write the final migration file
  fs.writeFileSync(outputFile, finalScript);

  console.log('✅ Migration script created successfully!');
  console.log(`📄 Output file: ${outputFile}`);
  console.log(`📊 Total reviews: ${inserts.length}`);
  console.log('\nNext steps:');
  console.log('1. Review the generated SQL file');
  console.log('2. Backup your Supabase reviews table');
  console.log('3. Run the migration in Supabase SQL Editor');
}

// Run the script
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
