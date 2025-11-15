import { expect, test } from '@playwright/test';

test('home page has correct title and heading', async ({ page }) => {
	await page.goto('/');

	// Check the page title
	await expect(page).toHaveTitle(/SvelteKit/);

	// Check for main heading
	await expect(page.getByRole('heading', { name: /SvelteKit Template/i })).toBeVisible();
	await expect(page.getByRole('heading', { name: /with Supabase & Vercel/i })).toBeVisible();
});

test('items table is rendered', async ({ page }) => {
	await page.goto('/');

	// Check that the items table heading is visible
	await expect(page.getByRole('heading', { name: /Items Table/i })).toBeVisible();
});
