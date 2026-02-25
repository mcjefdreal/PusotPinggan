import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';

export const load: PageServerLoad = async ({ parent, locals: { supabase }, params }) => {
  const { user } = await parent();

  const { data: store, error: storeError } = await supabase
    .from('store')
    .select('*')
    .eq('store_name', params.name)
    .eq('store_id', params.id)
    .eq('owner', user.id)
    .single();

  if (storeError) {
    console.error('Fetch Error:', storeError.message);
    throw error(500, 'Failed to load stores');
  }

  console.log(`got store ${store.store_name}`);

  return {
    store,
    storeName: params.name,
    storeId: params.id
  };
};