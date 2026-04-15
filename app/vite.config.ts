import { defineConfig } from 'vite'; // Change from 'vitest/config' to 'vite'
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		SvelteKitPWA({
			injectRegister: 'auto',
			registerType: 'autoUpdate',
			manifest: {
				name: `Puso't Pinggan`,
				short_name: 'PusotPinggan',
				description: 'Order food from local restaurants',
				theme_color: '#d7385d',
				background_color: '#e4688b',
				display: 'standalone',
				start_url: '/',
				icons: [
					{
						src: '/192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				// NetworkFirst = always try network first, fall back to error if offline
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'global-cache',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
							},
							networkTimeoutSeconds: 10, // Wait 10s before considering offline
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			}
		})
	]
});
