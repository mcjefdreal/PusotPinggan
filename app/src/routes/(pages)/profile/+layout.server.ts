import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, locals: { supabase } }: { parent: () => Promise<{ user: import('@supabase/supabase-js').User | null }>; locals: App.Locals }) => {
	const { user } = await parent();

	if (!user) {
		throw redirect(303, '/');
	}

	const { data: pub_user } = await supabase
		.from('user')
		.select('*')
		.eq('user_id', user.id)
		.single();

	return { pub_user };
};
