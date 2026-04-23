<script lang="ts">
	import AddProductModal from '$lib/components/Store/AddProductModal.svelte';
	import EditStoreModal from '$lib/components/Store/EditStoreModal.svelte';
	import type { PageProps } from './$types';
	import { Toast } from 'flowbite-svelte';
	import { ArrowLeftOutline, EditOutline } from 'flowbite-svelte-icons';

	import { resolve } from '$app/paths';
	import ProductCard from '$lib/components/Store/ProductCard.svelte';

	let { data }: PageProps = $props();

	let activeTab = $state<'products' | 'orders'>('products');
	let active = $state(false);
	let editStoreActive = $state(false);
	let showSuccess = $state(false);
	let showFail = $state(false);
	let toastMessage = $state('');

	let products = $derived(data.products);
	let orders = $derived(data.orders || []);

	function handleEditStoreClose() {
		editStoreActive = false;
	}

	function handleEditStoreSubmit(result: { success: boolean; message: string }) {
		editStoreActive = false;
		toastMessage = result.message;
		if (result.success) {
			showSuccess = true;
			setTimeout(() => (showSuccess = false), 3000);
		} else {
			showFail = true;
			setTimeout(() => (showFail = false), 3000);
		}
	}

	function handleModal() {
		active = false;
	}

	function handleSubmit(result: { success: boolean; message: string }) {
		active = false;
		toastMessage = result.message;
		if (result.success) {
			showSuccess = true;
			setTimeout(() => (showSuccess = false), 3000);
		} else {
			showFail = true;
			setTimeout(() => (showFail = false), 3000);
		}
	}
</script>

{#if showSuccess}
	<Toast color="green" class="fixed top-4 right-4 z-100">
		{toastMessage}
	</Toast>
{/if}

{#if showFail}
	<Toast color="red" class="fixed top-4 right-4 z-100">
		{toastMessage}
	</Toast>
{/if}

<div class="min-h-screen w-full">
	<div class="mx-auto max-w-md">
		<!-- Banner -->
		<div class="relative">
			<a
				class="bg-pp-pink text-pp-white absolute top-2 left-2 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
				href={resolve('/store')}
			>
				<ArrowLeftOutline />
			</a>
			<button
				class="bg-pp-pink text-pp-white absolute top-2 right-2 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
				data-testid="edit-store"
				aria-label="Edit Store"
				onclick={() => (editStoreActive = true)}
			>
				<EditOutline />
			</button>
			<div class="bg-pp-gray/10 h-44 w-full">
				<img
					class="h-full w-full object-cover"
					src={data.store.img_url}
					alt={data.store.store_name}
					loading="lazy"
					decoding="async"
				/>
			</div>
		</div>

		<!-- Store info -->
		<div class="px-4 py-3">
			<div class="text-pp-pink text-xl font-semibold">{data.store.store_name}</div>
			<div class="text-pp-gray text-xs">⭐ {data.store.rating}</div>
			<p class="text-pp-gray mt-2 text-xs">{data.store.store_desc}</p>
		</div>

		<!-- Tabs -->
		<div class="mb-3 flex border-b items-center justify-center text-center">
			<button
				class="flex-1 border-b-2 px-4 py-2 transition {activeTab === 'products'
					? 'border-pp-pink text-pp-pink'
					: 'border-transparent'}"
				onclick={() => (activeTab = 'products')}
			>
				Products
			</button>
			<a
				href={resolve(`/store/${data.storeName}/${data.storeId}/orders`)}
				class="flex-1 border-b-2 px-4 py-2 transition {activeTab === 'orders'
					? 'border-pp-pink text-pp-pink'
					: 'border-transparent'}"
			>
				Orders{orders.length > 0 ? ` (${orders.length})` : ''}
			</a>
		</div>

		{#if activeTab === 'products'}
			<!-- Products -->
			<div class="px-4 pb-24">
				{#if products!.length === 0}
					<div class="text-pp-gray py-8 text-center">No products yet</div>
				{:else}
					<div class="grid grid-cols-2 gap-3">
						{#each products as p (p.product_id)}
							<ProductCard
								productPic={p.img_url}
								productName={p.name}
								productPrice={p.price}
								productDescription={p.description}
								productId={p.product_id}
								productQuantity={p.quantity}
								storeId={data.storeId}
								showToast={handleSubmit}
							/>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Floating plus -->
			<button
				class="bg-pp-pink text-pp-white fixed right-6 bottom-24 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
				aria-label="Add"
				data-testid="add-product"
				onclick={() => (active = true)}
			>
				+
			</button>
		{/if}
	</div>

	<AddProductModal {active} onClose={handleModal} onSubmit={handleSubmit} storeId={data.storeId}
	></AddProductModal>

	<EditStoreModal
		editModal={editStoreActive}
		onClose={handleEditStoreClose}
		onSubmit={handleEditStoreSubmit}
		storeId={data.storeId}
		storeName={data.store.store_name}
		storeDesc={data.store.store_desc}
		storePic={data.store.img_url}
		storeAddr={data.store.store_addr}
		storeLat={data.storeLat}
		storeLng={data.storeLng}
		storeHrs={data.store.store_hrs}
	/>
</div>
