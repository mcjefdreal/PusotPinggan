<script>
	import { resolve } from '$app/paths';

	import { CogSolid } from 'flowbite-svelte-icons';

	import ChatPreview from '$lib/components/Messages/ChatPreview.svelte';
</script>

<div class="min-h-screen w-full">
	<div
		class="from-pp-pink to-pp-light-pink sticky start-0 top-0 z-20 grid w-full grid-cols-3 justify-center bg-linear-to-t p-4 py-8"
	>
		<div></div>
		<div class="text-pp-white text-center text-2xl font-semibold">Messages</div>

		<a
			href={resolve('/messages')}
			class="text-pp-white top-6 right-6 ml-auto flex items-center gap-2"
		>
			<CogSolid class="h-8 w-8" />
		</a>
	</div>

	<div class="flex flex-col gap-y-0 px-0 py-0">
		<a
			href={resolve('/messages/chat')}
			class="block rounded-lg transition hover:bg-gray-100 active:bg-gray-300"
		>
			<ChatPreview></ChatPreview>
		</a>
		<a
			href={resolve('/messages/chat')}
			class="block rounded-lg transition hover:bg-gray-100 active:bg-gray-300"
		>
			<ChatPreview userName="karin" read={true}></ChatPreview>
		</a>
	</div>
</div>
