import { test, expect } from '@playwright/test';

test('Should display the landing page of an unauthorized user', async({ page }) => {
    await page.goto('/');
    await expect(
        page.getByRole('heading', { name: "Puso't Pinggan" })).toBeVisible();
})

test('Should go to log in page after clicking log in button', async({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.waitForURL('**/login');
    await expect(page.getByRole('heading', { name: 'Welcome back!' })).toBeVisible();
})

test('Should go to the sign up page after clicking the sign up button', async({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await page.waitForURL('**/signup');
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
})