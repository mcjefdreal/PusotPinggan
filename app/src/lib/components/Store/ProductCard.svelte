<script>
    import { Card } from "flowbite-svelte";

    import {
        EditOutline,
    } from 'flowbite-svelte-icons';

    let {
        // productPic,
        productName = "Product",
        productPrice = 85.00,
        productDescription = "Lorem ipsum"
    } = $props();

    let editModal = $state(false);

    import EditProductModal from "./EditProductModal.svelte";
</script>

<Card class="max-w-[170px] flex items-left">
    <div class="aspect-square max-h-40 rounded-t-lg mb-2 bg-pp-light-pink"> </div>
    <!-- <img class="aspect-square max-h-40 rounded-t-lg mb-2" src={productPic} alt="product 1" /> -->

    <div class="pb-2 px-2 flex flex-row items-left">
        <div class="flex flex-col text-left">
            <p class="text-base font-semibold text-pp-pink"> {productName} </p>
            <p class="text-base text-pp-black"> ₱ {productPrice} </p>
        </div>
        <EditOutline class="ml-auto text-pp-pink ms-1 h-6 w-6" onclick={() => (editModal = true)}/>
    </div>
</Card>

<EditProductModal editModal={editModal} productName={productName} productPrice={productPrice} productDescription={productDescription}> </EditProductModal>