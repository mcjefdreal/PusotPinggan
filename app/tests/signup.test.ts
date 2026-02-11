import { test, expect } from '@playwright/test';

test('Should load login page', async({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
})