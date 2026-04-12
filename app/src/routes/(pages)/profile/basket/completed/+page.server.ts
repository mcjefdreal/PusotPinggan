import type { PageServerLoad } from './$types';

async function getBuyerId(supabase: any, userId: string): Promise<string | null> {
	const { data: buyer, error } = await supabase
		.from('buyer')
		.select('buyer_id')
		.eq('buyer_id', userId)
		.single();

	if (error && error.code !== 'PGRST116') {
		console.error('Error fetching buyer:', error.message);
		return null;
	}

	if (buyer) {
		return buyer.buyer_id;
	}

	const { data: newBuyer, error: insertError } = await supabase
		.from('buyer')
		.insert({ buyer_id: userId })
		.select('buyer_id')
		.single();

	if (insertError) {
		console.error('Error creating buyer:', insertError.message);
		return null;
	}

	return newBuyer.buyer_id;
}

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const { user } = await parent();

	if (!user) {
		return { orders: [] };
	}

	const buyerId = await getBuyerId(supabase, user.id);
	if (!buyerId) {
		return { orders: [] };
	}

	const { data: orders, error: ordersError } = await supabase
		.from('order')
		.select('*, order_details(*, product(*)), store(store_id, store_name)')
		.eq('buyer_id', buyerId)
		.eq('order_status', 'Confirmed');

	if (ordersError) {
		console.error('Orders error:', ordersError.message);
	}

	return {
		orders: orders || []
	};
};
