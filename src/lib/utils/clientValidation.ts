/**
 * Client-side validation utilities
 * Mirrors server-side validation for instant feedback
 */

export interface ValidationResult {
	valid: boolean;
	error: string;
}

export function validateName(value: string): ValidationResult {
	const trimmed = value?.trim() || '';

	if (trimmed.length === 0) {
		return { valid: false, error: 'Name is required' };
	}

	if (trimmed.length < 2) {
		return { valid: false, error: 'Name must be at least 2 characters' };
	}

	if (value.length > 100) {
		return { valid: false, error: 'Name must be less than 100 characters' };
	}

	return { valid: true, error: '' };
}

export function validateEmail(value: string): ValidationResult {
	const trimmed = value?.trim() || '';

	if (trimmed.length === 0) {
		return { valid: false, error: 'Email is required' };
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(trimmed)) {
		return { valid: false, error: 'Please enter a valid email address' };
	}

	return { valid: true, error: '' };
}

export function validateText(value: string, options: {
	fieldName: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
}): ValidationResult {
	const trimmed = value?.trim() || '';

	if (options.required && trimmed.length === 0) {
		return { valid: false, error: `${options.fieldName} is required` };
	}

	if (options.minLength && trimmed.length > 0 && trimmed.length < options.minLength) {
		return { valid: false, error: `${options.fieldName} must be at least ${options.minLength} characters` };
	}

	if (options.maxLength && value.length > options.maxLength) {
		return { valid: false, error: `${options.fieldName} must be less than ${options.maxLength} characters` };
	}

	return { valid: true, error: '' };
}

export function validateInteger(value: string, options: {
	fieldName: string;
	required?: boolean;
	min?: number;
	max?: number;
}): ValidationResult {
	const trimmed = value?.trim() || '';

	if (options.required && trimmed.length === 0) {
		return { valid: false, error: `${options.fieldName} is required` };
	}

	if (trimmed.length === 0 && !options.required) {
		return { valid: true, error: '' };
	}

	const num = parseInt(trimmed, 10);

	if (isNaN(num)) {
		return { valid: false, error: `${options.fieldName} must be a number` };
	}

	if (options.min !== undefined && num < options.min) {
		return { valid: false, error: `${options.fieldName} must be at least ${options.min}` };
	}

	if (options.max !== undefined && num > options.max) {
		return { valid: false, error: `${options.fieldName} must be no more than ${options.max}` };
	}

	return { valid: true, error: '' };
}
