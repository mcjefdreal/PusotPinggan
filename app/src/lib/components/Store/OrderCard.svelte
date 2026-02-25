<script>
    let {
        // productPicURL,
        buyerName = "Buyer",
        orderStatus = "Pending",
        productName = "Product Name",
        productQty = 3,
        productUnitPrice = 0,
        orderTotalPrice = 0,
    } = $props();
</script>

<div class="p-4 shadow-md rounded-lg">
    <div class="flex flex-row py-2">
        <p> {buyerName} </p>
        <p class="ml-auto text-pp-pink"> {orderStatus} </p>
    </div>

    <div class="flex flex-row">
        <div class="rounded-sm w-25 h-25 bg-pp-light-pink"></div>
        <!-- <img src={productPicURL} alt={productName} class="rounded-sm w-25 h-25"/> -->

        <div class="flex flex-col px-3 py-2"> 
            <p class=""> {productName} </p>
            <p class="text-pp-gray"> x{productQty} </p>
        </div>

        <p class="ml-auto mt-auto"> ₱ {productUnitPrice} </p>
    </div>

    <div class="flex flex-row">
        <p class="ml-auto"> ₱ {orderTotalPrice} </p>
    </div>

    <div class="flex flex-row py-2">
        <a
            class="border-pp-pink text-pp-pink flex h-8 w-30 items-center justify-center rounded-lg border text-base ml-auto" 
            href="/"
        >
            Order Details
        </a>
    </div>
    
    <div class="flex flex-row">
        <a
            class="border-pp-pink bg-pp-pink text-pp-white flex h-8 w-35 items-center justify-center rounded-lg border text-base"
            href="/"
        >
            Confirm Order
        </a>

        <a
            class="border-pp-pink bg-pp-pink text-pp-white flex h-8 w-30 items-center justify-center rounded-lg border text-base ml-auto"
            href="/"
        >
            Open Chat
        </a>
    </div>
</div>