import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface CartItem {
	id: string;
	cart_id: string;
	product_id: string;
	quantity: number;
	product: {
		product_id: string;
		name: string;
		price: number;
		quantity: number;
		store_id: string;
		store: {
			store_id: string;
			store_name: string;
		};
	};
}

interface StoreGroup {
	storeId: string;
	storeName: string;
	items: CartItem[];
}

async function getBuyerId(
	supabase: import('@supabase/supabase-js').SupabaseClient,
	userId: string
): Promise<string | null> {
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

	// Create buyer if not exists
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

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const buyerId = await getBuyerId(supabase, user.id);
	if (!buyerId) {
		return json({ error: 'Buyer not found' }, { status: 404 });
	}

	// Get cart
	const { data: cart, error: cartError } = await supabase
		.from('cart')
		.select('cart_id')
		.eq('buyer_id', buyerId)
		.single();

	if (cartError || !cart) {
		return json({ error: 'Cart not found' }, { status: 400 });
	}

	// Get cart items with product and store
	const { data: cartItems, error: itemsError } = await supabase
		.from('cart_item')
		.select('*, product:product_id(*, store:store_id(*))')
		.eq('cart_id', cart.cart_id);

	if (itemsError) {
		return json({ error: itemsError.message }, { status: 500 });
	}

	if (!cartItems || cartItems.length === 0) {
		return json({ error: 'Cart is empty' }, { status: 400 });
	}

	const storeGroups: StoreGroup[] = [];
	const storeMap = new Map<string, CartItem[]>();

	for (const item of cartItems as CartItem[]) {
		const storeId = item.product?.store?.store_id;
		const storeName = item.product?.store?.store_name;

		if (!storeId) continue;

		if (!storeMap.has(storeId)) {
			storeMap.set(storeId, []);
			storeGroups.push({
				storeId,
				storeName: storeName || 'Unknown Store',
				items: storeMap.get(storeId)!
			});
		}
		storeMap.get(storeId)!.push(item);
	}

	const orders: { orderId: string; storeId: string; storeName: string }[] = [];

	for (const group of storeGroups) {
		// Create order
		const { data: orderData, error: orderError } = await supabase
			.from('order')
			.insert({
				buyer_id: buyerId,
				store_id: group.storeId
			})
			.select('order_id')
			.single();

		if (orderError) {
			return json({ error: orderError.message }, { status: 500 });
		}

		const orderId = orderData.order_id;
		orders.push({ orderId, storeId: group.storeId, storeName: group.storeName });

		for (const item of group.items) {
			const unitPrice = item.product.price;
			const orderQuantity = item.quantity;

			// Insert order details
			const { error: detailsError } = await supabase.from('order_details').insert({
				order_id: orderId,
				product_id: item.product_id,
				unit_price: unitPrice,
				quantity: orderQuantity
			});

			if (detailsError) {
				return json({ error: detailsError.message }, { status: 500 });
			}

			// Deduct product quantity
			const { data: productData, error: productError } = await supabase
				.from('product')
				.select('quantity')
				.eq('product_id', item.product_id)
				.single();

			if (productError) {
				return json({ error: productError.message }, { status: 500 });
			}

			const newQuantity = productData.quantity - orderQuantity;

			if (newQuantity < 0) {
				return json({ error: `Insufficient quantity for ${item.product.name}` }, { status: 400 });
			}

			const { error: updateError } = await supabase
				.from('product')
				.update({ quantity: newQuantity })
				.eq('product_id', item.product_id);

			if (updateError) {
				return json({ error: updateError.message }, { status: 500 });
			}
		}

		// Delete cart items for this store
		const { error: deleteItemsError } = await supabase
			.from('cart_item')
			.delete()
			.eq('cart_id', cart.cart_id)
			.eq('product.store.store_id', group.storeId);

		if (deleteItemsError) {
			return json({ error: deleteItemsError.message }, { status: 500 });
		}
	}

	// Check if cart is empty, delete cart too
	const { data: remainingItems } = await supabase
		.from('cart_item')
		.select('id', { count: 'exact' })
		.eq('cart_id', cart.cart_id);

	if (!remainingItems || remainingItems.length === 0) {
		await supabase.from('cart').delete().eq('cart_id', cart.cart_id);
	}

	return json({ success: true, orders });
};
