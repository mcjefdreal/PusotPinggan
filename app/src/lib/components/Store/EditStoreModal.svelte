<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll, goto } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import { Label, Timepicker } from 'flowbite-svelte';

	let {
		editModal = false,
		onClose,
		onSubmit,
		supabase,
		storeId,
		storeName = '',
		storeDesc = '',
		storePic = '',
		storeAddr = '',
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

	let schedule = $state({
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
		action="?/editStore"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result }) => {
				isSubmitting = false;
				if (result.type === 'success') {
					await invalidateAll();
					const data = result.data as { success: boolean; message: string };
					onSubmit?.(data);
				}
			}
		}}
	>
		<input type="hidden" name="storeId" value={storeId} />

		<div class="flex flex-col items-center space-y-6">
			<button type="button" onclick={handleImageClick} class="focus:outline-none">
				<div class="h-30 w-30 aspect-square rounded-lg overflow-hidden">
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

				<label for="store_description" class="text-pp-gray mb-2.5 text-xs font-medium">Store description</label>
				<textarea
					id="store_description"
					name="store_description"
					rows="3"
					class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs"
					value={storeDesc}
					required
				></textarea>

				<label class="text-pp-gray mb-2.5 text-xs font-medium">Store hours</label>
				<input type="hidden" name="sched" value={JSON.stringify(schedule)} />
				{#each Object.keys(schedule) as day}
					<div class="grid grid-cols-[80px_1fr] items-center gap-2 pb-2">
						<Label class="capitalize text-xs">{day}</Label>
						<Timepicker
							type="range"
							onselect={(e) => handleRangeChange(day, e.time, e.endTime)}
							divClass="w-full max-w-full shadow-none"
							class="w-full"
							value={schedule[day].open}
							endValue={schedule[day].close}
						/>
					</div>
				{/each}

				<label for="store_addr" class="text-pp-gray mb-2.5 text-xs font-medium">Location</label>
				<input
					type="text"
					id="store_addr"
					name="store_addr"
					class="border-pp-gray text-pp-black w-full rounded-md border px-3 py-2.5 text-xs bg-gray-100"
					value={storeAddr}
					readonly
				/>
			</div>
		</div>
		<div class="flex flex-row mt-4">
			<button
				class="bg-pp-pink text-pp-white ml-auto flex h-10 w-40 items-center justify-center rounded-lg text-auto"
				type="submit"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Saving...' : 'Save Changes'}
			</button>
		</div>
	</form>
	<form
		method="POST"
		action="?/deleteStore"
		use:enhance={() => {
			isDeleting = true;
			return async ({ result }) => {
				isDeleting = false;
				if (result.type === 'redirect') {
					await goto('/store');
				} else if (result.type === 'success') {
					await invalidateAll();
					await goto('/store');
				}
			}
		}}
	>
		<input type="hidden" name="storeId" value={storeId} />
		<div class="flex justify-center mt-4">
			<button
				class="bg-red-600 text-pp-white flex h-10 w-40 items-center justify-center rounded-lg text-auto"
				type="submit"
				disabled={isDeleting}
			>
				{isDeleting ? 'Deleting...' : 'Delete Store'}
			</button>
		</div>
	</form>
</Modal>
