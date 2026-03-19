<script lang="ts">
	import { Modal } from 'flowbite-svelte';

	let {
		editModal = false,
		productName = 'Name',
		productPrice = 80,
		productDescription = 'Lorem ipsum'
	} = $props();
</script>

<Modal form bind:open={editModal} class="max-w-[400px]">
	<div class="flex flex-col items-center space-y-6">
		<div class="bg-pp-pink aspect-square h-30 w-30 rounded-lg"></div>
		<div>
			<label for="product_name" class="text-pp-gray mb-2.5 text-xs font-medium">Product name</label>
			<input
				type="text"
				id="product_name"
				name="product_name"
				class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
				value={productName}
				required
			/>
			<label for="product_price" class="text-pp-gray mb-2.5 text-xs font-medium">Price</label>
			<input
				type="number"
				id="product_price"
				name="product_price"
				class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
				value={productPrice}
				required
			/>
			<label for="product_description" class="text-pp-gray mb-2.5 text-xs font-medium"
				>Description</label
			>
			<input
				type="text"
				id="product_description"
				name="product_description"
				class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
				value={productDescription}
				required
			/>
		</div>
	</div>
	<div class="flex flex-row">
		<a
			class="bg-pp-pink text-pp-white ml-auto flex h-10 w-40 items-center justify-center rounded-lg text-lg"
			href="/"
		>
			Save Changes
		</a>
	</div>
</Modal>
