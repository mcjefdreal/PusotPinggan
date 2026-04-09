<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	// import { resolve } from '$app/paths';

	let {
		editModal = false,
		onClose,
		storeId,
		productId,
		productName = 'Name',
		productPrice = 80,
		productDescription = 'Lorem ipsum',
		productPic = '',
		productQuantity = 0
	} = $props();

	let isSubmitting = $state(false);
</script>

<Modal bind:open={editModal} class="max-w-100" onclose={onClose}>
	<div class="relative">
		<div class="bg-pp-gray/10 flex h-44 w-full items-center justify-center">
			<img class="h-full object-cover" src={productPic} alt={productName} />
		</div>
	</div>
	<form method="POST" enctype="multipart/form-data" action="?/order-product">
		<input type="hidden" name="productId" value={productId} />
		<input type="hidden" name="storeId" value={storeId} />

		<div class="flex flex-col space-y-6">
			<div>
				<div class="flex flex-row">
					<p class="text-pp-pink text-medium font-semibold">{productName}</p>
					<p class="ml-auto">₱ {productPrice.toFixed(2)}</p>
				</div>
				<p>{productDescription}</p>
				<label for="product_quantity" class="text-pp-gray mb-2.5 text-xs font-medium"
					>Quantity</label
				>
				<input
					type="number"
					id="product_quantity"
					name="product_quantity"
					class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
					value={productQuantity}
					required
				/>
			</div>
		</div>
		<div class="flex flex-row py-2.5">
			<a
				class="bg-pp-white border-pp-pink text-pp-pink flex h-10 w-40 items-center justify-center rounded-lg border text-lg"
				href="/"
			>
				View Store
			</a>

			<button
				class="bg-pp-pink text-pp-white ml-auto flex h-10 w-40 items-center justify-center rounded-lg text-lg"
				type="submit"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Ordering...' : 'Order'}
			</button>
		</div>
	</form>
	<form method="POST" action="?/delete-product">
		<input type="hidden" name="productId" value={productId} />
	</form>
</Modal>
