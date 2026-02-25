import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
  const { user } = await parent();

  const { data: stores, error: storeError } = await supabase
    .from('store')
    .select('*')
    .eq('owner', user.id)
    .order('created_at', { ascending: false });

  if (storeError) {
    console.error('Fetch Error:', storeError.message);
    throw error(500, 'Failed to load stores');
  }

  const { data: pub_user, error: userError } = await supabase
    .from('user')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (userError) {
    console.error('Fetch Error:', userError.message);
    throw error(500, 'Failed to load user');
  }

  return {
    stores, pub_user
  };
};