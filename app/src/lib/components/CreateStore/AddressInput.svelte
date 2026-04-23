<script lang="ts">
	import { onMount } from 'svelte';
	import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

	let {
		initialAddress = '',
		initialLat = '14.648937907831831',
		initialLng = '121.06869653914266'
	} = $props();

	let selected = $state({ address: initialAddress, lat: initialLat, lng: initialLng });
	let mapElement: HTMLElement | undefined = $state();
	let inputElement: HTMLInputElement | undefined = $state();

	const initialCenter = $derived(
		initialLat && initialLng
			? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
			: { lat: 0, lng: 0 }
	);

	onMount(async () => {
		setOptions({ key: PUBLIC_GOOGLE_MAPS_API_KEY });

		const [{ Map }, { Autocomplete }, { AdvancedMarkerElement }, { Geocoder }] = await Promise.all([
			importLibrary('maps'),
			importLibrary('places'),
			importLibrary('marker'),
			importLibrary('geocoding')
		]);

		const map = new Map(mapElement, {
			center: initialCenter,
			zoom: initialLat && initialLng ? 15 : 2,
			mapId: 'DEMO_MAP_ID'
		});

		const marker = new AdvancedMarkerElement({
			map,
			position: initialCenter
		});

		if (initialAddress && inputElement) {
			inputElement.value = initialAddress;
		}

		const autocomplete = new Autocomplete(inputElement, {
			fields: ['formatted_address', 'geometry']
		});
		const geocoder = new Geocoder();

		map.addListener(
			'click',
			async (event: { latLng: { lat: () => number; lng: () => number } }) => {
				const latLng = event.latLng;

				marker.position = latLng;

				const response = await geocoder.geocode({ location: latLng });
				const address = response.results[0]?.formatted_address || 'Custom Location';

				selected = {
					address: address,
					lat: latLng.lat().toString(),
					lng: latLng.lng().toString()
				};

				if (inputElement) {
					inputElement.value = address;
				}
			}
		);

		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			if (!place || !place.geometry || !place.geometry.location) return;

			selected = {
				address: place.formatted_address || '',
				lat: place.geometry.location.lat().toString(),
				lng: place.geometry.location.lng().toString()
			};

			map.setCenter(place.geometry.location);
			map.setZoom(17);
			marker.position = place.geometry.location;
		});
	});
</script>

<div class="address-picker">
	<input
		bind:this={inputElement}
		type="text"
		placeholder="Search address..."
		class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs text-pp-black"
		required
	/>

	<div bind:this={mapElement} class="my-4 h-[300px] w-full rounded bg-[#ddd]"></div>

	<input type="hidden" name="store_addr" value={selected.address} />
	<input type="hidden" name="store_lat" value={selected.lat} />
	<input type="hidden" name="store_lng" value={selected.lng} />
</div>
