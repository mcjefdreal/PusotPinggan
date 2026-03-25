<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';

	let {
		active = false,
		onClose,
		onSubmit,
		storeId,
		supabase
	} = $props();

	let isSubmitting = $state(false);

</script>

<Modal bind:open={active} class="max-w-100" onclose={onClose}>
	<form
		method="POST"
		enctype="multipart/form-data"
		action="?/add-product"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result }) => {
				isSubmitting = false;
				if (result.type === 'success') {
					await invalidateAll();
					const data = result.data as { success: boolean; message: string };
					onSubmit?.(data);
				}
			}
		}}
	>
		<div class="flex flex-col items-center space-y-6">
			<div>
				<div>
					<label for="product_img" class="text-pp-gray mb-2.5 text-xs font-medium">Product image</label>
					<input type="file" id="product_img" name="product_img" accept="image/*" required />
				</div>

				<label for="product_name" class="text-pp-gray mb-2.5 text-xs font-medium">Product name</label>
				<input
					type="text"
					id="product_name"
					name="product_name"
					class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
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
					required
				/>
				<div class="flex flex-row w-full justify-between">

					<div class="flex-col w-[48%]">
					<label for="product_price" class="text-pp-gray mb-2.5 text-xs font-medium">Price</label>
					<input
						type="number"
						step="any"
						inputmode="decimal"
						id="product_price"
						name="product_price"
						class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
						required
					/>
					</div>
					<div class="flex-col w-[48%]">
						<label for="product_quantity" class="text-pp-gray mb-2.5 text-xs font-medium"
							>Quantity</label
						>
						<input
							type="number"
							id="product_quantity"
							name="product_quantity"
							class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
							required
						/>
					</div>
				</div>


				<input type="hidden" name="storeId" value={storeId} />
			</div>
		</div>
		<div class="flex flex-row mt-5">
			<button
				class="bg-pp-pink text-pp-white ml-auto flex h-10 w-40 items-center justify-center rounded-lg text-auto"
				type="submit"
				disabled={isSubmitting}
				value="add"
			>
			{isSubmitting ? 'Adding product...' : 'Add Product'}
			</button>
		</div>
	</form>
</Modal>
