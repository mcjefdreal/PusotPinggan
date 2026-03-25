<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { Label, Timepicker } from 'flowbite-svelte';
	import AddressInput from '$lib/components/CreateStore/AddressInput.svelte';

	let schedule = {
		monday: { open: '00:00', close: '00:00' },
		tuesday: { open: '00:00', close: '00:00' },
		wednesday: { open: '00:00', close: '00:00' },
		thursday: { open: '00:00', close: '00:00' },
		friday: { open: '00:00', close: '00:00' },
		saturday: { open: '00:00', close: '00:00' },
		sunday: { open: '00:00', close: '00:00' }
	};

	function handleRangeChange(day, start, end) {
		schedule[day] = { open: start, close: end };
	}

	let submitting = false;
</script>

<div class="min-h-screen w-full items-center justify-center">
	<div class="m-5">
		<form
			method="POST"
			enctype="multipart/form-data"
			action="?/createStore"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
			class="max-w-md w-full"
		>
			<div class="mb-6 grid gap-2 px-3">
				<div>
					<label for="store_img" class="text-pp-gray mb-2.5 text-xs font-medium">Store image</label>
					<input type="file" id="store_img" name="store_img" accept="image/*" required />
				</div>

				<div>
					<label for="store_name" class="text-pp-gray mb-2.5 text-xs font-medium">Store name</label>
					<input
						type="text"
						id="store_name"
						name="store_name"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						required
					/>
				</div>

				<div>
					<label for="store_description" class="text-pp-gray mb-2.5 text-xs font-medium"
						>Store description</label
					>
					<textarea
						id="store_description"
						name="store_description"
						rows="4"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
					></textarea>
				</div>

				<div class="min-w-0 shrink-0">
					<Label class="text-pp-gray mb-2.5 text-xs font-medium">Store hours</Label>

					<input type="hidden" name="sched" value={JSON.stringify(schedule)} />

					{#each Object.keys(schedule) as day (day)}
						<div class="grid grid-cols-[100px_1fr] items-center gap-2 pb-2">
							<Label class="capitalize">{day}</Label>
							<br/>
							<div class="min-w-0">
								<Timepicker
									type="range"
									onselect={(e) => handleRangeChange(day, e.time, e.endTime)}
									divClass="w-full max-w-full shadow-none max-w-xs"
									class="w-full min-w-0 max-w-xs"
								/>
							</div>
						</div>
					{/each}
				</div>

				<div>
					<label for="store_addr" class="text-pp-gray mb-2.5 text-xs font-medium">Location</label>
					<AddressInput />
				</div>
			</div>

			<div class="px-3 pb-12">
				<a
					class="bg-pp-white text-pp-black hover:bg-pp-darker-pink float-left rounded px-4 py-1 text-xs"
					href={resolve(`/store/`)}
				>
					Cancel
				</a>
				<button
					type="submit"
					disabled={submitting}
					class="bg-pp-pink text-pp-white hover:bg-pp-darker-pink float-right rounded px-4 py-1 text-xs"
				>
					{submitting ? 'Creating store...' : 'Create store'}
				</button>
			</div>
		</form>
	</div>
</div>
