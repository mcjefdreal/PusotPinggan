// src/routes/api/geocode/+server.ts
import { json } from '@sveltejs/kit';
import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  // Extract latitude and longitude from the query parameters
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
      const components = data.results[0].address_components;
      
      let city = '';
      let country = '';

      const cityObj = components.find((c: any) => 
        c.types.includes('locality') || c.types.includes('administrative_area_level_2')
      );
      if (cityObj) city = cityObj.long_name;

      const countryObj = components.find((c: any) => c.types.includes('country'));
      if (countryObj) country = countryObj.short_name;

      return json({ 
        city, 
        country, 
        fallback: data.results[0].formatted_address 
      });
    }

    return json({ error: 'Address not found' }, { status: 404 });

  } catch (error) {
    console.error('Server Geocoding Error:', error);
    return json({ error: 'Failed to process location' }, { status: 500 });
  }
};