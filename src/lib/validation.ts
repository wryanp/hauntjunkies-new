// Input validation and sanitization utilities

/**
 * Comprehensive email validation with sanitization
 */
export function validateEmail(email: string): { valid: boolean; error?: string; sanitized?: string } {
	if (!email || typeof email !== 'string') {
		return { valid: false, error: 'Email is required' };
	}

	// Remove whitespace and sanitize
	email = email.trim().toLowerCase();

	// Length check - RFC 5321
	if (email.length > 254) {
		return { valid: false, error: 'Email address is too long' };
	}

	if (email.length < 3) {
		return { valid: false, error: 'Email address is too short' };
	}

	// More strict RFC 5322 compliant regex
	// Allows: letters, numbers, dots, hyphens, underscores, plus signs in local part
	// Requires proper domain structure
	const emailRegex = /^[a-z0-9][a-z0-9._+-]*[a-z0-9]@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
	if (!emailRegex.test(email)) {
		return { valid: false, error: 'Invalid email format' };
	}

	const [localPart, domain] = email.split('@');

	// Validate local part length (RFC 5321: max 64 chars)
	if (localPart.length > 64) {
		return { valid: false, error: 'Email address is invalid' };
	}

	// Validate domain part length (RFC 5321: max 255 chars)
	if (domain.length > 255) {
		return { valid: false, error: 'Email domain is too long' };
	}

	// Check for consecutive dots
	if (email.includes('..')) {
		return { valid: false, error: 'Invalid email format' };
	}

	// Check for dots at start/end of local part
	if (localPart.startsWith('.') || localPart.endsWith('.')) {
		return { valid: false, error: 'Invalid email format' };
	}

	// Check for potential email injection (newlines, null bytes, control characters)
	if (/[\r\n\0\x00-\x1f\x7f]/.test(email)) {
		return { valid: false, error: 'Invalid characters in email' };
	}

	// Additional security: reject emails with suspicious patterns
	const suspiciousPatterns = [
		/content-type:/i,
		/bcc:/i,
		/cc:/i,
		/to:/i,
		/from:/i,
		/subject:/i,
		/mime-version:/i
	];

	for (const pattern of suspiciousPatterns) {
		if (pattern.test(email)) {
			return { valid: false, error: 'Invalid email format' };
		}
	}

	// Sanitize email (remove any remaining dangerous characters)
	const sanitized = sanitizeEmail(email);

	return { valid: true, sanitized };
}

/**
 * Sanitize email for safe use (remove potential injection chars)
 */
export function sanitizeEmail(email: string): string {
	return email.trim().replace(/[\r\n\0]/g, '');
}

/**
 * Validate text input with length constraints
 */
export function validateText(
	text: string | null | undefined,
	options: {
		fieldName: string;
		minLength?: number;
		maxLength: number;
		required?: boolean;
	}
): { valid: boolean; error?: string; sanitized?: string } {
	// Check if required
	if (options.required && (!text || text.trim().length === 0)) {
		return { valid: false, error: `${options.fieldName} is required` };
	}

	// If not required and empty, return valid
	if (!text || text.trim().length === 0) {
		return { valid: true, sanitized: '' };
	}

	// Trim whitespace
	const sanitized = text.trim();

	// Check min length
	if (options.minLength && sanitized.length < options.minLength) {
		return {
			valid: false,
			error: `${options.fieldName} must be at least ${options.minLength} characters`
		};
	}

	// Check max length
	if (sanitized.length > options.maxLength) {
		return {
			valid: false,
			error: `${options.fieldName} must be no more than ${options.maxLength} characters`
		};
	}

	// Check for null bytes (potential injection)
	if (sanitized.includes('\0')) {
		return { valid: false, error: `${options.fieldName} contains invalid characters` };
	}

	return { valid: true, sanitized };
}

/**
 * Validate phone number (basic validation)
 */
export function validatePhone(phone: string | null | undefined): { valid: boolean; error?: string } {
	if (!phone || phone.trim().length === 0) {
		return { valid: true }; // Phone is optional
	}

	const sanitized = phone.trim();

	// Allow only digits, spaces, hyphens, parentheses, plus sign
	const phoneRegex = /^[\d\s\-\(\)\+]+$/;
	if (!phoneRegex.test(sanitized)) {
		return { valid: false, error: 'Phone number contains invalid characters' };
	}

	// Check length (international numbers can be up to 15 digits)
	const digitsOnly = sanitized.replace(/\D/g, '');
	if (digitsOnly.length < 10 || digitsOnly.length > 15) {
		return { valid: false, error: 'Phone number must be between 10 and 15 digits' };
	}

	return { valid: true };
}

/**
 * Validate integer with range
 */
export function validateInteger(
	value: unknown,
	options: {
		fieldName: string;
		min?: number;
		max?: number;
		required?: boolean;
	}
): { valid: boolean; error?: string; value?: number } {
	// Check if value exists
	if (value === null || value === undefined || value === '') {
		if (options.required) {
			return { valid: false, error: `${options.fieldName} is required` };
		}
		return { valid: true };
	}

	// Parse integer
	const parsed = parseInt(String(value), 10);

	// Check if valid number
	if (isNaN(parsed)) {
		return { valid: false, error: `${options.fieldName} must be a valid number` };
	}

	// Check min
	if (options.min !== undefined && parsed < options.min) {
		return { valid: false, error: `${options.fieldName} must be at least ${options.min}` };
	}

	// Check max
	if (options.max !== undefined && parsed > options.max) {
		return { valid: false, error: `${options.fieldName} must be no more than ${options.max}` };
	}

	return { valid: true, value: parsed };
}

/**
 * Sanitize HTML to prevent XSS (basic - for display only, not for rich text)
 */
export function sanitizeHTML(html: string): string {
	return html
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
}

/**
 * Validate date string
 */
export function validateDate(dateString: string | null | undefined): { valid: boolean; error?: string } {
	if (!dateString) {
		return { valid: false, error: 'Date is required' };
	}

	// Check format (YYYY-MM-DD)
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateString)) {
		return { valid: false, error: 'Invalid date format' };
	}

	// Check if valid date
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return { valid: false, error: 'Invalid date' };
	}

	return { valid: true };
}
