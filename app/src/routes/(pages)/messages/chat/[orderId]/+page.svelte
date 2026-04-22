<script lang="ts">
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { subscribeToChat } from '$lib/hooks/UseRealtime';
	import { supabaseClient } from '$lib/SupabaseClient';
	import { onMount } from 'svelte';
	import { Toast } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	let {
		data
	}: {
		data: {
			order: {
				order_id: string;
				order_status: string;
				order_date: string;
				store?: {
					store_name?: string;
				};
			};
			chat: Record<string, unknown>;
			messages: Array<{
				msg_id: string;
				chat_id: string;
				sender_id: string;
				content: string;
				created_at: string;
				sender: {
					display_name: string;
				};
			}>;
			orderDetails: Array<{
				product: {
					name: string;
					img_url: string;
					product_id?: string;
				};
				product_id?: string;
				quantity: number;
				unit_price: number;
			}>;
			userId: string;
			deletionTime: string | null;
			buyerName: string | null;
		};
	} = $props();

	// let pollInterval: ReturnType<typeof setInterval>;

	let newMessage = $state('');
	let messagesContainer: HTMLDivElement;
	let showSuccess = $state(false);
	let showFail = $state(false);
	let toastMessage = $state('');
	let isSending = $state(false);
	let pendingMessages = $state<Record<string, unknown>[]>([]);

	let messages = $derived(data?.messages || []);
	let order = $derived(data?.order || {});
	let orderDetails = $derived(data?.orderDetails || []);
	let userId = $derived(data?.userId || '');
	let deletionTime = $derived(data?.deletionTime || null);
	let showDeletionNotice = $derived(order.order_status === 'Completed' || order.order_status === 'Cancelled');


	let allMessages = $derived([...messages, ...pendingMessages]);

	// Clear pending messages when server data updates with new messages
	$effect(() => {
		if (pendingMessages.length > 0 && messages.length > 0) {
			const pendingContents = pendingMessages.map((p) => p.content);
			const hasServerNewMessage = messages.some((m) => pendingContents.includes(m.content));
			if (hasServerNewMessage) {
				pendingMessages = [];
			}
		}
	});

	onMount(() => {
		const chatId = data?.chat?.chat_id as string;
		if (!chatId) return;

		const channel = subscribeToChat(chatId, () => {
			console.log('New message found');
			invalidateAll();
		});

		return () => {
			supabaseClient.removeChannel(channel);
		};
	});

	function getOrderTotal() {
		return orderDetails.reduce(
			(sum: number, d: { unit_price: number; quantity: number }) =>
				sum + (d.unit_price || 0) * d.quantity,
			0
		);
	}

	function formatTime(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString();
	}

	async function sendMessage() {
		if (!newMessage.trim() || isSending) return;
		isSending = true;
		showSuccess = false;
		showFail = false;

		const messageContent = newMessage.trim();
		const formData = new FormData();
		formData.append('content', messageContent);

		try {
			const response = await fetch('?/send-message', {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: formData
			});

			const jsonResponse = await response.json();
			const resultArray = JSON.parse(jsonResponse.data);
			const success = resultArray[1];
			const responseMsg = resultArray[2];

			if (success) {
				// Add message immediately to local list
				pendingMessages = [
					...pendingMessages,
					{
						msg_id: `pending-${Date.now()}`,
						chat_id: data?.chat?.chat_id || '',
						sender_id: userId,
						content: messageContent,
						created_at: new Date().toISOString(),
						sender: { display_name: 'You' }
					}
				];
				newMessage = '';
				await invalidateAll();
			} else {
				toastMessage = responseMsg || 'Failed to send';
				showFail = true;
				setTimeout(() => (showFail = false), 3000);
			}
		} catch {
			toastMessage = 'An error occurred';
			showFail = true;
			setTimeout(() => (showFail = false), 3000);
		} finally {
			isSending = false;
		}
	}

	$effect(() => {
		if (messagesContainer && allMessages.length > 0) {
			setTimeout(() => {
				if (messagesContainer) {
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				}
			}, 0);
		}
	});
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

