import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const { user } = await parent();

	if (!user) {
		throw error(401, 'Unauthorized');
	}
 
	const userId = user.id;

	// Fetch all stores
	const { data: stores, error: storesError } = await supabase.from('store').select('*');

	if (storesError) throw error(500, storesError.message);

	// Calculate distance for each store
	const storesWithDistance = await Promise.all(
		stores.map(async (store) => {
			const { data: distance } = await supabase.rpc('get_store_distance', {
				p_user_id: userId,
				p_store_id: store.store_id
			});
			return { ...store, distance_meters: distance || 0 };
		})
	);

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
		stores: storesWithDistance,
		products
	};
};
