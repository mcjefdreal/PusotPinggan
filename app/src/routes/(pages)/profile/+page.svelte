<script lang="ts">
	import {
		CogSolid,
		FilePenOutline,
		CartOutline,
		HeartOutline,
		QuestionCircleOutline,
		BuildingOutline,
		BookOpenOutline
	} from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';
</script>

<div class="bg-linear-to-t from-pp-pink to-pp-light-pink relative min-h-screen w-full p-6">
	<a
		href={resolve('/profile')}
		class="text-pp-white absolute top-6 right-6 flex items-center gap-2"
	>
		<CogSolid class="h-8 w-8" />
	</a>

	<div class="text-pp-white text-center text-2xl font-semibold">Profile</div>

	<div class="absolute left-1/2 mt-20 -translate-x-1/2 -translate-y-1/2">
		<div
			class="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg"
		>
			Karin
		</div>
	</div>

	<div class="bg-pp-white mx-auto mt-44 w-80 rounded-xl">
		<a href={resolve('/profile/edit')} class="block hover:bg-gray-100 rounded-t-xl active:bg-gray-300 transition px-3 py-4 text-left text-sm font-normal">
			<FilePenOutline class="mr-2 inline-block h-5 w-5" />
			Edit Profile</a
		>
		<div class="border-t-1 border-dotted border-gray-300"></div>
		<a href="/profile/basket" class="block hover:bg-gray-100 active:bg-gray-300 transition px-3 py-4 text-left text-sm font-normal">
			<CartOutline class="mr-2 inline-block h-5 w-5" />
			View Basket</a
		>
		<div class="border-t-1 border-dotted border-gray-300"></div>
		<a href={resolve('/profile/edit')} class="block hover:bg-gray-100 active:bg-gray-300 transition px-3 py-4 text-left text-sm font-normal">
			<HeartOutline class="mr-2 inline-block h-5 w-5" />
			Favorites</a
		>
		<div class="border-t-1 border-dotted border-gray-300"></div>
		<a href={resolve('/profile/edit')} class="block hover:bg-gray-100 active:bg-gray-300 transition px-3 py-4 text-left text-sm font-normal">
			<QuestionCircleOutline class="mr-2 inline-block h-5 w-5" />
			Help Center</a
		>
		<div class="border-t-1 border-dotted border-gray-300"></div>
		<a href={resolve('/profile/edit')} class="block hover:bg-gray-100 active:bg-gray-300 transition px-3 py-4 text-left text-sm font-normal">
			<BuildingOutline class="mr-2 inline-block h-5 w-5" />
			For Business</a
		>
		<div class="border-t-1 border-dotted border-gray-300"></div>
		<a href={resolve('/profile/edit')} class="block hover:bg-gray-100 rounded-b-xl active:bg-gray-300 transition px-3 py-4 text-left text-sm font-normal">
			<BookOpenOutline class="mr-2 inline-block h-5 w-5" />
			Terms and Policies</a
		>
	</div>
</div>
