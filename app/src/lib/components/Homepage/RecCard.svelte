<script>
	let {
		// storePic,
		storeName = 'Store Name aawhiuhaiuauah',
		storeCateg = "Store Category ahkajhakhakaj"
	} = $props();
</script>

<div class="flex flex-col flex-shrink-0 max-w-[100px]">
	<div class="bg-pp-light-pink mb-2 aspect-square max-h-20 max-w-20 rounded-lg"></div>
	<!-- <img class="aspect-square max-h-20 max-w-20 rounded-lg mb-2" src={storePic} alt="store name" /> -->

	<div class="pb-2 overflow-hidden">
		<div class="flex flex-col text-left">
			<p class="text-pp-pink text-xs font-semibold truncate">{storeCateg}</p>
			<p class="text-pp-black text-xs truncate">{storeName}</p>
		</div>
	</div>
</div>
