import { test, expect } from '@playwright/test';
import { supabaseAdmin } from '../supabase';

let createdStoreId: string | null = null;
const searchTerm = `SearchableProduct-${Date.now()}`;

test.afterEach(async () => {
	if (createdStoreId) {
		await supabaseAdmin.from('product').delete().eq('store_id', createdStoreId);
		await supabaseAdmin.from('store').delete().eq('store_id', createdStoreId);
		createdStoreId = null;
	}
});

test.beforeEach(async ({ page }) => {
	const timestamp = Date.now();
	const storeName = `SearchStore-${timestamp}`;

	await page.goto('/store');
	await page.getByTestId('add-store').click();

	await page.setInputFiles('input[type="file"]', {
		name: 'test-image.jpg',
		mimeType: 'image/jpeg',
		buffer: Buffer.from('fake-image-data')
	});

	await page.fill('#store_name', storeName);
	await page.fill('#store_description', 'Test store');

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

		await supabaseAdmin.from('product').insert({
			name: searchTerm,
			description: 'A searchable product',
			price: 50.0,
			quantity: 5,
			store_id: store.store_id
		});
	}
});

test('search for products by name', async ({ page }) => {
	await page.waitForTimeout(2000);

	await page.fill('#search', searchTerm);
	await page.keyboard.press('Enter');

	await expect(page.getByText('No products or store found')).not.toBeVisible();
});

test('search for products shows no results for unknown term', async ({ page }) => {
	await page.fill('#search', 'NonExistentProduct12345');
	await page.keyboard.press('Enter');

	await expect(page.getByText('No products or store found')).toBeVisible();
});
