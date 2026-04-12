<script lang="ts">
	import Banner from '$lib/banner.png';
	import RecCard from '$lib/components/Homepage/RecCard.svelte';

	import { Button } from 'flowbite-svelte';
	import CategoryCard from '$lib/components/Homepage/CategoryCard.svelte';

	import BasketIcon from '$lib/icons/basket.svg';
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

	<a href="/profile/basket/cart">
		<Button
			pill={true}
			class="bg-pp-pink fixed right-6 bottom-25 z-50 p-2! shadow-lg focus:outline-none"
			><img src={BasketIcon} alt="Basket" /></Button
		>
	</a>
</div>
