<script lang="ts">
	import {CogSolid, 
			FilePenOutline, 
			CartOutline, 
			HeartOutline,
			QuestionCircleOutline,
			BuildingOutline,
			BookOpenOutline} from "flowbite-svelte-icons";
	import { resolve } from '$app/paths';

</script>

<div class="relative bg-pp-light-pink w-full min-h-screen p-6">
	<a href={resolve('/profile')} class="flex items-center absolute top-6 right-6 gap-2 text-pp-white">
		<CogSolid class="w-8 h-8" />
	</a>

	<div class ="text-pp-white text-2xl font-semibold text-center">Profile</div>

	<div class="absolute left-1/2 mt-20 -translate-x-1/2 -translate-y-1/2">
		<div class="w-36 h-36 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
			Karin
		</div>
	</div>

	<div class="bg-pp-white w-80 mx-auto mt-44 rounded-xl">
		<a href={resolve('/profile/edit')} class="block text-left text-sm font-normal px-3 py-4">
			<FilePenOutline class="w-5 h-5 inline-block mr-2" />
			Edit Profile</a>
		<div class="border-t-1 border-dotted border-gray-300"></div>
		<a href={resolve('/profile/edit')} class="block text-left text-sm font-normal px-3 py-4">
			<CartOutline class="w-5 h-5 inline-block mr-2" />
			View Basket</a>
		<div class="border-t-1 border-dotted border-gray-300"></div>
				<a href={resolve('/profile/edit')} class="block text-left text-sm font-normal px-3 py-4">
			<HeartOutline class="w-5 h-5 inline-block mr-2" />
			Favorites</a>
		<div class="border-t-1 border-dotted border-gray-300"></div>
				<a href={resolve('/profile/edit')} class="block text-left text-sm font-normal px-3 py-4">
			<QuestionCircleOutline class="w-5 h-5 inline-block mr-2" />
			Help Center</a>
		<div class="border-t-1 border-dotted border-gray-300"></div>
				<a href={resolve('/profile/edit')} class="block text-left text-sm font-normal px-3 py-4">
			<BuildingOutline class="w-5 h-5 inline-block mr-2" />
			For Business</a>
		<div class="border-t-1 border-dotted border-gray-300"></div>
				<a href={resolve('/profile/edit')} class="block text-left text-sm font-normal px-3 py-4">
			<BookOpenOutline class="w-5 h-5 inline-block mr-2" />
			Terms and Policies</a>
		<div class="border-t-1 border-dotted border-gray-300"></div>
	</div>
</div>
