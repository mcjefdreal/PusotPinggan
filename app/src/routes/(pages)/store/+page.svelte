<script lang="ts">
	import { resolve } from '$app/paths'

	let { data } = $props();

	let stores = $derived(data.stores);

	let storeCount = $derived(stores.length);

</script>
<div class="min-h-screen w-full items-center justify-center">

	<div class="grid place-items-center my-3">
		{#if storeCount === 0}
			<h1 class="text-pp-black pt-5 pb-3 text-center text-3xl font-medium">No Stores Yet</h1>
		{:else}
			{#each stores as store (store.store_id)}
				<img src="{store.img_url}" alt="{store.store_name}" class="w-50 h-50" />
			{/each}
		{/if}
		<a
			class="bg-pp-pink text-pp-white flex h-10 w-40 items-center justify-center rounded-lg text-lg font-medium"
			href={resolve('/store/create')}
		>
			Add Store
		</a>
	</div>
</div>
