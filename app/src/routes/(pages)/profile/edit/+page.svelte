<script lang="ts">
	import {ArrowLeftOutline, CogSolid} from "flowbite-svelte-icons";
	import { resolve } from '$app/paths';

</script>

<div class="relative bg-pp-light-pink w-full min-h-screen p-6">

	<a href={resolve('/profile')} class="flex items-center absolute top-6 left-6 gap-1 text-pp-white">
		<ArrowLeftOutline class="w-8 h-8" />
	</a>

	<div class ="text-pp-white text-2xl font-semibold text-center">Edit Profile</div>
	
	<a href={resolve('/profile')} class="flex items-center absolute top-6 right-6 gap-2 text-pp-white">
		<CogSolid class="w-8 h-8" />
	</a>

	<div class="absolute left-1/2 mt-20 -translate-x-1/2 -translate-y-1/2">
		<div class="w-36 h-36 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
			Karin
		</div>
	</div>

	<div class="bg-pp-white w-80 mx-auto mt-44 rounded-xl">

		<form>
			<div class="pt-2 mb-1 grid gap-2 px-3">
				<div>
					<label for="firstname" class="text-pp-gray mb-2.5 text-xs font-medium">First Name</label>
					<input
						type="tel"
						id="firstname"
						class="border-pp-gray w-full rounded-md border px-2 py-2.5 text-xs"
						placeholder="Carlyne"
						required
					/>
				</div>

				<div>
					<label for="lastname" class="text-pp-gray mb-2.5 text-xs font-medium">Last Name</label>
					<input
						type="tel"
						id="lastname"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="Consebido"
						required
					/>
				</div>
				
				<div>
					<label for="phone" class="text-pp-gray mb-2.5 text-xs font-medium">Phone Number</label>
					<input
						type="tel"
						id="phone"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="+63 912 345 6789"
						required
					/>
				</div>
			</div>
		</form>

		<div class="pr-6 pt-4 pb-12">
			<button
				class="bg-pp-pink text-pp-white hover:bg-pp-darker-pink float-right rounded px-4 py-1 text-xs"
			>
				Save Changes
			</button>
		</div>
	</div>
</div>
