import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.ts';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const { data: store, error: storeError } = await supabase
		.from('store')
		.select('*')
		.eq('store_name', params.storename)
		.eq('store_id', params.id)
		.single();

	if (storeError) {
		console.error('Fetch Error:', storeError.message);
		throw error(500, 'Failed to load stores');
	}

	let storeLat = '';
	let storeLng = '';

	if (store.store_coords) {
		const { data: coords } = await supabase.rpc('get_geo_coords', {
			p_store_id: store.store_id
		});
		if (coords) {
			storeLat = coords[0].lat?.toString() || '';
			storeLng = coords[0].lng?.toString() || '';
		}
	}

	const { data: products } = await supabase.from('product').select('*').eq('store_id', params.id);

	return {
		store,
		storeName: params.storename,
		storeId: params.id,
		storeLat,
		storeLng,
		products
	};
};

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

export const actions: Actions = {
	'add-to-cart': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const productId = formData.get('productId') as string;
		const storeId = formData.get('storeId') as string;
		const quantity = parseInt(formData.get('quantity') as string) || 1;

		if (!productId || !storeId) {
			return fail(400, { success: false, message: 'Missing required fields' });
		}

		const { data: { user }, error: userError } = await supabase.auth.getUser();
		if (userError || !user) {
			return fail(401, { success: false, message: 'Unauthorized' });
		}

		const buyerId = await getBuyerId(supabase, user.id);
		if (!buyerId) {
			return fail(404, { success: false, message: 'Buyer not found' });
		}

		// Get or create cart
		let { data: cart, error: findCartError } = await supabase
			.from('cart')
			.select('cart_id')
			.eq('buyer_id', buyerId)
			.single();

		if (findCartError && findCartError.code !== 'PGRST116') {
			return fail(500, { success: false, message: findCartError.message });
		}

		let cartId: string;

		if (!cart) {
			const { data: newCart, error: createCartError } = await supabase
				.from('cart')
				.insert({ buyer_id: buyerId })
				.select('cart_id')
				.single();

			if (createCartError) {
				return fail(500, { success: false, message: createCartError.message });
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
			return fail(500, { success: false, message: findItemError.message });
		}

		if (existingItem) {
			const { error: updateError } = await supabase
				.from('cart_item')
				.update({ quantity: existingItem.quantity + quantity })
				.eq('id', existingItem.id);

			if (updateError) {
				return fail(500, { success: false, message: updateError.message });
			}
		} else {
			const { error: insertItemError } = await supabase.from('cart_item').insert({
				cart_id: cartId,
				product_id: productId,
				quantity
			});

			if (insertItemError) {
				return fail(500, { success: false, message: insertItemError.message });
			}
		}

		return { success: true, message: 'Added to cart' };
	},

	'add-product': async ({ request, locals: { supabase } }) => {
		const timeout = (ms: number) =>
			new Promise((_, reject) => setTimeout(() => reject(new Error('Database Timeout')), ms));

		const formData = await request.formData();

		const name = formData.get('product_name') as string;
		const price = parseFloat(formData.get('product_price') as string);
		const description = formData.get('product_description') as string;
		const quantity = formData.get('product_quantity') as string;
		const storeId = formData.get('storeId') as string;

		if (!name || !price || !description || !storeId) {
			return fail(400, { success: false, message: 'Missing required fields' });
		}

		const dbPromise = await supabase
			.from('product')
			.insert({
				store_id: storeId,
				name: name,
				description: description,
				price: price,
				quantity: quantity,
				available: true
			})
			.select()
			.single();

		const result = (await Promise.race([dbPromise, timeout(5000)])) as {
			data?: { product_id: string };
			error?: { message: string };
		};

		if (result.error) {
			console.error('Database responded with error: ', result.error.message);

			return fail(500, { success: false, message: result.error.message });
		}

		const product = result.data;
		if (!product) {
			return fail(500, { success: false, message: 'Failed to create product' });
		}
		const productId = product.product_id;

		// get image file
		const imgFile = formData.get('product_img') as File;
		const fileExt = imgFile.name.split('.').pop();
		const filePath = `${storeId}/${productId}.${fileExt}`;

		// console.log(`Image path is ${filePath}`);

		const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imgFile);

		if (uploadError) return fail(500, { success: false, message: 'Image upload failed' });

		const {
			data: { publicUrl }
		} = supabase.storage.from('images').getPublicUrl(filePath);

		const { error: updateError } = await supabase
			.from('product')
			.update({ img_url: publicUrl })
			.eq('product_id', productId)
			.select();

		if (updateError) {
			console.error('Update error:', updateError.message);
			return fail(500, { success: false, message: updateError.message });
		}

		return { success: true, message: 'Product added successfully' };
	},

	'edit-product': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const name = formData.get('product_name') as string;
		const price = parseFloat(formData.get('product_price') as string);
		const description = formData.get('product_description') as string;
		const quantity = parseInt(formData.get('product_quantity') as string);
		const storeId = formData.get('storeId') as string;
		const productId = formData.get('productId') as string;

		if (!productId || !storeId || !name || !price || !description || isNaN(quantity)) {
			return fail(400, { success: false, message: 'Missing required fields' });
		}

		await supabase
			.from('product')
			.update({ name: name, description: description, price: price, quantity: quantity })
			.eq('product_id', productId);

		// Handle optional image update
		const imgFile = formData.get('product_img') as File;
		if (imgFile && imgFile.size > 0) {
			const fileExt = imgFile.name.split('.').pop();
			const filePath = `${storeId}/${productId}_${Date.now()}.${fileExt}`;

			// Delete existing images for this product
			const { data: existingFiles } = await supabase.storage.from('images').list(`${storeId}/`);

			if (existingFiles && existingFiles.length > 0) {
				const filesToDelete = existingFiles
					.filter((f) => f.name.startsWith(`${productId}_`))
					.map((f) => `${storeId}/${f.name}`);
				if (filesToDelete.length > 0) {
					await supabase.storage.from('images').remove(filesToDelete);
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			}

			// Upload new image
			const { error: uploadError } = await supabase.storage
				.from('images')
				.upload(filePath, imgFile, { upsert: true, contentType: imgFile.type });

			if (uploadError) {
				return fail(500, { success: false, message: 'Image upload failed' });
			}

			const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);

			const { error: imgUpdateError } = await supabase
				.from('product')
				.update({ img_url: urlData.publicUrl })
				.eq('product_id', productId);

			if (imgUpdateError) {
				return fail(500, { success: false, message: 'Image URL update failed' });
			}
		}

		return { success: true, message: 'Product edited successfully' };
	},

	'delete-product': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const productId = formData.get('productId') as string;

		const { error: deleteError } = await supabase
			.from('product')
			.delete()
			.eq('product_id', productId);

		if (deleteError) {
			return fail(500, { success: false, message: 'Remove product failed' });
		}

		return { success: true, message: 'Product removed successfully' };
	},

	'edit-store': async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();

		const storeId = formData.get('storeId') as string;
		const name = formData.get('store_name') as string;
		const desc = formData.get('store_description') as string;
		const addr = formData.get('store_addr') as string;
		const lat = formData.get('store_lat') as string;
		const lng = formData.get('store_lng') as string;

		const oldName = params.storename;

		const schedRaw = formData.get('sched') as string;
		let sched = {};
		try {
			sched = JSON.parse(schedRaw);
		} catch (e) {
			console.error('Failed to parse schedule:', e);
		}

		if (!storeId || !name || !desc) {
			return fail(400, { success: false, message: 'Missing required fields' });
		}

		let storeCoords = undefined;
		if (lat && lng) {
			storeCoords = `POINT(${lng} ${lat})`;
		}

		const updateData: Record<string, unknown> = {
			store_name: name,
			store_desc: desc,
			store_addr: addr,
			store_hrs: sched
		};

		if (storeCoords) {
			updateData.store_coords = storeCoords;
		}

		const { error: updateError } = await supabase
			.from('store')
			.update(updateData)
			.eq('store_id', storeId);

		if (updateError) {
			console.error('Update error:', updateError.message);
			return fail(500, { success: false, message: updateError.message });
		}

		const imgFile = formData.get('store_img') as File;
		if (imgFile && imgFile.size > 0) {
			const fileExt = imgFile.name.split('.').pop();
			const filePath = `${storeId}/store_thumbnail_${Date.now()}.${fileExt}`;

			const { data: existingFiles } = await supabase.storage.from('images').list(`${storeId}/`);

			if (existingFiles && existingFiles.length > 0) {
				const filesToDelete = existingFiles
					.filter((f) => f.name.includes('store_thumbnail'))
					.map((f) => `${storeId}/${f.name}`);
				if (filesToDelete.length > 0) {
					await supabase.storage.from('images').remove(filesToDelete);
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			}

			const { error: uploadError } = await supabase.storage
				.from('images')
				.upload(filePath, imgFile, { upsert: true, contentType: imgFile.type });

			if (uploadError) {
				return fail(500, { success: false, message: 'Image upload failed' });
			}

			const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);

			const { error: imgUpdateError } = await supabase
				.from('store')
				.update({ img_url: urlData.publicUrl })
				.eq('store_id', storeId);

			if (imgUpdateError) {
				return fail(500, { success: false, message: 'Image URL update failed' });
			}
		}

		const nameChanged = oldName !== name;
		if (nameChanged) {
			throw redirect(303, `/store/${name}/${storeId}`);
		}

		return { success: true, message: 'Store updated successfully' };
	},

	'delete-store': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const storeId = formData.get('storeId') as string;

		if (!storeId) {
			return fail(400, { success: false, message: 'Missing store ID' });
		}

		const { data: products, error: productsError } = await supabase
			.from('product')
			.select('product_id')
			.eq('store_id', storeId);

		if (productsError) {
			return fail(500, { success: false, message: 'Failed to fetch products' });
		}

		if (products && products.length > 0) {
			const { error: deleteProductsError } = await supabase
				.from('product')
				.delete()
				.eq('store_id', storeId);

			if (deleteProductsError) {
				return fail(500, { success: false, message: 'Failed to delete products' });
			}
		}

		const { error: deleteStoreError } = await supabase
			.from('store')
			.delete()
			.eq('store_id', storeId);

		if (deleteStoreError) {
			return fail(500, { success: false, message: 'Delete store failed' });
		}

		throw redirect(303, '/store');
	}
};
