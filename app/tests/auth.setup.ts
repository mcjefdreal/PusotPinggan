import { test as setup, expect } from '@playwright/test';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import 'dotenv/config';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json';
const tokenFile = '.auth-token.txt';

setup('authenticate', async ({ page }) => {
	const accessToken = process.env.TEST_ACCESS_TOKEN;

	// OPTION A: Check auth file FIRST - use it if it exists
	if (fs.existsSync(authFile)) {
		const storageState = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
		if (storageState.cookies) {
			await page.context().addCookies(storageState.cookies);
		}
		// Navigate to trigger auth state
		await page.goto('http://localhost:5173/home');
		await expect(page.getByText('All categories')).toBeVisible({ timeout: 10000 });
		await page.waitForTimeout(1000);
	}
	// OPTION B: Try TEST_ACCESS_TOKEN if auth file doesn't exist
	else if (accessToken) {
		// Try to parse token - support multiple formats
		try {
			const parsed = JSON.parse(accessToken);
			
			// Format 1: Full storageState (has cookies array) - from GitHub secret
			if (parsed.cookies && Array.isArray(parsed.cookies)) {
				await page.context().addCookies(parsed.cookies);
			}
			// Format 2: Supabase response { "access_token": "..." }
			else if (parsed.access_token) {
				await page.context().addCookies([{
					name: 'sb-tyyeqrrpaezkfusujglm-auth-token.0',
					value: parsed.access_token,
					domain: 'localhost',
					path: '/'
				}]);
			}
			// Format 3: { "token": "...", "cookieName": "..." }
			else if (parsed.token) {
				await page.context().addCookies([{
					name: parsed.cookieName || 'sb-tyyeqrrpaezkfusujglm-auth-token.0',
					value: parsed.token,
					domain: 'localhost',
					path: '/'
				}]);
			}
			else {
				throw new Error('Unknown token format');
			}
		} catch (e) {
			// Format 4: Raw token string - use as-is
			await page.context().addCookies([{
				name: 'sb-tyyeqrrpaezkfusujglm-auth-token.0',
				value: accessToken,
				domain: 'localhost',
				path: '/'
			}]);
		}
		// Navigate to trigger auth state
		await page.goto('http://localhost:5173/home');
		await expect(page.getByText('All categories')).toBeVisible({ timeout: 10000 });
		await page.waitForTimeout(1000);
	}
	// OPTION C: Run headed browser login
	else {
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

		// Wait for cookies to be set
		await loginPage.waitForTimeout(5000);

		// Extract and save token from cookies
		const cookies = await loginPage.context().cookies();
		const tokenCookie = cookies.find(c => 
			c.name.startsWith('sb-') && c.name.endsWith('-auth-token.0')
		);
		
		if (tokenCookie) {
			// Save token and cookie name as JSON
			const tokenData = JSON.stringify({ token: tokenCookie.value, cookieName: tokenCookie.name });
			fs.writeFileSync(tokenFile, tokenData);
			console.log(`\n✅ Auth token saved to ${tokenFile}`);
			console.log(`Cookie name: ${tokenCookie.name}`);
			console.log(
				'Copy the contents of .auth-token.txt to your GitHub secrets as: TEST_ACCESS_TOKEN\n'
			);
		} else {
			console.log("No token found in cookies");
		}

		await loginPage.context().storageState({ path: authFile });
		await browser.close();
		return;
	}

	await page.context().storageState({ path: authFile });
});
