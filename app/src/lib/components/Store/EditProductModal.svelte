<script lang="ts">
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation';
	import { EditOutline } from 'flowbite-svelte-icons';
	import { Modal } from 'flowbite-svelte';

	let {
		editModal = false,
		onClose,
		onSubmit,
		showToast,
		supabase,
		storeId,
		productId,
		productName = 'Name',
		productPrice = 80,
		productDescription = 'Lorem ipsum',
		productPic = '',
		productQuantity = 0
	} = $props();

	let isSubmitting = $state(false);
	let isDeleting = $state(false);
	let selectedFile = $state<File | null>(null);
	let fileInput: HTMLInputElement;

	let displayImage = $derived.by(() => {
		if (selectedFile) {
			return URL.createObjectURL(selectedFile);
		}
		return productPic;
	});

	function handleImageClick() {
		fileInput?.click();
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			selectedFile = file;
		}
	}
</script>

<Modal bind:open={editModal} class="max-w-100" onclose={onClose}>
	<form
		method="POST"
		enctype="multipart/form-data"
		action="?/edit-product"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result }) => {
				isSubmitting = false;
				if (result.type === 'success') {
					await invalidateAll();
					const data = result.data as { success: boolean; message: string };
					onSubmit?.(data)
					showToast?.(data);
				}
			}
		}}
	>
		<input type="hidden" name="productId" value={productId} />
		<input type="hidden" name="storeId" value={storeId} />

		<div class="flex flex-col items-center space-y-6">
			<!-- <div class="bg-pp-pink aspect-square h-30 w-30 rounded-lg">
			</div> -->
			<button type="button" onclick={handleImageClick} class="focus:outline-none">
				<div class="h-30 w-30 aspect-square rounded-lg overflow-hidden">
					<img class="h-full w-full rounded-lg object-cover" src={displayImage} alt={productName} />
				</div>
			</button>
			<input
				type="file"
				bind:this={fileInput}
				onchange={handleFileChange}
				accept="image/*"
				name="product_img"
				class="hidden"
			/>
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
					step="any"
					inputmode="decimal"
					id="product_price"
					name="product_price"
					class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
					value={productPrice}
					required
				/>
				<label for="product_quantity" class="text-pp-gray mb-2.5 text-xs font-medium">Quantity</label>
				<input
					type="number"
					id="product_quantity"
					name="product_quantity"
					class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
					value={productQuantity}
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
			<button
				class="bg-pp-pink text-pp-white ml-auto flex h-10 w-40 items-center justify-center rounded-lg text-lg"
				type="submit"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Saving...' : 'Save Changes'}
			</button>
		</div>
	</form>
	<form
		method="POST"
		action="?/delete-product"
		use:enhance={() => {
			isDeleting = true;
			return async ({ result }) => {
				isDeleting = false;
				if (result.type === 'success') {
					await invalidateAll();
					const data = result.data as { success: boolean; message: string };
					showToast?.(data);
					onSubmit
				}
			}
		}}
	>
		<input type="hidden" name="productId" value={productId} />
		<div class="flex justify-center">
			<button
				class="bg-pp-pink text-pp-white flex h-10 w-40 items-center justify-center rounded-lg text-lg"
				type="submit"
				disabled={isDeleting}
			>
				{isDeleting ? 'Removing...' : 'Remove Product'}
			</button>
		</div>
	</form>
</Modal>
