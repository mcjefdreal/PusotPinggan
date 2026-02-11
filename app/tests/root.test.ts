import { test, expect } from '@playwright/test';

test('Should display the home page (not logged in)', async({ page }) => {
    await page.goto('/');
    await expect(
        page.getByRole('heading', {name: "Puso't Pinggan"}),
    ).toBeVisible();
})