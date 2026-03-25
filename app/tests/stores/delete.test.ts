import { test, expect } from '@playwright/test';
import { supabaseAdmin } from '../supabase';

let createdStoreId: string | null = null;
let storeName: string | null = null;

test.afterEach(async () => {
  if (createdStoreId) {
    await supabaseAdmin.from('product').delete().eq('store_id', createdStoreId);
    await supabaseAdmin.from('store').delete().eq('store_id', createdStoreId);
    createdStoreId = null;
    storeName = null;
  }
});

test.beforeEach(async ({ page }) => {
  const timestamp = Date.now();
  storeName = `StoreToDelete-${timestamp}`;

  await page.goto('/store');

  await page.getByTestId('add-store').click();

  await page.setInputFiles('input[type="file"]', {
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-image-data')
  });

  await page.fill('#store_name', storeName!);
  await page.fill('#store_description', 'Will be deleted');

  await page.click('.address-picker input[type="text"]');
  await page.fill('.address-picker input[type="text"]', 'UPTC');
  await page.waitForTimeout(1000);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');

  await page.waitForTimeout(1000);

  await page.click('button[type="submit"]');

  await expect(page.getByText(storeName!)).toBeVisible({ timeout: 10000 });

  const { data: store } = await supabaseAdmin
    .from('store')
    .select('store_id')
    .eq('store_name', storeName)
    .single();

  if (store) {
    createdStoreId = store.store_id;
  }
});

async function waitForModalWithRetry(page: any, editButton: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    await editButton.click({ force: true });
    
    // Wait a bit for modal to potentially appear
    await page.waitForTimeout(500);
    
    // Check if modal is visible
    const modalVisible = await page.getByTestId('delete-store').isVisible().catch(() => false);
    
    if (modalVisible) {
      return true;
    }
    
    console.log(`Modal not visible, retrying... (${i + 1}/${maxRetries})`);
  }
  
  throw new Error('Modal did not appear after retries');
}

test('delete store from stores list', async ({ page }) => {
  // Navigate to stores list
  await page.goto('/store');

  // Wait for the store to appear in the list and click view-store
  await expect(page.getByText(storeName!)).toBeVisible({ timeout: 10000 });
  await page.getByTestId('view-store').click();

  // Wait for the store detail page to load
  await expect(page.getByTestId('edit-store')).toBeVisible({ timeout: 10000 });

  // Click edit button using data-testid
  const editButton = page.getByTestId('edit-store');
  await waitForModalWithRetry(page, editButton, 5)

  // Verify the modal appeared by checking delete-store button
  await expect(page.getByTestId('delete-store')).toBeVisible({ timeout: 30000 });

  // Click Delete Store button using data-testid
  await page.getByTestId('delete-store').click();

  // Handle confirmation dialog if it appears
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.waitForURL('/store', { timeout: 10000 });

  await expect(page.getByText(storeName!)).not.toBeVisible();
});
