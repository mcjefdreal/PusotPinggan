import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent, locals: { supabase } }) => {
	const { session, user } = await parent();

	if (!session) {
		throw redirect(303, '/');
	}

	if (!user) {
		throw error(401, 'User not found');
	}

	const { data: stores, error: storeError } = await supabase
		.from('store')
		.select('store_id')
		.eq('owner', user.id);

	if(storeError) throw error(500, storeError.message);

	const storeIds = stores?.map((s) => s.store_id) || [];

	const { data: count } = await supabase.rpc('get_unread_count', {
		p_buyer_id: user.id,
		p_store_ids: storeIds
	});

	const unreadCount = count || 0;

	return { session, user, unreadCount };
};