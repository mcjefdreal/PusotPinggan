import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, parent, locals: { supabase } }) => {
	const { user } = await parent();

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const userId = user.id;
	const query = url.searchParams.get('q');

	if (!query) {
		return {
			products: [],
			stores: []
		};
	}

	// fetch stores
	const { data: stores, error: storeError } = await supabase
		.from('store')
		.select('*')
		.ilike('store_name', `%${query}%`);

	if (storeError) throw error(500, 'Failed to search for stores.');

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
		.ilike('name', `%${query}%`)
		.gt('quantity', 0);

	if (productsError) throw error(500, 'Failed to search for products.');

	return {
		products: products || [],
		stores: storesWithDistance || [],
		query
	};
};
