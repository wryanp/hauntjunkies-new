import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import ical from 'ical-generator';
import { createHmac } from 'crypto';
import { logEmailError, logError } from './logger';

// Validate API key before initializing Resend client
if (!RESEND_API_KEY || RESEND_API_KEY === 'your_resend_api_key') {
	throw new Error('RESEND_API_KEY is not configured. Please set it in your .env file.');
}

// Validate email from address
if (!RESEND_FROM_EMAIL) {
	throw new Error('RESEND_FROM_EMAIL is not configured. Please set it in your .env file.');
}

const resend = new Resend(RESEND_API_KEY);

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

function createCustomerEmailHTML(ticketData: TicketData): string {
	const dateFormatted = formatDate(ticketData.date);
	const timeStr = ticketData.startTime && ticketData.endTime
		? `${formatTime(ticketData.startTime)} - ${formatTime(ticketData.endTime)}`
		: 'See details below';

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
			src: url('https://hauntjunkies.com/fonts/Karma-FreeVersion.ttf') format('truetype');
			font-weight: normal;
			font-style: normal;
		}
		:root {
			color-scheme: light only;
			supported-color-schemes: light only;
		}
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
				font-size: 32px !important;
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
<body style="margin: 0; padding: 0; font-family: 'Karma', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; color: #333333;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table width="600" cellpadding="0" cellspacing="0" class="responsive-table" style="max-width: 600px; width: 100%; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">

					<!-- Header -->
					<tr>
						<td align="center" class="mobile-header-padding" style="padding: 50px 40px; background-color: #000000; border-bottom: 4px solid #a41214;">
							<h1 style="margin: 0; font-size: 48px; font-weight: 700; color: #a41214; font-family: 'Georgia', serif; letter-spacing: 2px; text-transform: uppercase;">McCloud Manor</h1>
						</td>
					</tr>

					<!-- Ticket Intro -->
					<tr>
						<td class="mobile-padding" style="padding: 40px 40px 30px 40px; text-align: center;">
							<h2 class="mobile-font-large" style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #000000;">Your Tickets Are Confirmed</h2>
							<p style="margin: 0 0 8px 0; font-size: 16px; color: #666666; line-height: 1.6;">
								We're excited to terrify you at McCloud Manor.
							</p>
							<p style="margin: 0; font-size: 16px; color: #666666; line-height: 1.6;">
								Please review your event details below.
							</p>
						</td>
					</tr>

					<!-- Event Details -->
					<tr>
						<td class="mobile-padding" style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; overflow: hidden;">
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Guest Name</td>
												<td style="color: #000000; font-size: 16px; font-weight: 600; text-align: right;">${ticketData.firstName} ${ticketData.lastName}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Date</td>
												<td style="color: #000000; font-size: 16px; font-weight: 600; text-align: right;">${dateFormatted}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Time</td>
												<td style="color: #000000; font-size: 16px; font-weight: 600; text-align: right;">${timeStr}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Tickets</td>
												<td style="color: #a41214; font-size: 18px; font-weight: 700; text-align: right;">${ticketData.tickets} ${ticketData.tickets === 1 ? 'Ticket' : 'Tickets'}</td>
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
										<a href="https://www.google.com/maps/dir/?api=1&destination=2100+Carlysle+Park+Lane+Lawrenceville+GA+30044" class="button-link" style="display: block; background-color: #a41214; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											Get Directions
										</a>
									</td>
									<td class="button-column" width="48%" style="padding-left: 2%;">
										<a href="https://hauntjunkies.com/mccloudmanor#faq" class="button-link" style="display: block; background-color: #a41214; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
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
							<div style="background-color: #f9f9f9; border-radius: 6px; padding: 28px 24px;">
								<h3 class="mobile-font-medium" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #000000;">Important Information</h3>
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="padding-bottom: 12px;">
											<p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
												<strong style="color: #000000;">Parking:</strong> Parking is free but EXTREMELY limited! Please carpool or even Uber/Lyft if possible. Do not park in or block any of our neighbors driveways.
											</p>
										</td>
									</tr>
									<tr>
										<td>
											<p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
												<strong style="color: #000000;">Weather:</strong> Open rain or shine (line is not covered)
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
	<title>Email Delivery Failure</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
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
	<title>New Ticket Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
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
			html: createCustomerEmailHTML(ticketData),
			attachments: [
				{
					filename: 'mccloud-manor-ticket.ics',
					content: calendarInvite
				}
			]
		});

		console.log('Customer email result:', customerEmailResult);

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

		// Check if admin email failed
		if (adminEmailResult.error) {
			// Don't throw here - customer email succeeded, that's more important
		}

		return { success: true };
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
	<title>New Comment on Review</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
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
				<button type="submit" style="display: inline-block; background-color: #FC7403; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 5px; border: none; cursor: pointer;">
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
