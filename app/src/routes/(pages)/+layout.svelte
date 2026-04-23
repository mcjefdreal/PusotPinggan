<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { subscribeToMessagesList } from '$lib/hooks/UseRealtime';
	import { supabaseClient } from '$lib/SupabaseClient';
	import { onMount } from 'svelte';

	const { data, children } = $props();

	let unreadCount = $state(0);

	async function fetchUnreadCount() {
		if (!data.user?.id) return;

		const { data: stores } = await supabaseClient
			.from('store')
			.select('store_id')
			.eq('owner', data.user.id);

		const storeIds = stores?.map((s) => s.store_id) || [];

		const { data: count } = await supabaseClient.rpc('get_unread_count', {
			p_buyer_id: data.user.id,
			p_store_ids: storeIds
		});

		unreadCount = count || 0;
	}

	onMount(() => {
		fetchUnreadCount();

		const userId = data.user?.id;
		if (!userId) return;

		const channel = subscribeToMessagesList(userId, () => {
			fetchUnreadCount();
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