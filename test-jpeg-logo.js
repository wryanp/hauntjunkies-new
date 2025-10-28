/**
 * Test the JPEG logo in email
 */

import { Resend } from 'resend';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TEST_EMAIL = 'vilonte1@gmail.com';

if (!RESEND_API_KEY) {
	console.error('❌ RESEND_API_KEY not found');
	process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// Read the JPEG logo and encode it
const logoData = fs.readFileSync('./static/mccloudmanor-logo.jpg');
const logoBase64 = logoData.toString('base64');

// Read the OTF font
const fontData = fs.readFileSync('./static/fonts/Karma-FreeVersion.otf');
const fontBase64 = fontData.toString('base64');

const confirmationNumber = 'MCM-' + new Date().toISOString().split('T')[0].replace(/-/g, '') + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Your McCloud Manor Tickets</title>
	<style>
		@font-face {
			font-family: 'Karma';
			src: url('data:font/opentype;charset=utf-8;base64,${fontBase64}') format('opentype');
			font-weight: normal;
			font-style: normal;
		}

		body {
			margin: 0;
			padding: 0;
			font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
			background-color: #f4f4f4;
			color: #333333;
		}
	</style>
</head>
<body>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #fffffe; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">

					<!-- Header with JPEG Logo -->
					<tr>
						<td align="center" style="padding: 50px 40px; background-color: #000001; border-bottom: 4px solid #a41214; vertical-align: middle;">
							<!-- McCloud Manor Logo (Base64 Embedded) -->
							<img src="data:image/jpeg;base64,${logoBase64}" alt="McCloud Manor" style="max-width: 350px; width: 100%; height: auto; display: block; margin: 0 auto;" />
						</td>
					</tr>

					<!-- Ticket Intro -->
					<tr>
						<td style="padding: 40px 40px 30px 40px; text-align: center;">
							<h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #000001;">Your Tickets Are Confirmed</h2>
							<p style="margin: 0 0 8px 0; font-size: 16px; color: #666666; line-height: 1.6;">
								We're excited to terrify you at McCloud Manor.
							</p>
						</td>
					</tr>

					<!-- Ticket Details -->
					<tr>
						<td style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0;">
								<tr>
									<td style="padding: 8px; font-weight: 600; color: #333; border-bottom: 1px solid #e0e0e0;">Confirmation #</td>
									<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444; font-family: monospace;">${confirmationNumber}</td>
								</tr>
								<tr>
									<td style="padding: 8px; font-weight: 600; color: #333; border-bottom: 1px solid #e0e0e0;">Name</td>
									<td style="padding: 8px; color: #666; border-bottom: 1px solid #e0e0e0;">JPEG Logo Test</td>
								</tr>
								<tr>
									<td style="padding: 8px; font-weight: 600; color: #333; border-bottom: 1px solid #e0e0e0;">Date</td>
									<td style="padding: 8px; color: #666; border-bottom: 1px solid #e0e0e0;">October 31, 2025</td>
								</tr>
								<tr>
									<td style="padding: 8px; font-weight: 600; color: #333; border-bottom: 1px solid #e0e0e0;">Tickets</td>
									<td style="padding: 8px; color: #666; border-bottom: 1px solid #e0e0e0;">2 tickets</td>
								</tr>
								<tr>
									<td style="padding: 8px; font-weight: 600; color: #333;">Total Paid</td>
									<td style="padding: 8px; color: #a41214; font-weight: 700;">$50.00</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Footer -->
					<tr>
						<td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
							<p style="margin: 0 0 10px 0; font-size: 14px; color: #999;">
								Questions? Contact us at <a href="mailto:info@hauntjunkies.com" style="color: #a41214;">info@hauntjunkies.com</a>
							</p>
							<p style="margin: 0; font-size: 12px; color: #999;">
								© 2025 Haunt Junkies. All rights reserved.
							</p>
						</td>
					</tr>

				</table>
			</td>
		</tr>
	</table>
</body>
</html>
`;

async function sendTest() {
	try {
		console.log('📧 Sending test email with JPEG logo (base64 embedded)...');
		console.log(`   Logo size: ${Math.round(logoData.length / 1024)}KB`);

		const { data, error } = await resend.emails.send({
			from: 'Haunt Junkies <noreply@hauntjunkies.com>',
			to: [TEST_EMAIL],
			subject: '🎃 Your McCloud Manor Tickets (JPEG Logo Test)',
			html: htmlContent
		});

		if (error) {
			console.error('❌ Error:', error);
			return;
		}

		console.log('✅ Test email sent successfully!');
		console.log('📬 Email ID:', data.id);
		console.log('📨 Sent to:', TEST_EMAIL);
		console.log('\n📋 Please check your email and verify:');
		console.log('   ✓ JPEG logo appears crisp and clear (not pixelated)');
		console.log('   ✓ Logo is centered');
		console.log('   ✓ Logo is properly sized');

	} catch (error) {
		console.error('❌ Failed:', error);
	}
}

sendTest();
