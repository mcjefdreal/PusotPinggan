import { test } from '@playwright/test';

test('logged in user can access application pages', async ({ page }) => {
	await page.goto('/home');
	await page.goto('/store');
	await page.goto('/profile');
});
