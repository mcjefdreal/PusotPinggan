<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	import StoreProductCard from '$lib/components/Homepage/StoreProductCard.svelte';

	let editModal = $state(false);

	function handleClose() {
		editModal = false;
	}
</script>

<div class="min-h-screen w-full p-5">
	<h1 class="py-3 text-xl font-medium">
		{#if data.query}
			Results for "{data.query}"
		{:else}
			Search Products or Store
		{/if}
	</h1>

	{#if data.products.length === 0 && data.stores.length === 0}
		<div class="flex flex-col items-center justify-center py-20">
			<p class="text-pp-gray text-lg">No products or store found</p>
			<p class="text-pp-gray text-sm">Try searching with a different keyword</p>
		</div>
	{:else}
		<div class="px-4 pb-24">
			<!-- display stores first -->
			{#if data.stores.length != 0}
				<p class="pb-3 text-xl font-medium"> Stores </p>
			{/if}
			{#each data.stores as s (s.store_id)}
				<div class="flex flex-row items-start pb-5">
					<img src={s.img_url} alt={s.store_name} class="h-35 w-35 rounded-lg" />
					<div class="flex flex-col overflow-hidden px-5">
						<p class="text-pp-pink truncate pb-5 text-2xl font-semibold">{s.store_name}</p>
						<a
							class="bg-pp-pink text-pp-white my-1 flex h-8 w-25 items-center justify-center rounded-lg text-sm"
							href={resolve(`/search/${s.store_name}/${s.store_id}`)}
							data-testid="view-store"
						>
							View Store
						</a>
					</div>
				</div>
			{/each}

			{#if data.products.length != 0}
				<p class="py-3 text-xl font-medium"> Products </p>
			{/if}
			<div class="grid grid-cols-2 gap-3">
				<!-- display products second -->
				{#each data.products as p (p.product_id)}
					<StoreProductCard
                        productPic={p.img_url}
                        productName={p.name}
                        productPrice={p.price}
                        productDescription={p.description}
                        productId={p.product_id}
                        productQuantity={p.quantity}
                        storeId={p.store_id}
                    />
				{/each}
			</div>
		</div>
	{/if}
</div>