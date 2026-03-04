<script lang="ts">
	import type { PageProps } from './$types.ts';

	let { data }: PageProps = $props();
</script>

<div class="min-h-screen w-full">
	<div class="mx-auto max-w-md">
		<!-- Banner -->
		<div class="bg-pp-gray/10 h-44 w-full"></div>

		<!-- Store info -->
		<div class="px-4 py-3">
			<div class="text-pp-pink text-xl font-semibold">{data.store.store_name}</div>
			<div class="text-pp-gray text-xs">⭐ {data.store.rating}</div>
			<p class="text-pp-gray mt-2 text-xs">{data.store.store_desc}</p>
		</div>

		<!-- Products -->
		<!-- <div class="px-4 pb-24">
		<div class="grid grid-cols-2 gap-3">
			{#each products as p (p.id)}
			<div class="overflow-hidden rounded-xl border border-pp-gray/30">
				<img class="h-28 w-full object-cover" src={p.img_url} alt={p.name} />
				<div class="p-2">
				<div class="text-sm font-semibold text-pp-black">{p.name}</div>
				<div class="text-xs text-pp-gray">₱ {p.price.toFixed(2)}</div>
				</div>
			</div>
			{/each}
		</div>
		</div> -->
	</div>

	<!-- Floating plus -->
	<button
		class="bg-pp-pink text-pp-white fixed right-6 bottom-24 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
		aria-label="Add"
	>
		+
	</button>
</div>
