import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const { user } = await parent();

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const userId = user.id;

	const { data: stores, error: storesError } = await supabase.rpc('get_stores_with_distances', {
		p_user_id: userId
	});

	if (storesError) throw error(500, storesError.message);

	// Fetch products where quantity > 0, joined with store info
	const { data: products, error: productsError } = await supabase
		.from('product')
		.select(
			`
      *,
      store:store_id (
        store_id,
        store_name,
        store_addr
      )
    `
		)
		.gt('quantity', 0);

	if (productsError) throw error(500, productsError.message);

	return {
		stores,
		products
	};
};
