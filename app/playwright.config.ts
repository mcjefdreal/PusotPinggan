import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: false,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	// forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	// retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: 1,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	// reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		// storageState: 'playwright/.auth/user.json',
		/* Base URL to use in actions like `await page.goto('')`. */
		baseURL: 'http://localhost:5173',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry'
	},

	/* Configure projects for major browsers */
	projects: [
		{ 
			name: 'setup', 
			testMatch: /.*\.setup\.ts/ ,
			use: { browserName: 'firefox' }
		},
		{
			name: 'chromium',
			use: { 
				...devices['Desktop Chrome'],
				storageState: 'playwright/.auth/user.json',
				launchOptions: {
					args: ['--disable-blink-features=AutomationControlled']
				},
				permissions: ['geolocation'],
				geolocation: { latitude: 14.5995, longitude: 120.9842 },
			},
			dependencies: ['setup']
		},
		// {
		// 	name: 'firefox',
		// 	use: { 
		// 		...devices['Desktop Firefox'],
		// 		storageState: 'playwright/.auth/user.json',
		// 		launchOptions: {
		// 			args: [
		// 				'--disable-blink-features=AutomationControlled',
		// 			]
		// 		},
		// 		permissions: ['geolocation'],
		// 		geolocation: { latitude: 14.5995, longitude: 120.9842 },
		// 	},
		// 	dependencies: ['setup']
		// },

		// /* Test against mobile viewports. */
		// {
		// 	name: 'Mobile Chrome',
		// 	use: { 
		// 		...devices['Pixel 5'],
		// 		storageState: 'playwright/.auth/user.json',
		// 		launchOptions: {
		// 			args: ['--disable-blink-features=AutomationControlled']
		// 		},
		// 		permissions: ['geolocation'],
		// 		geolocation: { latitude: 14.5995, longitude: 120.9842 },
		// 	},
		// 	dependencies: ['setup']
		// }
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI
	}
});
