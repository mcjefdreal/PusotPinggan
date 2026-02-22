<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Header from '$lib/components/Header.svelte';

	const { data, children } = $props();
</script>

<div class="bg-pp-white w-full min-h-screen">
	<Header supabase={data.supabase} session={data.session} />
	{@render children()}
	<Navbar />
</div>
