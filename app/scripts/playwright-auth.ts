import { chromium } from '@playwright/test';
import 'dotenv/config';
async function saveAuthSession() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  // Navigate to app
  await page.goto('http://localhost:5173/');
  
  console.log('Please log in with Google OAuth...');
  console.log('The session will save automatically after login.');
  
  await page.waitForSelector('h1:has-text("hello profile")', { timeout: 0 });
  
  console.log('Login detected! Saving session...');
  
  // Save session
  await context.storageState({ path: 'playwright/.auth/user.json' });
  
  console.log('Session saved to playwright/.auth/user.json');
  
  await browser.close();
}
saveAuthSession().catch(console.error);