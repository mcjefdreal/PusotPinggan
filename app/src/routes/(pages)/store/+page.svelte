<script lang="ts">
	import { resolve } from '$app/paths'
</script>
<div class="min-h-screen w-full items-center justify-center">
	<h1 class="text-pp-black pt-5 pb-3 text-center text-3xl font-medium">No Stores Yet</h1>

	<div class="grid place-items-center my-3">
		<a
			class="bg-pp-pink text-pp-white flex h-10 w-40 items-center justify-center rounded-lg text-lg font-medium"
			href={resolve('/store')}
		>
			Add Store
		</a>
	</div>
</div>
