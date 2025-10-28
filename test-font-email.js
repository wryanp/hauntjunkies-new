/**
 * Test script to send an email and verify the L character displays correctly
 * Run with: node test-font-email.js
 */

import { Resend } from 'resend';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TEST_EMAIL = process.argv[2]; // Get email from command line argument

if (!RESEND_API_KEY) {
	console.error('❌ RESEND_API_KEY not found in environment variables');
	process.exit(1);
}

if (!TEST_EMAIL) {
	console.error('❌ Please provide an email address as an argument');
	console.error('Usage: node test-font-email.js YOUR_EMAIL@example.com');
	process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// Read the OTF font and encode it
const fontData = fs.readFileSync('./static/fonts/Karma-FreeVersion.otf');
const fontBase64 = fontData.toString('base64');

console.log(`✓ Font loaded: ${fontBase64.length} characters`);
console.log(`✓ Font starts with: ${fontBase64.substring(0, 20)}...`);

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<style>
		@font-face {
			font-family: 'Karma';
			src: url('data:font/opentype;charset=utf-8;base64,${fontBase64}') format('opentype');
			font-weight: normal;
			font-style: normal;
		}

		body {
			margin: 0;
			padding: 20px;
			background-color: #1a1a1a;
			font-family: Arial, sans-serif;
		}

		.container {
			max-width: 600px;
			margin: 0 auto;
			background: #2a2a2a;
			padding: 40px;
			border-radius: 8px;
		}

		.title {
			font-family: 'Karma', 'Palatino Linotype', 'Book Antiqua', Palatino, 'Times New Roman', Georgia, serif;
			font-size: 72px;
			font-weight: 700;
			color: #a41214;
			text-align: center;
			letter-spacing: 2px;
			text-transform: uppercase;
			margin: 0 0 30px 0;
			line-height: 1.1;
		}

		.subtitle {
			font-family: 'Karma', 'Palatino Linotype', 'Book Antiqua', Palatino, 'Times New Roman', Georgia, serif;
			font-size: 36px;
			color: #FC7403;
			text-align: center;
			margin: 20px 0;
		}

		.test-section {
			background: #333;
			padding: 20px;
			margin: 20px 0;
			border-radius: 4px;
		}

		.test-label {
			color: #999;
			font-size: 14px;
			margin-bottom: 10px;
		}

		.test-text {
			font-family: 'Karma', 'Palatino Linotype', 'Book Antiqua', Palatino, 'Times New Roman', Georgia, serif;
			font-size: 24px;
			color: #ffffff;
			margin: 10px 0;
		}

		.fallback-text {
			font-family: Arial, sans-serif;
			font-size: 24px;
			color: #ffffff;
			margin: 10px 0;
		}

		.letter-grid {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 10px;
		}

		.letter-box {
			background: #444;
			padding: 15px;
			border-radius: 4px;
			text-align: center;
			min-width: 60px;
		}

		.letter-box .letter {
			font-family: 'Karma', serif;
			font-size: 48px;
			color: #FC7403;
			display: block;
			margin-bottom: 5px;
		}

		.letter-box .label {
			font-size: 12px;
			color: #999;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1 class="title">Haunt Junkies</h1>
		<h2 class="subtitle">Font Test Email</h2>

		<div class="test-section">
			<div class="test-label">Test 1: Full Title (Karma Font)</div>
			<div class="test-text">McCloud Manor</div>
		</div>

		<div class="test-section">
			<div class="test-label">Test 2: L Character Repetition (Karma Font)</div>
			<div class="test-text">LLLLLLLLLLL (11 L's)</div>
		</div>

		<div class="test-section">
			<div class="test-label">Test 3: Words with L (Karma Font)</div>
			<div class="test-text">Halloween Spooky Thrills</div>
			<div class="test-text">Lovely Haunted Location</div>
			<div class="test-text">All Available Tickets</div>
		</div>

		<div class="test-section">
			<div class="test-label">Test 4: Mixed Case (Karma Font)</div>
			<div class="test-text">Lower: llllllllll</div>
			<div class="test-text">Upper: LLLLLLLLLL</div>
			<div class="test-text">Mixed: LlLlLlLlLl</div>
		</div>

		<div class="test-section">
			<div class="test-label">Test 5: Individual Letters (Karma Font)</div>
			<div class="letter-grid">
				<div class="letter-box">
					<span class="letter">L</span>
					<span class="label">Capital L</span>
				</div>
				<div class="letter-box">
					<span class="letter">l</span>
					<span class="label">Lowercase l</span>
				</div>
				<div class="letter-box">
					<span class="letter">I</span>
					<span class="label">Capital I</span>
				</div>
				<div class="letter-box">
					<span class="letter">i</span>
					<span class="label">Lowercase i</span>
				</div>
				<div class="letter-box">
					<span class="letter">1</span>
					<span class="label">Number 1</span>
				</div>
			</div>
		</div>

		<div class="test-section">
			<div class="test-label">Test 6: Full Alphabet (Karma Font)</div>
			<div class="test-text">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
			<div class="test-text">abcdefghijklmnopqrstuvwxyz</div>
			<div class="test-text">0123456789</div>
		</div>

		<div class="test-section">
			<div class="test-label">Test 7: Fallback Font (Arial) - For Comparison</div>
			<div class="fallback-text">McCloud Manor</div>
			<div class="fallback-text">LLLLLLLLLLL (11 L's)</div>
		</div>

		<div style="margin-top: 40px; padding: 20px; background: #222; border-left: 4px solid #FC7403;">
			<p style="color: #fff; margin: 0 0 10px 0; font-weight: bold;">What to check:</p>
			<p style="color: #ccc; margin: 5px 0; font-size: 14px;">✓ Can you see all L characters in tests 1-6?</p>
			<p style="color: #ccc; margin: 5px 0; font-size: 14px;">✓ Do the Karma font L's look different from Arial L's in test 7?</p>
			<p style="color: #ccc; margin: 5px 0; font-size: 14px;">✓ Are capital L and lowercase l both visible in test 5?</p>
		</div>
	</div>
</body>
</html>
`;

async function sendTestEmail() {
	try {
		console.log('\n📧 Sending font test email...');

		const { data, error } = await resend.emails.send({
			from: 'Haunt Junkies <noreply@hauntjunkies.com>',
			to: [TEST_EMAIL],
			subject: '🎃 Font Test - Verify L Character Display',
			html: htmlContent
		});

		if (error) {
			console.error('❌ Error sending email:', error);
			return;
		}

		console.log('✅ Test email sent successfully!');
		console.log('📬 Email ID:', data.id);
		console.log('📨 Sent to:', TEST_EMAIL);
		console.log('\n📋 Please check your email and verify:');
		console.log('   1. All L characters are visible in tests 1-6');
		console.log('   2. The Karma font looks different from the Arial fallback');
		console.log('   3. Both uppercase L and lowercase l are showing');
		console.log('\n💡 If L characters are missing, it may be an email client issue.');

	} catch (error) {
		console.error('❌ Failed to send email:', error);
	}
}

// Run the test
sendTestEmail();
