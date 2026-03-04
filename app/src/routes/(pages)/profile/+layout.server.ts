import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	// If no session cookie exists, send them back to login
	if (!session) {
		throw redirect(303, '/');
	}

	return {
		user: session.user
	};
};
