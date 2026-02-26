<script lang="ts">
	import type { PageProps } from './$types.ts';

	let { data }: PageProps = $props();
</script>

<div class="min-h-screen w-full">
	<div class="mx-auto max-w-md">
		<!-- Banner -->
		<div class="h-44 w-full bg-pp-gray/10"></div>

		<!-- Store info -->
		<div class="px-4 py-3">
		<div class="text-xl font-semibold text-pp-pink">{data.store.store_name}</div>
		<div class="text-xs text-pp-gray">⭐ {data.store.rating}</div>
		<p class="mt-2 text-xs text-pp-gray">{data.store.store_desc}</p>
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
    class="fixed bottom-24 right-6 grid h-12 w-12 place-items-center rounded-full bg-pp-pink text-xl text-pp-white shadow-lg"
    aria-label="Add"
  >
    +
  </button>
</div>