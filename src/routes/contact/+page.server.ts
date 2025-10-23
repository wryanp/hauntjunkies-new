import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY, TURNSTILE_SECRET_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { Resend } from 'resend';
import { checkRateLimit, getClientIP, formatTimeRemaining } from '$lib/rateLimit';
import { validateEmail, validateText, sanitizeHTML } from '$lib/validation';
import { verifyTurnstile } from '$lib/captcha';
import { dev } from '$app/environment';

const resend = new Resend(RESEND_API_KEY);

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// Rate limiting - 3 submissions per hour per IP
		const clientIP = getClientIP(request);
		const rateLimit = checkRateLimit(clientIP, {
			identifier: 'contact-form',
			maxRequests: 3,
			windowMs: 60 * 60 * 1000 // 1 hour
		});

		if (!rateLimit.success) {
			return fail(429, {
				error: `Too many contact form submissions. Please try again in ${formatTimeRemaining(rateLimit.resetTime)}.`
			});
		}

		// Get form data first to extract CAPTCHA token
		const formData = await request.formData();
		const captchaToken = formData.get('cf-turnstile-response')?.toString() || '';

		// Verify CAPTCHA (skip in development mode)
		if (!dev) {
			const captchaResult = await verifyTurnstile(captchaToken, TURNSTILE_SECRET_KEY);
			if (!captchaResult.success) {
				return fail(400, { error: captchaResult.error || 'Please complete the CAPTCHA verification' });
			}
		}

		// Use service_role key to bypass RLS for contact submissions
		const supabase = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			cookies: {
				get: (key) => cookies.get(key),
				set: (key, value, options) => {
					cookies.set(key, value, { ...options, path: '/' });
				},
				remove: (key, options) => {
					cookies.delete(key, { ...options, path: '/' });
				}
			}
		});

		// Get form fields
		const name = formData.get('name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const subject = formData.get('subject')?.toString() || 'No Subject';
		const message = formData.get('message')?.toString() || '';

		// Validate name
		const nameValidation = validateText(name, {
			fieldName: 'Name',
			minLength: 2,
			maxLength: 100,
			required: true
		});
		if (!nameValidation.valid) {
			return fail(400, { error: nameValidation.error });
		}

		// Validate email
		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			return fail(400, { error: emailValidation.error });
		}

		// Validate subject
		const subjectValidation = validateText(subject, {
			fieldName: 'Subject',
			maxLength: 200,
			required: false
		});
		if (!subjectValidation.valid) {
			return fail(400, { error: subjectValidation.error });
		}

		// Validate message
		const messageValidation = validateText(message, {
			fieldName: 'Message',
			minLength: 10,
			maxLength: 5000,
			required: true
		});
		if (!messageValidation.valid) {
			return fail(400, { error: messageValidation.error });
		}

		// Use sanitized values
		const sanitizedName = nameValidation.sanitized!;
		const sanitizedSubject = subjectValidation.sanitized || 'No Subject';
		const sanitizedMessage = messageValidation.sanitized!;

		const { error: insertError } = await supabase
			.from('contact_submissions')
			.insert({
				name: sanitizedName,
				email: email,
				subject: sanitizedSubject,
				message: sanitizedMessage
			});

		if (insertError) {
			console.error('Error inserting contact submission:', insertError);
			return fail(500, { error: 'Failed to send message. Please try again.' });
		}

		// Send email notification to admin
		try {
			// Sanitize for HTML email (prevent XSS in email clients)
			const safeEmail = sanitizeHTML(email);
			const safeName = sanitizeHTML(sanitizedName);
			const safeSubject = sanitizeHTML(sanitizedSubject);
			const safeMessage = sanitizeHTML(sanitizedMessage);

			const emailHtml = `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>New Contact Form Submission</title>
				</head>
				<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
					<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
						<tr>
							<td align="center" style="padding: 50px 20px;">
								<table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 2px solid #FC7403; border-radius: 10px;">
									<!-- Header -->
									<tr>
										<td align="center" style="padding: 40px; background-color: #000000; border-bottom: 4px solid #FC7403; border-radius: 10px 10px 0 0;">
											<h1 style="margin: 0; color: #FC7403; font-size: 32px; font-weight: bold; text-shadow: 0 0 10px rgba(252, 116, 3, 0.5);">
												NEW CONTACT MESSAGE
											</h1>
										</td>
									</tr>

									<!-- Content -->
									<tr>
										<td style="padding: 40px;">
											<table width="100%" cellpadding="0" cellspacing="0">
												<tr>
													<td style="padding-bottom: 30px;">
														<h2 style="margin: 0 0 20px 0; color: #FC7403; font-size: 20px;">Contact Details</h2>

														<table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #333;">
															<tr>
																<td style="padding: 15px 0; border-bottom: 1px solid #333;">
																	<span style="color: #888888; font-size: 14px; display: block; margin-bottom: 5px;">Name</span>
																	<span style="color: #ffffff; font-size: 16px; font-weight: bold;">${safeName}</span>
																</td>
															</tr>
															<tr>
																<td style="padding: 15px 0; border-bottom: 1px solid #333;">
																	<span style="color: #888888; font-size: 14px; display: block; margin-bottom: 5px;">Email</span>
																	<a href="mailto:${safeEmail}" style="color: #FC7403; font-size: 16px; text-decoration: none;">${safeEmail}</a>
																</td>
															</tr>
															<tr>
																<td style="padding: 15px 0; border-bottom: 1px solid #333;">
																	<span style="color: #888888; font-size: 14px; display: block; margin-bottom: 5px;">Subject</span>
																	<span style="color: #ffffff; font-size: 16px;">${safeSubject}</span>
																</td>
															</tr>
														</table>
													</td>
												</tr>

												<tr>
													<td style="padding-top: 10px;">
														<h2 style="margin: 0 0 15px 0; color: #FC7403; font-size: 20px;">Message</h2>
														<div style="background-color: #0a0a0a; border-left: 4px solid #FC7403; padding: 20px; border-radius: 5px;">
															<p style="margin: 0; color: #cccccc; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
														</div>
													</td>
												</tr>
											</table>
										</td>
									</tr>

									<!-- Footer -->
									<tr>
										<td align="center" style="padding: 30px; background-color: #0a0a0a; border-top: 2px solid #333; border-radius: 0 0 10px 10px;">
											<p style="margin: 0; color: #666666; font-size: 14px;">
												This message was sent from the Haunt Junkies contact form
											</p>
											<p style="margin: 10px 0 0 0; color: #666666; font-size: 12px;">
												Respond directly to: <a href="mailto:${safeEmail}" style="color: #FC7403; text-decoration: none;">${safeEmail}</a>
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

			await resend.emails.send({
				from: 'Haunt Junkies <onboarding@resend.dev>',
				to: 'hauntjunkies@gmail.com',
				subject: `New Contact Form: ${subject}`,
				html: emailHtml,
				reply_to: email
			});
		} catch (emailError) {
			console.error('Error sending contact notification email:', emailError);
			// Don't fail the form submission if email fails
		}

		return { success: true };
	}
};
