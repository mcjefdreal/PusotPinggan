import { test, expect } from '@playwright/test';

test('Should load login page', async({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
})

test('Should go to sign up page after clicking the link', async({ page }) => {
    await page.goto('/signup');
    await page.getByRole('link', { name: 'here!' }).click();
    await page.waitForURL('**/login');
    await expect(page.getByRole('heading', { name: 'Welcome back!' })).toBeVisible();
})