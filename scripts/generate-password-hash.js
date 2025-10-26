#!/usr/bin/env node
/**
 * Password Hash Generator for Admin Authentication
 *
 * Usage:
 *   node scripts/generate-password-hash.js "YourPasswordHere"
 *
 * This script generates a bcrypt hash of your admin password.
 * Copy the generated hash to your .env file as ADMIN_PASSWORD_HASH
 */

const bcrypt = require('bcryptjs');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
	console.error('❌ Error: Please provide a password as an argument');
	console.error('Usage: node scripts/generate-password-hash.js "YourPasswordHere"');
	process.exit(1);
}

// Validate password length
if (password.length < 6) {
	console.error('❌ Error: Password must be at least 6 characters long');
	process.exit(1);
}

if (password.length > 72) {
	console.error('❌ Error: Password must be 72 characters or less (bcrypt limitation)');
	process.exit(1);
}

// Generate hash with cost factor of 10 (recommended for production)
const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('\n✅ Password hash generated successfully!\n');
console.log('Copy this hash to your .env file:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
console.log('⚠️  IMPORTANT: Delete your old ADMIN_PASSWORD variable from .env');
console.log('⚠️  Keep this hash secret - treat it like a password!\n');
