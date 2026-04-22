<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { subscribeToMessagesList } from '$lib/hooks/UseRealtime';
	import { supabase } from '$lib/SupabaseClient';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	const { data, children } = $props();

	// let pollInterval: ReturnType<typeof setInterval>;

	// onMount(() => {
	// 	pollInterval = setInterval(async () => {
	// 		await invalidateAll();
	// 	}, 60000);

	// 	return () => {
	// 		if (pollInterval) {
	// 			clearInterval(pollInterval);
	// 		}
	// 	};
	// });
	onMount(() => {
		const userId = data.user.id;
		if (!userId) return;

		const channel = subscribeToMessagesList(userId, () => {
			invalidateAll();
		});

		return () => {
			supabase.removeChannel(channel);
		};
	});
</script>

<div class="bg-pp-bg min-h-screen w-full">
	<Header supabase={data.supabase} session={data.session} />
	{@render children()}
	<Navbar {data} />
</div>