<div class="flex h-screen flex-col bg-rose-50">
	<!-- Header -->
	<div
		class="from-pp-pink to-pp-light-pink sticky top-0 z-20 flex w-full items-center justify-between bg-linear-to-t p-4 py-6"
	>
		<a href={resolve('/messages')} class="text-pp-white">
			<ArrowLeftOutline class="h-8 w-8" />
		</a>
		<div class="text-center">
			{#if data.buyerName}
				<div class="text-pp-white text-xl font-semibold">{data.buyerName}</div>
				<div class="text-pp-white text-xs">{formatDate(order.order_date)}</div>
			{:else}
				<div class="text-pp-white text-xl font-semibold">{order.store?.store_name || 'Store'}</div>
				<div class="text-pp-white text-xs">{formatDate(order.order_date)}</div>
			{/if}
		</div>
		<div class="w-8"></div>
	</div>

	<!-- Order Summary Card -->
	<div class="mx-3 mt-2 rounded-lg bg-white p-3 shadow">
		<div class="mb-2 border-b pb-2">
			<span class="text-pp-pink font-semibold">Order Summary</span>
			<span
				class="ml-2 rounded-full px-2 py-0.5 text-xs {order.order_status === 'Pending'
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
		<div class="max-h-24 space-y-1 overflow-y-auto">
			{#each orderDetails as detail (detail.product?.product_id || detail.product_id)}
				<div class="flex items-center justify-between text-sm">
					<div class="flex items-center gap-2">
						<img
							class="h-8 w-8 rounded object-cover"
							src={detail.product?.img_url || '/placeholder.png'}
							alt={detail.product?.name}
						/>
						<span class="text-pp-black">{detail.product?.name}</span>
						<span class="text-pp-gray">x{detail.quantity}</span>
					</div>
					<span class="text-pp-gray">₱ {(detail.unit_price * detail.quantity).toFixed(2)}</span>
				</div>
			{/each}
		</div>
		<div class="mt-2 border-t pt-2 text-right font-semibold">
			Total: ₱ {getOrderTotal().toFixed(2)}
		</div>
	</div>

	<!-- Messages -->
	<div bind:this={messagesContainer} class="flex-1 overflow-y-auto p-3">
		{#if allMessages.length === 0}
			<div class="text-pp-gray flex h-full items-center justify-center">
				<p>No messages yet. Start the conversation!</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each allMessages as msg (msg.msg_id)}
					{@const isMyMessage = msg.sender_id === userId}
					<div class="flex {isMyMessage ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[75%] rounded-lg px-3 py-2 {isMyMessage
								? 'bg-pp-pink text-white'
								: 'bg-gray-200 text-gray-800'}"
						>
							<div class="text-sm">{msg.content}</div>
							<div class="text-xs {isMyMessage ? 'text-pink-200' : 'text-gray-500'}">
								{formatTime(msg.created_at as string)}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if showDeletionNotice && deletionTime}
			{@const delTime = new Date(deletionTime).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			})}
			<div class="mt-4 flex justify-center">
				<p class="text-center text-sm text-gray-500">
					This chat will be deleted in 1 hour (at {delTime})
				</p>
			</div>
		{/if}
	</div>

	<!-- Message Input -->
	<form
		class="flex items-center gap-2 border-t bg-white p-3"
		onsubmit={(e) => {
			e.preventDefault();
			sendMessage();
		}}
	>
		<input
			type="text"
			bind:value={newMessage}
			placeholder="Type a message..."
			class="focus:border-pp-pink flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
		/>
		<button
			type="submit"
			disabled={!newMessage.trim() || isSending}
			class="bg-pp-pink rounded-lg px-4 py-2 text-white disabled:opacity-50"
			aria-label="send"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
				></path>
			</svg>
		</button>
	</form>
</div>
