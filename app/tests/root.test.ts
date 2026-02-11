import { test, expect } from '@playwright/test';

test('Should display the landing page of an unauthorized user', async({ page }) => {
    await page.goto('/');
    await expect(
        page.getByRole('heading', {name: "Puso't Pinggan"}),
    ).toBeVisible();
})