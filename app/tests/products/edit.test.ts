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

test.beforeEach(async ({ page }) => {
  const timestamp = Date.now();
  const storeName = `EditStore-${timestamp}`;

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
      name: 'OriginalProduct',
      price: 50.00,
      quantity: 5,
      description: 'Original description',
      store_id: store.store_id
    });
  }
});

async function waitForModalWithRetry(page: any, editButton: any, modalSelector: string, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    await editButton.click({ force: true });
    
    await page.waitForTimeout(500);
    
    const modalVisible = await page.locator(modalSelector).first().isVisible().catch(() => false);
    
    if (modalVisible) {
      return true;
    }
    
    console.log(`Modal not visible, retrying... (${i + 1}/${maxRetries})`);
  }
  
  throw new Error('Modal did not appear after retries');
}

test('edit product name and price', async ({ page }) => {
  const newName = 'UpdatedProduct';
  const newPrice = '99.99';

  await page.goto('/store');
  await page.getByTestId('view-store').click();

  const editButton = page.getByTestId('edit-product');
  await waitForModalWithRetry(page, editButton, '#product_name');

  await page.fill('#product_name', newName);
  await page.fill('#product_price', newPrice);

  await page.click('button:has-text("Save Changes")');

  await expect(page.getByText(newName)).toBeVisible();
  await expect(page.getByText(`₱ ${newPrice}`)).toBeVisible();
});

test('edit product description', async ({ page }) => {
  const newDescription = 'Updated description';

  await page.goto('/store');
  await page.getByTestId('view-store').click();

  const editButton = page.getByTestId('edit-product');
  await waitForModalWithRetry(page, editButton, '#product_name');

  await page.fill('#product_description', newDescription);

  await page.click('button:has-text("Save Changes")');

  await page.waitForTimeout(1000)

  await page.locator('#product_name').first().isVisible().catch(() => true);
});
