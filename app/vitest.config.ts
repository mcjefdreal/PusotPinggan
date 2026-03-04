import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';
import { playwright } from '@vitest/browser-playwright';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			expect: { requireAssertions: true },
			projects: [
				{
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**', 'tests/**']
				},
				{
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'tests/**']
				}
			]
		}
	})
);
