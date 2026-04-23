import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface ChatPreviewRow {
	chat_id: string;
	buyer_id: string;
	seller_id: string;
	order_id: string;
	buyer_opened_at: string | null;
	seller_opened_at: string | null;
	last_message_content: string | null;
	last_message_created_at: string | null;
	last_message_sender_id: string | null;
	unread: boolean;
	is_buyer: boolean;
}

interface OrderWithStore {
	order_id: string;
	buyer_id: string;
	order_status: string;
	created_at: string;
	updated_at: string;
	store: {
		store_id: string;
		store_name: string;
		img_url: string;
	};
	buyer: {
		user_id: string;
	};
}

interface BuyerInfo {
	display_name: string;
	img_url: string;
}

export const load: PageServerLoad = async ({ depends, parent, locals: { supabase } }) => {
	depends('supabase:messages');

	const { user } = await parent();
	if (!user) throw redirect(303, '/');

	const { data: chatsRaw, error: chatsError } = await supabase.rpc('get_user_chats_with_preview', {
		p_user_id: user.id
	});

	if (chatsError) throw error(500, chatsError.message);

	const chats = (chatsRaw ?? []) as ChatPreviewRow[];

	const orderIds = [...new Set(chats.map((c) => c.order_id).filter(Boolean))];
	const ordersMap: Record<string, OrderWithStore & { buyerDisplayName: string | null; buyerImgUrl: string | null }> = {};
	const buyerNamesMap: Record<string, BuyerInfo> = {};

	if (orderIds.length > 0) {
		const { data: ordersRaw } = await supabase
			.from('order')
			.select('*, store(store_id, store_name, img_url), buyer(*)')
			.in('order_id', orderIds);

		const orders = (ordersRaw ?? []) as OrderWithStore[];

		if (orders.length > 0) {
			const buyerUserIds = [...new Set(orders.map((o) => o.buyer_id).filter(Boolean))];
			if (buyerUserIds.length > 0) {
				const { data: buyerUsersRaw } = await supabase
					.from('user')
					.select('user_id, display_name, img_url')
					.in('user_id', buyerUserIds);

				const buyerUsers = (buyerUsersRaw ?? []) as { user_id: string; display_name: string; img_url: string }[];
				buyerUsers.forEach((u) => {
					buyerNamesMap[u.user_id] = { display_name: u.display_name, img_url: u.img_url };
				});
			}

			orders.forEach((o) => {
				ordersMap[o.order_id] = {
					...o,
					buyerDisplayName: o.buyer_id ? buyerNamesMap[o.buyer_id]?.display_name || 'Buyer' : null,
					buyerImgUrl: o.buyer_id ? buyerNamesMap[o.buyer_id]?.img_url || null : null
				};
			});
		}
	}

	const chatsWithUnread = chats.map((chat) => ({
		...chat,
		order: ordersMap[chat.order_id] || null,
		lastMessage: chat.last_message_created_at
			? {
					content: chat.last_message_content,
					created_at: chat.last_message_created_at,
					sender_id: chat.last_message_sender_id
				}
			: null,
		unread: chat.unread,
		isBuyer: chat.is_buyer
	}));

	const unreadCount = chatsWithUnread.filter((c) => c.unread).length;

	return {
		chats: chatsWithUnread,
		unreadCount
	};
};
