import { redirect } from '@sveltejs/kit';

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
			.select('chat_id, buyer_id, buyer_opened_at, seller_opened_at, order_id')
			.eq('buyer_id', buyerId);
		chats = buyerChats || [];
	}

	if (storeIds.length > 0) {
		const { data: sellerChats } = await supabase
			.from('chat')
			.select('chat_id, buyer_id, buyer_opened_at, seller_opened_at, order_id')
			.in('seller_id', storeIds);
		chats = [...chats, ...(sellerChats || [])];
	}

	// Get last messages and unread counts
	let unreadCount = 0;

	for (const chat of chats) {
		// Get last message
		const { data: lastMsg } = await supabase
			.from('message')
			.select('created_at, sender_id')
			.eq('chat_id', chat.chat_id)
			.order('created_at', { ascending: false })
			.limit(1)
			.single();

		// Determine if unread
		const isBuyer = buyerId && chat.buyer_id === buyerId;
		const lastOpened = isBuyer ? chat.buyer_opened_at : chat.seller_opened_at;
		const unread = lastMsg && (!lastOpened || new Date(lastMsg.created_at) > new Date(lastOpened));

		if (unread) {
			unreadCount++;
		}
	}

	return {
		session,
		user,
		unreadCount
	};
};
