<script>
	import { resolve } from '$app/paths';

	const { storePicUrl, storeName, storeId } = $props();
</script>

<div class="flex flex-row py-5 items-start">
	<img src={storePicUrl} alt={storeName} class="h-35 w-35 rounded-lg" />

	<div class="flex flex-col px-5 overflow-hidden">
		<p class="text-2xl text-pp-pink font-semibold pb-5 truncate">{storeName}</p>

		<div class="flex flex-col"> 
			<a
				class="bg-pp-pink text-pp-white flex h-8 w-25 items-center justify-center rounded-lg text-sm my-1"
				href={resolve(`/store/${storeName}/${storeId}`)}
				data-testid="view-store"
			>
				View Store
			</a>
			<a
				class="bg-pp-pink text-pp-white flex h-8 w-25 items-center justify-center rounded-lg text-sm my-1"
				href="/"
			>
				View Orders
			</a>
		</div>
	</div>
</div>
