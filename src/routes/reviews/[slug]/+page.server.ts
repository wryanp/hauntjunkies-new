import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY, TURNSTILE_SECRET_KEY } from '$env/static/private';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Review, ReviewImage, ReviewComment, ReviewerPhoto } from '$lib/types';
import { checkRateLimit, getClientIP, formatTimeRemaining } from '$lib/rateLimit';
import { validateEmail, validateText } from '$lib/validation';
import { verifyTurnstile } from '$lib/captcha';
import { dev } from '$app/environment';
import { sendCommentNotification } from '$lib/email';
import { randomBytes } from 'crypto';

export const load: PageServerLoad = async ({ params, parent, cookies }) => {
	// Get authentication from parent layout
	const { isAuthenticated } = await parent();

	// Handle missing Supabase credentials gracefully
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
	    PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
	    PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		throw error(503, 'Database not configured');
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Fetch review by slug
	const { data: review, error: reviewError } = await supabase
		.from('reviews')
		.select('*')
		.eq('slug', params.slug)
		.single();

	if (reviewError || !review) {
		throw error(404, 'Review not found');
	}

	// Increment view count (fire and forget - don't wait for response)
	supabase.rpc('increment_review_views', { review_slug: params.slug }).then();

	// Fetch images for this review
	const { data: images } = await supabase
		.from('review_images')
		.select('*')
		.eq('review_id', review.id)
		.order('display_order', { ascending: true });

	// Fetch reviewer photos (images of the reviewers visiting the haunt)
	const { data: reviewerPhotos } = await supabase
		.from('reviewer_photos')
		.select('*')
		.eq('review_id', review.id)
		.order('display_order', { ascending: true });

	// Fetch approved comments
	const { data: comments } = await supabase
		.from('review_comments')
		.select('*')
		.eq('review_id', review.id)
		.eq('approved', true)
		.order('created_at', { ascending: false });

	// Get user identifier for like tracking (session cookie)
	let userIdentifier = cookies.get('comment_likes_session');
	if (!userIdentifier) {
		// Create a unique session ID for this user
		userIdentifier = randomBytes(32).toString('hex');
		cookies.set('comment_likes_session', userIdentifier, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365 // 1 year
		});
	}

	// Fetch which comments this user has liked
	const commentIds = (comments || []).map(c => c.id);
	const { data: userLikes } = commentIds.length > 0 ? await supabase
		.from('comment_likes')
		.select('comment_id')
		.eq('user_identifier', userIdentifier)
		.in('comment_id', commentIds) : { data: [] };

	const likedCommentIds = new Set((userLikes || []).map(l => l.comment_id));

	return {
		review: review as Review,
		images: (images as ReviewImage[]) || [],
		reviewerPhotos: (reviewerPhotos as ReviewerPhoto[]) || [],
		comments: (comments as ReviewComment[]) || [],
		likedCommentIds: Array.from(likedCommentIds),
		isAuthenticated
	};
};

export const actions: Actions = {
	comment: async ({ request, params, cookies }) => {
		// Rate limiting - 3 comments per hour per IP
		const clientIP = getClientIP(request);
		const rateLimit = await checkRateLimit(clientIP, {
			identifier: 'comment-submission',
			maxRequests: 3,
			windowMs: 60 * 60 * 1000 // 1 hour
		});

		if (!rateLimit.success) {
			return fail(429, {
				error: `Too many comment submissions. Please try again in ${formatTimeRemaining(rateLimit.resetTime)}.`
			});
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

		// Use service_role key to bypass RLS for comment submissions
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
		const author_name = formData.get('author_name')?.toString() || '';
		const author_email = formData.get('author_email')?.toString() || '';
		const comment_text = formData.get('comment_text')?.toString() || '';

		// Validate author name
		const nameValidation = validateText(author_name, {
			fieldName: 'Name',
			minLength: 2,
			maxLength: 100,
			required: true
		});
		if (!nameValidation.valid) {
			return fail(400, { error: nameValidation.error });
		}

		// Validate email
		const emailValidation = validateEmail(author_email);
		if (!emailValidation.valid) {
			return fail(400, { error: emailValidation.error });
		}

		// Validate comment text
		const commentValidation = validateText(comment_text, {
			fieldName: 'Comment',
			minLength: 10,
			maxLength: 2000,
			required: true
		});
		if (!commentValidation.valid) {
			return fail(400, { error: commentValidation.error });
		}

		// Use sanitized values
		const sanitizedName = nameValidation.sanitized!;
		const sanitizedEmail = emailValidation.sanitized!;
		const sanitizedComment = commentValidation.sanitized!;

		// Get review details
		const { data: review } = await supabase
			.from('reviews')
			.select('id, name, slug')
			.eq('slug', params.slug)
			.single();

		if (!review) {
			return fail(404, { error: 'Review not found' });
		}

		// Generate secure approval token
		const approvalToken = randomBytes(32).toString('hex');

		// Set approval token expiration (7 days from now)
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7);

		// Insert comment (unapproved by default) and get the inserted data
		const { data: insertedComment, error: insertError } = await supabase
			.from('review_comments')
			.insert({
				review_id: review.id,
				author_name: sanitizedName,
				author_email: sanitizedEmail,
				comment_text: sanitizedComment,
				approved: false, // Requires admin approval
				approval_token: approvalToken,
				approval_token_expires_at: expirationDate.toISOString() // Token expires in 7 days
			})
			.select()
			.single();

		if (insertError) {
			return fail(500, { error: 'Failed to submit comment. Please try again.' });
		}

		// Send email notification to admin (fire and forget - don't block user)
		if (insertedComment) {
			sendCommentNotification({
				commentId: insertedComment.id,
				reviewName: review.name,
				reviewSlug: review.slug,
				authorName: sanitizedName,
				authorEmail: sanitizedEmail,
				commentText: sanitizedComment,
				approvalToken: approvalToken
			}).catch(error => {
				// Don't fail the request - comment was saved successfully
			});
		}

		return { success: true };
	},

	likeComment: async ({ request, cookies }) => {
		// Get user identifier
		const userIdentifier = cookies.get('comment_likes_session');
		if (!userIdentifier) {
			return fail(400, { error: 'Session not found' });
		}

		const formData = await request.formData();
		const commentId = formData.get('commentId')?.toString();

		if (!commentId) {
			return fail(400, { error: 'Comment ID is required' });
		}

		// Use service role key for like operations
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

		// Check if user already liked this comment
		const { data: existingLike } = await supabase
			.from('comment_likes')
			.select('id')
			.eq('comment_id', commentId)
			.eq('user_identifier', userIdentifier)
			.maybeSingle();

		if (existingLike) {
			// Unlike - remove the like
			const { error: deleteError } = await supabase
				.from('comment_likes')
				.delete()
				.eq('id', existingLike.id);

			if (deleteError) {
				return fail(500, { error: 'Failed to unlike comment' });
			}

			return { success: true, action: 'unliked' };
		} else {
			// Like - add the like
			const { error: insertError } = await supabase
				.from('comment_likes')
				.insert({
					comment_id: commentId,
					user_identifier: userIdentifier
				});

			if (insertError) {
				return fail(500, { error: 'Failed to like comment' });
			}

			return { success: true, action: 'liked' };
		}
	}
};
