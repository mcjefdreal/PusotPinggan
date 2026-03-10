import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.ts';

export const load: PageServerLoad = async ({ parent, locals: { supabase }, params }) => {
	const { user } = await parent();

	const { data: store, error: storeError } = await supabase
		.from('store')
		.select('*')
		.eq('store_name', params.name)
		.eq('store_id', params.id)
		.eq('owner', user.id)
		.single();

	if (storeError) {
		console.error('Fetch Error:', storeError.message);
		throw error(500, 'Failed to load stores');
	}

	const { data: products, error: productError } = await supabase
		.from('product')
		.select('*')
		.eq('store_id', params.id)

	return {
		store,
		storeName: params.name,
		storeId: params.id,
		products
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
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
				available: true,
			})
			.select()
			.single();

		const result = (await Promise.race([dbPromise, timeout(5000)])) as any;

		if (result.error) {
			console.error('Database responded with error: ', result.error.message);

			return fail(500, { success: false, message: result.error.message });
		}

		const product = result.data
		const productId = product.product_id

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

		const {
			data,
			error: updateError,
			count
		} = await supabase
			.from('product')
			.update({ img_url: publicUrl })
			.eq('product_id', productId)
			.select();

		if (updateError) {
			console.error('Update error:', updateError.message);
			return fail(500, {success: false, message: updateError.message})
		}

		return { success: true, message: 'Product added successfully' };
	}
};

