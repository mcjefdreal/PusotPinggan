<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Toast } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	let { data }: { data: { cartItems: Array<{
		id: string;
		cart_id: string;
		product_id: string;
		quantity: number;
		product: {
			product_id: string;
			name: string;
			price: number;
			description: string;
			img_url: string;
			quantity: number;
			store: {
				store_id: string;
				store_name: string;
			};
		};
	}> } } = $props();

	let isOrdering = $state(false);
	let showSuccess = $state(false);
	let showError = $state(false);
	let toastMessage = $state('');

	// Local state for optimistic UI updates
	let localCartItems = $state<typeof data.cartItems>([]);
	let pendingUpdates: Map<string, number> = new Map();
	let updateTimers: Map<string, any> = new Map();
	let savingItems: Set<string> = $state(new Set());

	// Sync with server data
	$effect(() => {
		localCartItems = data?.cartItems || [];
	});

	let cartItems = $derived(localCartItems);

	type CartItem = {
		id: string;
		cart_id: string;
		product_id: string;
		quantity: number;
		product: {
			product_id: string;
			name: string;
			price: number;
			description: string;
			img_url: string;
			quantity: number;
			store: {
				store_id: string;
				store_name: string;
			};
		};
	};

	function getGroupedByStore(): Array<{ storeId: string; storeName: string; items: CartItem[] }> {
		const groups: Record<string, { storeId: string; storeName: string; items: CartItem[] }> = {};
		for (const item of cartItems) {
			const sid = item.product?.store?.store_id;
			if (!sid) continue;
			if (!groups[sid]) {
				groups[sid] = {
					storeId: sid,
					storeName: item.product?.store?.store_name || 'Unknown Store',
					items: []
				};
			}
			groups[sid].items.push(item);
		}
		return Object.values(groups);
	}

	async function handleOrderNow(storeId: string) {
		if (isOrdering) return;
		
		// First, wait for any pending quantity updates to complete
		await waitForPendingUpdates();
		
		isOrdering = true;
		showSuccess = false;
		showError = false;

		const formData = new FormData();
		formData.append('storeId', storeId);

		try {
			const response = await fetch('?/order-now', {
				method: 'POST',
				headers: { 'Accept': 'application/json' },
				body: formData
			});

			const jsonResponse = await response.json();
			const resultArray = JSON.parse(jsonResponse.data);

			const success = resultArray[1];
			const message = resultArray[2];

			if (success) {
				toastMessage = message || 'Order placed!';
				showSuccess = true;
				await invalidateAll();
				setTimeout(() => (showSuccess = false), 3000);
			} else {
				toastMessage = message || 'Failed to place order';
				showError = true;
				setTimeout(() => (showError = false), 3000);
			}
		} catch (err) {
			console.error('Order error:', err);
			toastMessage = 'An error occurred';
			showError = true;
			setTimeout(() => (showError = false), 3000);
		} finally {
			isOrdering = false;
		}
	}

	async function handleRemoveFromCart(itemId: string) {
		const formData = new FormData();
		formData.append('itemId', itemId);

		try {
			const response = await fetch('?/remove-from-cart', {
				method: 'POST',
				headers: { 'Accept': 'application/json' },
				body: formData
			});
			const jsonResponse = await response.json();
			const resultArray = JSON.parse(jsonResponse.data);
			await invalidateAll();
		} catch (err) {
			console.error('Failed to remove item:', err);
		}
	}

	// Wait for any pending quantity updates to complete before ordering
	async function waitForPendingUpdates() {
		if (pendingUpdates.size === 0) return;
		
		const promises: Promise<void>[] = [];
		for (const [itemId, timer] of updateTimers) {
			promises.push(
				new Promise((resolve) => {
					clearTimeout(timer);
					const q = pendingUpdates.get(itemId);
					if (q !== undefined) {
						const formData = new FormData();
						formData.append('itemId', itemId);
						formData.append('quantity', q.toString());
						
						fetch('?/update-cart-quantity', {
							method: 'POST',
							headers: { 'Accept': 'application/json' },
							body: formData
						}).then(async () => {
							await invalidateAll();
							resolve();
						}).catch(() => resolve());
					} else {
						resolve();
					}
				})
			);
		}
		await Promise.all(promises);
	}

	async function handleUpdateQuantity(itemId: string, newQuantity: number) {
		if (newQuantity < 1) {
			pendingUpdates.delete(itemId);
			if (updateTimers.has(itemId)) {
				clearTimeout(updateTimers.get(itemId));
				updateTimers.delete(itemId);
			}
			handleRemoveFromCart(itemId);
			return;
		}

		// Optimistic UI update - immediately update local state
		const itemIndex = localCartItems.findIndex((i: any) => i.id === itemId);
		if (itemIndex !== -1) {
			localCartItems[itemIndex].quantity = newQuantity;
		}

		pendingUpdates.set(itemId, newQuantity);

		if (updateTimers.has(itemId)) {
			clearTimeout(updateTimers.get(itemId));
		}

		updateTimers.set(
			itemId,
			setTimeout(async () => {
				updateTimers.delete(itemId);
				const q = pendingUpdates.get(itemId);
				if (q !== undefined) {
					pendingUpdates.delete(itemId);
					savingItems.add(itemId);
					savingItems = new Set(savingItems);

					const formData = new FormData();
					formData.append('itemId', itemId);
					formData.append('quantity', q.toString());

					try {
						const response = await fetch('?/update-cart-quantity', {
							method: 'POST',
							headers: { 'Accept': 'application/json' },
							body: formData
						});
						await response.json();
						await invalidateAll();
					} catch (err) {
						console.error('Failed to update quantity:', err);
					} finally {
						savingItems.delete(itemId);
						savingItems = new Set(savingItems);
					}
				}
			}, 1000)
		);
	}
