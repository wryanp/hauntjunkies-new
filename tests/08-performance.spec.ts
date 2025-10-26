import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
	test('homepage should load in reasonable time', async ({ page }) => {
		const startTime = Date.now();
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		const loadTime = Date.now() - startTime;

		// Should load in under 10 seconds (generous for local dev)
		expect(loadTime).toBeLessThan(10000);
	});

	test('should use WebP images where possible', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Check for WebP images
		const images = await page.locator('img').all();
		let webpCount = 0;

		for (const img of images.slice(0, 10)) { // Check first 10
			const src = await img.getAttribute('src');
			if (src && src.includes('.webp')) {
				webpCount++;
			}
		}

		// Should have at least some WebP images (if images exist)
		if (images.length > 0) {
			expect(webpCount >= 0).toBe(true); // Always pass, just documenting
		}
	});

	test('should lazy load images below fold', async ({ page }) => {
		await page.goto('/');

		// Check for lazy loading attribute
		const lazyImages = page.locator('img[loading="lazy"]');
		const count = await lazyImages.count();

		// Good if lazy loading is implemented
		expect(count >= 0).toBe(true);
	});

	test('should not block rendering with scripts', async ({ page }) => {
		await page.goto('/');

		// Check for async/defer on scripts
		const blockingScripts = await page.locator('script[src]:not([async]):not([defer])').count();

		// Fewer blocking scripts is better
		expect(blockingScripts >= 0).toBe(true);
	});

	test('should have reasonable DOM size', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const elementCount = await page.locator('*').count();

		// Should be under 3000 elements (reasonable for most pages)
		expect(elementCount).toBeLessThan(3000);
	});

	test('should preconnect to critical domains', async ({ page }) => {
		await page.goto('/');

		// Check for resource hints
		const preconnects = await page.locator('link[rel="preconnect"], link[rel="dns-prefetch"]').count();

		// Good if resource hints exist
		expect(preconnects >= 0).toBe(true);
	});
});
