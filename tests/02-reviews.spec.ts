import { test, expect } from '@playwright/test';

test.describe('Reviews Pages', () => {
	test('should load reviews list page', async ({ page }) => {
		await page.goto('/reviews');

		// Check page loaded
		await expect(page).toHaveTitle(/Reviews|Haunt Junkies/i);

		// Check for main content
		await expect(page.locator('body')).toBeVisible();
	});

	test('should display reviews or empty state', async ({ page }) => {
		await page.goto('/reviews');
		await page.waitForLoadState('networkidle');

		// Should have either reviews (links to review pages) or an empty state message
		const reviewLinks = await page.locator('a[href*="/reviews/"]').count();
		const hasReviews = reviewLinks > 0;
		const hasEmptyState = await page.locator('text=/no reviews|coming soon/i').isVisible().catch(() => false);

		expect(hasReviews || hasEmptyState).toBe(true);
	});

	test('should navigate to individual review if available', async ({ page }) => {
		await page.goto('/reviews');
		await page.waitForLoadState('networkidle');

		// Check if there are any review links
		const reviewLinks = page.locator('a[href^="/reviews/"]');
		const count = await reviewLinks.count();

		if (count > 0) {
			// Click first review
			await reviewLinks.first().click();

			// Check we navigated to a review detail page
			await expect(page).toHaveURL(/\/reviews\/.+/);

			// Check for review content
			await expect(page.locator('body')).toBeVisible();
		}
	});

	test('should not crash with SSR errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', error => {
			errors.push(error.message);
		});

		await page.goto('/reviews');
		await page.waitForLoadState('networkidle');

		// Check for window/document errors
		const ssrErrors = errors.filter(err =>
			err.includes('window is not defined') ||
			err.includes('document is not defined')
		);

		expect(ssrErrors).toHaveLength(0);
	});

	test('should have working search/filter if available', async ({ page }) => {
		await page.goto('/reviews');

		// Check if search exists
		const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
		const searchExists = await searchInput.count() > 0;

		if (searchExists) {
			// Try typing in search
			await searchInput.first().fill('test');
			// Just verify it doesn't crash
			await page.waitForTimeout(500);
		}
	});
});
