<script lang="ts">
	import type { PageProps } from './$types.ts';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	import { resolve } from '$app/paths';

	import StoreProductCard from '$lib/components/Homepage/StoreProductCard.svelte';

	let { data }: PageProps = $props();

	let products = $derived(data.products);
</script>

<div class="min-h-screen w-full">
	<div class="mx-auto max-w-md">
		<!-- Banner -->
		<div class="relative">
			<a
				class="bg-pp-pink text-pp-white absolute top-2 left-2 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
				href={resolve('/home/')}
			>
				<ArrowLeftOutline />
			</a>

			<div class="bg-pp-gray/10 h-44 w-full">
				<img
					class="h-full w-full object-cover"
					src={data.store.img_url}
					alt={data.store.store_name}
				/>
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
					<StoreProductCard
						productPic={p.img_url}
						productName={p.name}
						productPrice={p.price}
						productDescription={p.description}
						productId={p.product_id}
						productQuantity={p.quantity}
						storeId={data.storeId}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>
