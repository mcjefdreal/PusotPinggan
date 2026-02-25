<script lang="ts">
	import type { PageProps } from './$types.ts';

	let { data }: PageProps = $props();
</script>

<div class="min-h-screen w-full">
	<h1>{data.storeName} store with id {data.storeId}</h1>
	<h1>Owned by {data.pub_user.display_name}</h1>

	<h1>Database queries</h1>
	<h1>Name: {data.store.store_name}</h1>
	<h1>Owner: {data.store.owner}</h1>
	<h1>Id: {data.store.store_id}</h1>
</div>