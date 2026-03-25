<script>
	let {
		// storePic,
		storeName = 'Store Name aawhiuhaiuauah',
		storeCateg = 'Store Category ahkajhakhakaj'
	} = $props();
</script>

<div class="flex max-w-[100px] flex-shrink-0 flex-col">
	<div class="bg-pp-light-pink mb-2 aspect-square max-h-20 max-w-20 rounded-lg"></div>
	<!-- <img class="aspect-square max-h-20 max-w-20 rounded-lg mb-2" src={storePic} alt="store name" /> -->

	<div class="overflow-hidden pb-2">
		<div class="flex flex-col text-left">
			<p class="text-pp-pink truncate text-xs font-semibold">{storeCateg}</p>
			<p class="text-pp-black truncate text-xs">{storeName}</p>
		</div>
	</div>
</div>
