<script>
	let {
		// productPicURL,
		buyerName = 'Buyer',
		orderStatus = 'Pending',
		productName = 'Product Name',
		productQty = 3,
		productUnitPrice = 0,
		orderTotalPrice = 0
	} = $props();
</script>

<div class="rounded-lg p-4 shadow-md">
	<div class="flex flex-row py-2">
		<p>{buyerName}</p>
		<p class="text-pp-pink ml-auto">{orderStatus}</p>
	</div>

	<div class="flex flex-row">
		<div class="bg-pp-light-pink h-25 w-25 rounded-sm"></div>
		<!-- <img src={productPicURL} alt={productName} class="rounded-sm w-25 h-25"/> -->

		<div class="flex flex-col px-3 py-2">
			<p class="">{productName}</p>
			<p class="text-pp-gray">x{productQty}</p>
		</div>

		<p class="mt-auto ml-auto">₱ {productUnitPrice}</p>
	</div>

	<div class="flex flex-row">
		<p class="ml-auto">₱ {orderTotalPrice}</p>
	</div>

	<div class="flex flex-row py-2">
		<a
			class="border-pp-pink text-pp-pink ml-auto flex h-8 w-30 items-center justify-center rounded-lg border text-base"
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
			class="border-pp-pink bg-pp-pink text-pp-white ml-auto flex h-8 w-30 items-center justify-center rounded-lg border text-base"
			href="/"
		>
			Open Chat
		</a>
	</div>
</div>
