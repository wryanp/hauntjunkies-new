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
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="color-scheme" content="light only">
	<meta name="supported-color-schemes" content="light only">
	<title>Your McCloud Manor Tickets</title>
	<style type="text/css">
		@font-face {
			font-family: 'Karma';
			src: url('data:font/opentype;charset=utf-8;base64,${fontBase64}') format('opentype');
			font-weight: normal;
			font-style: normal;
			font-display: swap;
		}
		:root {
			color-scheme: light only;
			supported-color-schemes: light only;
		}
		/* Force colors in dark mode - prevent email client overrides */
		@media (prefers-color-scheme: dark) {
			body, table, td, p, h1, h2, h3, div, span, a {
				background-color: transparent !important;
				color: #1a1a1a !important;
				-webkit-text-fill-color: #1a1a1a !important;
			}
			.email-wrapper { background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; }
			.email-container { background-color: #fffffe !important; background-image: linear-gradient(#fffffe, #fffffe) !important; }
			.detail-bg { background-color: #f9f9f9 !important; background-image: linear-gradient(#f9f9f9, #f9f9f9) !important; }
			.brand-color { color: #a41214 !important; -webkit-text-fill-color: #a41214 !important; }
			.ticket-count { color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-weight: 700 !important; }
			strong { color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-weight: 700 !important; }
		}
		/* Outlook dark mode prevention */
		[data-ogsc] body { background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; }
		[data-ogsc] .header-bg { background-color: #000001 !important; background-image: linear-gradient(#000001, #000001) !important; }
		[data-ogsc] .brand-color { color: #a41214 !important; -webkit-text-fill-color: #a41214 !important; }
	</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; color: #333333 !important; -webkit-text-fill-color: #333333 !important; color-scheme: light only;">
	<table width="100%" cellpadding="0" cellspacing="0" class="email-wrapper" style="background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important;">
		<tr>
			<td align="center" style="padding: 0;">
				<img src="https://hauntjunkies.com/mccloudmanor-logo.jpg" alt="McCloud Manor" style="max-width: 600px; width: 100%; height: auto; display: block; margin: 0 auto;" />
			</td>
		</tr>
		<tr>
			<td align="center" style="padding: 20px 20px 40px 20px;">
				<table width="600" cellpadding="0" cellspacing="0" class="responsive-table email-container" style="max-width: 600px; width: 100%; background-color: #fffffe !important; background-image: linear-gradient(#fffffe, #fffffe) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">

					<!-- Ticket Intro -->
					<tr>
						<td style="padding: 40px 40px 30px 40px; text-align: center;">
							<h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important;">Your Tickets Are Confirmed</h2>
							<p style="margin: 0 0 8px 0; font-size: 16px; color: #666666;">We're excited to terrify you at McCloud Manor.</p>
						</td>
					</tr>

					<!-- Event Details -->
					<tr>
						<td style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0" class="detail-bg" style="background-color: #f9f9f9 !important; background-image: linear-gradient(#f9f9f9, #f9f9f9) !important; border-radius: 6px; overflow: hidden;">
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Guest Name</td>
												<td style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-size: 16px; font-weight: 600; text-align: right;">Vilonte McCloud</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Date</td>
												<td style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-size: 16px; font-weight: 600; text-align: right;">Friday, October 31, 2025</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Time</td>
												<td style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-size: 16px; font-weight: 600; text-align: right;">7:00 PM - 10:00 PM</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Tickets</td>
												<td class="ticket-count" style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; font-size: 18px; font-weight: 700; text-align: right;">2 Tickets</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Action Buttons -->
					<tr>
						<td style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td width="48%" style="padding-right: 2%;">
										<a href="https://www.google.com/maps/dir/?api=1&destination=2100+Carlysle+Park+Lane+Lawrenceville+GA+30044" style="display: block; background-color: #a41214 !important; background-image: linear-gradient(#a41214, #a41214) !important; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											Get Directions
										</a>
									</td>
									<td width="48%" style="padding-left: 2%;">
										<a href="https://hauntjunkies.com/mccloudmanor#faq" style="display: block; background-color: #a41214 !important; background-image: linear-gradient(#a41214, #a41214) !important; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											View FAQ
										</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Important Info -->
					<tr>
						<td style="padding: 0 40px 40px 40px;">
							<div style="background-color: #f9f9f9 !important; background-image: linear-gradient(#f9f9f9, #f9f9f9) !important; border-radius: 6px; padding: 28px 24px;">
								<h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important;">Important Information</h3>
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="padding-bottom: 12px;">
											<p style="margin: 0; color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 14px; line-height: 1.6;">
												<strong style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important;">Parking:</strong> Parking is free but EXTREMELY limited! Please carpool or even Uber/Lyft if possible.
											</p>
										</td>
									</tr>
									<tr>
										<td>
											<p style="margin: 0; color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 14px; line-height: 1.6;">
												<strong style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important;">Weather:</strong> Open rain or shine (line is not covered)
											</p>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>

					<!-- Footer -->
					<tr>
						<td align="center" style="padding: 40px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5;">
							<p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;">
								Questions? Contact us at <a href="mailto:hauntjunkies@gmail.com" style="color: #a41214; text-decoration: none; font-weight: 600;">hauntjunkies@gmail.com</a>
							</p>
							<p style="margin: 0; font-size: 12px; color: #999999;">
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
	subject: '🎃 Dark Mode Fix Test - Your McCloud Manor Tickets',
	html
});

if (error) {
	console.error('❌ Error:', error);
} else {
	console.log('✅ Dark mode test email sent!');
	console.log('📬 Email ID:', data.id);
	console.log('📨 Sent to: vilonte1@gmail.com');
	console.log('🎫 Confirmation #:', confirmationNumber);
	console.log('\n📱 Please check the email in dark mode on iOS Mail and Gmail to verify the text is now visible!');
}
