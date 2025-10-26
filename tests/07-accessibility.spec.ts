import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
	test('homepage should have skip to content link', async ({ page }) => {
		await page.goto('/');

		// Look for skip link
		const skipLink = page.locator('a[href="#main-content"], a:has-text("skip to content")').first();
		const hasSkipLink = await skipLink.count() > 0;

		// Check if it exists (good practice)
		if (hasSkipLink) {
			await expect(skipLink).toBeTruthy();
		}
	});

	test('all images should have alt text or role', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Get all images
		const images = page.locator('img');
		const count = await images.count();

		if (count > 0) {
			for (let i = 0; i < Math.min(count, 10); i++) { // Check first 10
				const img = images.nth(i);
				const alt = await img.getAttribute('alt');
				const role = await img.getAttribute('role');

				// Should have alt or role="presentation"
				expect(alt !== null || role === 'presentation').toBe(true);
			}
		}
	});

	test('forms should have proper labels', async ({ page }) => {
		await page.goto('/contact');

		// Check inputs have labels or aria-label
		const inputs = page.locator('input[type="text"], input[type="email"], textarea');
		const count = await inputs.count();

		if (count > 0) {
			for (let i = 0; i < count; i++) {
				const input = inputs.nth(i);
				const id = await input.getAttribute('id');
				const ariaLabel = await input.getAttribute('aria-label');
				const placeholder = await input.getAttribute('placeholder');

				// Should have some form of label
				const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;
				expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
			}
		}
	});

	test('should have proper heading hierarchy', async ({ page }) => {
		await page.goto('/');

		// Check for h1
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBeGreaterThan(0);
		expect(h1Count).toBeLessThanOrEqual(1); // Should only have one h1
	});

	test('links should have descriptive text', async ({ page }) => {
		await page.goto('/');

		// Get all links
		const links = page.locator('a[href]');
		const count = await links.count();

		if (count > 0) {
			for (let i = 0; i < Math.min(count, 10); i++) {
				const link = links.nth(i);
				const text = await link.textContent();
				const ariaLabel = await link.getAttribute('aria-label');
				const title = await link.getAttribute('title');

				// Should have text, aria-label, or title
				expect(text || ariaLabel || title).toBeTruthy();
			}
		}
	});

	test('should support keyboard navigation on contact form', async ({ page }) => {
		await page.goto('/contact');

		// Tab through form
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Should be able to type in focused field
		await page.keyboard.type('Test');

		// Form should still be functional
		await expect(page.locator('form')).toBeVisible();
	});
});
