<script lang="ts">
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { Toast } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	let { data }: { data: {
		store: any;
		storeName: string;
		storeId: string;
		orders: Array<{
			order_id: string;
			order_status: string;
			order_date: string;
			buyer: {
				buyer_id: string;
				display_name: string | null;
			};
			order_details: Array<{
				product: {
					name: string;
					img_url: string;
				};
				unit_price: number;
				quantity: number;
			}>;
		}>;
	}} = $props();

	let showSuccess = $state(false);
	let showFail = $state(false);
	let toastMessage = $state('');
	let actionOrders: Map<string, boolean> = new Map();

	let orders = $derived(data?.orders || []);

	let activeStatus = $state<'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'>('Pending');

	let filteredOrders = $derived(
		orders.filter((o) => o.order_status === activeStatus)
	);

	async function handleConfirmOrder(orderId: string) {
		actionOrders.set(orderId, true);
		const formData = new FormData();
		formData.append('orderId', orderId);

		try {
			const response = await fetch('?/confirm-order', {
				method: 'POST',
				headers: { 'Accept': 'application/json' },
				body: formData
			});

			const jsonResponse = await response.json();
			const resultArray = JSON.parse(jsonResponse.data);
			const success = resultArray[1];
			const message = resultArray[2];

			if (success) {
				toastMessage = 'Order confirmed';
				showSuccess = true;
				await invalidateAll();
			} else {
				toastMessage = message || 'Failed to confirm';
				showFail = true;
			}
			setTimeout(() => {
				showSuccess = false;
				showFail = false;
			}, 3000);
		} catch (err) {
			toastMessage = 'Error confirming order';
			showFail = true;
			setTimeout(() => (showFail = false), 3000);
		} finally {
			actionOrders.set(orderId, false);
		}
	}

	async function handleCancelOrder(orderId: string) {
		actionOrders.set(orderId, true);
		const formData = new FormData();
		formData.append('orderId', orderId);

		try {
			const response = await fetch('?/cancel-order', {
				method: 'POST',
				headers: { 'Accept': 'application/json' },
				body: formData
			});

			const jsonResponse = await response.json();
			const resultArray = JSON.parse(jsonResponse.data);
			const success = resultArray[1];
			const message = resultArray[2];

			if (success) {
				toastMessage = 'Order cancelled';
				showSuccess = true;
				await invalidateAll();
			} else {
				toastMessage = message || 'Failed to cancel';
				showFail = true;
			}
			setTimeout(() => {
				showSuccess = false;
				showFail = false;
			}, 3000);
		} catch (err) {
			toastMessage = 'Error cancelling order';
			showFail = true;
			setTimeout(() => (showFail = false), 3000);
		} finally {
			actionOrders.set(orderId, false);
		}
	}

	function getBuyerName(order: typeof orders[0]) {
		console.log(order);
		return order.buyer?.display_name || order.buyer?.buyer_id || 'Customer';
	}

	function getOrderTotal(order: typeof orders[0]) {
		return order.order_details.reduce(
			(sum, d) => sum + (d.unit_price || 0) * d.quantity,
			0
		);
	}

	function formatDateTime(dateStr: string) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

