<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	const { children } = $props();
</script>

<div class="bg-pp-white w-full min-h-screen">
	{@render children()}
	<Navbar />
</div>
