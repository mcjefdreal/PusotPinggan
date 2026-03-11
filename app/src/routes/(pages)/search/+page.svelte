<script lang="ts">
	let { data } = $props();
</script>

<div class="min-h-screen w-full p-5">
	<h1 class="py-3 text-xl font-medium">
		{#if data.query}
			Results for "{data.query}"
		{:else}
			Search Products
		{/if}
	</h1>

	{#if data.products.length === 0}
		<div class="flex flex-col items-center justify-center py-20">
			<p class="text-pp-gray text-lg">No products found</p>
			<p class="text-pp-gray text-sm">Try searching with a different keyword</p>
		</div>
	{:else}
		<div class="px-4 pb-24">
            <div class="grid grid-cols-2 gap-3">
                {#each data.products as p (p.product_id)}
                    <div class="overflow-hidden rounded-xl border border-pp-gray/30">
                        <img class="h-28 w-full object-cover" src={p.img_url} alt={p.name} />
                        <div class="p-2">
                        <div class="text-sm font-semibold text-pp-black">{p.name}</div>
                        <div class="text-xs text-pp-gray">₱ {p.price.toFixed(2)}</div>
                        </div>
                    </div>
                {/each}
            </div>
		</div>
	{/if}
</div>
