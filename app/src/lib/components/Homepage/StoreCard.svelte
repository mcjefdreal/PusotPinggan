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
		<img class="aspect-square max-h-40 rounded-t-lg mb-2" src={storePic} alt={storeName} />

		<div class="items-left flex flex-row overflow-hidden px-2 pb-2">
			<div class="flex flex-col text-left w-full">
				<div class="flex flex-row">
					<p class="text-pp-pink min-w-0 flex-1 truncate text-base font-semibold">{storeName}</p>
					<p class="ml-auto pl-2 text-pp-gray"> ⭐{storeRating} </p>
				</div>
				
				<p class="text-pp-black truncate text-base text-pp-black">{storeDistance}km away</p>
			</div>
		</div>
	</Card>
</a>
