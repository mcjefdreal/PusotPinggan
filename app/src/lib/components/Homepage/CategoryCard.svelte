<script>
	import { Card } from 'flowbite-svelte';

	import { EditOutline } from 'flowbite-svelte-icons';

	let {
		// categPic,
		categName = 'Category',
		categProductsNum = 0
	} = $props();

</script>

<Card class="items-left flex">
	<div class="bg-pp-light-pink mb-2 aspect-square max-h-40 rounded-t-lg"></div>
	<!-- <img class="aspect-square max-h-40 rounded-t-lg mb-2" src={productPic} alt="product 1" /> -->

	<div class="items-left flex flex-row px-2 pb-2 overflow-hidden">
		<div class="flex flex-col text-left">
			<p class="text-pp-pink text-base font-semibold truncate">{categName}</p>
			<p class="text-pp-black text-base truncate"> {categProductsNum} products </p>
		</div>
	</div>
</Card>
