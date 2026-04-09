<script lang="ts">
	let {
		productPic = '',
		productName = 'Product',
		productPrice = 85.0,
		productQuantity = 1,
		productDescription = 'Lorem ipsum',
		productId = '',
		storeId = '',
	} = $props();

	import ViewProductInStoreModal from '$lib/components/Homepage/ViewProductInStoreModal.svelte';

	let editModal = $state(false);

	function handleClose() {
		editModal = false;
	}
</script>

<button onclick={() => (editModal = true)}>
	<div class="border-pp-gray/30 overflow-hidden rounded-xl border">
		<img class="h-28 w-full object-cover" src={productPic} alt={productName} />
		<div class="flex">
			<div class="p-2">
				<div class="text-pp-black text-sm font-semibold">{productName}</div>
				<div class="text-pp-gray text-xs text-left">₱ {productPrice.toFixed(2)}</div>
			</div>
		</div>
	</div>
</button>

<ViewProductInStoreModal
	{editModal}
	onClose={handleClose}
	{storeId}
	{productId}
	{productName}
	{productPrice}
	{productDescription}
	{productPic}
	{productQuantity}
></ViewProductInStoreModal>