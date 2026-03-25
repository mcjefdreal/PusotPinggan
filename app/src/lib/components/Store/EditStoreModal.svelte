<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll, goto } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import { Label, Timepicker } from 'flowbite-svelte';
	import AddressInput from '$lib/components/CreateStore/AddressInput.svelte';

	let {
		editModal = false,
		onClose,
		onSubmit,
		storeId,
		storeName = '',
		storeDesc = '',
		storePic = '',
		storeAddr = '',
		storeLat = '',
		storeLng = '',
		storeHrs = {}
	} = $props();

	let isSubmitting = $state(false);
	let isDeleting = $state(false);
	let selectedFile = $state<File | null>(null);
	let fileInput: HTMLInputElement;

	let displayImage = $derived.by(() => {
		if (selectedFile) {
			return URL.createObjectURL(selectedFile);
		}
		return storePic;
	});

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

	function handleRangeChange(day: string, start: string, end: string) {
		schedule[day] = { open: start, close: end };
	}

	function handleImageClick() {
		fileInput?.click();
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			selectedFile = file;
		}
	}
</script>

<Modal bind:open={editModal} class="max-w-100" onclose={onClose}>
	<form
		method="POST"
		enctype="multipart/form-data"
		action="?/edit-store"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					onClose?.();
					await invalidateAll();
					await goto(result.location);
				} else if (result.type === 'success') {
					await invalidateAll();
					const data = result.data as { success: boolean; message: string };
					onSubmit?.(data);
				}
			};
		}}
	>
		<input type="hidden" name="storeId" value={storeId} />

		<div class="flex flex-col items-center space-y-6">
			<button type="button" onclick={handleImageClick} class="focus:outline-none">
				<div class="aspect-square h-30 w-30 overflow-hidden rounded-lg">
					<img class="h-full w-full rounded-lg object-cover" src={displayImage} alt={storeName} />
				</div>
			</button>
			<input
				type="file"
				bind:this={fileInput}
				onchange={handleFileChange}
				accept="image/*"
				name="store_img"
				class="hidden"
			/>

			<div class="w-full">
				<label for="store_name" class="text-pp-gray mb-2.5 text-xs font-medium">Store name</label>
				<input
					type="text"
					id="store_name"
					name="store_name"
					class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
					value={storeName}
					required
				/>

				<label for="store_description" class="text-pp-gray mb-2.5 text-xs font-medium"
					>Store description</label
				>
				<textarea
					id="store_description"
					name="store_description"
					rows="3"
					class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
					value={storeDesc}
					required
				></textarea>

				<span class="text-pp-gray mb-2.5 text-xs font-medium">Store hours</span>
				<input type="hidden" name="sched" value={JSON.stringify(schedule)} />
				{#each Object.keys(schedule) as day (day)}
					<div class="grid grid-cols-[80px_1fr] items-center gap-2 pb-2">
						<Label class="text-xs capitalize">{day}</Label>
						<Timepicker
							type="range"
							onselect={(e: { time: string; endTime: string }) =>
								handleRangeChange(day, e.time, e.endTime)}
							divClass="w-full max-w-full shadow-none"
							value={schedule[day].open}
							endValue={schedule[day].close}
						/>
					</div>
				{/each}

				<label for="store_addr" class="text-pp-gray mb-2.5 text-xs font-medium">Location</label>
				<AddressInput initialAddress={storeAddr} initialLat={storeLat} initialLng={storeLng} />
			</div>
		</div>
		<div class="mt-4 flex flex-row">
			<button
				class="bg-pp-pink text-pp-white text-auto ml-auto flex h-10 w-40 items-center justify-center rounded-lg"
				type="submit"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Saving...' : 'Save Changes'}
			</button>
		</div>
	</form>
	<form
		method="POST"
		action="?/delete-store"
		use:enhance={() => {
			isDeleting = true;
			return async ({ result }) => {
				isDeleting = false;
				if (result.type === 'redirect') {
					await goto(result.location);
					await invalidateAll();
				}
			};
		}}
	>
		<input type="hidden" name="storeId" value={storeId} />
		<div class="mt-4 flex justify-center">
			<button
				class="text-pp-white text-auto flex h-10 w-40 items-center justify-center rounded-lg bg-red-600"
				type="submit"
				disabled={isDeleting}
				data-testid="delete-store"
			>
				{isDeleting ? 'Deleting...' : 'Delete Store'}
			</button>
		</div>
	</form>
</Modal>
