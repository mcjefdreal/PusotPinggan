import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const buyerId = await getBuyerId(supabase, user.id);
	if (!buyerId) {
		return json({ cartItems: [] });
	}

	// Get cart
	const { data: cart, error: cartError } = await supabase
		.from('cart')
		.select('cart_id')
		.eq('buyer_id', buyerId)
		.single();

	if (cartError && cartError.code !== 'PGRST116') {
		return json({ error: cartError.message }, { status: 500 });
	}

	if (!cart) {
		return json({ cartItems: [] });
	}

	// Get cart items
	const { data: cartItems, error } = await supabase
		.from('cart_item')
		.select('*, product:product_id(*, store:store_id(*))')
		.eq('cart_id', cart.cart_id);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ cartItems: cartItems as CartItemWithProduct[] });
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
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

	const formData = await request.formData();
	const productId = formData.get('productId') as string;
	const storeId = formData.get('storeId') as string;
	const quantity = parseInt(formData.get('quantity') as string) || 1;

	if (!productId || !storeId) {
		return json({ error: 'Missing productId or storeId' }, { status: 400 });
	}

	// Get or create cart
	const { data: cart, error: findCartError } = await supabase
		.from('cart')
		.select('cart_id')
		.eq('buyer_id', buyerId)
		.single();

	if (findCartError && findCartError.code !== 'PGRST116') {
		return json({ error: findCartError.message }, { status: 500 });
	}

	let cartId: string;

	if (!cart) {
		// Create new cart
		const { data: newCart, error: createCartError } = await supabase
			.from('cart')
			.insert({ buyer_id: buyerId })
			.select('cart_id')
			.single();

		if (createCartError) {
			return json({ error: createCartError.message }, { status: 500 });
		}

		cartId = newCart.cart_id;
	} else {
		cartId = cart.cart_id;
	}

	// Check if product already in cart_item
	const { data: existingItem, error: findItemError } = await supabase
		.from('cart_item')
		.select('id, quantity')
		.eq('cart_id', cartId)
		.eq('product_id', productId)
		.single();

	if (findItemError && findItemError.code !== 'PGRST116') {
		return json({ error: findItemError.message }, { status: 500 });
	}

	if (existingItem) {
		// Update quantity
		const { error: updateError } = await supabase
			.from('cart_item')
			.update({ quantity: existingItem.quantity + quantity })
			.eq('id', existingItem.id);

		if (updateError) {
			return json({ error: updateError.message }, { status: 500 });
		}
	} else {
		// Add new item
		const { error: insertItemError } = await supabase.from('cart_item').insert({
			cart_id: cartId,
			product_id: productId,
			quantity
		});

		if (insertItemError) {
			return json({ error: insertItemError.message }, { status: 500 });
		}
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ url, locals: { supabase } }) => {
	const itemId = url.searchParams.get('itemId');

	if (!itemId) {
		return json({ error: 'Missing itemId' }, { status: 400 });
	}

	const { error } = await supabase.from('cart_item').delete().eq('id', itemId);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ success: true });
};
