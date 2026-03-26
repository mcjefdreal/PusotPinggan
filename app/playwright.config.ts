import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: false,
	workers: 1,
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'setup',
			testMatch: 'auth.setup.ts',
			use: { browserName: 'chromium', headless: true }
		},
		{
			name: 'Mobile Chrome',
			use: {
				...devices['Pixel 5'],
				storageState: 'playwright/.auth/user.json',
				launchOptions: {
					args: ['--disable-blink-features=AutomationControlled']
				},
				permissions: ['geolocation'],
				geolocation: { latitude: 14.5995, longitude: 120.9842 }
			},
			dependencies: ['setup']
		}
	],
	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		stderr: 'ignore' // Suppress errors
	}
});
