<script>
    import {
        EditOutline,
        StarSolid,
        CirclePlusSolid
    } from 'flowbite-svelte-icons';

    import { Button } from 'flowbite-svelte';

    import ProductCard from './ProductCard.svelte';
    import EditProductModal from './EditProductModal.svelte';

    let {
        storeName = "Store Name",
        // storePicURL, 
        storeRating = 4.8,
        storeDistance = 1.0,
        storeDescription = "Lorem ipsum dolor sit amet, consec ut lab qco lahenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint",
        // products
    } = $props();
</script>

<div class="bg-pp-white min-h-screen">
    <div class="w-full h-32 bg-pp-light-pink"> </div>
    <!-- <img src={storePicURL} alt="big pic" class="w-full"/> -->

    <div class="p-5 flex flex-col">
        <div class="flex flex-row">
            <p class="text-pp-pink text-2xl font-semibold"> {storeName} </p>
            <EditOutline class="text-pp-pink ms-1 h-6 w-6" />
            <button class="bg-pp-pink text-pp-white hover:bg-pp-darker-pink ml-auto rounded px-4 py-1 text-base">
                View Orders
            </button>
        </div>


        <div class="flex flex-row">
            <StarSolid class="text-pp-pink h-4 w-4" />
            <p> {storeRating} </p>
        </div>


        <div>
            <p class="text-sm"> {storeDistance} km away </p>
            <p class="pt-2 text-justify text-sm"> {storeDescription} </p>
        </div>
    </div>

    <hr class="border-gray-400">

    <div class="p-4 flex items-center justify-center">
        <div class="flex items-center space-x-4 space-y-4 flex-wrap">
            <ProductCard productName={"Sisig"}> </ProductCard>
            <ProductCard> </ProductCard>
            <ProductCard> </ProductCard>
            <ProductCard> </ProductCard>
            <ProductCard> </ProductCard>
        </div>
    </div>

    <Button>
        <CirclePlusSolid class="fixed bottom-25 right-6 z-50 text-pp-pink bg-pp-white rounded-full shadow-lg w-10 h-10" />
    </Button>
</div>