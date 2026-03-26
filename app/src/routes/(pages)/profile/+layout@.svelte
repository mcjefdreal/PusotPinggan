<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	const { children } = $props();
</script>

<div class="bg-pp-white h-screen flex flex-col overflow-hidden">
  <main class="flex-1 overflow-hidden">
    {@render children()}
  </main>
  <Navbar />
</div>
