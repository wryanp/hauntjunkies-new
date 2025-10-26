/**
 * Centralized Error Logging Utility
 *
 * Provides consistent error logging across the application.
 * In development: logs to console
 * In production: ready for integration with error tracking services (Sentry, LogRocket, etc.)
 */

import { dev } from '$app/environment';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogContext {
	userId?: string;
	sessionId?: string;
	route?: string;
	action?: string;
	metadata?: Record<string, unknown>;
}

/**
 * Log an error with context
 */
export function logError(
	error: Error | unknown,
	message: string,
	context?: LogContext
): void {
	const errorObj = error instanceof Error ? error : new Error(String(error));

	if (dev) {
		// Development: detailed console logging
		console.error('❌ Error:', message);
		console.error('Details:', errorObj);
		if (context) {
			console.error('Context:', context);
		}
		if (errorObj.stack) {
			console.error('Stack:', errorObj.stack);
		}
	} else {
		// Production: log to external service
		// TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)

		// For now, still log to console in production for debugging
		console.error(message, {
			error: errorObj.message,
			context,
			timestamp: new Date().toISOString()
		});

		// Example Sentry integration (commented out):
		// import * as Sentry from '@sentry/sveltekit';
		// Sentry.captureException(errorObj, {
		//   tags: context,
		//   extra: { message }
		// });
	}
}

/**
 * Log a warning with context
 */
export function logWarning(
	message: string,
	context?: LogContext
): void {
	if (dev) {
		console.warn('⚠️ Warning:', message);
		if (context) {
			console.warn('Context:', context);
		}
	} else {
		console.warn(message, {
			context,
			timestamp: new Date().toISOString()
		});
	}
}

/**
 * Log informational message
 */
export function logInfo(
	message: string,
	context?: LogContext
): void {
	if (dev) {
		console.log('ℹ️ Info:', message);
		if (context) {
			console.log('Context:', context);
		}
	}
	// In production, only log info messages if needed for monitoring
	// Most info messages should be debug-only
}

/**
 * Log debug message (dev only)
 */
export function logDebug(
	message: string,
	data?: unknown
): void {
	if (dev) {
		console.log('🔍 Debug:', message);
		if (data) {
			console.log(data);
		}
	}
}

/**
 * Log database query error
 */
export function logDatabaseError(
	operation: string,
	error: Error | unknown,
	context?: LogContext
): void {
	logError(
		error,
		`Database operation failed: ${operation}`,
		{
			...context,
			action: 'database_operation',
			metadata: {
				operation,
				...(context?.metadata || {})
			}
		}
	);
}

/**
 * Log email sending error
 */
export function logEmailError(
	recipient: string,
	error: Error | unknown,
	context?: LogContext
): void {
	logError(
		error,
		`Email sending failed to: ${recipient}`,
		{
			...context,
			action: 'email_send',
			metadata: {
				recipient,
				...(context?.metadata || {})
			}
		}
	);
}

/**
 * Log API error
 */
export function logAPIError(
	endpoint: string,
	error: Error | unknown,
	context?: LogContext
): void {
	logError(
		error,
		`API request failed: ${endpoint}`,
		{
			...context,
			action: 'api_request',
			metadata: {
				endpoint,
				...(context?.metadata || {})
			}
		}
	);
}

/**
 * Log authentication error
 */
export function logAuthError(
	attemptType: string,
	error: Error | unknown,
	context?: LogContext
): void {
	logError(
		error,
		`Authentication failed: ${attemptType}`,
		{
			...context,
			action: 'authentication',
			metadata: {
				attemptType,
				...(context?.metadata || {})
			}
		}
	);
}

/**
 * Log rate limit hit
 */
export function logRateLimitHit(
	identifier: string,
	ip: string,
	context?: LogContext
): void {
	logWarning(
		`Rate limit exceeded: ${identifier}`,
		{
			...context,
			action: 'rate_limit',
			metadata: {
				identifier,
				ip,
				...(context?.metadata || {})
			}
		}
	);
}

/**
 * Log successful operation (for audit trail)
 */
export function logSuccess(
	operation: string,
	context?: LogContext
): void {
	if (dev) {
		console.log('✅ Success:', operation);
		if (context) {
			console.log('Context:', context);
		}
	}
	// In production, you might want to log successful critical operations
	// to an audit log or analytics service
}
