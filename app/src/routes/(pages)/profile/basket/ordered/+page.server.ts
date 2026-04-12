import type { PageServerLoad, Actions } from './$types';

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
		.select('*, order_details(*, product(*)), store(store_id, store_name), buyer(*)')
		.eq('buyer_id', buyerId)
		.in('order_status', ['Pending', 'Confirmed']);

	if (ordersError) {
		console.error('Orders error:', ordersError.message);
	}

	return {
		orders: orders || []
	};
};

export const actions: Actions = {
	'complete-order': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const orderId = formData.get('orderId') as string;

		if (!orderId) {
			return { success: false, message: 'Missing order ID' };
		}

		const { error } = await supabase
			.from('order')
			.update({ order_status: 'Completed' })
			.eq('order_id', orderId);

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'Order completed' };
	},

	'buyer-cancel-order': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const orderId = formData.get('orderId') as string;

		if (!orderId) {
			return { success: false, message: 'Missing order ID' };
		}

		const { data: orderDetails, error: detailsError } = await supabase
			.from('order_details')
			.select('product_id, quantity')
			.eq('order_id', orderId);

		if (detailsError) {
			return { success: false, message: detailsError.message };
		}

		if (orderDetails && orderDetails.length > 0) {
			for (const detail of orderDetails) {
				const { data: product, error: productError } = await supabase
					.from('product')
					.select('quantity')
					.eq('product_id', detail.product_id)
					.single();

				if (productError) {
					return { success: false, message: productError.message };
				}

				const newQuantity = product.quantity + detail.quantity;

				const { error: updateError } = await supabase
					.from('product')
					.update({ quantity: newQuantity })
					.eq('product_id', detail.product_id);

				if (updateError) {
					return { success: false, message: updateError.message };
				}
			}
		}

		const { error } = await supabase
			.from('order')
			.update({ order_status: 'Cancelled' })
			.eq('order_id', orderId);

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'Order cancelled' };
	}
};
