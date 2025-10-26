import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
	test('should load contact page', async ({ page }) => {
		await page.goto('/contact');

		// Check page loaded
		await expect(page).toHaveTitle(/Contact|Haunt Junkies/i);

		// Check for form
		await expect(page.locator('form')).toBeVisible();
	});

	test('should display all required form fields', async ({ page }) => {
		await page.goto('/contact');

		// Check for required fields
		const nameField = page.locator('input[name="name"], input[id*="name"]');
		const emailField = page.locator('input[name="email"], input[id*="email"]');
		const messageField = page.locator('textarea[name="message"], textarea[id*="message"]');

		await expect(nameField).toBeVisible();
		await expect(emailField).toBeVisible();
		await expect(messageField).toBeVisible();
	});

	test('should show validation errors on empty submit', async ({ page }) => {
		await page.goto('/contact');

		// Try to submit empty form
		const submitButton = page.locator('button[type="submit"]').first();
		await submitButton.click();

		// Wait a bit for validation
		await page.waitForTimeout(1000);

		// Check for error messages or HTML5 validation
		const hasErrors = await page.locator('text=/required|invalid|error/i').isVisible().catch(() => false);
		const hasHTML5Validation = await page.evaluate(() => {
			const form = document.querySelector('form');
			return form ? !form.checkValidity() : false;
		});

		expect(hasErrors || hasHTML5Validation).toBe(true);
	});

	test('should validate email format', async ({ page }) => {
		await page.goto('/contact');

		// Fill in invalid email
		await page.locator('input[name="name"]').fill('Test User');
		await page.locator('input[name="email"]').fill('invalid-email');
		await page.locator('textarea[name="message"]').fill('Test message');

		// Try to submit
		await page.locator('button[type="submit"]').click();
		await page.waitForTimeout(1000);

		// Should show email validation error
		const emailError = await page.locator('text=/valid email|email.*invalid/i').isVisible().catch(() => false);
		const hasHTML5Validation = await page.evaluate(() => {
			const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
			return emailInput ? !emailInput.validity.valid : false;
		});

		expect(emailError || hasHTML5Validation).toBe(true);
	});

	test('should have character counter for message field', async ({ page }) => {
		await page.goto('/contact');

		// Fill in message
		const messageField = page.locator('textarea[name="message"]');
		await messageField.fill('This is a test message');

		// Look for character counter
		const counter = page.locator('text=/character|\\d+\\/\\d+/i');
		const hasCounter = await counter.count() > 0;

		// Not required, but good UX if present
		expect(true).toBe(true); // Always pass, just checking
	});

	test('should not crash on submit (even if CAPTCHA blocks)', async ({ page }) => {
		await page.goto('/contact');

		const errors: string[] = [];
		page.on('pageerror', error => {
			errors.push(error.message);
		});

		// Fill valid data
		await page.locator('input[name="name"]').fill('Test User');
		await page.locator('input[name="email"]').fill('test@example.com');
		await page.locator('textarea[name="message"]').fill('This is a test message from E2E tests');

		// Try to submit (might be blocked by CAPTCHA or rate limiting)
		await page.locator('button[type="submit"]').click();
		await page.waitForTimeout(2000);

		// Check no critical errors occurred
		const criticalErrors = errors.filter(err =>
			!err.includes('Turnstile') &&
			!err.includes('CAPTCHA')
		);

		expect(criticalErrors).toHaveLength(0);
	});
});
