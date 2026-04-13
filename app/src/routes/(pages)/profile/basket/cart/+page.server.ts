import type { PageServerLoad, Actions } from './$types';

interface CartItemWithProduct {
	id: string;
	cart_id: string;
	product_id: string;
	quantity: number;
	product: {
		product_id: string;
		name: string;
		price: number;
		description: string;
		img_url: string;
		quantity: number;
		store: {
			store_id: string;
			store_name: string;
		};
	};
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
		return { cartItems: [] };
	}

	const buyerId = await getBuyerId(supabase, user.id);
	if (!buyerId) {
		return { cartItems: [] };
	}

	const { data: cart, error: cartError } = await supabase
		.from('cart')
		.select('cart_id')
		.eq('buyer_id', buyerId)
		.single();

	if (cartError && cartError.code !== 'PGRST116') {
		console.error('Cart error:', cartError.message);
	}

	let cartItems: CartItemWithProduct[] = [];

	if (cart) {
		const { data: items, error: itemsError } = await supabase
			.from('cart_item')
			.select('*, product:product_id(*, store:store_id(*))')
			.eq('cart_id', cart.cart_id);

		if (itemsError) {
			console.error('Cart items error:', itemsError.message);
		} else {
			cartItems = items as CartItemWithProduct[];
		}
	}

	return { cartItems };
};

export const actions: Actions = {
	'update-cart-quantity': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const itemId = formData.get('itemId') as string;
		const quantity = parseInt(formData.get('quantity') as string);

		if (!itemId || isNaN(quantity)) {
			return { success: false, message: 'Invalid parameters' };
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, message: 'Unauthorized' };
		}

		if (quantity <= 0) {
			const { error } = await supabase.from('cart_item').delete().eq('id', itemId);

			if (error) {
				return { success: false, message: error.message };
			}
			return { success: true, message: 'Item removed' };
		}

		const { error } = await supabase.from('cart_item').update({ quantity }).eq('id', itemId);

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'Quantity updated' };
	},

	'remove-from-cart': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const itemId = formData.get('itemId') as string;

		if (!itemId) {
			return { success: false, message: 'Invalid item' };
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, message: 'Unauthorized' };
		}

		const { error } = await supabase.from('cart_item').delete().eq('id', itemId);

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'Item removed' };
	},

	'order-now': async ({ request, locals: { supabase } }) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, message: 'Unauthorized' };
		}

		const buyerId = await getBuyerId(supabase, user.id);
		if (!buyerId) {
			return { success: false, message: 'Buyer not found' };
		}

		const formData = await request.formData();
		const storeId = formData.get('storeId') as string;

		if (!storeId) {
			return { success: false, message: 'Invalid store' };
		}

		const { data: cart, error: cartError } = await supabase
			.from('cart')
			.select('cart_id')
			.eq('buyer_id', buyerId)
			.single();

		if (cartError || !cart) {
			return { success: false, message: 'Cart not found' };
		}

		const { data: cartItems, error: itemsError } = await supabase
			.from('cart_item')
			.select('id, product_id, quantity, product(*, store(store_id, store_name))')
			.eq('cart_id', cart.cart_id);

		if (itemsError) {
			return { success: false, message: itemsError.message };
		}

		if (!cartItems || cartItems.length === 0) {
			return { success: false, message: 'Cart is empty' };
		}

		const storeItems = cartItems.filter(
			(item: CartItemWithProduct) => item.product?.store?.store_id === storeId
		);

		if (!storeItems || storeItems.length === 0) {
			return { success: false, message: 'Cart is empty for this store' };
		}

		const { data: orderData, error: orderError } = await supabase
			.from('order')
			.insert({
				buyer_id: buyerId,
				store_id: storeId
			})
			.select('order_id')
			.single();

		if (orderError) {
			console.error('Order create error:', orderError.message);
			return { success: false, message: orderError.message };
		}

		const orderId = orderData.order_id;
		console.log('Order created:', orderId);

		for (const item of storeItems) {
			console.log('Entering for loop');
			const { error: detailsError } = await supabase.from('order_details').insert({
				order_id: orderId,
				product_id: item.product_id,
				unit_price: item.product.price,
				quantity: item.quantity
			});

			if (detailsError) {
				console.error('Order details insert error:', detailsError.message);
				return { success: false, message: detailsError.message };
			}

			const { data: productData, error: productError } = await supabase
				.from('product')
				.select('quantity')
				.eq('product_id', item.product_id)
				.single();

			if (productError) {
				console.error('Product fetch error:', productError.message);
				return { success: false, message: productError.message };
			}

			const newQuantity = productData.quantity - item.quantity;

			console.log('product quantity:', productData.quantity);
			console.log('item quantity:', item.quantity);

			if (newQuantity < 0) {
				return { success: false, message: `Insufficient quantity for ${item.product.name}` };
			}

			const { error: updateError } = await supabase
				.from('product')
				.update({ quantity: newQuantity })
				.eq('product_id', item.product_id);

			if (updateError) {
				console.error('Product update error:', updateError.message);
				return { success: false, message: updateError.message };
			}
		}

		console.log('exited for loop');

		const storeItemIds = storeItems.map((item: CartItemWithProduct) => item.id);
		if (storeItemIds.length > 0) {
			const { error: deleteItemsError } = await supabase
				.from('cart_item')
				.delete()
				.in('id', storeItemIds);

			if (deleteItemsError) {
				console.error('Cart item delete error:', deleteItemsError.message);
				return { success: false, message: deleteItemsError.message };
			}
		}

		const { data: remainingItems } = await supabase
			.from('cart_item')
			.select('id', { count: 'exact' })
			.eq('cart_id', cart.cart_id);

		if (!remainingItems || remainingItems.length === 0) {
			await supabase.from('cart').delete().eq('cart_id', cart.cart_id);
		}

		// Create chat for the order
		const { error: chatError } = await supabase.from('chat').insert({
			order_id: orderId,
			buyer_id: buyerId,
			seller_id: storeId
		});

		if (chatError) {
			console.error('Chat create error:', chatError.message);
		}

		console.log('Order placed successfully:', orderId);
		return { success: true, message: 'Order placed successfully!', orderId };
	}
};
