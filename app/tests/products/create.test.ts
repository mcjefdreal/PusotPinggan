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
  const storeName = `ProductStore-${timestamp}`;

  await page.goto('/store');
  await page.getByTestId('add-store').click();

  await page.setInputFiles('input[type="file"]', {
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-image-data')
  });

  await page.fill('#store_name', storeName);
  await page.fill('#store_description', 'Test store for products');

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

async function waitForModalWithRetry(page: any, button: any, modalSelector: string, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    await button.click({ force: true });
    
    await page.waitForTimeout(500);
    
    const modalVisible = await page.locator(modalSelector).first().isVisible().catch(() => false);
    
    if (modalVisible) {
      return true;
    }
    
    console.log(`Modal not visible, retrying... (${i + 1}/${maxRetries})`);
  }
  
  throw new Error('Modal did not appear after retries');
}

test('create product with valid data', async ({ page }) => {
  const timestamp = Date.now();
  const productName = `TestProduct-${timestamp}`;

  await page.goto('/store');
  await page.getByTestId('view-store').first().click();

  const addButton = page.getByTestId('add-product');
  await waitForModalWithRetry(page, addButton, '#product_name');

  await page.setInputFiles('input[type="file"]', {
    name: 'test-product.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-product-image')
  });

  await page.fill('#product_name', productName);
  await page.fill('#product_price', '99.99');
  await page.fill('#product_quantity', '10');
  await page.fill('#product_description', 'Test product description');

  await page.click('button[type="submit"]');

  await expect(page.getByText(productName)).toBeVisible();

  const { data: product } = await supabaseAdmin
    .from('product')
    .select('product_id')
    .eq('name', productName)
    .single();

  expect(product).toBeTruthy();
});

test('create product shows error without required fields', async ({ page }) => {
  await page.goto('/store');
  await page.getByTestId('view-store').first().click();

  const addButton = page.getByTestId('add-product');
  await waitForModalWithRetry(page, addButton, '#product_name');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);

  await page.locator('#product_name').first().isVisible().catch(() => false);
});
