import { redirect } from '@sveltejs/kit';

export const load = async ({
	parent
}: {
	parent: () => Promise<{
		session: import('@supabase/supabase-js').Session | null;
		user: import('@supabase/supabase-js').User | null;
	}>;
}) => {
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
