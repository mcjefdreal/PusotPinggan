import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
  const { user } = await parent();


  console.log(`Fetching stores for user: ${user.id}`);

  const { data: stores, error: dbError } = await supabase
    .from('store')
    .select('*')
    .eq('owner', user.id)
    .order('created_at', { ascending: false });

  if (dbError) {
    console.error('Fetch Error:', dbError.message);
    throw error(500, 'Failed to load stores');
  }

  return {
    stores
  };
};