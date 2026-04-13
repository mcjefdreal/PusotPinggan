import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

async function getBuyerId(supabase: any, userId: string): Promise<string | null> {
	const { data: buyer, error } = await supabase
		.from('buyer')
		.select('buyer_id')
		.eq('buyer_id', userId)
		.single();

	if (error && error.code !== 'PGRST116') {
		return null;
	}

	if (buyer) {
		return buyer.buyer_id;
	}

	return null;
}

export const load: PageServerLoad = async ({ parent, locals: { supabase }, params }) => {
	const { user } = await parent();

	if (!user) {
		throw redirect(303, '/login');
	}

	const buyerId = await getBuyerId(supabase, user.id);

	// Get order details
	const { data: order, error: orderError } = await supabase
		.from('order')
		.select('*, store(store_id, store_name, owner), buyer(*)')
		.eq('order_id', params.orderId)
		.single();

	if (orderError || !order) {
		throw error(404, 'Order not found');
	}

	// Check if user is buyer or store owner
	const isBuyer = buyerId && order.buyer_id === buyerId;
	const isSeller = order.store?.owner === user.id;

	if (!isBuyer && !isSeller) {
		throw error(403, 'You do not have access to this chat');
	}

	// Get chat by order_id
	const { data: chat, error: chatError } = await supabase
		.from('chat')
		.select('*')
		.eq('order_id', params.orderId)
		.single();

	if (chatError || !chat) {
		// Create chat if it doesn't exist
		const { data: newChat, error: newChatError } = await supabase
			.from('chat')
			.insert({
				order_id: params.orderId,
				buyer_id: order.buyer_id,
				seller_id: order.store_id
			})
			.select()
			.single();

		if (newChatError || !newChat) {
			throw error(500, 'Failed to create chat');
		}

		var chatWithId = newChat;
	} else {
		var chatWithId = chat;
	}

	// Mark chat as opened
	const openedField = isBuyer ? 'buyer_opened_at' : 'seller_opened_at';
	const lastMessageField = isBuyer ? 'seller_opened_at' : 'buyer_opened_at';

	// Get last message time
	const { data: lastMessage } = await supabase
		.from('message')
		.select('created_at')
		.eq('chat_id', chatWithId.chat_id)
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	// Check if need to mark as opened (if last message is from other party)
	const otherPartyOpened = lastMessage && lastMessage.sender_id !== user.id;
	const shouldMarkOpened = otherPartyOpened || !chatWithId[openedField];

	if (shouldMarkOpened) {
		await supabase
			.from('chat')
			.update({ [openedField]: new Date().toISOString() })
			.eq('chat_id', chatWithId.chat_id);
	}

	// Get messages
	const { data: messages, error: messagesError } = await supabase
		.from('message')
		.select('msg_id, chat_id, sender_id, content, created_at')
		.eq('chat_id', chatWithId.chat_id)
		.order('created_at', { ascending: true });

	if (messagesError) {
		console.error('Messages error:', messagesError.message);
	}

	// Fetch sender names
	const senderIds = [...new Set(messages?.map((m) => m.sender_id) || [])];
	let senderMap: Record<string, { display_name: string }> = {};

	if (senderIds.length > 0) {
		const { data: users } = await supabase
			.from('user')
			.select('user_id, display_name')
			.in('user_id', senderIds);

		if (users) {
			users.forEach((u) => {
				senderMap[u.user_id] = { display_name: u.display_name };
			});
		}
	}

	const messagesWithSender = messages?.map((m) => ({
		...m,
		sender: senderMap[m.sender_id] || { display_name: 'Unknown' }
	})) || [];

	// Get order details for display
	const { data: orderDetails, error: detailsError } = await supabase
		.from('order_details')
		.select('*, product(*)')
		.eq('order_id', params.orderId);

	// Calculate deletion time if order is completed
	let deletionTime: string | null = null;
	if (order.order_status === 'Completed' && order.updated_at) {
		const completionTime = new Date(order.updated_at);
		completionTime.setHours(completionTime.getHours() + 1);
		deletionTime = completionTime.toISOString();
	}

	return {
		order,
		chat: chatWithId,
		messages: messagesWithSender,
		orderDetails: orderDetails || [],
		isBuyer,
		isSeller,
		userId: user.id,
		deletionTime
	};
};

export const actions: Actions = {
	'send-message': async ({ request, locals: { supabase }, params }) => {
		const { data: { user } } = await supabase.auth.getUser();

		if (!user) {
			return { success: false, message: 'Unauthorized' };
		}

		const formData = await request.formData();
		const content = formData.get('content') as string;

		if (!content || content.trim() === '') {
			return { success: false, message: 'Message cannot be empty' };
		}

		const { data: chat, error: chatError } = await supabase
			.from('chat')
			.select('*')
			.eq('order_id', params.orderId)
			.single();

		if (chatError || !chat) {
			return { success: false, message: 'Chat not found' };
		}

		const { error: messageError } = await supabase.from('message').insert({
			chat_id: chat.chat_id,
			sender_id: user.id,
			content: content.trim()
		});

		if (messageError) {
			return { success: false, message: messageError.message };
		}

		// Update chat timestamp
		await supabase
			.from('chat')
			.update({ updated_at: new Date().toISOString() })
			.eq('chat_id', chat.chat_id);

		return { success: true, message: 'Message sent' };
	}
};
