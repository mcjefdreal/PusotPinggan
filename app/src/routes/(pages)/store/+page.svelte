<script lang="ts">
	import { resolve } from '$app/paths';

	import StorePreviewCard from '$lib/components/CreateStore/StorePreviewCard.svelte';

	let { data } = $props();

	let stores = $derived(data.stores);

	let storeCount = $derived(stores.length);
</script>

<div class="min-h-screen w-full items-center justify-center">
	<!-- <h1>Owned by {data.pub_user.display_name}</h1> -->
	<div class="my-3 flex grid place-items-center">
		{#if storeCount === 0}
			<h1 class="text-pp-black pt-5 pb-3 text-center text-3xl font-medium">No Stores Yet</h1>
		{:else}
			<p class="text-pp-pink pb-5 text-3xl font-semibold">Stores</p>
			<div class="flex w-full flex-col space-y-5 overflow-x-hidden pl-6">
				{#each stores as store (store.store_id)}
					<StorePreviewCard
						storePicUrl={store.img_url}
						storeName={store.store_name}
						storeId={store.store_id}
					></StorePreviewCard>
				{/each}
			</div>
		{/if}
		<a
			class="bg-pp-pink text-pp-white mt-5 flex h-10 w-40 items-center justify-center rounded-lg text-lg font-medium"
			data-testid="add-store"
			href={resolve('/store/create')}
		>
			Add Store
		</a>
	</div>
</div>
