<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Header from '$lib/components/Navbar/header.svelte';

	const { children } = $props();
</script>

{@render children()}
<Navbar />
<Header />
