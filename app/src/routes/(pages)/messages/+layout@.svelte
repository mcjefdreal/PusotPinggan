<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	const { children } = $props();
</script>

<div class="bg-pp-white min-h-screen w-full">
	{@render children()}
	<Navbar />
</div>
