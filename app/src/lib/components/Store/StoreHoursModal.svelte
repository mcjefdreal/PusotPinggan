<script lang="ts">
	import { Modal } from 'flowbite-svelte';

	let { editModal = false, onClose, storeHrs = {}, isOpen } = $props();

	type DaySchedule = { open: string; close: string };
	type WeekSchedule = Record<string, DaySchedule>;

	let schedule: WeekSchedule = $derived({
		monday: storeHrs?.monday || { open: '00:00', close: '00:00' },
		tuesday: storeHrs?.tuesday || { open: '00:00', close: '00:00' },
		wednesday: storeHrs?.wednesday || { open: '00:00', close: '00:00' },
		thursday: storeHrs?.thursday || { open: '00:00', close: '00:00' },
		friday: storeHrs?.friday || { open: '00:00', close: '00:00' },
		saturday: storeHrs?.saturday || { open: '00:00', close: '00:00' },
		sunday: storeHrs?.sunday || { open: '00:00', close: '00:00' }
	});

	let today = $derived(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase());
</script>

<Modal bind:open={editModal} class="max-w-100" onclose={onClose}>
	<p class="text-pp-black text-xl font-medium">Store Hours</p>
	{#if isOpen}
		<p class="text-green-700">Open Now</p>
	{:else}
		<p class="text-red-500">Currently Closed</p>
	{/if}
	<div class="grid grid-cols-2">
		{#each Object.keys(schedule) as day (day)}
			<div class="capitalize {today === day ? 'font-bold' : 'font-medium'}">{day}</div>
			<div class={today === day ? 'font-bold' : 'font-normal'}>
				{schedule[day].open} - {schedule[day].close}
			</div>
		{/each}
	</div>
</Modal>
