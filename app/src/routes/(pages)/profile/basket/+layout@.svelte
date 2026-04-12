<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	const { children } = $props();
</script>

<div class="bg-pp-white flex h-screen flex-col overflow-y-auto">
	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>
	<Navbar />
</div>
