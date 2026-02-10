<script>
	import logo from '../../icons/logomark.svg';

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
</script>

<nav class="from-pp-pink to-pp-light-pink fixed start-0 top-0 z-20 w-full bg-linear-to-t p-2 pb-4">
	<div class="flex max-w-screen-xl items-center p-4">
		<MapPinAltOutline class="text-pp-white h-8 w-8 shrink-0" />
		<div class="items-left ml-4 flex flex-col">
			<p class="text-pp-white font-bold">P. Velazquez St.</p>
			<p class="text-pp-white">Diliman, Quezon City</p>
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
