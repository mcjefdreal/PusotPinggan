import { error, redirect } from '@sveltejs/kit';

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
		throw error(401, "User not found");
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
		const { data: buyerChats } = await supabase
			.from('chat')
			.select('chat_id, buyer_id, buyer_opened_at, seller_opened_at, order_id')
			.eq('buyer_id', buyerId);
		chats.push(...(buyerChats || []));
	}

	if (storeIds.length > 0) {
		const { data: sellerChats } = await supabase
			.from('chat')
			.select('chat_id, buyer_id, buyer_opened_at, seller_opened_at, order_id')
			.in('seller_id', storeIds);
		chats.push(...(sellerChats || []));
	}

	// Single DB call for unread count instead of N+1
	const { data: unreadCount } = await supabase.rpc('get_unread_count', {
		p_buyer_id: user.id,
		p_store_ids: storeIds
	});

	return {
		session,
		user,
		unreadCount: unreadCount || 0
	};
};
