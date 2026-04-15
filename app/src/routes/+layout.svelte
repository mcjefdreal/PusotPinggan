<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	onMount(async () => {
		if (pwaInfo) {
		const { registerSW } = await import('virtual:pwa-register');
		registerSW({
			immediate: true,
			onRegistered(r) {
			console.log(`SW Registered: ${r}`);
			},
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
  {@html webManifestLink}
</svelte:head>

{@render children()}
