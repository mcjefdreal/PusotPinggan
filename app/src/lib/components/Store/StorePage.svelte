<script>
	import { EditOutline, StarSolid, CirclePlusSolid } from 'flowbite-svelte-icons';

	import { Button } from 'flowbite-svelte';

	import ProductCard from './ProductCard.svelte';
	import EditProductModal from './EditProductModal.svelte';

	let {
		storeName = 'Store Name',
		// storePicURL,
		storeRating = 4.8,
		storeDistance = 1.0,
		storeDescription = 'Lorem ipsum dolor sit amet, consec ut lab qco lahenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint'
		// products
	} = $props();
</script>

<div class="bg-pp-white min-h-screen">
	<div class="bg-pp-light-pink h-32 w-full"></div>
	<!-- <img src={storePicURL} alt="big pic" class="w-full"/> -->

	<div class="flex flex-col p-5">
		<div class="flex flex-row">
			<p class="text-pp-pink text-2xl font-semibold">{storeName}</p>
			<EditOutline class="text-pp-pink ms-1 h-6 w-6" />
			<button
				class="bg-pp-pink text-pp-white hover:bg-pp-darker-pink ml-auto rounded px-4 py-1 text-base"
			>
				View Orders
			</button>
		</div>

		<div class="flex flex-row">
			<StarSolid class="text-pp-pink h-4 w-4" />
			<p>{storeRating}</p>
		</div>

		<div>
			<p class="text-sm">{storeDistance} km away</p>
			<p class="pt-2 text-justify text-sm">{storeDescription}</p>
		</div>
	</div>

	<hr class="border-gray-400" />

	<div class="flex items-center justify-center p-4">
		<div class="flex flex-wrap items-center space-y-4 space-x-4">
			<ProductCard productName={'Sisig'}></ProductCard>
			<ProductCard></ProductCard>
			<ProductCard></ProductCard>
			<ProductCard></ProductCard>
			<ProductCard></ProductCard>
		</div>
	</div>

	<Button>
		<CirclePlusSolid
			class="text-pp-pink bg-pp-white fixed right-6 bottom-25 z-50 h-10 w-10 rounded-full shadow-lg"
		/>
	</Button>
</div>
