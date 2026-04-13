<script lang="ts">
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import ChatPreview from '$lib/components/Messages/ChatPreview.svelte';

	let { data }: { data: {
		chats: Array<{
			chat_id: string;
			order_id: string;
			isBuyer: boolean;
			order: {
				order_id: string;
				order_status: string;
				created_at: string;
				store: {
					store_name: string;
					img_url: string;
				};
				buyer: {
					user_id: string;
					display_name: string;
				};
			};
			lastMessage: {
				content: string;
				created_at: string;
				sender_id: string;
			};
			unread: boolean;
		}>;
		unreadCount: number;
	}} = $props();

	let pollInterval: any;

	let chats = $derived(data?.chats || []);
	let unreadCount = $derived(data?.unreadCount || 0);

	function formatTime(dateStr: string) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) {
			return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		} else if (days === 1) {
			return 'Yesterday';
		} else if (days < 7) {
			return date.toLocaleDateString([], { weekday: 'short' });
		} else {
			return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
		}
	}

	onMount(() => {
		pollInterval = setInterval(async () => {
			await invalidateAll();
		}, 30000);

		return () => {
			if (pollInterval) {
				clearInterval(pollInterval);
			}
		};
	});
</script>

<div class="min-h-screen w-full">
	<div
		class="from-pp-pink to-pp-light-pink sticky start-0 top-0 z-20 grid w-full justify-center bg-linear-to-t p-4 py-8"
	>
		<div class="text-pp-white text-center text-2xl font-semibold">Messages</div>
	</div>

	<div class="flex flex-col gap-y-0 px-0 py-0">
		{#if chats.length === 0}
			<div class="flex flex-col items-center justify-center py-20">
				<p class="text-pp-gray text-lg">No chats yet</p>
				<p class="text-pp-gray mt-2 text-sm">Place an order to start chatting with sellers</p>
			</div>
		{:else}
			{#each chats as chat}
				{@const otherName = chat.order?.store?.store_name || 'Store'}
				{@const lastTime = formatTime(chat.lastMessage?.created_at || chat.order?.created_at)}
				{@const userPic = chat.isBuyer ? chat.order?.store?.img_url : null}
				{@const latestMsg = chat.lastMessage?.content || 'No messages yet'}
				<a
					href={resolve(`/messages/chat/${chat.order_id}`)}
					class="block rounded-lg transition hover:bg-gray-100 active:bg-gray-300"
				>
					<ChatPreview
						{userPic}
						userName={otherName}
						{latestMsg}
						time={lastTime}
						read={!chat.unread}
					></ChatPreview>
				</a>
			{/each}
		{/if}
	</div>
</div>
