import { test, expect } from '@playwright/test';
import { supabase } from './supabase.ts';

test('logged in user can access application pages', async ({ page }) => {
  await page.goto('/home');
  await expect(page.locator('h1')).toContainText('hello');
});