import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const { user } = await parent();

	const { data: pub_user, error: userError } = await supabase
		.from('user')
		.select('*')
		.eq('user_id', user.id)
		.single();

	return { pub_user };
};