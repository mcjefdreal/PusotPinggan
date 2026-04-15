<script lang="ts">
	import Banner from '$lib/banner.png';
	import RecCard from '$lib/components/Homepage/RecCard.svelte';

	import { Button } from 'flowbite-svelte';
	import CategoryCard from '$lib/components/Homepage/CategoryCard.svelte';

	import BasketIcon from '$lib/icons/basket.svg';

	let { data } = $props();

	function formatDistance(meters: number): string {
		return (meters / 1000).toFixed(1);
	}
</script>

<div class="min-h-screen w-full p-5">
	<img src={Banner} alt="welcome banner" class="w-full rounded-lg" />
	<!-- <h1>hello, {email}</h1> -->

	<h1 class="py-3 text-xl font-medium">Recommended</h1>
	<div class="flex flex-nowrap gap-3 overflow-x-auto">
		<RecCard></RecCard>
		<RecCard></RecCard>
		<RecCard></RecCard>
		<RecCard></RecCard>
	</div>

	<h1 class="py-3 text-xl font-medium">All categories</h1>
	<div class="grid grid-cols-2 gap-4">
		<CategoryCard></CategoryCard>
		<CategoryCard></CategoryCard>
		<CategoryCard></CategoryCard>
	</div>
	{#each data.stores as s (s.store_id)}
		<p>{s.store_name} - {formatDistance(s.distance_meters)}km away</p>
	{/each}

	<a href="/profile/basket/cart">
		<Button
			pill={true}
			class="bg-pp-pink fixed right-6 bottom-25 z-50 p-2! shadow-lg focus:outline-none"
			><img src={BasketIcon} alt="Basket" /></Button
		>
	</a>
</div>
