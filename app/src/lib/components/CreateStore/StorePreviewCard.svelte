<script>
	import { resolve } from '$app/paths';

	const { storePicUrl, storeName, storeId } = $props();
</script>

<div class="flex flex-row items-start">
	<img src={storePicUrl} alt={storeName} class="h-35 w-35 rounded-lg" loading="lazy" decoding="async" />

	<div class="flex flex-col overflow-hidden px-5">
		<p class="text-pp-pink truncate pb-3 text-2xl font-semibold">{storeName}</p>

		<div class="flex flex-col">
			<a
				class="bg-pp-pink text-pp-white my-1 flex h-8 w-25 items-center justify-center rounded-lg text-sm"
				href={resolve(`/store/${storeName}/${storeId}`)}
				data-testid="view-store"
			>
				View Store
			</a>
			<a
				class="bg-pp-pink text-pp-white my-1 flex h-8 w-25 items-center justify-center rounded-lg text-sm"
				href={resolve(`/store/${storeName}/${storeId}/orders`)}
			>
				View Orders
			</a>
		</div>
	</div>
</div>
