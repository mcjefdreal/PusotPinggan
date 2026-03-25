import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { session, user } = await parent();

	// If no session cookie exists, send them back to login
	if (!session) {
		throw redirect(303, '/');
	}

	return {
		session,
		user
	};
};
