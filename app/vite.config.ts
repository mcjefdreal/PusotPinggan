import { defineConfig } from 'vite'; // Change from 'vitest/config' to 'vite'
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

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
				runtimeCaching: [
					{
						// Supabase Storage images — cache aggressively
						urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'supabase-images',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
							},
							cacheableResponse: { statuses: [0, 200] }
						}
					},
					{
						// All other external images (store/product URLs)
						urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)(\?.*)?$/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'external-images',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 7
							},
							cacheableResponse: { statuses: [0, 200] }
						}
					},
					{
						// Supabase REST API + your API routes — fail fast, short stale fallback
						urlPattern: /^https:\/\/.*\/(rest\/v1\/|api\/).*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'api-data',
							networkTimeoutSeconds: 3,
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 5 // 5 min
							},
							cacheableResponse: { statuses: [0, 200] }
						}
					}
				]
			}
		})
	]
});
