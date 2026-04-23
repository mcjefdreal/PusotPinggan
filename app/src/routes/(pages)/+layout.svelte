<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { subscribeToMessagesList } from '$lib/hooks/UseRealtime';
	import { supabaseClient } from '$lib/SupabaseClient';
	import { onMount } from 'svelte';

	const { data, children } = $props();

	let unreadCount = $derived(data.unreadCount || 0);

	onMount(() => {
		const userId = data.user?.id;
		if (!userId) return;

		const channel = subscribeToMessagesList(userId, () => {
			invalidate('supabase:messages');
		});

		return () => {
			supabaseClient.removeChannel(channel);
		};
	});
</script>

<div class="bg-pp-bg min-h-screen w-full">
	<Header supabase={data.supabase} session={data.session} />
	{@render children()}
	<Navbar {unreadCount} />
</div>
