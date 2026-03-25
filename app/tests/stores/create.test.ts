import { test, expect } from '@playwright/test';
import { supabaseAdmin } from '../supabase';

let createdStoreId: string | null = null;

test.afterEach(async () => {
	if (createdStoreId) {
		await supabaseAdmin.from('product').delete().eq('store_id', createdStoreId);
		await supabaseAdmin.from('store').delete().eq('store_id', createdStoreId);
		createdStoreId = null;
	}
});

test('create store with valid data', async ({ page }) => {
	const timestamp = Date.now();
	const storeName = `TestStore-${timestamp}`;

	await page.goto('/store');
	await page.getByTestId('add-store').click();

	await page.setInputFiles('input[type="file"]', {
		name: 'test-image.jpg',
		mimeType: 'image/jpeg',
		buffer: Buffer.from('fake-image-data')
	});

	await page.fill('#store_name', storeName);
	await page.fill('#store_description', 'Test store description');

	await page.click('.address-picker input[type="text"]');
	await page.fill('.address-picker input[type="text"]', 'UPTC');
	await page.waitForTimeout(2000);
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Tab');

	await page.waitForTimeout(1000);

	await page.click('button[type="submit"]');

	await expect(page.getByText(storeName)).toBeVisible({ timeout: 10000 });

	const { data: store } = await supabaseAdmin
		.from('store')
		.select('store_id')
		.eq('store_name', storeName)
		.single();

	if (store) {
		createdStoreId = store.store_id;
	}
});

test('create store shows error without required fields', async ({ page }) => {
	await page.goto('/store');
	await page.getByTestId('add-store').click();

	await page.click('button[type="submit"]');

	await expect(page).toHaveURL(/.*store\/create/);
});
