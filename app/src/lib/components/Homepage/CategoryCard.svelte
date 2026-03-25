<script>
	import { Card } from 'flowbite-svelte';

	let {
		// categPic,
		categName = 'Category',
		categProductsNum = 0
	} = $props();
</script>

<Card class="items-left flex">
	<div class="bg-pp-light-pink mb-2 aspect-square max-h-40 rounded-t-lg"></div>
	<!-- <img class="aspect-square max-h-40 rounded-t-lg mb-2" src={productPic} alt="product 1" /> -->

	<div class="items-left flex flex-row overflow-hidden px-2 pb-2">
		<div class="flex flex-col text-left">
			<p class="text-pp-pink truncate text-base font-semibold">{categName}</p>
			<p class="text-pp-black truncate text-base">{categProductsNum} products</p>
		</div>
	</div>
</Card>
