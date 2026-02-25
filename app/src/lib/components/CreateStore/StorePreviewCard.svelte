<script>
	import { resolve } from '$app/paths'

    const {
        storePicUrl,
        storeName,
        storeId
    } = $props();

</script>

<div class="flex flex-row">
    <img src={storePicUrl} alt={storeName} class="w-50 h-50 rounded-lg" />

    <div class="flex flex-col">
        <p> {storeName} </p>

        <div class="flex flex-row"> </div>
        <a
			class="bg-pp-pink text-pp-white flex h-10 w-40 items-center justify-center rounded-lg text-lg font-medium"
			href={resolve(`/store/${storeName}/${storeId}`)}
		>
			View Store
		</a>
        <a
			class="bg-pp-pink text-pp-white flex h-10 w-40 items-center justify-center rounded-lg text-lg font-medium"
			href='/'
		>
			View Orders
		</a>
    </div>
</div>