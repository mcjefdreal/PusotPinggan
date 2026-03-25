import { test, expect } from '@playwright/test';
import { supabaseAdmin } from '../supabase';

let createdStoreId: string | null = null;
const searchTerm = `SearchableStore-${Date.now()}`;

test.afterEach(async () => {
  if (createdStoreId) {
    await supabaseAdmin.from('product').delete().eq('store_id', createdStoreId);
    await supabaseAdmin.from('store').delete().eq('store_id', createdStoreId);
    createdStoreId = null;
  }
});

test.beforeEach(async ({ page }) => {
  await page.goto('/store');
  await page.getByTestId('add-store').click();

  await page.setInputFiles('input[type="file"]', {
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-image-data')
  });

  await page.fill('#store_name', searchTerm);
  await page.fill('#store_description', 'A searchable store');

  await page.click('.address-picker input[type="text"]');
  await page.fill('.address-picker input[type="text"]', 'UPTC');
  await page.waitForTimeout(1000);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');

  await page.waitForTimeout(1000);

  await page.click('button[type="submit"]');

  await expect(page.getByText(searchTerm)).toBeVisible({ timeout: 10000 });

  const { data: store } = await supabaseAdmin
    .from('store')
    .select('store_id')
    .eq('store_name', searchTerm)
    .single();

  if (store) {
    createdStoreId = store.store_id;
  }
});

test('search for stores by name', async ({ page }) => {
  await page.goto(`/search?q=${searchTerm}`);

  await expect(page.getByText(searchTerm)).toBeVisible();
});

test('search for stores shows no results for unknown term', async ({ page }) => {
  await page.goto('/search?q=NonExistentStore12345');

  await expect(page.getByText('No products or store found')).toBeVisible();
});
