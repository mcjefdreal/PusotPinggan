<script lang="ts">
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { Toast } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { SvelteMap } from 'svelte/reactivity';

	let {
		data
	}: {
		data: {
			orders: Array<{
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
			}>;
		};
	} = $props();

	let orders = $derived(data?.orders || []);
	let showSuccess = $state(false);
	let showFail = $state(false);
	let toastMessage = $state('');
	let actionOrders: SvelteMap<string, boolean> = new SvelteMap();

	async function handleCompleteOrder(orderId: string) {
		if (actionOrders.get(orderId)) return;
		actionOrders.set(orderId, true);
		showSuccess = false;
		showFail = false;

		const formData = new FormData();
		formData.append('orderId', orderId);

		try {
			const response = await fetch('?/complete-order', {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: formData
			});

			const jsonResponse = await response.json();
			const resultArray = JSON.parse(jsonResponse.data);
			const success = resultArray[1];
			const message = resultArray[2];

			if (success) {
				toastMessage = 'Order completed!';
				showSuccess = true;
				await invalidateAll();
				setTimeout(() => (showSuccess = false), 3000);
			} else {
				toastMessage = message || 'Failed to complete order';
				showFail = true;
				setTimeout(() => (showFail = false), 3000);
			}
		} catch {
			toastMessage = 'An error occurred';
			showFail = true;
			setTimeout(() => (showFail = false), 3000);
		} finally {
			actionOrders.set(orderId, false);
		}
	}

	async function handleCancelOrder(orderId: string) {
		if (actionOrders.get(orderId)) return;
		actionOrders.set(orderId, true);
		showSuccess = false;
		showFail = false;

		const formData = new FormData();
		formData.append('orderId', orderId);

		try {
			const response = await fetch('?/buyer-cancel-order', {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: formData
			});

			const jsonResponse = await response.json();
			const resultArray = JSON.parse(jsonResponse.data);
			const success = resultArray[1];
			const message = resultArray[2];

			if (success) {
				toastMessage = 'Order cancelled!';
				showSuccess = true;
				await invalidateAll();
				setTimeout(() => (showSuccess = false), 3000);
			} else {
				toastMessage = message || 'Failed to cancel order';
				showFail = true;
				setTimeout(() => (showFail = false), 3000);
			}
		} catch {
			toastMessage = 'An error occurred';
			showFail = true;
			setTimeout(() => (showFail = false), 3000);
		} finally {
			actionOrders.set(orderId, false);
		}
	}
</script>

{#if showSuccess}
	<Toast color="green" class="fixed top-4 right-4 z-100">
		{toastMessage}
	</Toast>
{/if}

{#if showFail}
	<Toast color="red" class="fixed top-4 right-4 z-100">
		{toastMessage}
	</Toast>
{/if}

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
				class="border-pp-pink text-pp-pink flex flex-1 items-center justify-center border-b-2 transition active:bg-gray-300"
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

	<div class="overflow-y-auto pb-24">
		{#if orders.length === 0}
			<div class="flex flex-col items-center justify-center py-20">
				<p class="text-pp-gray text-lg">No orders</p>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center gap-y-2 py-1">
				{#each orders as order (order.order_id)}
					<div class="mb-4 w-full px-2">
						<div class="bg-pp-white mx-2 rounded-lg p-3 shadow">
							<div class="mb-2 flex items-center justify-between border-b pb-2">
								<h3 class="text-pp-pink text-lg font-semibold">
									{order.store?.store_name || 'Store'}
								</h3>
								<span
									class="rounded-full px-2 py-1 text-xs {order.order_status === 'Pending'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-green-100 text-green-800'}"
								>
									{order.order_status}
								</span>
							</div>

							{#each order.order_details as detail (detail.product?.name)}
								<div class="mb-2 flex items-center">
									<div class="flex-1">
										<p class="text-pp-black font-medium">{detail.product?.name}</p>
										<p class="text-pp-gray text-sm">x{detail.quantity}</p>
									</div>
									<p class="text-pp-gray">₱ {(detail.unit_price * detail.quantity).toFixed(2)}</p>
								</div>
							{/each}

							<div class="mt-2 flex flex-wrap items-center justify-between gap-2 border-t pt-2">
								<span class="text-lg font-semibold">
									Total: ₱ {order.order_details
										.reduce((sum: number, d) => sum + (d.unit_price || 0) * d.quantity, 0)
										.toFixed(2)}
								</span>
								<div class="flex gap-2">
									{#if order.order_status === 'Pending' || order.order_status === 'Confirmed'}
										<a
											href={resolve(`/messages/chat/${order.order_id}`)}
											class="rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
										>
											Chat
										</a>
									{/if}
									{#if order.order_status === 'Confirmed'}
										<button
											class="bg-pp-pink text-pp-white rounded-md px-4 py-2 text-sm"
											disabled={actionOrders.get(order.order_id)}
											onclick={() => handleCompleteOrder(order.order_id)}
										>
											{actionOrders.get(order.order_id) ? 'Completing...' : 'Complete Order'}
										</button>
									{/if}
									{#if order.order_status === 'Pending' || order.order_status === 'Confirmed'}
										<button
											class="rounded-md border border-red-500 px-4 py-2 text-sm text-red-500"
											disabled={actionOrders.get(order.order_id)}
											onclick={() => handleCancelOrder(order.order_id)}
										>
											{actionOrders.get(order.order_id) ? 'Cancelling...' : 'Cancel Order'}
										</button>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
