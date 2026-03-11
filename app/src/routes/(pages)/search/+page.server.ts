import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, url, locals: { supabase } }) => {
	const query = url.searchParams.get('q');

	if (!query) {
		return { products: [] };
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

	return {
		products: products || [],
		query
	};
};