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

	return { session, user };
};