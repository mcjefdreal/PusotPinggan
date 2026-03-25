import { json } from '@sveltejs/kit';
import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const lat = url.searchParams.get('lat');
	const lng = url.searchParams.get('lng');

	if (!lat || !lng) {
		return json({ error: 'Missing coordinates' }, { status: 400 });
	}

	try {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${PUBLIC_GOOGLE_MAPS_API_KEY}`
		);

		if (!response.ok) throw new Error('Google API responded with an error');

		const data = await response.json();

		if (data.status === 'OK' && data.results.length > 0) {
			const components = data.results[1].address_components;

			const getComponent = (types: string[]) => {
				const found = components.find((c: { types: string[] }) =>
					types.some((t) => c.types.includes(t))
				);
				return found?.long_name || '';
			};

			const getComponentShort = (types: string[]) => {
				const found = components.find((c: { types: string[] }) =>
					types.some((t) => c.types.includes(t))
				);
				return found?.short_name || '';
			};

			// console.log("Full response: ", JSON.stringify(data, null, 2));

			const bldg = getComponentShort(['premise']);
			const streetNumber = getComponent(['street_number']);
			const street = getComponent(['route']);
			const brgy = getComponent([
				'sublocality',
				'administrative_area_level_3',
				'sublocality_level_1'
			]);
			const city = getComponent(['locality', 'administrative_area_level_2']);
			const province = getComponent(['administrative_area_level_1']);
			const country = getComponent(['country']);

			const full = [
				bldg,
				streetNumber && street ? `${streetNumber} ${street}` : street || streetNumber,
				brgy,
				city,
				province,
				country
			]
				.filter(Boolean)
				.join(', ');

			const firstHalf = [
				bldg,
				streetNumber && street ? `${streetNumber} ${street}` : street || streetNumber
			]
				.filter(Boolean)
				.join(', ');

			const secondHalf = [brgy, city].filter(Boolean).join(', ');

			return json({
				bldg,
				streetNumber,
				street,
				brgy,
				city,
				province,
				country,
				full,
				firstHalf,
				secondHalf
			});
		}

		return json({ error: 'Address not found' }, { status: 404 });
	} catch (error) {
		console.error('Server Geocoding Error:', error);
		return json({ error: 'Failed to process location' }, { status: 500 });
	}
};
