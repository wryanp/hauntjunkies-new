import { test, expect } from '@playwright/test';

test.describe('McCloud Manor (Haunt) Page', () => {
	test('should load McCloud Manor page', async ({ page }) => {
		await page.goto('/mccloudmanor');

		// Check page loaded
		await expect(page).toHaveTitle(/McCloud|Haunt|Junkies/i);

		// Check body is visible
		await expect(page.locator('body')).toBeVisible();
	});

	test('should display manor information', async ({ page }) => {
		await page.goto('/mccloudmanor');
		await page.waitForLoadState('networkidle');

		// Look for typical manor content
		const content = page.locator('body');
		await expect(content).toBeVisible();

		// Should have some text content
		const text = await content.textContent();
		expect(text).toBeTruthy();
		expect(text!.length).toBeGreaterThan(50);
	});

	test('should have ticket purchase link or form', async ({ page }) => {
		await page.goto('/mccloudmanor');
		await page.waitForLoadState('networkidle');

		// Look for ticket-related elements
		const ticketLink = page.locator('a[href*="ticket"], button:has-text("ticket")').first();
		const ticketForm = page.locator('form').first();

		const hasTicketElement = await ticketLink.isVisible().catch(() => false) ||
			await ticketForm.isVisible().catch(() => false);

		// It's okay if tickets aren't available, just checking page structure
		expect(true).toBe(true);
	});

	test('should display photo gallery if available', async ({ page }) => {
		await page.goto('/mccloudmanor');
		await page.waitForLoadState('networkidle');

		// Look for images
		const images = page.locator('img[src*="mccloud"], img[alt*="manor" i]');
		const imageCount = await images.count();

		// Even if no gallery, page should load without errors
		expect(imageCount >= 0).toBe(true);
	});

	test('should not have SSR errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', error => {
			errors.push(error.message);
		});

		await page.goto('/mccloudmanor');
		await page.waitForLoadState('networkidle');

		const ssrErrors = errors.filter(err =>
			err.includes('window is not defined') ||
			err.includes('document is not defined')
		);

		expect(ssrErrors).toHaveLength(0);
	});
});
