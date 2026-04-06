<script lang="ts">
	import {
		AngleRightOutline,
		FilePenOutline,
		CartOutline,
		ArrowRightToBracketOutline
	} from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';

	const { data } = $props();

	export async function signOut() {
		await data.supabase.auth.signOut();
		await invalidateAll();
	}
</script>

<div class="relative h-screen overflow-hidden">
	<div class="from-pp-pink to-pp-light-pink relative h-[36%] bg-gradient-to-t p-6">
		<div class="text-pp-white mt-0 text-center text-2xl font-semibold">Profile</div>
		<div class="mt-6 flex flex-col items-center justify-center">
			<div
				class="flex h-35 w-35 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg"
			>
				Karin
			</div>
			<div class="text-pp-white mt-2 text-center text-lg font-medium">Karin Consebido</div>
		</div>
	</div>

	<div class="h-[64%] bg-rose-50"></div>
	<div class="bg-pp-white absolute top-[31%] left-1/2 w-80 -translate-x-1/2 rounded-xl">
		<a
			href={resolve('/profile/edit')}
			class="block flex w-full items-center rounded-t-xl px-3 py-4 text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
		>
			<FilePenOutline class="mr-4 ml-2 inline-block h-5 w-5" />
			Edit Profile
			<AngleRightOutline class="mr-1 ml-auto h-5 w-5" />
		</a>
		<div class="border-t-1 border-dotted border-gray-300"></div>
		<a
			href="/profile/basket/ordered"
			class="block flex w-full items-center px-3 py-4 text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
		>
			<CartOutline class="mr-4 ml-2 inline-block h-5 w-5" />
			View Basket
			<AngleRightOutline class="mr-1 ml-auto h-5 w-5" />
		</a>
		<div class="border-t-1 border-dotted border-gray-300"></div>
		<button
			class="block w-full rounded-b-xl px-3 py-4 text-left text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
			onclick={signOut}
		>
			<ArrowRightToBracketOutline class="mr-3 ml-2 inline-block h-5 w-5 text-red-800" />
			Log Out
		</button>
	</div>
</div>
