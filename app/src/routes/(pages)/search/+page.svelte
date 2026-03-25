<script lang="ts">
	let { data } = $props();
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
			<div class="grid grid-cols-2 gap-3">
				{#each data.products as p (p.product_id)}
					<div class="border-pp-gray/30 overflow-hidden rounded-xl border">
						<img class="h-28 w-full object-cover" src={p.img_url} alt={p.name} />
						<div class="p-2">
							<div class="text-pp-black text-sm font-semibold">{p.name}</div>
							<div class="text-pp-gray text-xs">₱ {p.price.toFixed(2)}</div>
						</div>
					</div>
				{/each}
				{#each data.stores as s (s.store_id)}
					<div class="border-pp-gray/30 overflow-hidden rounded-xl border">
						<img class="h-28 w-full object-cover" src={s.img_url} alt={s.store_name} />
						<div class="p-2">
							<div class="text-pp-black text-sm font-semibold">{s.store_name}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
