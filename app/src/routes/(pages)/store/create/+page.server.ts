import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	createStore: async ({ request, locals: { supabase } }) => {
		const timeout = (ms: number) =>
			new Promise((_, reject) => setTimeout(() => reject(new Error('Database Timeout')), ms));
		const formData = await request.formData();

		// get text field data
		const name = formData.get('store_name') as string;
		const desc = formData.get('store_description') as string;
		const addr = formData.get('store_addr') as string;
		const lat = formData.get('store_lat') as string;
		const lng = formData.get('store_lng') as string;

		// parse schedule JSON
		const schedRaw = formData.get('sched') as string;
		const sched = JSON.parse(schedRaw);

		console.log('Creating Store in database');
		// create the new store to get store_id
		const dbPromise = await supabase
			.from('store')
			.insert({
				store_name: name,
				store_desc: desc,
				store_addr: addr,
				store_coords: `POINT(${lng} ${lat})`,
				store_hrs: sched
			})
			.select()
			.single();

		const result = await Promise.race([dbPromise, timeout(5000)]) as { data?: { store_id: string }; error?: { message: string } };

		if (result.error) {
			console.error('Database responded with error: ', result.error.message);

			return fail(500, { message: result.error.message });
		}

		const store = result.data;
		const storeId = store.store_id;
		// console.log(`Store created with ID: ${store.store_id}`);

		// get image file
		const imgFile = formData.get('store_img') as File;
		const fileExt = imgFile.name.split('.').pop();
		const filePath = `${storeId}/store_thumbnail.${fileExt}`;

		// console.log(`Image path is ${filePath}`);

		const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imgFile);

		if (uploadError) return fail(500, { error: 'Upload failed' });

		const {
			data: { publicUrl }
		} = supabase.storage.from('images').getPublicUrl(filePath);

		const {
			error: updateError
		} = await supabase
			.from('store')
			.update({ img_url: publicUrl })
			.eq('store_id', storeId)
			.select();

		if (updateError) {
			console.error('Update error:', updateError.message);
		}

		// if (!data || data.length === 0) {
		//     console.warn(`No store found with ID ${storeId}`);
		// } else {
		//     console.log('Image url updated:', data[0].img_url);
		// }

		throw redirect(303, '/store');
	}
};
