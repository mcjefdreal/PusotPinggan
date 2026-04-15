import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const query = url.searchParams.get('q');

	if (!query) {
		return {
			products: [],
			stores: []
		}; 
	}

	const { data: products, error: productError } = await supabase
		.from('product')
		.select('*')
		.ilike('name', `%${query}%`)
		.eq('available', true);

	if (productError) {
		console.error('Search error:', productError.message);
		throw error(500, 'Failed to search products');
	}

	const { data: stores, error: storeError } = await supabase
		.from('store')
		.select('*')
		.ilike('store_name', `%${query}%`);

	if (storeError) {
		console.error('Search error:', storeError.message);
		throw error(500, 'Failed to search store');
	}

	return {
		products: products || [],
		stores: stores || [],
		query
	};
};
