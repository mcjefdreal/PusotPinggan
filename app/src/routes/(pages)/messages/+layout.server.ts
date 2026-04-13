import { redirect } from '@sveltejs/kit';
import { error } from 'console';

export const load = async ({
	parent,
	locals: { supabase }
}: {
	parent: () => Promise<{
		session: import('@supabase/supabase-js').Session | null;
		user: import('@supabase/supabase-js').User | null;
	}>;
	locals: { supabase: any };
}) => {
	const { session, user } = await parent();

	if (!session) {
		throw redirect(303, '/');
	}
	
	if (!user) {
		throw error("No user found");
	}

	// Get buyer_id for the user
	const { data: buyer } = await supabase
		.from('buyer')
		.select('buyer_id')
		.eq('buyer_id', user.id)
		.single();

	const buyerId = buyer?.buyer_id;

	// Get stores owned by user
	const { data: stores } = await supabase
		.from('store')
		.select('store_id')
		.eq('owner', user.id);

	const storeIds = stores?.map((s) => s.store_id) || [];

	// Fetch chats where user is buyer or seller
	let chats: any[] = [];

	if (buyerId) {
		const { data: buyerChats } = await supabase
			.from('chat')
			.select('*')
			.eq('buyer_id', buyerId);
		chats = buyerChats || [];
	}

	if (storeIds.length > 0) {
		const { data: sellerChats } = await supabase
			.from('chat')
			.select('*')
			.in('seller_id', storeIds);
		chats = [...chats, ...(sellerChats || [])];
	}

	// Fetch order data for each chat
	const orderIds = [...new Set(chats.map((c) => c.order_id).filter(Boolean))];
	let ordersMap: Record<string, any> = {};

	if (orderIds.length > 0) {
		const { data: orders } = await supabase
			.from('order')
			.select('*, store(store_id, store_name, img_url), buyer(*)')
			.in('order_id', orderIds);

		if (orders) {
			orders.forEach((o) => {
				ordersMap[o.order_id] = o;
			});
		}
	}

	// Get last messages and unread counts
	let chatsWithUnread: any[] = [];

	for (const chat of chats) {
		// Get last message with content
		const { data: lastMsg } = await supabase
			.from('message')
			.select('content, created_at, sender_id')
			.eq('chat_id', chat.chat_id)
			.order('created_at', { ascending: false })
			.limit(1)
			.single();

		// Determine if unread
		const isBuyer = buyerId && chat.buyer_id === buyerId;
		const lastOpened = isBuyer ? chat.buyer_opened_at : chat.seller_opened_at;
		const unread = lastMsg && (!lastOpened || new Date(lastMsg.created_at) > new Date(lastOpened));

		chatsWithUnread.push({
			...chat,
			order: ordersMap[chat.order_id] || null,
			lastMessage: lastMsg,
			unread: unread || false,
			isBuyer
		});
	}

	// Sort: unread first, then by last message time (newest first)
	chatsWithUnread.sort((a, b) => {
		if (a.unread !== b.unread) {
			return a.unread ? -1 : 1;
		}
		const dateA = new Date(a.lastMessage?.created_at || a.order?.created_at || 0);
		const dateB = new Date(b.lastMessage?.created_at || b.order?.created_at || 0);
		return dateB.getTime() - dateA.getTime();
	});

	const unreadCount = chatsWithUnread.filter((c) => c.unread).length;

	return {
		session,
		user,
		chats: chatsWithUnread || [],
		unreadCount
	};
};
