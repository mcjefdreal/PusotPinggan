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


	const { data: stores, error: storesError } = await supabase.rpc('get_stores_with_distances_from_search', {
		p_user_id: userId,
		search_term: `%${query}%`
	});

	if (storesError) throw error(500, 'Failed to search for stores.');

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
		stores: stores || [],
		query
	};
};
