import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/supabase';
import { fail } from '@sveltejs/kit';
import { sendTicketConfirmation, generateConfirmationNumber } from '$lib/email';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY, TURNSTILE_SECRET_KEY } from '$env/static/private';
import { checkRateLimit, getClientIP, formatTimeRemaining } from '$lib/rateLimit';
import { validateEmail, validateText, validatePhone, validateInteger, validateDate } from '$lib/validation';
import { verifyTurnstile } from '$lib/captcha';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ setHeaders, cookies }) => {
	// Disable caching to always fetch fresh ticket data
	setHeaders({
		'cache-control': 'no-store, no-cache, must-revalidate, max-age=0'
	});

	// Use service_role key to read ticket_requests data (needed for capacity calculation)
	const supabaseAdmin = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
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

	// Fetch available ticket dates
	const { data: dates } = await supabaseAdmin
		.from('ticket_dates')
		.select('*')
		.eq('is_available', true)
		.gte('date', new Date().toISOString().split('T')[0])
		.order('date', { ascending: true });

	if (!dates) {
		return { availableDates: [] };
	}

	// For each date, calculate tickets_sold from confirmed ticket requests
	const datesWithTicketsSold = await Promise.all(
		dates.map(async (date) => {
			const { data: requests, error } = await supabaseAdmin
				.from('ticket_requests')
				.select('tickets')
				.eq('date', date.date)
				.eq('status', 'confirmed');

			// Silently handle ticket fetch errors

			const tickets_sold = requests?.reduce((sum, req) => sum + req.tickets, 0) || 0;

			return {
				...date,
				tickets_sold
			};
		})
	);

	return {
		availableDates: datesWithTicketsSold
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		// Rate limiting - 25 ticket purchases per hour per IP (skip only in explicit development mode)
		// SECURITY FIX: Fail-safe default - security checks are ON unless explicitly in development
		// This prevents accidental bypass if NODE_ENV is misconfigured (e.g., 'staging', undefined, etc.)
		if (process.env.NODE_ENV !== 'development') {
			const clientIP = getClientIP(request);
			const rateLimit = await checkRateLimit(clientIP, {
				identifier: 'ticket-purchase',
				maxRequests: 25,
				windowMs: 60 * 60 * 1000 // 1 hour
			});

			if (!rateLimit.success) {
				return fail(429, {
					error: `Too many ticket purchase attempts. Please try again in ${formatTimeRemaining(rateLimit.resetTime)}.`
				});
			}
		}

		// Get form data first to extract CAPTCHA token
		const formData = await request.formData();
		const captchaToken = formData.get('cf-turnstile-response')?.toString() || '';

		// Verify CAPTCHA (skip only in explicit development mode)
		// SECURITY FIX: Fail-safe default - security checks are ON unless explicitly in development
		// This prevents accidental bypass if NODE_ENV is misconfigured (e.g., 'staging', undefined, etc.)
		if (process.env.NODE_ENV !== 'development') {
			const captchaResult = await verifyTurnstile(captchaToken, TURNSTILE_SECRET_KEY);
			if (!captchaResult.success) {
				return fail(400, { error: captchaResult.error || 'Please complete the CAPTCHA verification' });
			}
		}

		// Use service_role key for insert to bypass RLS
		const supabaseAdmin = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
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
		const firstName = formData.get('firstName')?.toString() || '';
		const lastName = formData.get('lastName')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const date = formData.get('date')?.toString() || '';
		const ticketsStr = formData.get('tickets')?.toString() || '';

		// PRIORITY 1: Validate date first (needed to check availability)
		const dateValidation = validateDate(date);
		if (!dateValidation.valid) {
			return fail(400, { error: dateValidation.error });
		}

		// PRIORITY 2: Validate tickets (needed to check availability)
		const ticketsValidation = validateInteger(ticketsStr, {
			fieldName: 'Number of tickets',
			min: 1,
			max: 10,
			required: true
		});
		if (!ticketsValidation.valid) {
			return fail(400, { error: ticketsValidation.error });
		}

		const tickets = ticketsValidation.value!;

		// PRIORITY 2.5: Validate email (needed for duplicate check)
		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			return fail(400, { error: emailValidation.error });
		}
		const sanitizedEmail = emailValidation.sanitized!;

		// PRIORITY 3: Check if tickets are available for this date BEFORE validating other fields
		// Get the date info and check capacity
		const { data: dateInfo } = await supabaseAdmin
			.from('ticket_dates')
			.select('*')
			.eq('date', date)
			.single();

		if (!dateInfo) {
			return fail(400, { error: 'Invalid date selected' });
		}

		if (!dateInfo.is_available) {
			return fail(400, { error: 'This date is no longer available' });
		}

		// Check for duplicate purchase - prevent same email from booking same date multiple times
	const { data: existingTicket } = await supabaseAdmin
		.from('ticket_requests')
		.select('id, tickets')
		.eq('email', sanitizedEmail)
		.eq('date', date)
		.eq('status', 'confirmed')
		.maybeSingle();

	if (existingTicket) {
		return fail(400, {
			error: 'You already have tickets for this date. Check your email for your confirmation, or contact us at hauntjunkies@gmail.com if you need to modify your reservation.'
		});
	}

	// Count already confirmed tickets for this date
		const { data: requests } = await supabaseAdmin
			.from('ticket_requests')
			.select('tickets')
			.eq('date', date)
			.eq('status', 'confirmed');

		const ticketsSold = requests?.reduce((sum, req) => sum + req.tickets, 0) || 0;
		const remainingTickets = dateInfo.capacity - ticketsSold;

		// Check if enough tickets are available
		if (remainingTickets <= 0) {
			return fail(400, { error: 'Sorry, tickets for this date are sold out' });
		}

		if (tickets > remainingTickets) {
			return fail(400, { error: `Only ${remainingTickets} ticket${remainingTickets === 1 ? '' : 's'} remaining for this date` });
		}

		// Check against max tickets per request
		if (tickets > dateInfo.max_tickets_per_request) {
			return fail(400, { error: `Maximum ${dateInfo.max_tickets_per_request} tickets per reservation` });
		}

		// NOW validate other fields only if tickets are available
		// Validate first name
		const firstNameValidation = validateText(firstName, {
			fieldName: 'First name',
			minLength: 2,
			maxLength: 50,
			required: true
		});
		if (!firstNameValidation.valid) {
			return fail(400, { error: firstNameValidation.error });
		}

		// Validate last name
		const lastNameValidation = validateText(lastName, {
			fieldName: 'Last name',
			minLength: 2,
			maxLength: 50,
			required: true
		});
		if (!lastNameValidation.valid) {
			return fail(400, { error: lastNameValidation.error });
		}

		// Use sanitized values
		const sanitizedFirstName = firstNameValidation.sanitized!;
		const sanitizedLastName = lastNameValidation.sanitized!;

		// Generate confirmation number
		const confirmationNumber = generateConfirmationNumber();

		// Use PostgreSQL function for atomic ticket purchase with race condition protection
		const { data: result, error: rpcError } = await supabaseAdmin.rpc('purchase_tickets', {
			p_date: date,
			p_tickets: tickets,
			p_name: `${sanitizedFirstName} ${sanitizedLastName}`,
			p_first_name: sanitizedFirstName,
			p_last_name: sanitizedLastName,
			p_email: sanitizedEmail,
			p_confirmation_number: confirmationNumber
		});

		if (rpcError) {
			return fail(500, { error: 'Failed to process ticket request. Please try again.' });
		}

		// Check if the function returned an error
		if (!result?.success) {
			return fail(400, { error: result?.error || 'Failed to purchase tickets' });
		}

		// We already have dateInfo from the earlier availability check, no need to fetch again

		// Send confirmation emails
		const emailResult = await sendTicketConfirmation({
			confirmationNumber,
			firstName: sanitizedFirstName,
			lastName: sanitizedLastName,
			email: sanitizedEmail,
			date,
			startTime: dateInfo.start_time,
			endTime: dateInfo.end_time,
			tickets,
			ticketRequestId: result.ticket_id  // Pass ticket ID for QR code generation
		});

		if (!emailResult.success) {
			// Don't fail the request - ticket is already saved
			console.error('Email send failed:', emailResult.error);
		} else {
			console.log('Email sent successfully to:', sanitizedEmail);
		}

		return {
			success: true,
			confirmationNumber,
			ticketDetails: {
				firstName: sanitizedFirstName,
				lastName: sanitizedLastName,
				email: sanitizedEmail,
				date,
				tickets
			}
		};
	}
} satisfies Actions;
