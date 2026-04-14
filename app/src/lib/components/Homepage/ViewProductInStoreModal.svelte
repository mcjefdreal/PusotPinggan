<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import { Toast } from 'flowbite-svelte';

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
	let showSuccess = $state(false);
	let showError = $state(false);
	let toastMessage = $state('');

	async function handleAddToCart() {
		if (isSubmitting) return;

		isSubmitting = true;
		showSuccess = false;
		showError = false;

		const quantityInput = document.getElementById('product_quantity') as HTMLInputElement;
		const quantity = parseInt(quantityInput?.value || '1') || 1;

		try {
			const formData = new FormData();
			formData.append('productId', productId);
			formData.append('storeId', storeId);
			formData.append('quantity', quantity.toString());

			const response = await fetch('/api/cart', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok && result.success) {
				toastMessage = 'Added to cart!';
				showSuccess = true;
				setTimeout(() => {
					showSuccess = false;
					onClose?.();
				}, 1500);
			} else {
				toastMessage = result.error || 'Failed to add to cart';
				showError = true;
				setTimeout(() => (showError = false), 3000);
			}
		} catch {
			toastMessage = 'An error occurred';
			showError = true;
			setTimeout(() => (showError = false), 3000);
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if showSuccess}
	<Toast color="green" class="fixed top-4 right-4 z-100">
		{toastMessage}
	</Toast>
{/if}

{#if showError}
	<Toast color="red" class="fixed top-4 right-4 z-100">
		{toastMessage}
	</Toast>
{/if}

<Modal bind:open={editModal} class="max-w-100" onclose={onClose}>
	<div class="relative">
		<div class="bg-pp-gray/10 flex h-44 w-full items-center justify-center">
			<img class="h-full object-cover" src={productPic} alt={productName} />
		</div>
	</div>

	<div class="flex flex-col space-y-6">
		<div>
			<div class="flex flex-row">
				<p class="text-pp-pink text-medium font-semibold">{productName}</p>
				<p class="ml-auto">₱ {productPrice.toFixed(2)}</p>
			</div>
			<p>{productDescription}</p>
			<label for="product_quantity" class="text-pp-gray mb-2.5 text-xs font-medium">Quantity</label>
			<input
				type="number"
				id="product_quantity"
				name="product_quantity"
				class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
				value={productQuantity}
				min="1"
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
			type="button"
			disabled={isSubmitting}
			onclick={handleAddToCart}
		>
			{isSubmitting ? 'Adding...' : 'Add to Cart'}
		</button>
	</div>
</Modal>
