<script lang="ts">
	import Banner from '$lib/banner.png';

	import { Button } from 'flowbite-svelte';
	import StoreCard from '$lib/components/Homepage/StoreCard.svelte';

	import BasketIcon from '$lib/icons/basket.svg';
	import { resolve } from '$app/paths';

	let { data } = $props();

	const closestStores = $derived(
		data.stores
			.slice()
			.sort(
				(a: { distance_meters: number }, b: { distance_meters: number }) =>
					a.distance_meters - b.distance_meters
			)
			.slice(0, 6)
	);

	function formatDistance(meters: number): string {
		return (meters / 1000).toFixed(1);
	}

	let showAllStores = $state(false);
</script>

<div class="min-h-screen w-full p-5">
	{#if !showAllStores}
		<img src={Banner} alt="welcome banner" class="w-full rounded-lg" />
		<!-- <h1>hello, {email}</h1> -->

		<h1 class="py-3 text-xl font-medium">Stores near you</h1>
		<div class="grid grid-cols-2 gap-4 pb-4">
			{#each closestStores as s (s.store_id)}
				<StoreCard
					storePic={s.img_url}
					storeName={s.store_name}
					storeDistance={formatDistance(s.distance_meters)}
					storeRating={s.rating}
					storeID={s.store_id}
				/>
				<!-- <p>{s.store_name} - {formatDistance(s.distance_meters)}km away</p> -->
			{/each}
		</div>

		<div class="flex items-center justify-center p-4">
			<button
				onclick={() => (showAllStores = true)}
				class="bg-pp-pink text-pp-white max-w-70 rounded-lg px-10 py-2.5 text-xl"
			>
				View all stores
			</button>
		</div>
	{:else}
		<h1 class="py-3 text-xl font-medium">All Stores</h1>

		{#each data.stores as s (s.store_id)}
			<div class="flex flex-row items-start pb-5">
				<img src={s.img_url} alt={s.store_name} class="h-35 w-35 rounded-lg" />
				<div class="flex flex-col overflow-hidden px-5">
					<p class="text-pp-pink truncate pb-2 text-2xl font-semibold">{s.store_name}</p>
					<p class="text-pp-gray">⭐{s.rating}</p>
					<p class="text-pp-black text-pp-black text-base">
						{formatDistance(s.distance_meters)}km away
					</p>
					<a
						class="bg-pp-pink text-pp-white my-1 flex h-8 w-25 items-center justify-center rounded-lg text-sm"
						href={resolve(`/search/${s.store_name}/${s.store_id}`)}
						data-testid="view-store"
					>
						View Store
					</a>
				</div>
			</div>
		{/each}

		<div class="flex justify-center p-4">
			<button onclick={() => (showAllStores = false)} class="text-gray-500 underline">
				← Back
			</button>
		</div>
	{/if}

	<a href="/profile/basket/cart">
		<Button
			pill={true}
			class="bg-pp-pink fixed right-6 bottom-25 z-50 p-2! shadow-lg focus:outline-none"
			><img src={BasketIcon} alt="Basket" /></Button
		>
	</a>
</div>
