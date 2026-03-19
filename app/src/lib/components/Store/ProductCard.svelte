<script>
	import { EditOutline } from 'flowbite-svelte-icons';

	let {
		productPic,
		productName = 'Product',
		productPrice = 85.0,
		productDescription = 'Lorem ipsum'
	} = $props();

	let editModal = $state(false);

	import EditProductModal from './EditProductModal.svelte';
</script>

<div class="overflow-hidden rounded-xl border border-pp-gray/30">
	<img class="h-28 w-full object-cover" src={productPic} alt={productName} />
	<div class="flex">
		<div class="p-2">
			<div class="text-sm font-semibold text-pp-black">{productName}</div>
			<div class="text-xs text-pp-gray">₱ {productPrice.toFixed(2)}</div>
		</div>
		<EditOutline class="text-pp-pink mt-1 ml-auto h-6 w-6" onclick={() => (editModal = true)} />
	</div>
</div>

<EditProductModal {editModal} {productName} {productPrice} {productDescription}></EditProductModal>
