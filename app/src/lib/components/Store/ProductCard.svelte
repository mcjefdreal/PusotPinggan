<script>
	import { Card } from 'flowbite-svelte';

	import { EditOutline } from 'flowbite-svelte-icons';

	let {
		// productPic,
		productName = 'Product',
		productPrice = 85.0,
		productDescription = 'Lorem ipsum'
	} = $props();

	let editModal = $state(false);

	import EditProductModal from './EditProductModal.svelte';
</script>

<Card class="items-left flex max-w-[170px]">
	<div class="bg-pp-light-pink mb-2 aspect-square max-h-40 rounded-t-lg"></div>
	<!-- <img class="aspect-square max-h-40 rounded-t-lg mb-2" src={productPic} alt="product 1" /> -->

	<div class="items-left flex flex-row px-2 pb-2">
		<div class="flex flex-col text-left">
			<p class="text-pp-pink text-base font-semibold">{productName}</p>
			<p class="text-pp-black text-base">₱ {productPrice}</p>
		</div>
		<EditOutline class="text-pp-pink ms-1 ml-auto h-6 w-6" onclick={() => (editModal = true)} />
	</div>
</Card>

<EditProductModal {editModal} {productName} {productPrice} {productDescription}></EditProductModal>
