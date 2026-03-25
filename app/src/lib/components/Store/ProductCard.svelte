<script lang="ts">
	import { EditOutline } from 'flowbite-svelte-icons';

	let {
		productPic = '',
		productName = 'Product',
		productPrice = 85.0,
		productQuantity = 1,
		productDescription = 'Lorem ipsum',
		productId = '',
		storeId = '',
		showToast = () => {},
	} = $props();

	let editModal = $state(false);

	function handleClose() {
		editModal = false;
	}

	function handleSubmit() {
		editModal = false;
	}

	import EditProductModal from './EditProductModal.svelte';
</script>

<div class="overflow-hidden rounded-xl border border-pp-gray/30">
	<img class="h-28 w-full object-cover" src={productPic} alt={productName} />
	<div class="flex">
		<div class="p-2">
			<div class="text-sm font-semibold text-pp-black">{productName}</div>
			<div class="text-xs text-pp-gray">₱ {productPrice.toFixed(2)}</div>
		</div>
		<EditOutline class="text-pp-pink mt-1 ml-auto h-6 w-6" onclick={() => (editModal = true)} data-testid="edit-product" />
	</div>
</div>

<EditProductModal 
	{editModal} 
	onClose={handleClose}
	onSubmit={handleSubmit}
	showToast={showToast}
	{storeId}
	{productId}
	{productName} 
	{productPrice} 
	{productDescription} 
	{productPic}
	{productQuantity}
>
</EditProductModal>
