import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Generate HMAC signature for approval token
 * Provides additional security layer beyond token
 */
function generateHmac(token: string): string {
	const secret = SUPABASE_SERVICE_ROLE_KEY; // Use service key as HMAC secret
	return createHmac('sha256', secret)
		.update(token)
		.digest('hex');
}

/**
 * Verify HMAC signature in constant time
 */
function verifyHmac(token: string, providedHmac: string): boolean {
	const expectedHmac = generateHmac(token);

	try {
		const expectedBuf = Buffer.from(expectedHmac, 'hex');
		const providedBuf = Buffer.from(providedHmac, 'hex');

		if (expectedBuf.length !== providedBuf.length) {
			return false;
		}

		return timingSafeEqual(expectedBuf, providedBuf);
	} catch {
		return false;
	}
}

/**
 * SECURITY: Changed from GET to POST to prevent CSRF attacks
 * GET requests can be triggered by <img> tags or browser prefetching
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const formData = await request.formData();
	const token = formData.get('token')?.toString();
	const hmac = formData.get('hmac')?.toString();

	if (!token) {
		return json({ error: 'Missing approval token' }, { status: 400 });
	}

	// SECURITY: Verify HMAC signature to prevent token tampering
	if (!hmac || !verifyHmac(token, hmac)) {
		return json({ error: 'Invalid security signature' }, { status: 403 });
	}

	// Create Supabase client with service role for admin operations
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

	// Find comment with this approval token
	// NOTE: Database should have 'approval_token_expires_at' column (add via migration if missing)
	const { data: comment, error: findError } = await supabase
		.from('review_comments')
		.select('id, approved, review_id, approval_token_expires_at, reviews(slug)')
		.eq('approval_token', token)
		.single();

	if (findError || !comment) {
		return json({ error: 'Invalid or expired approval token' }, { status: 404 });
	}

	// SECURITY: Check token expiration (7 days from creation)
	const expiresAt = (comment as any).approval_token_expires_at;
	if (expiresAt) {
		const expirationDate = new Date(expiresAt);
		const now = new Date();

		if (now > expirationDate) {
			return json({ error: 'Approval token has expired. Please request a new approval link.' }, { status: 410 });
		}
	}

	// Check if already approved
	if (comment.approved) {
		return json({ message: 'Comment already approved' }, { status: 200 });
	}

	// Approve the comment and clear the token
	const { error: updateError } = await supabase
		.from('review_comments')
		.update({
			approved: true,
			approval_token: null // Clear token after use
		})
		.eq('id', comment.id);

	if (updateError) {
		console.error('Error approving comment:', updateError);
		return json({ error: 'Failed to approve comment' }, { status: 500 });
	}

	// Redirect to the review page with a success message
	const reviewSlug = (comment as any).reviews?.slug;
	if (reviewSlug) {
		throw redirect(302, `/reviews/${reviewSlug}?comment_approved=true`);
	}

	return json({ success: true, message: 'Comment approved successfully' });
};
