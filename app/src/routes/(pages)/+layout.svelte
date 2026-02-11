<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Header from '$lib/components/Header.svelte';

	const { children } = $props();
</script>

<Header />
{@render children()}
<Navbar />
