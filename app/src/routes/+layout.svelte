<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	// @ts-expect-error build stuff
	import { pwaInfo } from 'virtual:pwa-info';

	onMount(async () => {
		if (pwaInfo) {
			// @ts-expect-error build stuff
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				// @ts-expect-error build stuff
				onRegistered(r) {
					console.log(`SW Registered: ${r}`);
				},
				// @ts-expect-error build stuff
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});

	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	const { children } = $props();
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte-ignore svelte/no-at-html-tags -->
	{@html webManifestLink}
</svelte:head>

{@render children()}