</script>

{#if showSuccess}
	<Toast color="green" class="fixed top-4 right-4 z-100">
		{toastMessage}
	</Toast>
{/if}

{#if showError}
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
				class="flex flex-1 items-center justify-center border-b-2 border-pp-pink text-pp-pink transition active:bg-gray-300"
			>Cart{cartItems.length > 0 ? ` (${cartItems.length})` : ''}</a
			>
			<a
				href={resolve('/profile/basket/ordered')}
				class="flex flex-1 items-center justify-center border-b-2 border-transparent transition active:bg-gray-300"
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

		{#if cartItems.length === 0}
			<div class="flex flex-col items-center justify-center py-20">
				<p class="text-pp-gray text-lg">Your cart is empty</p>
				<p class="text-pp-gray mt-2 text-sm">Add items from a store to get started</p>
				<a href={resolve('/home')} class="text-pp-pink mt-4 text-sm font-medium">Go to Home</a>
			</div>
		{:else}
			{#each getGroupedByStore() as group}
			<div class="mb-4 w-full px-2">
				<div class="bg-pp-white mx-2 rounded-lg p-3 shadow">
					<div class="mb-3 flex items-center justify-between border-b pb-2">
						<h3 class="text-pp-pink text-lg font-semibold">{group.storeName}</h3>
						<button
							class="bg-pp-pink text-pp-white rounded-md px-4 py-2 text-sm"
							disabled={isOrdering}
							onclick={() => handleOrderNow(group.storeId)}
						>
							{isOrdering ? 'Ordering...' : 'Order Now'}
						</button>
					</div>

					{#each group.items as item}
						<div class="mb-3 flex items-center border-b pb-3 last:border-b-0">
							<img
								class="h-20 w-20 rounded object-cover"
								src={item.product?.img_url || '/placeholder.png'}
								alt={item.product?.name}
							/>
							<div class="ml-3 flex flex-1 flex-col">
								<h4 class="text-pp-black font-medium">{item.product?.name}</h4>
								<p class="text-pp-gray text-sm">₱ {item.product?.price.toFixed(2)}</p>
								<div class="mt-2 flex items-center gap-2">
									<button
										class="border-pp-gray h-6 w-6 rounded border"
										disabled={savingItems.has(item.id)}
										onclick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
									>
										-
									</button>
									{#if savingItems.has(item.id)}
										<div class="h-4 w-4 animate-spin rounded-full border-2 border-pp-pink border-t-transparent"></div>
									{:else}
										<span class="w-8 text-center">{item.quantity}</span>
									{/if}
									<button
										class="border-pp-gray h-6 w-6 rounded border"
										disabled={savingItems.has(item.id)}
										onclick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
									>
										+
									</button>
								</div>
							</div>
							<button
								class="text-pp-pink text-sm"
								onclick={() => handleRemoveFromCart(item.id)}
							>
								Remove
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>
