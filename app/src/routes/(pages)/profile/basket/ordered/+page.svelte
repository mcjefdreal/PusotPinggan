<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	let { data }: { data: { pendingOrders: Array<{
		order_id: string;
		order_status: string;
		order_date: string;
		store: {
			store_name: string;
		};
		order_details: Array<{
			product: {
				name: string;
			};
			quantity: number;
			unit_price: number;
		}>;
	}> } } = $props();

	let pendingOrders = $derived(data?.pendingOrders || []);
</script>

<div class="min-h-screen w-full bg-rose-50">
	<div class="sticky start-0 top-0 z-20">
		<div
			class="from-pp-pink to-pp-light-pink grid w-full grid-cols-3 justify-center bg-linear-to-t p-4 py-8"
		>
			<a href={resolve('/profile')}>
				<button
					class="text-pp-white active:text-pp-darker-pink flex items-center gap-2 rounded-full transition"
				>
					<ArrowLeftOutline class="h-8 w-8" />
				</button>
			</a>

			<div class="text-pp-white text-center text-2xl font-semibold">My Basket</div>

			<div></div>
		</div>

		<div class="bg-pp-white sticky top-24 z-20 mb-1 flex h-14 w-full">
			<a
				href={resolve('/profile/basket/cart')}
				class="flex flex-1 items-center justify-center border-b-2 border-transparent transition active:bg-gray-300"
			>Cart</a
			>
			<a
				href={resolve('/profile/basket/ordered')}
				class="flex flex-1 items-center justify-center border-b-2 border-pp-pink text-pp-pink transition active:bg-gray-300"
			>Ordered</a
			>
			<a
				href={resolve('/profile/basket/completed')}
				class="flex flex-1 items-center justify-center border-b-2 border-transparent transition active:bg-gray-300"
			>Completed</a
			>
			<a
				href={resolve('/profile/basket/cancelled')}
				class="flex flex-1 items-center justify-center border-b-2 border-transparent transition active:bg-gray-300"
			>Cancelled</a
			>
		</div>
	</div>

	{#if pendingOrders.length === 0}
		<div class="flex flex-col items-center justify-center py-20">
			<p class="text-pp-gray text-lg">No pending orders</p>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center gap-y-2 py-1">
			{#each pendingOrders as order}
				<div class="mb-4 w-full px-2">
					<div class="bg-pp-white mx-2 rounded-lg p-3 shadow">
						<div class="mb-2 flex items-center justify-between border-b pb-2">
							<h3 class="text-pp-pink text-lg font-semibold">
								{order.store?.store_name || 'Store'}
							</h3>
							<span class="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
								Pending
							</span>
						</div>

						{#each order.order_details as detail}
							<div class="mb-2 flex items-center">
								<div class="flex-1">
									<p class="text-pp-black font-medium">{detail.product?.name}</p>
									<p class="text-pp-gray text-sm">x{detail.quantity}</p>
								</div>
								<p class="text-pp-gray">₱ {(detail.unit_price * detail.quantity).toFixed(2)}</p>
							</div>
						{/each}

						<div class="mt-2 flex justify-end border-t pt-2 text-lg font-semibold">
							Total: ₱ {order.order_details.reduce((sum: number, d: any) => sum + (d.unit_price || 0) * d.quantity, 0).toFixed(2)}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
