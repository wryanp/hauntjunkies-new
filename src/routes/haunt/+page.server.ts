import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY, TURNSTILE_SECRET_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { McCloudInfo, McCloudPhoto } from '$lib/types';
import { checkRateLimit, getClientIP, formatTimeRemaining } from '$lib/rateLimit';
import { validateEmail, validateText, validatePhone, validateInteger, validateDate } from '$lib/validation';
import { verifyTurnstile } from '$lib/captcha';
import { dev } from '$app/environment';

export const load: PageServerLoad = async () => {
	// Handle missing Supabase credentials gracefully
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
	    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
	    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		console.warn('Supabase credentials not configured - returning empty data');
		return {
			info: null,
			photos: []
		};
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Fetch McCloud Manor info (single row)
	const { data: info } = await supabase
		.from('mccloud_info')
		.select('*')
		.single();

	// Fetch photos
	const { data: photos } = await supabase
		.from('mccloud_photos')
		.select('*')
		.order('display_order', { ascending: true});

	// Fetch available ticket dates
	const { data: ticketDates } = await supabase
		.from('ticket_dates')
		.select('*')
		.eq('is_available', true)
		.gte('date', new Date().toISOString().split('T')[0])
		.order('date', { ascending: true });

	return {
		info: info as McCloudInfo | null,
		photos: (photos as McCloudPhoto[]) || [],
		ticketDates: ticketDates || []
	};
};

export const actions: Actions = {
	requestTickets: async ({ request, cookies }) => {
		// Rate limiting - 3 ticket requests per hour per IP
		const clientIP = getClientIP(request);
		const rateLimit = await checkRateLimit(clientIP, {
			identifier: 'haunt-ticket-request',
			maxRequests: 3,
			windowMs: 60 * 60 * 1000 // 1 hour
		});

		if (!rateLimit.success) {
			return fail(429, {
				error: `Too many ticket requests. Please try again in ${formatTimeRemaining(rateLimit.resetTime)}.`
			});
		}

		// Get form data first to extract CAPTCHA token
		const formData = await request.formData();
		const captchaToken = formData.get('cf-turnstile-response')?.toString() || '';

		// Verify CAPTCHA (skip in development mode)
		// SECURITY: Use NODE_ENV instead of dev flag to prevent accidental bypass in production
		if (process.env.NODE_ENV === 'production') {
			const captchaResult = await verifyTurnstile(captchaToken, TURNSTILE_SECRET_KEY);
			if (!captchaResult.success) {
				return fail(400, { error: captchaResult.error || 'Please complete the CAPTCHA verification' });
			}
		}

		// Use service_role key to bypass RLS for ticket request submissions
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

		// Extract form fields
		const name = formData.get('name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const phone = formData.get('phone')?.toString() || '';
		const quantityStr = formData.get('quantity')?.toString() || '';
		const preferred_date = formData.get('preferred_date')?.toString() || '';
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

		// Validate phone (optional)
		const phoneValidation = validatePhone(phone);
		if (!phoneValidation.valid) {
			return fail(400, { error: phoneValidation.error });
		}

		// Validate quantity
		const quantityValidation = validateInteger(quantityStr, {
			fieldName: 'Number of tickets',
			min: 1,
			max: 20,
			required: true
		});
		if (!quantityValidation.valid) {
			return fail(400, { error: quantityValidation.error });
		}

		// Validate preferred date (optional)
		let validatedDate = null;
		if (preferred_date) {
			const dateValidation = validateDate(preferred_date);
			if (!dateValidation.valid) {
				return fail(400, { error: dateValidation.error });
			}
			validatedDate = preferred_date;
		}

		// Validate message (optional)
		const messageValidation = validateText(message, {
			fieldName: 'Message',
			maxLength: 1000,
			required: false
		});
		if (!messageValidation.valid) {
			return fail(400, { error: messageValidation.error });
		}

		// Use sanitized values
		const sanitizedName = nameValidation.sanitized!;
		const sanitizedEmail = emailValidation.sanitized!;
		const sanitizedPhone = phone.trim() || null;
		const sanitizedMessage = messageValidation.sanitized || null;
		const quantity = quantityValidation.value!;

		// Insert ticket request
		const { error: insertError } = await supabase
			.from('ticket_requests')
			.insert({
				name: sanitizedName,
				email: sanitizedEmail,
				phone: sanitizedPhone,
				quantity,
				preferred_date: validatedDate,
				message: sanitizedMessage,
				status: 'pending'
			});

		if (insertError) {
			console.error('Error inserting ticket request:', insertError);
			return fail(500, { error: 'Failed to submit request. Please try again.' });
		}

		return { success: true };
	}
};
