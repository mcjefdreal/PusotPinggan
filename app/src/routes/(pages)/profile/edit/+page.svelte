<script lang="ts">
	import { ArrowLeftOutline, CogSolid } from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';
</script>

<div class="bg-pp-light-pink relative min-h-screen w-full p-6">
	<a href={resolve('/profile')} class="text-pp-white absolute top-6 left-6 flex items-center gap-1">
		<ArrowLeftOutline class="h-8 w-8" />
	</a>

	<div class="text-pp-white text-center text-2xl font-semibold">Edit Profile</div>

	<a
		href={resolve('/profile')}
		class="text-pp-white absolute top-6 right-6 flex items-center gap-2"
	>
		<CogSolid class="h-8 w-8" />
	</a>

	<div class="absolute left-1/2 mt-20 -translate-x-1/2 -translate-y-1/2">
		<div
			class="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg"
		>
			Karin
		</div>
	</div>

	<div class="bg-pp-white mx-auto mt-44 w-80 rounded-xl">
		<form>
			<div class="mb-1 grid gap-2 px-3 pt-2">
				<div>
					<label for="firstname" class="text-pp-gray mb-2.5 text-xs font-medium">First Name</label>
					<input
						type="tel"
						id="firstname"
						class="border-pp-gray placeholder-pp-gray w-full rounded-md border px-2 py-2.5 text-xs"
						placeholder="First Name"
						required
					/>
				</div>

				<div>
					<label for="lastname" class="text-pp-gray mb-2.5 text-xs font-medium">Last Name</label>
					<input
						type="tel"
						id="lastname"
						class="border-pp-gray placeholder-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="Last Name"
						required
					/>
				</div>

				<div>
					<label for="phone" class="text-pp-gray mb-2.5 text-xs font-medium">Phone Number</label>
					<input
						type="tel"
						id="phone"
						class="border-pp-gray placeholder-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="+63 912 345 6789"
						required
					/>
				</div>
			</div>
		</form>

		<div class="pt-4 pr-6 pb-12">
			<button
				class="bg-pp-pink text-pp-white hover:bg-pp-darker-pink float-right rounded px-4 py-1 text-xs"
			>
				Save Changes
			</button>
		</div>
	</div>
</div>
