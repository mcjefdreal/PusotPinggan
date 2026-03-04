<script lang="ts">
	import logo from '$lib/icons/logomark.svg';

	import { Search, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import {
		SearchOutline,
		AdjustmentsHorizontalOutline,
		MapPinAltOutline,
		CogSolid
	} from 'flowbite-svelte-icons';

	const items = [
		{
			label: 'Filter 1'
		},
		{
			label: 'Filter 2'
		},
		{
			label: 'Filter 3'
		},
		{
			label: 'Filter 4'
		},
		{
			label: 'Filter 5'
		}
	];

	let selectCategory = $state('Filters');

	let { supabase, session } = $props();

	let user = $derived(session.user);

	let locationText = $state('Finding location...');
	let firstHalf = $state('');
	let secondHalf = $state('');
	let errorMessage = $state('');

	async function saveLocationToDatabase(latitude: number, longitude: number) {
		try {
			if (!user) {
				errorMessage = 'User not authenticated.';
				locationText = 'Location unavailable';
				return;
			}

			const { error: dbError } = await supabase
				.from('user')
				.update({ user_coords: `POINT(${longitude} ${latitude})` })
				.eq('user_id', user.id)
				.select();

			if (dbError) throw dbError;

			const response = await fetch(`api/geocode?lat=${latitude}&lng=${longitude}`);
			const data = await response.json();

			if (data.firstHalf) {
				firstHalf = data.firstHalf;
				secondHalf = data.secondHalf || '';

				// Save to localStorage for caching
				localStorage.setItem(
					'userLocation',
					JSON.stringify({
						firstHalf: data.firstHalf,
						secondHalf: data.secondHalf || ''
					})
				);
			}
		} catch (error: any) {
			console.error('Error saving location:', error.message);
			errorMessage = 'Failed to save location.';
			locationText = 'Location unavailable';
		}
	}

	function requestLocation() {
		firstHalf = '';
		secondHalf = '';
		locationText = 'Finding location...';
		errorMessage = '';
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					saveLocationToDatabase(position.coords.latitude, position.coords.longitude);
				},
				(error) => {
					console.error('Geolocation error:', error.message);
					errorMessage = 'Location permission denied.';
					locationText = 'Location unavailable';
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0
				}
			);
		} else {
			errorMessage = 'Geolocation is not supported.';
			locationText = 'Location unavailable';
		}
	}

	$effect(() => {
		if (!user) {
			locationText = 'Not logged in';
			return;
		}

		// Check localStorage first
		const cached = localStorage.getItem('userLocation');
		if (cached) {
			const { firstHalf: cachedFirst, secondHalf: cachedSecond } = JSON.parse(cached);
			firstHalf = cachedFirst;
			secondHalf = cachedSecond || '';
		} else {
			requestLocation();
		}
	});
</script>

<nav class="from-pp-pink to-pp-light-pink sticky start-0 top-0 z-20 w-full bg-linear-to-t p-2 pb-4">
	<div
		class="flex max-w-screen-xl items-center p-4"
		onclick={requestLocation}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && requestLocation()}
	>
		<MapPinAltOutline class="text-pp-white h-8 w-8 shrink-0" />
		<div class="items-left ml-4 flex flex-col">
			{#if errorMessage}
				<p class="text-pp-white font-bold">{errorMessage}</p>
			{:else}
				<p class="text-pp-white font-bold">{firstHalf || locationText}</p>
				{#if secondHalf}
					<p class="text-pp-white">{secondHalf}</p>
				{/if}
			{/if}
		</div>
		<CogSolid class="text-pp-white ml-auto h-8 w-8 shrink-0" />
	</div>

	<form class="flex max-w-screen-xl px-4">
		<div class="relative w-full">
			<div class="absolute inset-y-0 start-0 flex items-center ps-3">
				<SearchOutline class="text-pp-gray ms-0.5 h-6 w-6" />
			</div>
			<input
				type="search"
				id="search"
				class="bg-pp-white border-pp-gray placeholder:text-body placeholder:text-pp-gray w-full rounded-lg border p-3 ps-10 text-sm"
				placeholder="Search for food"
			/>
		</div>

		<div class="bg-pp-white border-pp-gray relative ml-4 rounded-lg border px-8">
			<Button class="text-pp-gray flex">
				{selectCategory}
				<AdjustmentsHorizontalOutline class="ms-2.5 h-6 w-6" />
			</Button>
			<Dropdown simple class="w-40">
				{#each items as { label } (label)}
					<DropdownItem
						onclick={() => {
							selectCategory = label;
						}}
						class={selectCategory === label ? 'underline' : ''}
					>
						{label}
					</DropdownItem>
				{/each}
			</Dropdown>
		</div>
	</form>
</nav>
