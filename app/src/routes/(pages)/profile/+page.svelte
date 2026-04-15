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

	let displayname = $derived(data.pub_user?.display_name || '');
	let imgUrl = $derived.by(() => {
		const baseUrl = data.pub_user?.img_url;
		if (!baseUrl) return '';

		const timestamp = data.pub_user?.updated_at
			? new Date(data.pub_user.updated_at).getTime()
			: Date.now();

		return `${baseUrl}?t=${timestamp}`;
	});

	export async function signOut() {
		await data.supabase.auth.signOut();
		await invalidateAll();
	}
</script>

<div class="flex min-h-screen flex-col">
	<div class=" from-pp-pink to-pp-light-pink bg-gradient-to-t p-6 px-6 pt-6 pb-20">
		<div class="text-pp-white text-center text-2xl font-semibold">Profile</div>
		<div class="mt-4 flex flex-col items-center justify-center">
			<div
				class="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white"
			>
				<img src={imgUrl} alt="Profile" class="h-full w-full object-cover" />
			</div>
			<div class="text-pp-white mt-2 text-center text-lg font-medium">
				{displayname || 'Username'}
			</div>
		</div>
	</div>

	<div class="flex-1 bg-rose-50">
		<div class="bg-pp-white mx-auto -mt-15 w-full max-w-[85%] flex-1 rounded-xl">
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
				href="/profile/basket/cart"
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
</div>
