import { Resend } from 'resend';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

// Read the font
const fontData = fs.readFileSync('./static/fonts/Karma-FreeVersion.otf');
const fontBase64 = fontData.toString('base64');

// Generate confirmation number
const confirmationNumber = 'MCM-' + new Date().toISOString().split('T')[0].replace(/-/g, '') + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

const html = `<!DOCTYPE html>
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
	</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
		<tr>
			<td align="center" style="padding: 0;">
				<img src="https://hauntjunkies.com/mccloudmanor-logo.jpg" alt="McCloud Manor" style="max-width: 600px; width: 100%; height: auto; display: block; margin: 0 auto;" />
			</td>
		</tr>
		<tr>
			<td align="center" style="padding: 20px 20px 40px 20px;">
				<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #fffffe; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">

					<!-- Ticket Intro -->
					<tr>
						<td style="padding: 40px 40px 30px 40px; text-align: center;">
							<h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #000001;">Your Tickets Are Confirmed</h2>
							<p style="margin: 0 0 8px 0; font-size: 16px; color: #666666;">We're excited to terrify you at McCloud Manor.</p>
						</td>
					</tr>

					<!-- Event Details -->
					<tr>
						<td style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; overflow: hidden;">
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #000001; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Guest Name</td>
												<td style="color: #000001; font-size: 16px; font-weight: 600; text-align: right;">Vilonte McCloud</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #000001; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Date</td>
												<td style="color: #000001; font-size: 16px; font-weight: 600; text-align: right;">Friday, October 31, 2025</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #000001; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Time</td>
												<td style="color: #000001; font-size: 16px; font-weight: 600; text-align: right;">7:00 PM - 10:00 PM</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #000001; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Tickets</td>
												<td style="color: #000001; font-size: 18px; font-weight: 700; text-align: right;">2 Tickets</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Confirmation Number -->
					<tr>
						<td style="padding: 0 40px 30px 40px;">
							<div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; text-align: center;">
								<p style="margin: 0 0 8px 0; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Confirmation Number</p>
								<p style="margin: 0; font-size: 20px; color: #000001; font-family: 'Courier New', monospace; font-weight: 700; letter-spacing: 1px;">${confirmationNumber}</p>
							</div>
						</td>
					</tr>

					<!-- Action Buttons -->
					<tr>
						<td style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td width="48%" style="padding-right: 2%;">
										<a href="https://www.google.com/maps/dir/?api=1&destination=2100+Carlysle+Park+Lane+Lawrenceville+GA+30044" style="display: block; background-color: #a41214; color: #fffffe; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											Get Directions
										</a>
									</td>
									<td width="48%" style="padding-left: 2%;">
										<a href="https://hauntjunkies.com/mccloudmanor#faq" style="display: block; background-color: #a41214; color: #fffffe; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											View FAQ
										</a>
									</td>
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
</html>`;

const { data, error } = await resend.emails.send({
	from: 'Haunt Junkies <noreply@hauntjunkies.com>',
	to: ['vilonte1@gmail.com'],
	subject: '🎃 Your McCloud Manor Tickets - Full Test',
	html
});

if (error) {
	console.error('❌ Error:', error);
} else {
	console.log('✅ Full ticket confirmation sent!');
	console.log('📬 Email ID:', data.id);
	console.log('📨 Sent to: vilonte1@gmail.com');
	console.log('🎫 Confirmation #:', confirmationNumber);
}
