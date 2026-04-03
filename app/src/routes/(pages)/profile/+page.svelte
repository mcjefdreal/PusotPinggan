<script lang="ts">
	import {
		AngleRightOutline,
		FilePenOutline,
		CartOutline,
		HeartOutline,
		QuestionCircleOutline,
		BuildingOutline,
		BookOpenOutline,
		ArrowRightToBracketOutline
	} from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';
</script>


<div class="relative h-screen overflow-hidden">
	<div class="from-pp-pink to-pp-light-pink relative h-[36%] bg-gradient-to-t p-6">
		<div class="mt-0 text-pp-white text-center text-2xl font-semibold">Profile</div>
		<div class="flex flex-col mt-6 items-center justify-center">
		<div
			class="flex h-35 w-35 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg"
		>
			Karin
		</div>
		<div class="text-pp-white mt-2 text-center text-lg font-medium">Karin Consebido</div>
	</div>	
	</div>

	<div class="bg-rose-50 h-[64%]"></div>
	<div class="absolute left-1/2 top-[31%] -translate-x-1/2 bg-pp-white w-80 rounded-xl">
			<a
				href={resolve('/profile/edit')}
				class="block rounded-t-xl px-3 py-4 flex items-center w-full text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
			>
				<FilePenOutline class="ml-2 mr-4 inline-block h-5 w-5" />
				Edit Profile
				<AngleRightOutline class="ml-auto mr-1 h-5 w-5" />
			</a> 
			<div class="border-t-1 border-dotted border-gray-300"></div>
			<a
				href="/profile/basket/ordered"
				class="block px-3 py-4 flex items-center w-full text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
			>
				<CartOutline class="ml-2 mr-4 inline-block h-5 w-5" />
				View Basket
				<AngleRightOutline class="ml-auto mr-1 h-5 w-5" />
			</a>
			<div class="border-t-1 border-dotted border-gray-300"></div>
			<a
				href={resolve('/profile/edit')}
				class="block px-3 py-4 flex items-center w-full text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
			>
				<HeartOutline class="ml-2 mr-4 inline-block h-5 w-5" />
				Favorites
				<AngleRightOutline class="ml-auto mr-1 h-5 w-5" />
			</a>
			<div class="border-t-1 border-dotted border-gray-300"></div>
			<a
				href={resolve('/profile/edit')}
				class="block px-3 py-4 flex items-center w-full text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
			>
				<QuestionCircleOutline class="ml-2 mr-4 inline-block h-5 w-5" />
				Help Center
				<AngleRightOutline class="ml-auto mr-1 h-5 w-5" />
			</a>
			<div class="border-t-1 border-dotted border-gray-300"></div>
			<a
				href={resolve('/profile/edit')}
				class="block px-3 py-4 flex items-center w-full text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
			>
				<BuildingOutline class="ml-2 mr-4 inline-block h-5 w-5" />
				For Business
				<AngleRightOutline class="ml-auto mr-1 h-5 w-5" />
			</a>
			<div class="border-t-1 border-dotted border-gray-300"></div>
			<a
				href={resolve('/profile/edit')}
				class="block px-3 py-4 flex items-center w-full text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
			>
				<BookOpenOutline class="ml-2 mr-4 inline-block h-5 w-5" />
				Terms and Policies
				<AngleRightOutline class="ml-auto mr-1 h-5 w-5" />
			</a>
			<div class="border-t-1 border-dotted border-gray-300"></div>
			<a
				href={resolve('/profile/edit')}
				class="block rounded-b-xl px-3 py-4 text-left text-base font-normal transition hover:bg-gray-100 active:bg-gray-300"
			>
				<ArrowRightToBracketOutline class="text-red-800 ml-2 mr-3 inline-block h-5 w-5" />
				Log Out</a
			>
		</div>
</div>

