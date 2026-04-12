import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface OrderWithDetails {
	order_id: string;
	buyer_id: string;
	store_id: string;
	order_status: string;
	order_date: string;
	buyer: {
		user_id: string;
		display_name: string | null;
		first_name: string | null;
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

export const GET: RequestHandler = async ({ url, locals: { supabase }, params }) => {
	const storeId = url.searchParams.get('storeId');

	if (!storeId) {
		return json({ error: 'Missing storeId' }, { status: 400 });
	}

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { data: orders, error } = await supabase
		.from('order')
		.select('*, buyer:buyer_id(first_name, display_name), order_details(*, product(name, img_url))')
		.eq('store_id', storeId)
		.in('order_status', ['Pending', 'Confirmed']);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ orders: orders as OrderWithDetails[] });
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const formData = await request.formData();
	const orderId = formData.get('orderId') as string;
	const action = formData.get('action') as string;

	if (!orderId || !action) {
		return json({ error: 'Missing orderId or action' }, { status: 400 });
	}

	if (action === 'confirm') {
		const { error } = await supabase
			.from('order')
			.update({ order_status: 'Confirmed' })
			.eq('order_id', orderId);

		if (error) {
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true, message: 'Order confirmed' });
	}

	if (action === 'cancel') {
		const { data: orderDetails, error: detailsError } = await supabase
			.from('order_details')
			.select('product_id, quantity')
			.eq('order_id', orderId);

		if (detailsError) {
			return json({ error: detailsError.message }, { status: 500 });
		}

		if (orderDetails && orderDetails.length > 0) {
			for (const detail of orderDetails) {
				const { data: product, error: productError } = await supabase
					.from('product')
					.select('quantity')
					.eq('product_id', detail.product_id)
					.single();

				if (productError) {
					return json({ error: productError.message }, { status: 500 });
				}

				const newQuantity = product.quantity + detail.quantity;

				const { error: updateError } = await supabase
					.from('product')
					.update({ quantity: newQuantity })
					.eq('product_id', detail.product_id);

				if (updateError) {
					return json({ error: updateError.message }, { status: 500 });
				}
			}
		}

		const { error } = await supabase
			.from('order')
			.update({ order_status: 'Cancelled' })
			.eq('order_id', orderId);

		if (error) {
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true, message: 'Order cancelled' });
	}

	return json({ error: 'Invalid action' }, { status: 400 });
};