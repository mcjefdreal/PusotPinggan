<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	const { data, children } = $props();

	let pollInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		pollInterval = setInterval(async () => {
			await invalidateAll();
		}, 60000);

		return () => {
			if (pollInterval) {
				clearInterval(pollInterval);
			}
		};
	});
</script>

<div class="bg-pp-bg min-h-screen w-full">
	<Header supabase={data.supabase} session={data.session} />
	{@render children()}
	<Navbar {data} />
</div>
