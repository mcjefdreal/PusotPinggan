<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte'

	const { children } = $props();
</script>

{@render children()}
<Navbar />