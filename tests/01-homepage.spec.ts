import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
	test('should load homepage successfully', async ({ page }) => {
		await page.goto('/');

		// Check page title
		await expect(page).toHaveTitle(/Haunt Junkies/i);

		// Check main heading is visible
		await expect(page.locator('h1')).toBeVisible();

		// Check navigation is present
		await expect(page.locator('nav')).toBeVisible();
	});

	test('should display featured reviews section', async ({ page }) => {
		await page.goto('/');

		// Look for featured reviews or reviews section
		const featuredSection = page.locator('text=/featured|reviews/i').first();
		await expect(featuredSection).toBeVisible({ timeout: 10000 });
	});

	test('should have working navigation links', async ({ page }) => {
		await page.goto('/');

		// Check navigation links exist and are clickable
		const reviewsLink = page.locator('nav a[href="/reviews"]');
		const contactLink = page.locator('nav a[href*="/contact"]');
		const mccloudLink = page.locator('nav a[href="/haunt"]');

		// Verify links are present
		await expect(reviewsLink).toBeVisible();
		await expect(contactLink).toBeVisible();
		await expect(mccloudLink).toBeVisible();
	});

	test('should not have console errors', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', msg => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Filter out known acceptable errors (like network errors in dev)
		const criticalErrors = consoleErrors.filter(err =>
			!err.includes('favicon') &&
			!err.includes('net::ERR') &&
			!err.includes('GTM')
		);

		expect(criticalErrors).toHaveLength(0);
	});

	test('should be responsive on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Check page loads on mobile
		await expect(page.locator('body')).toBeVisible();

		// Check for mobile menu (hamburger) or navigation
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
	});

	test('should have proper meta tags for SEO', async ({ page }) => {
		await page.goto('/');

		// Check for description meta tag
		const description = page.locator('meta[name="description"]');
		await expect(description).toHaveAttribute('content', /.+/);

		// Check for og:image
		const ogImage = page.locator('meta[property="og:image"]');
		await expect(ogImage).toHaveAttribute('content', /.+/);
	});
});
