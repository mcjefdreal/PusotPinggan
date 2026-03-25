import { test as setup, expect } from '@playwright/test';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import 'dotenv/config';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json';
const tokenFile = '.auth-token.txt';

setup('authenticate', async ({ page }) => {
	const accessToken = process.env.TEST_ACCESS_TOKEN;

	if (accessToken) {
		// CI/Local with env var - set cookie directly
		await page.goto('http://localhost:5173');

		await page.addInitScript((token) => {
			localStorage.setItem('sb-access-token', token);
		}, accessToken);

		// Navigate to trigger auth state
		await page.goto('http://localhost:5173/home');
		await page.waitForTimeout(1000);
	} else {
		// Fallback: stealth login (headed only)
		const stealthPlugin = stealth();
		stealthPlugin.enabledEvasions.delete('iframe.contentWindow');
		stealthPlugin.enabledEvasions.delete('media.codecs');

		const browser = await chromium.launch({
			headless: false,
			args: ['--disable-blink-features=AutomationControlled']
		});

		const context = await browser.newContext();
		const loginPage = await context.newPage();

		await loginPage.goto('http://localhost:5173');

		await loginPage.getByText('Sign in with Google').click();

		await loginPage.waitForURL(/.*google.*|.*accounts.*/, { timeout: 15000 });

		await loginPage.getByLabel('Email or phone').fill(process.env.TEST_GOOGLE_USER!);
		await loginPage.getByRole('button', { name: 'Next' }).click();

		await loginPage.getByLabel('Enter your password').fill(process.env.TEST_GOOGLE_PASS!);
		await loginPage.getByRole('button', { name: 'Next' }).click();

		await loginPage.waitForURL('http://localhost:5173/**', { timeout: 30000 });

		await expect(loginPage.getByText('All categories')).toBeVisible({ timeout: 10000 });

		// Extract and save token
		const token = await loginPage.evaluate(() => localStorage.getItem('sb-access-token'));
		if (token) {
			fs.writeFileSync(tokenFile, token);
			console.log(`\n✅ Auth token saved to ${tokenFile}`);
			console.log(
				'Copy this to your .env file as: TEST_ACCESS_TOKEN=' + token.substring(0, 50) + '...\n'
			);
		}

		await loginPage.context().storageState({ path: authFile });
		await browser.close();
		return;
	}

	await page.context().storageState({ path: authFile });
});
