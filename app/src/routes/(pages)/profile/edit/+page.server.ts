import { fail } from '@sveltejs/kit';
import type { Actions } from './$types.js';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { supabase } = locals;
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { message: 'Not authenticated' });
		}

		const formData = await request.formData();

		const first_name = formData.get('firstname') as string;
		const last_name = formData.get('lastname') as string;
		const phone_number = formData.get('phone') as string;
		const display_name = `${first_name} ${last_name}`;
		let img_url = '';

		console.log('name: ', first_name, last_name);

		const { error: updateError } = await supabase
			.from('user')
			.update({ first_name, last_name, phone_number, display_name })
			.eq('user_id', user.id);

		if (updateError) {
			return fail(500, { message: updateError.message });
		}

		// Handle image upload
		const imgFile = formData.get('profile_image') as File;
		if (imgFile && imgFile.size > 0) {
			const fileExt = imgFile.name.split('.').pop();
			const filePath = `avatars/${user.id}/profile.${fileExt}`;
			// console.log(filePath);

			// Delete existing image(s) first
			const { data: existingFiles } = await supabase.storage
				.from('images')
				.list(`avatars/${user.id}/`);

			if (existingFiles && existingFiles.length > 0) {
				console.log('Deleting files');
				const filesToDelete = existingFiles.map((f) => `avatars/${user.id}/${f.name}`);
				await supabase.storage.from('images').remove(filesToDelete);
			}

			const { error: uploadError } = await supabase.storage
				.from('images')
				.upload(filePath, imgFile, { upsert: true, contentType: imgFile.type });

			if (uploadError) {
				console.error('Upload failed: ', uploadError);
				return fail(500, { message: 'Failed to upload image' });
			}

			const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);

			await supabase.from('user').update({ img_url: urlData.publicUrl }).eq('user_id', user.id);

			img_url = urlData.publicUrl;
		}

		// Fetch updated user data from database
		const { data: updatedUser, error: fetchError } = await supabase
			.from('user')
			.select('*')
			.eq('user_id', user.id)
			.single();

		if (fetchError) {
			console.error('Failed to fetch updated user:', fetchError);
			return fail(500, { message: 'Failed to fetch updated user data' });
		}

		return {
			success: true,
			updatedUser: {
				first_name,
				last_name,
				phone_number,
				img_url
			}
		};
	}
};
