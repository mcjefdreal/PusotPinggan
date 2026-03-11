<script>
	import { resolve } from '$app/paths';

	import { PlusOutline, ArrowLeftOutline, FaceGrinOutline, PaperPlaneSolid, CogSolid } from 'flowbite-svelte-icons';

	import ChatHead from '$lib/components/Messages/ChatHead.svelte';

	import ChatMessage from '$lib/components/Messages/ChatMessage.svelte';
</script>

<div class="min-h-screen bg-rose-50 w-full">
	<div class="bg-pp-white sticky start-0 top-0 z-20 w-full px-4 py-0 justify-center grid grid-cols-[auto_1fr_auto] items-center border-b border-gray-300">
		
		<a 
			href={resolve('/messages')} 
			class="text-pp-black top-6 left-6 flex items-center gap-2"
		>
			<ArrowLeftOutline class="h-8 w-8" />
		</a>

		<div> <ChatHead></ChatHead> </div>

		<a
			href={resolve('/messages')}
			class="text-pp-black top-6 right-6 flex items-center gap-2 ml-auto"
		>
			<CogSolid class="h-8 w-8" />
		</a>
	</div>
	<div class="flex flex-col py-1">
		<ChatMessage isUser={false}> </ChatMessage>
		<ChatMessage isUser={false}> </ChatMessage>
		<ChatMessage isUser={false}> </ChatMessage>
		<ChatMessage isUser={false}> </ChatMessage>
		<ChatMessage contents="heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" isUser={true}> </ChatMessage>
		<ChatMessage contents="heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" isUser={true}> </ChatMessage>
	</div>

	<div class="bg-pp-white sticky bottom-0 z-20 w-full p-4 justify-center grid grid-cols-[auto_1fr_auto] gap-x-5 items-center px-6">
		<div class="text-pp-gray flex items-center gap-2">
			<PlusOutline class="h-8 w-8" />
		</div>
	
		<input
			type="text"
			id="firstname"
			name="firstname"
			class="border-pp-white placeholder-pp-gray w-full rounded-md border px-2 py-2.5 focus:border-pp-pink focus:ring-pp-pink"
			placeholder="Type a message..."
		/>
		<div class="text-pp-gray flex items-center gap-2">
			<FaceGrinOutline class="h-8 w-8" />
		</div>

	</div>
</div>
