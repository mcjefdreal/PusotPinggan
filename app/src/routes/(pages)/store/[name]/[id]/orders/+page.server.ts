import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

interface OrderWithDetails {
	order_id: string;
	buyer_id: string;
	store_id: string;
	order_status: string;
	order_date: string;
	buyer: {
		buyer_id: string;
		display_name: string | null;
	};
	order_details: Array<{
		product_id: string;
		unit_price: number;
		quantity: number;
		product: {
			name: string;
			img_url: string;
		};
	}>;
}

export const load: PageServerLoad = async ({ parent, locals: { supabase }, params }) => {
	const { user } = await parent();

	const { data: store, error: storeError } = await supabase
		.from('store')
		.select('*')
		.eq('store_name', params.name)
		.eq('store_id', params.id)
		.eq('owner', user!.id)
		.single();

	if (storeError) {
		console.error('Fetch Error:', storeError.message);
		throw error(500, 'Failed to load store');
	}

	const { data: orders, error: ordersError } = await supabase
		.from('order')
		.select('*, order_details(*, product(name, img_url))')
		.eq('store_id', params.id)
		.in('order_status', ['Pending', 'Confirmed', 'Completed', 'Cancelled'])
		.order('updated_at', { ascending: false });

	if (ordersError) {
		console.error('Orders error:', ordersError.message);
	}

	let ordersWithDisplayName: OrderWithDetails[] = [];

	if (orders && orders.length > 0) {
		const buyerIds = [...new Set(orders.map((o: any) => o.buyer_id).filter(Boolean))];

		if (buyerIds.length > 0) {
			const { data: users } = await supabase
				.from('user')
				.select('user_id, display_name')
				.in('user_id', buyerIds);

			console.log('Users:', users);

			const userMap = new Map(users?.map((u) => [u.user_id, u.display_name]) || []);

			ordersWithDisplayName = orders.map((order: any) => ({
				...order,
				buyer: {
					buyer_id: order.buyer_id,
					display_name: userMap.get(order.buyer_id) || null
				}
			}));
		} else {
			ordersWithDisplayName = orders as OrderWithDetails[];
		}
	}

	return {
		store,
		storeName: params.name,
		storeId: params.id,
		orders: ordersWithDisplayName || []
	};
};

export const actions: Actions = {
	'confirm-order': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const orderId = formData.get('orderId') as string;

		if (!orderId) {
			return { success: false, message: 'Missing order ID' };
		}

		const { error } = await supabase
			.from('order')
			.update({ order_status: 'Confirmed' })
			.eq('order_id', orderId);

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'Order confirmed' };
	},

	'cancel-order': async ({ request, locals: { supabase } }) => {
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