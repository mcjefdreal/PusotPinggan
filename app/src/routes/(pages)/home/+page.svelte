<script lang="ts">
	import Banner from '$lib/banner.png';
	import RecCard from '$lib/components/Homepage/RecCard.svelte';

	import { Button } from 'flowbite-svelte';
	import CategoryCard from '$lib/components/Homepage/CategoryCard.svelte';

	import BasketIcon from '$lib/icons/basket.svg';
</script>

<div class="min-h-screen w-full p-5">
	<img src={Banner} alt="welcome banner" class="w-full rounded-lg"/>
	<!-- <h1>hello, {email}</h1> -->

	<h1 class="py-3 text-xl font-medium"> Recommended </h1>
	<div class="flex flex-nowrap overflow-x-auto gap-3">
		<RecCard> </RecCard>
		<RecCard> </RecCard>
		<RecCard> </RecCard>
		<RecCard> </RecCard>
	</div>

	<h1 class="py-3 text-xl font-medium"> All categories </h1>
	<div class="grid grid-cols-2 gap-4">
		<CategoryCard> </CategoryCard>
		<CategoryCard> </CategoryCard>
		<CategoryCard> </CategoryCard>
	</div>

	<Button pill={true} class="focus:outline-none p-2! bg-pp-pink fixed right-6 bottom-25 z-50 shadow-lg"><img src={BasketIcon} alt="Basket" /></Button>
</div>
