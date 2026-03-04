<script lang="ts">
	import { goto } from '$app/navigation';

	const store = {
		id: 123,
		name: 'Manam',
		pending: 2,
		ongoing: 1,
		img_url: 'https://placehold.co/96x96'
	};

	function openStore() {
		goto(`/store/${store.id}`);
	}
</script>

<div class="border-pp-gray/30 border-b bg-white px-4 py-4">
	<div class="flex cursor-pointer gap-3" on:click={openStore}>
		<img class="h-20 w-20 rounded-xl object-cover" src={store.img_url} alt="Store image" />

		<div class="flex-1">
			<div class="text-pp-pink text-xl font-semibold">
				{store.name}
			</div>

			<div class="text-pp-gray mt-1 text-xs">
				Pending Orders: {store.pending}
			</div>

			<div class="text-pp-gray text-xs">
				Ongoing Orders: {store.ongoing}
			</div>

			<button type="button" class="bg-pp-pink text-pp-white mt-2 rounded-full px-4 py-1 text-xs">
				View Orders
			</button>
		</div>
	</div>
</div>

<!-- Figma empty space -->
<div class="min-h-[520px] bg-white"></div>
