<script>
	import { resolve } from '$app/paths';

	import { CogSolid } from 'flowbite-svelte-icons';

	import ChatPreview from '$lib/components/Messages/ChatPreview.svelte';
</script>

<div class="min-h-screen w-full">
	<div class="from-pp-pink to-pp-light-pink sticky start-0 top-0 z-20 w-full bg-linear-to-t p-4 py-8 justify-center grid grid-cols-3">
		<div> </div>
		<div class="text-pp-white text-center text-2xl font-semibold"> Messages </div>

		<a
			href={resolve('/messages')}
			class="text-pp-white top-6 right-6 flex items-center gap-2 ml-auto"
		>
			<CogSolid class="h-8 w-8" />
		</a>
	</div>

	<div class="flex flex-col p-6 gap-y-4">
		<ChatPreview> </ChatPreview>
		<ChatPreview userName="karin" read={true}> </ChatPreview>
	</div>
</div>
