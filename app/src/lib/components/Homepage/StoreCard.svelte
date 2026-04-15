<script>
	import { Card } from 'flowbite-svelte';
	import { resolve } from '$app/paths';

	let {
		storePic = '',
		storeName = 'Store Name',
		storeDistance = '',
		storeRating = 0.0,
		storeID = ''
	} = $props();
</script>

<a href={resolve(`/search/${storeName}/${storeID}`)}>
	<Card class="items-left flex">
		<!-- <div class="bg-pp-light-pink mb-2 aspect-square max-h-40 rounded-t-lg"></div> -->
		<img class="mb-2 aspect-square max-h-40 rounded-t-lg" src={storePic} alt={storeName} />

		<div class="items-left flex flex-row overflow-hidden px-2 pb-2">
			<div class="flex w-full flex-col text-left">
				<div class="flex flex-row">
					<p class="text-pp-pink min-w-0 flex-1 truncate text-base font-semibold">{storeName}</p>
					<p class="text-pp-gray ml-auto pl-2">⭐{storeRating}</p>
				</div>

				<p class="text-pp-black text-pp-black truncate text-base">{storeDistance}km away</p>
			</div>
		</div>
	</Card>
</a>
