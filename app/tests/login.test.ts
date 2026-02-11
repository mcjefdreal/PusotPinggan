import { test, expect } from '@playwright/test';

test('Should load login page', async({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome back!' })).toBeVisible();
})

test('Should go to sign up page after clicking the link', async({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'here!' }).click();
    await page.waitForURL('**/signup');
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
})