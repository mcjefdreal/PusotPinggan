<script lang="ts">
	import { resolve } from '$app/paths';

	import {
		PlusOutline,
		ArrowLeftOutline,
		FaceGrinOutline,
		DotsVerticalOutline
	} from 'flowbite-svelte-icons';

	import ChatHead from '$lib/components/Messages/ChatHead.svelte';

	import ChatMessage from '$lib/components/Messages/ChatMessage.svelte';

	let MsgShowingTS = $state(-1); // variable storing chatID of message showing timestamp, -1 if none is showing
	let ShowTS = $state(false); // variable storing whether timestamp is showing or not

	function toggleTS(chatID: number) {
		// decides kung ano gagawin depende sa current state (show or hide timestamp?)
		if (MsgShowingTS === chatID) {
			//kung same message naclick, hide timestamp
			MsgShowingTS = -1;
			ShowTS = false;
		} else {
			MsgShowingTS = chatID;
			ShowTS = true;
		}
	}
</script>

<div class="min-h-screen w-full bg-rose-50">
	<div
		class="bg-pp-white sticky start-0 top-0 z-20 grid w-full grid-cols-[auto_1fr_auto] items-center justify-center border-b border-gray-300 px-4 py-0"
	>
		<a href={resolve('/messages')}>
			<button
				class="text-pp-black top-6 left-6 flex items-center gap-2 rounded-full transition active:bg-gray-300"
			>
				<ArrowLeftOutline class="h-8 w-8" />
			</button>
		</a>

		<div><ChatHead></ChatHead></div>

		<a href={resolve('/messages')}>
			<button
				class="text-pp-black top-6 right-6 ml-auto flex items-center gap-2 rounded-full transition active:bg-gray-300"
			>
				<DotsVerticalOutline class="h-8 w-8" />
			</button>
		</a>
	</div>
	<div class="flex flex-col py-1">
		<ChatMessage chatID={1} {MsgShowingTS} {ShowTS} {toggleTS}></ChatMessage>
		<ChatMessage
			chatID={2}
			{MsgShowingTS}
			{ShowTS}
			{toggleTS}
			isUser={false}
			timestamp="12:01 PM"
		></ChatMessage>
		<ChatMessage
			chatID={3}
			{MsgShowingTS}
			{ShowTS}
			{toggleTS}
			isUser={false}
			timestamp="12:01 PM"
		></ChatMessage>
		<ChatMessage
			chatID={4}
			{MsgShowingTS}
			{ShowTS}
			{toggleTS}
			isUser={false}
			timestamp="12:02 PM"
		></ChatMessage>
		<ChatMessage
			chatID={5}
			{MsgShowingTS}
			{ShowTS}
			{toggleTS}
			contents="heyyyyyyyyyyyy"
			isUser={true}
			timestamp="12:10 PM"
		></ChatMessage>
		<ChatMessage
			chatID={6}
			{MsgShowingTS}
			{ShowTS}
			{toggleTS}
			contents="heyyy"
			isUser={true}
			timestamp="12:11 PM"
		></ChatMessage>
	</div>

	<div
		class="bg-pp-white sticky bottom-0 z-20 grid w-full grid-cols-[auto_1fr_auto] items-center justify-center gap-x-5 p-4 px-6"
	>
		<button class="text-pp-gray flex items-center gap-2 rounded-full transition active:bg-gray-300">
			<PlusOutline class="h-8 w-8" />
		</button>

		<input
			type="text"
			id="firstname"
			name="firstname"
			class="border-pp-white placeholder-pp-gray focus:border-pp-pink focus:ring-pp-pink w-full rounded-md border px-2 py-2.5"
			placeholder="Type a message..."
		/>
		<button class="text-pp-gray flex items-center gap-2 rounded-full transition active:bg-gray-300">
			<FaceGrinOutline class="h-8 w-8" />
		</button>
	</div>
</div>
