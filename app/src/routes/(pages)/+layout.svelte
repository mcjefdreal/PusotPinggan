<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Header from '$lib/components/Header.svelte';

	const { children } = $props();
</script>

<div class="bg-pp-white w-full min-h-screen">
	<Header />
	{@render children()}
	<Navbar />
</div>
