<script lang="ts">
	import type { PageProps } from './$types.ts';
	import { ArrowLeftOutline, ClockOutline } from 'flowbite-svelte-icons';

	import { resolve } from '$app/paths';

	import StoreProductCard from '$lib/components/Homepage/StoreProductCard.svelte';
	import StoreHoursModal from '$lib/components/Store/StoreHoursModal.svelte';

	let { data }: PageProps = $props();

	let products = $derived(data.products);

	let storeHoursModal = $state(false);

	function handleClose() {
		storeHoursModal = false;
	}

	type DaySchedule = { open: string; close: string };

	function isStoreOpen(storeHrs: Record<string, DaySchedule>): boolean {
		const now = new Date();

		// check day first
		const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

		const todaySchedule = storeHrs?.[day];
		if (!todaySchedule) return false; // lowk useless rn pero for future use<3

		const { open, close } = todaySchedule;

		// convert everything to minutes
		// day -> 0 minutes to 1440 minutes
		// say open = 8am, close = 6pm
		// -> [480, 1080]
		// say current time is 3:20 pm -> 900+20 = 920 minutes (within range -> open!)

		const nowMinutes = now.getHours() * 60 + now.getMinutes();

		const toMinutes = (time: string) => {
			const [h, m] = time.split(':').map(Number);
			return h * 60 + m;
		};

		const openMinutes = toMinutes(open);
		const closeMinutes = toMinutes(close);

		if (openMinutes <= nowMinutes && nowMinutes < closeMinutes) {
			return true;
		} else {
			return false;
		}
	}

	let isOpen = $derived(isStoreOpen(data.store.store_hrs));
</script>

<div class="min-h-screen w-full">
	<div class="mx-auto max-w-md">
		<!-- Banner -->
		<div class="relative">
			<a
				class="bg-pp-pink text-pp-white absolute top-2 left-2 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
				href={resolve('/home')}
			>
				<ArrowLeftOutline />
			</a>

			<div class="bg-pp-gray/10 h-44 w-full">
				<img
					class="h-full w-full object-cover"
					src={data.store.img_url}
					alt={data.store.store_name}
				/>
			</div>
		</div>

		<!-- Store info -->
		<div class="px-4 py-3">
			<div class="text-pp-pink text-xl font-semibold">{data.store.store_name}</div>
			<div class="text-pp-gray text-xs">⭐ {data.store.rating}</div>
			<p class="text-pp-gray mt-2 text-xs">{data.store.store_desc}</p>

			<div class="flex flex-row pt-3">
				<button onclick={() => (storeHoursModal = true)}>
					<ClockOutline class="inline" />
					{#if isOpen}
						<p class="inline text-green-700">Open Now</p>
					{:else}
						<p class="inline text-red-500">Currently Closed</p>
					{/if}
				</button>
			</div>
		</div>

		<hr class="border-pp-gray pb-3" />

		<!-- Products -->
		<div class="px-4 pb-24">
			<div class="grid grid-cols-2 gap-3">
				{#each products as p (p.product_id)}
					<StoreProductCard
						productPic={p.img_url}
						productName={p.name}
						productPrice={p.price}
						productDescription={p.description}
						productId={p.product_id}
						productQuantity={p.quantity}
						storeId={data.storeId}
					/>
				{/each}
			</div>
		</div>
	</div>

	<StoreHoursModal
		editModal={storeHoursModal}
		onClose={handleClose}
		storeHrs={data.store.store_hrs}
		{isOpen}
	/>
</div>
