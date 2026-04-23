import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, parent, locals: { supabase } }) => {
	depends('supabase:messages');

	const { user } = await parent();
	if (!user) throw redirect(303, '/');

	const { data: chats, error: chatsError } = await supabase.rpc('get_user_chats_with_preview', {
		p_user_id: user.id
	});

	if (chatsError) throw error(500, chatsError.message);

	const orderIds = [...new Set(chats.map((c) => c.order_id).filter(Boolean))];
	const ordersMap: Record<string, unknown> = {};
	const buyerNamesMap: Record<string, unknown> = {};

	if (orderIds.length > 0) {
		const { data: orders } = await supabase
			.from('order')
			.select('*, store(store_id, store_name, img_url), buyer(*)')
			.in('order_id', orderIds);

		if (orders) {
			const buyerUserIds = [...new Set(orders.map((o) => o.buyer_id).filter(Boolean))];
			if (buyerUserIds.length > 0) {
				const { data: buyerUsers } = await supabase
					.from('user')
					.select('user_id, display_name, img_url')
					.in('user_id', buyerUserIds);

				if (buyerUsers) {
					buyerUsers.forEach((u) => {
						buyerNamesMap[u.user_id] = { display_name: u.display_name, img_url: u.img_url };
					});
				}
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
		order: ordersMap[chat.order_id as string] || null,
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