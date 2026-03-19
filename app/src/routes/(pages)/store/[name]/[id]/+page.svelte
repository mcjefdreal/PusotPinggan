<script lang="ts">
    import AddProductModal from '$lib/components/Store/AddProductModal.svelte'
	import type { PageProps } from './$types.ts';
	import { Toast } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	import { resolve } from '$app/paths';
	import ProductCard from '$lib/components/Store/ProductCard.svelte';

	let { data }: PageProps = $props();

	let active = $state(false);
	let showSuccess = $state(false);
	let showFail = $state(false);
	let toastMessage = $state('');

	let products = $derived(data.products);


	function handleModal() {
		active = false;
	}

	function handleSubmit(result: {success: boolean, message: string}) {
		active = false;
		toastMessage = result.message;
		if (result.success) {
			showSuccess = true;
			setTimeout(() => showSuccess = false, 3000);
		} else {
			showFail = true;
			setTimeout(() => showFail = false, 3000);
		}
	}

</script>

{#if showSuccess}
	<Toast color="green" class="fixed top-4 right-4 z-50">
		{toastMessage}
	</Toast>
{/if}

{#if showFail}
	<Toast color="red" class="fixed top-4 right-4 z-50">
		{toastMessage}
	</Toast>
{/if}

<div class="min-h-screen w-full">
	<div class="mx-auto max-w-md">
		<!-- Banner -->
		<div class="relative">
			<a
			class="bg-pp-pink text-pp-white absolute top-2 left-2 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
			href={resolve('/store/')}
			>
				<ArrowLeftOutline />
			</a>
			<div class="bg-pp-gray/10 h-44 w-full">
				<img class="object-cover w-full h-full" src={data.store.img_url} alt={data.store.store_name}/>
			</div>
		</div>

		<!-- Store info -->
		<div class="px-4 py-3">
			<div class="text-pp-pink text-xl font-semibold">{data.store.store_name}</div>
			<div class="text-pp-gray text-xs">⭐ {data.store.rating}</div>
			<p class="text-pp-gray mt-2 text-xs">{data.store.store_desc}</p>
		</div>

		<!-- Products -->
		<div class="px-4 pb-24">
		<div class="grid grid-cols-2 gap-3">
			{#each products as p (p.product_id)}
				<ProductCard productPic={p.img_url} productName={p.name} productPrice={p.price}/>
			{/each}
		</div>
		</div>
	</div>

	<!-- Floating plus -->
	<button
		class="bg-pp-pink text-pp-white fixed right-6 bottom-24 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
		aria-label="Add"
		onclick={() => active = true}
	>
		+
	</button>

	<AddProductModal active={active} onClose={handleModal} onSubmit={handleSubmit} supabase={data.supabase} storeId={data.storeId}>

	</AddProductModal>
</div>
