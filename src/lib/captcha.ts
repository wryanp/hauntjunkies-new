// Cloudflare Turnstile CAPTCHA verification

export interface TurnstileVerificationResult {
	success: boolean;
	error?: string;
}

/**
 * Verify a Turnstile CAPTCHA token with Cloudflare
 * @param token - The CAPTCHA token from the client
 * @param secretKey - Your Turnstile secret key
 * @returns Promise with verification result
 */
export async function verifyTurnstile(
	token: string,
	secretKey: string
): Promise<TurnstileVerificationResult> {
	if (!token) {
		return { success: false, error: 'CAPTCHA token is missing' };
	}

	if (!secretKey || secretKey === 'your_turnstile_secret_key') {
		console.error('Turnstile secret key not configured');
		return { success: false, error: 'CAPTCHA verification not configured' };
	}

	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				secret: secretKey,
				response: token
			})
		});

		const data = await response.json();

		if (!data.success) {
			console.error('Turnstile verification failed:', data['error-codes']);
			return {
				success: false,
				error: 'CAPTCHA verification failed. Please try again.'
			};
		}

		return { success: true };
	} catch (error) {
		console.error('Error verifying Turnstile CAPTCHA:', error);
		return {
			success: false,
			error: 'Failed to verify CAPTCHA. Please try again.'
		};
	}
}