<div class="min-h-screen w-full">
	<div class="mx-auto max-w-md">
		<!-- Banner -->
		<div class="relative">
			<a
				class="bg-pp-pink text-pp-white absolute top-2 left-2 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg"
				href={resolve(`/store/${data.storeName}/${data.storeId}`)}
			>
				<ArrowLeftOutline />
			</a>
			<div class="bg-pp-gray/10 h-44 w-full">
				<img
					class="h-full w-full object-cover"
					src={data.store.img_url}
					alt={data.store.store_name}
				/>
			</div>
		</div>

		<!-- Store info -->
		<div class="px-4 py-3">
			<div class="text-pp-pink text-xl font-semibold">{data.store.store_name}</div>
			<div class="text-pp-gray text-xs">⭐ {data.store.rating}</div>
		</div>

		<!-- Tabs -->
		<div class="mb-3 flex border-b">
			<button
				class="flex-1 border-b-2 px-4 py-2 transition {activeStatus === 'Pending' ? 'border-pp-pink text-pp-pink' : 'border-transparent'}"
				onclick={() => (activeStatus = 'Pending')}
			>
				Pending{orders.filter((o) => o.order_status === 'Pending').length > 0
					? ` (${orders.filter((o) => o.order_status === 'Pending').length})`
					: ''}
			</button>
			<button
				class="flex-1 border-b-2 px-4 py-2 transition {activeStatus === 'Confirmed' ? 'border-pp-pink text-pp-pink' : 'border-transparent'}"
				onclick={() => (activeStatus = 'Confirmed')}
			>
				Confirmed{orders.filter((o) => o.order_status === 'Confirmed').length > 0
					? ` (${orders.filter((o) => o.order_status === 'Confirmed').length})`
					: ''}
			</button>
			<button
				class="flex-1 border-b-2 px-4 py-2 transition {activeStatus === 'Completed' ? 'border-pp-pink text-pp-pink' : 'border-transparent'}"
				onclick={() => (activeStatus = 'Completed')}
			>
				Completed{orders.filter((o) => o.order_status === 'Completed').length > 0
					? ` (${orders.filter((o) => o.order_status === 'Completed').length})`
					: ''}
			</button>
			<button
				class="flex-1 border-b-2 px-4 py-2 transition {activeStatus === 'Cancelled' ? 'border-pp-pink text-pp-pink' : 'border-transparent'}"
				onclick={() => (activeStatus = 'Cancelled')}
			>
				Cancelled{orders.filter((o) => o.order_status === 'Cancelled').length > 0
					? ` (${orders.filter((o) => o.order_status === 'Cancelled').length})`
					: ''}
			</button>
		</div>

		<!-- Orders -->
		<div class="px-4 pb-24">
			{#if filteredOrders.length === 0}
				<div class="py-8 text-center text-pp-gray">No orders</div>
			{:else}
				{#each filteredOrders as order}
					{@const orderTotal = getOrderTotal(order)}
					<div class="mb-4 rounded-lg border bg-white p-4 shadow">
						<div class="mb-3 flex items-center justify-between border-b pb-2">
							<div>
								<p class="font-medium">{getBuyerName(order)}</p>
								<p class="text-pp-gray text-xs">
									{new Date(order.order_date).toLocaleDateString()}
								</p>
							</div>
							<span
								class="rounded-full px-2 py-1 text-xs {order.order_status === 'Pending'
									? 'bg-yellow-100 text-yellow-800'
									: order.order_status === 'Confirmed'
										? 'bg-green-100 text-green-800'
										: order.order_status === 'Completed'
											? 'bg-blue-100 text-blue-800'
											: 'bg-red-100 text-red-800'}"
							>
								{order.order_status}
							</span>
						</div>

						{#if order.order_status === 'Completed' && order.updated_at}
							<p class="text-pp-gray mt-1 text-xs">Completed at: {formatDateTime(order.updated_at)}</p>
						{:else if order.order_status === 'Cancelled' && order.updated_at}
							<p class="text-pp-gray mt-1 text-xs">Cancelled at: {formatDateTime(order.updated_at)}</p>
						{/if}

						{#each order.order_details as detail}
							<div class="mb-2 flex items-center">
								<img
									class="h-12 w-12 rounded object-cover"
									src={detail.product?.img_url || '/placeholder.png'}
									alt={detail.product?.name}
								/>
								<div class="ml-2 flex-1">
									<p class="text-sm">{detail.product?.name}</p>
									<p class="text-pp-gray text-xs">x{detail.quantity}</p>
								</div>
								<p class="text-sm">₱ {(detail.unit_price * detail.quantity).toFixed(2)}</p>
							</div>
						{/each}

						<div class="mt-2 flex items-center justify-between border-t pt-2">
							<span class="font-semibold">Total: ₱ {orderTotal.toFixed(2)}</span>
						</div>

						{#if order.order_status === 'Pending'}
							<div class="mt-3 flex gap-2">
								<a
									href={resolve(`/messages/chat/${order.order_id}`)}
									class="flex-1 rounded-lg bg-blue-500 py-2 text-white text-center"
								>
									Chat
								</a>
								<button
									class="flex-1 rounded-lg bg-pp-pink py-2 text-white"
									disabled={actionOrders.get(order.order_id)}
									onclick={() => handleConfirmOrder(order.order_id)}
								>
									{actionOrders.get(order.order_id) ? 'Processing...' : 'Confirm'}
								</button>
								<button
									class="flex-1 rounded-lg border border-red-500 py-2 text-red-500"
									disabled={actionOrders.get(order.order_id)}
									onclick={() => handleCancelOrder(order.order_id)}
								>
									{actionOrders.get(order.order_id) ? 'Processing...' : 'Cancel'}
								</button>
							</div>
						{:else if order.order_status === 'Confirmed'}
							<div class="mt-3 flex gap-2">
								<a
									href={resolve(`/messages/chat/${order.order_id}`)}
									class="flex-1 rounded-lg bg-blue-500 py-2 text-white text-center"
								>
									Chat
								</a>
								<button
									class="flex-1 rounded-lg border border-red-500 py-2 text-red-500"
									disabled={actionOrders.get(order.order_id)}
									onclick={() => handleCancelOrder(order.order_id)}
								>
									{actionOrders.get(order.order_id) ? 'Processing...' : 'Cancel'}
								</button>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>