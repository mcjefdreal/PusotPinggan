<script lang="ts">
	let {
		// productPicLink?,
		sellerName = '',
		productName = '',
		quantity = 0,
		status = '',
		unitPrice = 0
	} = $props();
</script>

<div class="bg-pp-white y-gap-1 flex w-96 flex-col gap-1 px-4 py-4">
	<div class="flex flex-row">
		<div class="text-pp-black text-base font-semibold">
			{sellerName}
		</div>
		<div class="text-pp-pink ml-auto text-base">
			{status}
		</div>
	</div>

	<div class="flex flex-row gap-4">
		<div class="bg-pp-light-pink h-20 w-20">
			<!-- Product image here -->
		</div>

		<div class="flex flex-col gap-0">
			<div class="text-pp-black pt-2 text-base">
				{productName}
			</div>
			<div class="text-pp-gray text-sm">
				x{quantity}
			</div>
		</div>
	</div>

	<div class="mt-auto self-end text-right text-sm">
		Per Unit: ₱ {unitPrice} <br />
		Total {quantity} Item{quantity === 1 ? '' : 's'}:
		<span class="font-semibold">₱ {quantity * unitPrice}</span>
	</div>

	<button
		class="text-pp-pink border-pp-pink active:bg-pp-pink active:text-pp-white mt-auto self-end rounded-lg border-1 bg-transparent px-4 py-1
                    text-sm font-semibold transition"
	>
		{status === 'Completed' ? 'Rate' : 'Order Details'}
	</button>
</div>
