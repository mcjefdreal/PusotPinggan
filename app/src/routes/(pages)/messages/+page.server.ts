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
	locals: { supabase: import('@supabase/supabase-js').SupabaseClient };
}) => {
	const { session, user } = await parent();

	if (!session) {
		throw redirect(303, '/');
	}

	if (!user) {
		throw error('No user found');
	}

	// Get buyer_id for the user
	const { data: buyer } = await supabase
		.from('buyer')
		.select('buyer_id')
		.eq('buyer_id', user.id)
		.single();

	const buyerId = buyer?.buyer_id;

	// Get stores owned by user
	const { data: stores } = await supabase.from('store').select('store_id').eq('owner', user.id);

	const storeIds = stores?.map((s) => s.store_id) || [];

	// Fetch chats where user is buyer or seller
	const chats: Record<string, unknown>[] = [];

	if (buyerId) {
		const { data: buyerChats } = await supabase.from('chat').select('*').eq('buyer_id', buyerId);
		chats.push(...(buyerChats || []));
	}

	if (storeIds.length > 0) {
		const { data: sellerChats } = await supabase.from('chat').select('*').in('seller_id', storeIds);
		chats.push(...(sellerChats || []));
	}

	// Fetch order data for each chat
	const orderIds = [...new Set(chats.map((c) => c.order_id).filter(Boolean))];
	const ordersMap: Record<string, Record<string, unknown>> = {};
	const buyerNamesMap: Record<string, Record<string, unknown>> = {};

	if (orderIds.length > 0) {
		const { data: orders } = await supabase
			.from('order')
			.select('*, store(store_id, store_name, img_url), buyer(*)')
			.in('order_id', orderIds);

		if (orders) {
			// Fetch buyer display names from user table
			const buyerUserIds = orders
				.map((o: any) => o.buyer_id)
				.filter((id: string) => id); // Remove undefined/null

			const uniqueBuyerIds = [...new Set(buyerUserIds)];
			if (uniqueBuyerIds.length > 0) {
				const { data: buyerUsers } = await supabase
					.from('user')
					.select('user_id, display_name')
					.in('user_id', uniqueBuyerIds);
				
				if (buyerUsers) {
					buyerUsers.forEach((u) => {
					buyerNamesMap[u.user_id] = { display_name: u.display_name };
					});
				}
			}

			orders.forEach((o) => {
				ordersMap[o.order_id] = {
					...o,
					buyerDisplayName: o.buyer_id 
					? (buyerNamesMap[o.buyer_id]?.display_name || 'Buyer')
					: null

				};
			});
		}
	}

	// Get last messages and unread counts
	const chatsWithUnread: Record<string, unknown>[] = [];

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
		const lastOpened = isBuyer
			? (chat.buyer_opened_at as string)
			: (chat.seller_opened_at as string);
		const unread =
			lastMsg && (!lastOpened || new Date(lastMsg.created_at) > new Date(lastOpened || 0));

		chatsWithUnread.push({
			...chat,
			order: ordersMap[chat.order_id as string] || null,
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
		const dateA = new Date(
			(a.lastMessage as { created_at?: string })?.created_at ||
				(a.order as { created_at?: string })?.created_at ||
				0
		);
		const dateB = new Date(
			(b.lastMessage as { created_at?: string })?.created_at ||
				(b.order as { created_at?: string })?.created_at ||
				0
		);
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
