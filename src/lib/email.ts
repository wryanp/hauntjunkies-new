import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import ical from 'ical-generator';
import { createHmac, randomBytes } from 'crypto';
import { logEmailError, logError } from './logger';
import * as QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

// Validate API key before initializing Resend client
if (!RESEND_API_KEY || RESEND_API_KEY === 'your_resend_api_key') {
	throw new Error('RESEND_API_KEY is not configured. Please set it in your .env file.');
}

// Validate email from address
if (!RESEND_FROM_EMAIL) {
	throw new Error('RESEND_FROM_EMAIL is not configured. Please set it in your .env file.');
}

const resend = new Resend(RESEND_API_KEY);

// Initialize Supabase client with service role key
const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

interface TicketData {
	confirmationNumber: string;
	firstName: string;
	lastName: string;
	email: string;
	date: string;
	startTime?: string;
	endTime?: string;
	tickets: number;
	specialRequests?: string;
	ticketRequestId?: string;  // UUID from ticket_requests table
}

function generateConfirmationNumber(): string {
	// Generate format: MCM-YYYYMMDD-XXXX (MCM = McCloud Manor)
	const date = new Date();
	const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
	const random = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `MCM-${dateStr}-${random}`;
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

function formatTime(timeString: string): string {
	if (!timeString) return '';
	return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

/**
 * Generate a unique secure token for QR code
 */
function generateQRToken(): string {
	return randomBytes(32).toString('hex'); // 64-character hex string
}

/**
 * Store QR token in database and link to ticket request
 */
async function storeQRToken(ticketRequestId: string, qrToken: string): Promise<boolean> {
	try {
		console.log('[QR] Storing QR token for ticket:', ticketRequestId);
		console.log('[QR] Token (first 20 chars):', qrToken.substring(0, 20));

		// Set expiration to event date + 30 days (for grace period)
		const { error } = await supabase
			.from('ticket_qr_codes')
			.insert({
				ticket_request_id: ticketRequestId,
				qr_token: qrToken,
				expires_at: null  // No expiration for now, can be added later
			});

		if (error) {
			console.error('[QR] Error storing QR token in database:', error);
			return false;
		}

		console.log('[QR] Successfully stored QR token in database');
		return true;
	} catch (error) {
		console.error('[QR] Exception storing QR token:', error);
		return false;
	}
}

/**
 * Generate QR code image from URL
 */
async function generateQRCode(url: string): Promise<string> {
	try {
		console.log('[QR] Attempting to generate QR code for URL:', url);
		console.log('[QR] QRCode module type:', typeof QRCode);
		console.log('[QR] QRCode.toDataURL type:', typeof QRCode.toDataURL);

		// Generate QR code as data URL (base64 encoded PNG)
		const qrCodeDataUrl = await QRCode.toDataURL(url, {
			width: 200,
			margin: 2,
			color: {
				dark: '#000000',
				light: '#FFFFFF'
			}
		});

		console.log('[QR] Successfully generated QR code, length:', qrCodeDataUrl.length);
		return qrCodeDataUrl;
	} catch (error) {
		console.error('[QR] Error generating QR code:', error);
		console.error('[QR] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
		// Return empty string if QR code generation fails
		return '';
	}
}

function generateCalendarInvite(ticketData: TicketData): string {
	const calendar = ical({ name: 'McCloud Manor Ticket' });

	const eventDate = new Date(ticketData.date);
	const startTime = ticketData.startTime || '20:00:00'; // Default 8 PM
	const endTime = ticketData.endTime || '23:00:00'; // Default 11 PM

	const startDateTime = new Date(`${ticketData.date}T${startTime}`);
	const endDateTime = new Date(`${ticketData.date}T${endTime}`);

	calendar.createEvent({
		start: startDateTime,
		end: endDateTime,
		summary: 'McCloud Manor',
		description: `Your tickets for McCloud Manor!\n\nTickets: ${ticketData.tickets}\n\nAddress: 2100 Carlysle Park Lane, Lawrenceville, GA 30044\n\nParking is free but EXTREMELY limited! Please carpool or even Uber/Lyft if possible. Do not park in or block any of our neighbors driveways.\n\nMore info: https://hauntjunkies.com/mccloudmanor#faq`,
		location: '2100 Carlysle Park Lane, Lawrenceville, GA 30044',
		url: 'https://hauntjunkies.com/mccloudmanor'
	});

	return calendar.toString();
}

async function createCustomerEmailHTML(ticketData: TicketData): Promise<string> {
	const dateFormatted = formatDate(ticketData.date);
	const timeStr = ticketData.startTime && ticketData.endTime
		? `${formatTime(ticketData.startTime)} - ${formatTime(ticketData.endTime)}`
		: 'See details below';

	// Generate unique QR token and store in database (if ticketRequestId is provided)
	let qrCodeImage = '';
	console.log('[EMAIL] Starting QR code generation process');
	console.log('[EMAIL] ticketRequestId:', ticketData.ticketRequestId);
	console.log('[EMAIL] ticketRequestId type:', typeof ticketData.ticketRequestId);
	console.log('[EMAIL] Full ticketData:', JSON.stringify(ticketData, null, 2));

	if (ticketData.ticketRequestId) {
		console.log('[EMAIL] ✓ ticketRequestId provided, generating QR code');
		const qrToken = generateQRToken();
		console.log('[EMAIL] Generated token (first 20):', qrToken.substring(0, 20));

		const stored = await storeQRToken(ticketData.ticketRequestId, qrToken);
		console.log('[EMAIL] Token storage result:', stored);

		if (stored) {
			// Generate QR code with validation URL
			const qrValidationUrl = `https://hauntjunkies.com/api/validate-qr?token=${qrToken}`;
			console.log('[EMAIL] QR validation URL:', qrValidationUrl);
			qrCodeImage = await generateQRCode(qrValidationUrl);
			console.log('[EMAIL] QR code generated, length:', qrCodeImage.length);
			console.log('[EMAIL] QR code prefix:', qrCodeImage.substring(0, 50));
		} else {
			console.error('[EMAIL] ✗ Failed to store QR token in database');
		}
	} else {
		console.warn('[EMAIL] ✗ No ticketRequestId provided, skipping QR code generation');
		console.warn('[EMAIL] This means the QR code will NOT appear in the email');
	}

	return `
<!DOCTYPE html>
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
			src: url('data:font/opentype;charset=utf-8;base64,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') format('opentype');
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
			.ticket-count { color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-weight: 700 !important; }
			strong { color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-weight: 700 !important; }
		}
		/* Outlook dark mode prevention */
		[data-ogsc] body { background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; }
		[data-ogsc] .header-bg { background-color: #000001 !important; background-image: linear-gradient(#000001, #000001) !important; }
		[data-ogsc] .brand-color { color: #a41214 !important; -webkit-text-fill-color: #a41214 !important; }
		@media only screen and (max-width: 600px) {
			.responsive-table {
				width: 100% !important;
			}
			.mobile-padding {
				padding: 20px !important;
			}
			.mobile-header-padding {
				padding: 30px 20px !important;
			}
			.mobile-font-xlarge {
				font-size: 48px !important;
			}
			.mobile-brand-title {
				font-size: 48px !important;
			}
			.mobile-font-large {
				font-size: 24px !important;
			}
			.mobile-font-medium {
				font-size: 16px !important;
			}
			.mobile-font-small {
				font-size: 14px !important;
			}
			.button-column {
				display: block !important;
				width: 100% !important;
				padding: 0 0 10px 0 !important;
			}
			.button-link {
				display: block !important;
				width: 100% !important;
				box-sizing: border-box !important;
			}
		}
	</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; color: #333333 !important; -webkit-text-fill-color: #333333 !important; color-scheme: light only;">
	<table width="100%" cellpadding="0" cellspacing="0" class="email-wrapper" style="background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important;">
		<tr>
			<td align="center" style="padding: 0;">
				<!-- McCloud Manor Logo - Full Width -->
				<img src="https://hauntjunkies.com/mccloudmanor-logo.jpg" alt="McCloud Manor" style="max-width: 600px; width: 100%; height: auto; display: block; margin: 0 auto;" />
			</td>
		</tr>
		<tr>
			<td align="center" style="padding: 20px 20px 40px 20px;">
				<table width="600" cellpadding="0" cellspacing="0" class="responsive-table email-container" style="max-width: 600px; width: 100%; background-color: #fffffe !important; background-image: linear-gradient(#fffffe, #fffffe) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">

					<!-- Ticket Intro -->
					<tr>
						<td class="mobile-padding" style="padding: 40px 40px 30px 40px; text-align: center;">
							<h2 class="mobile-font-large" style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important;">Your Tickets Are Confirmed</h2>
							<p style="margin: 0 0 8px 0; font-size: 16px; color: #666666; line-height: 1.6;">
								We're excited to terrify you at McCloud Manor.
							</p>
							<p style="margin: 0 0 20px 0; font-size: 16px; color: #666666; line-height: 1.6;">
								Please review your event details below.
							</p>
							${qrCodeImage ? `
							<!-- QR Code -->
							<div style="margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
								<img src="${qrCodeImage}" alt="Ticket QR Code" style="display: block; width: 200px; height: 200px; margin: 0 auto;" />
								<p style="margin: 12px 0 0 0; font-size: 12px; color: #999999; text-align: center;">Scan at entry</p>
							</div>
							` : ''}
						</td>
					</tr>

					<!-- Event Details -->
					<tr>
						<td class="mobile-padding" style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0" class="detail-bg" style="background-color: #f9f9f9 !important; background-image: linear-gradient(#f9f9f9, #f9f9f9) !important; border-radius: 6px; overflow: hidden;">
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Guest Name</td>
												<td style="color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-size: 16px; font-weight: 600; text-align: right;">${ticketData.firstName} ${ticketData.lastName}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Date</td>
												<td style="color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-size: 16px; font-weight: 600; text-align: right;">${dateFormatted}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Time</td>
												<td style="color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-size: 16px; font-weight: 600; text-align: right;">${timeStr}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Tickets</td>
												<td class="ticket-count" style="color: #000000 !important; -webkit-text-fill-color: #000000 !important; -apple-color-filter: none !important; font-size: 18px; font-weight: 700; text-align: right;">${ticketData.tickets} ${ticketData.tickets === 1 ? 'Ticket' : 'Tickets'}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Action Buttons -->
					<tr>
						<td class="mobile-padding" style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td class="button-column" width="48%" style="padding-right: 2%;">
										<a href="https://www.google.com/maps/dir/?api=1&destination=2100+Carlysle+Park+Lane+Lawrenceville+GA+30044" class="button-link" style="display: block; background-color: #a41214 !important; background-image: linear-gradient(#a41214, #a41214) !important; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											Get Directions
										</a>
									</td>
									<td class="button-column" width="48%" style="padding-left: 2%;">
										<a href="https://hauntjunkies.com/mccloudmanor#faq-section" class="button-link" style="display: block; background-color: #a41214 !important; background-image: linear-gradient(#a41214, #a41214) !important; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											View FAQ
										</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Important Info -->
					<tr>
						<td class="mobile-padding" style="padding: 0 40px 40px 40px;">
							<div style="background-color: #f9f9f9 !important; background-image: linear-gradient(#f9f9f9, #f9f9f9) !important; border-radius: 6px; padding: 28px 24px;">
								<h3 class="mobile-font-medium" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important;">Important Information</h3>
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="padding-bottom: 12px;">
											<p style="margin: 0; color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 14px; line-height: 1.6;">
												<strong style="color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important;">Parking:</strong> Parking is free but EXTREMELY limited! Please carpool or even Uber/Lyft if possible. Do not park in or block any of our neighbors driveways.
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
						<td align="center" class="mobile-padding" style="padding: 40px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5;">
							<p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;">
								Questions? Contact us at <a href="mailto:hauntjunkies@gmail.com" style="color: #a41214; text-decoration: none; font-weight: 600;">hauntjunkies@gmail.com</a>
							</p>
							<p style="margin: 0 0 16px 0; font-size: 14px; color: #666666;">
								<a href="https://hauntjunkies.com/mccloudmanor" style="color: #a41214; text-decoration: none; font-weight: 600;">Visit McCloud Manor Website</a>
							</p>
							<p style="margin: 0; font-size: 12px; color: #999999;">
								© ${new Date().getFullYear()} Haunt Junkies. All rights reserved.
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
}

function createEmailFailureAlertHTML(ticketData: TicketData, errorMessage: string): string {
	const dateFormatted = formatDate(ticketData.date);

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="color-scheme" content="light only">
	<meta name="supported-color-schemes" content="light only">
	<title>Email Delivery Failure</title>
	<style type="text/css">
		:root { color-scheme: light only; }
		@media (prefers-color-scheme: dark) {
			body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; color: #fffffe !important; }
		}
		[data-ogsc] body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
	</style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #ff0000; border-bottom: 3px solid #ff0000; padding-bottom: 10px;">⚠️ URGENT: Email Delivery Failed</h1>

	<div style="padding: 20px; background-color: #330000; border: 2px solid #ff0000; border-radius: 5px; margin: 20px 0;">
		<p style="margin: 0; color: #ffcccc; font-size: 18px; font-weight: bold;">
			A customer purchased tickets but their confirmation email failed to send!
		</p>
	</div>

	<h2 style="color: #ff0000; margin-top: 30px;">Customer Details</h2>
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold; width: 40%;">Guest Name:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${ticketData.firstName} ${ticketData.lastName}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Email:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${ticketData.email}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Date:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${dateFormatted}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Number of Tickets:</td>
			<td style="padding: 8px; background-color: #333333; color: #ff0000; border: 1px solid #444; font-size: 18px; font-weight: bold;">${ticketData.tickets}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Confirmation #:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444; font-family: monospace;">${ticketData.confirmationNumber}</td>
		</tr>
	</table>

	<h2 style="color: #ff0000; margin-top: 30px;">Error Details</h2>
	<div style="padding: 15px; background-color: #2a2a2a; border-left: 4px solid #ff0000; margin-bottom: 20px; font-family: monospace; color: #ffcccc;">
		${errorMessage}
	</div>

	<div style="margin-top: 30px; padding: 20px; background-color: #330000; border-radius: 5px; border: 1px solid #ff0000;">
		<p style="margin: 0 0 10px 0; font-size: 16px; color: #ffffff; font-weight: bold;">
			⚠️ ACTION REQUIRED:
		</p>
		<p style="margin: 0; color: #ffcccc; font-size: 14px;">
			Please manually send a confirmation email to <strong>${ticketData.email}</strong> with their ticket details and confirmation number <strong>${ticketData.confirmationNumber}</strong>.
		</p>
	</div>

	<hr style="margin: 30px 0; border: none; border-top: 1px solid #444;">

	<p style="font-size: 12px; color: #666; text-align: center;">
		Sent from HauntJunkies Ticket System - Email Failure Alert
	</p>
</body>
</html>
`;
}

function createAdminEmailHTML(ticketData: TicketData): string {
	const dateFormatted = formatDate(ticketData.date);
	const timeStr = ticketData.startTime && ticketData.endTime
		? `${formatTime(ticketData.startTime)} - ${formatTime(ticketData.endTime)}`
		: 'Not specified';

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="color-scheme" content="light only">
	<meta name="supported-color-schemes" content="light only">
	<title>New Ticket Request</title>
	<style type="text/css">
		:root { color-scheme: light only; }
		@media (prefers-color-scheme: dark) {
			body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; color: #fffffe !important; }
		}
		[data-ogsc] body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
	</style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #cc0000; border-bottom: 3px solid #cc0000; padding-bottom: 10px;">New Ticket Request</h1>

	<h2 style="color: #cc0000; margin-top: 30px;">Guest Details</h2>
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold; width: 40%;">Guest Name:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${ticketData.firstName} ${ticketData.lastName}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Email:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${ticketData.email || 'Not provided'}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Date:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${dateFormatted}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Time:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${timeStr}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Number of Tickets:</td>
			<td style="padding: 8px; background-color: #333333; color: #cc0000; border: 1px solid #444; font-size: 18px; font-weight: bold;">${ticketData.tickets}</td>
		</tr>
	</table>

	<div style="margin-top: 30px; padding: 15px; background-color: #2a2a2a; border-radius: 5px; border: 1px solid #444;">
		<p style="margin: 0; font-size: 14px; color: #cccccc;">
			<strong style="color: #ffffff;">Next Steps:</strong> This request has been automatically confirmed and the customer has received their digital ticket via email.
		</p>
	</div>

	<hr style="margin: 30px 0; border: none; border-top: 1px solid #444;">

	<p style="font-size: 12px; color: #666; text-align: center;">
		Sent from HauntJunkies Ticket System
	</p>
</body>
</html>
`;
}

export async function sendTicketConfirmation(ticketData: TicketData) {
	const calendarInvite = generateCalendarInvite(ticketData);

	try {
		// Construct proper from field - Resend requires plain email or "Name <email>" format
		// Environment variable should be just the email address (e.g., "noreply@hauntjunkies.com")
		const fromEmail = `Haunt Junkies <${RESEND_FROM_EMAIL}>`;

		console.log(`Sending ticket confirmation email to: ${ticketData.email} from: ${fromEmail}`);

		// Send customer email with calendar attachment
		const customerEmailResult = await resend.emails.send({
			from: fromEmail,
			to: ticketData.email,
			subject: 'Your McCloud Manor Tickets',
			html: await createCustomerEmailHTML(ticketData),
			attachments: [
				{
					filename: 'mccloud-manor-ticket.ics',
					content: calendarInvite
				}
			]
		});

		console.log('Customer email sent successfully:', {
			id: customerEmailResult.data?.id,
			to: ticketData.email,
			error: customerEmailResult.error
		});

		// Check if customer email failed
		if (customerEmailResult.error) {
			// Send urgent alert to admin about email failure
			try {
				await resend.emails.send({
					from: fromEmail,
					to: 'hauntjunkies@gmail.com',
					subject: `🚨 URGENT: Ticket Confirmation Email Failed - ${ticketData.email}`,
					html: createEmailFailureAlertHTML(ticketData, customerEmailResult.error.message)
				});
			} catch (alertError) {
				// Silently handle alert email failure
			}

			throw new Error(`Customer email failed: ${customerEmailResult.error.message}`);
		}

		// Send notification to admin
		const adminEmailResult = await resend.emails.send({
			from: fromEmail,
			to: 'hauntjunkies@gmail.com',
			subject: `New Ticket Request - ${new Date(ticketData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${ticketData.tickets} tickets)`,
			html: createAdminEmailHTML(ticketData)
		});

		console.log('Admin email sent successfully:', {
			id: adminEmailResult.data?.id,
			error: adminEmailResult.error
		});

		// Check if admin email failed
		if (adminEmailResult.error) {
			// Don't throw here - customer email succeeded, that's more important
			console.error('Admin email failed but customer email succeeded');
		}

		return { success: true, customerEmailId: customerEmailResult.data?.id };
	} catch (error) {
		return { success: false, error };
	}
}

interface CommentData {
	commentId: string;
	reviewName: string;
	reviewSlug: string;
	authorName: string;
	authorEmail: string;
	commentText: string;
	approvalToken: string;
}

/**
 * Generate HMAC signature for approval token
 * Must match the implementation in /api/comments/approve/+server.ts
 */
function generateApprovalHmac(token: string): string {
	const secret = SUPABASE_SERVICE_ROLE_KEY;
	return createHmac('sha256', secret)
		.update(token)
		.digest('hex');
}

function createCommentNotificationHTML(commentData: CommentData): string {
	const approvalUrl = `https://hauntjunkies.com/api/comments/approve`;
	const hmac = generateApprovalHmac(commentData.approvalToken);

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="color-scheme" content="light only">
	<meta name="supported-color-schemes" content="light only">
	<title>New Comment on Review</title>
	<style type="text/css">
		:root { color-scheme: light only; }
		@media (prefers-color-scheme: dark) {
			body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; color: #fffffe !important; }
			.button { background-color: #FC7403 !important; background-image: linear-gradient(#FC7403, #FC7403) !important; color: #fffffe !important; }
		}
		[data-ogsc] body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
		[data-ogsc] .button { background-color: #FC7403 !important; background-image: linear-gradient(#FC7403, #FC7403) !important; }
	</style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #FC7403; border-bottom: 3px solid #FC7403; padding-bottom: 10px;">New Comment Submitted</h1>

	<h2 style="color: #FC7403; margin-top: 30px;">Review Details</h2>
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold; width: 40%;">Review:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${commentData.reviewName}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Review URL:</td>
			<td style="padding: 8px; background-color: #333333; border: 1px solid #444;">
				<a href="https://hauntjunkies.com/reviews/${commentData.reviewSlug}" style="color: #FC7403; text-decoration: none;">View Review</a>
			</td>
		</tr>
	</table>

	<h2 style="color: #FC7403; margin-top: 30px;">Comment Details</h2>
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold; width: 40%;">Author Name:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${commentData.authorName}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Author Email:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${commentData.authorEmail}</td>
		</tr>
	</table>

	<h2 style="color: #FC7403; margin-top: 30px;">Comment Text</h2>
	<div style="padding: 15px; background-color: #2a2a2a; border-left: 4px solid #FC7403; margin-bottom: 30px;">
		<p style="margin: 0; color: #cccccc; white-space: pre-wrap;">${commentData.commentText}</p>
	</div>

	<div style="margin-top: 30px; padding: 20px; background-color: #2a2a2a; border-radius: 5px; border: 1px solid #FC7403; text-align: center;">
		<p style="margin: 0 0 15px 0; font-size: 16px; color: #ffffff;">
			<strong>Quick Actions:</strong>
		</p>
		<div style="margin: 15px 0;">
			<!-- SECURITY: Using POST form instead of GET link to prevent CSRF attacks -->
			<form action="${approvalUrl}" method="POST" style="display: inline-block;">
				<input type="hidden" name="token" value="${commentData.approvalToken}" />
				<input type="hidden" name="hmac" value="${hmac}" />
				<button type="submit" class="button" style="display: inline-block; background-color: #FC7403 !important; background-image: linear-gradient(#FC7403, #FC7403) !important; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 5px; border: none; cursor: pointer;">
					✅ Approve Comment
				</button>
			</form>
		</div>
		<p style="margin: 15px 0 0 0; font-size: 14px; color: #cccccc;">
			Or manage comments in the <a href="https://hauntjunkies.com/admin/comments" style="color: #FC7403; text-decoration: none;">admin panel</a>
		</p>
		<p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
			⏰ This approval link expires in 7 days for security.
		</p>
	</div>

	<hr style="margin: 30px 0; border: none; border-top: 1px solid #444;">

	<p style="font-size: 12px; color: #666; text-align: center;">
		Sent from HauntJunkies Comment System
	</p>
</body>
</html>
`;
}

export async function sendCommentNotification(commentData: CommentData) {
	try {
		// Construct proper from field - Resend requires plain email or "Name <email>" format
		const fromEmail = `Haunt Junkies <${RESEND_FROM_EMAIL}>`;

		const result = await resend.emails.send({
			from: fromEmail,
			to: 'hauntjunkies@gmail.com',
			subject: `New Comment on "${commentData.reviewName}"`,
			html: createCommentNotificationHTML(commentData)
		});

		if (result.error) {
			throw new Error(`Email failed: ${result.error.message}`);
		}

		return { success: true };
	} catch (error) {
		return { success: false, error };
	}
}

export { generateConfirmationNumber };
