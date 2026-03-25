<script lang="ts">
	let {
		chatID,
		contents = `gagawin 🔥 ko 💚 ang 🌳 lahat 🌎 para 💪🏽 protektahan 🛡️ ang 😠 aking 🏡 bansa iingatan ❤️‍🩹 ko 🦸🏻‍♀️ kayo 🧑‍🧑‍🧒‍🧒 hanggang 🏘️ dulo 🌈 basta ✋🏼 iingatan 🥺 niyo 👥 din 🫀ako 🧝🏽‍♀️`,
		isUser = false,
		timestamp = '12:00 PM',
		MsgShowingTS,
		ShowTS,
		toggleTS
	} = $props();

	import { CheckOutline } from 'flowbite-svelte-icons';
</script>

<div class={`flex flex-col gap-y-0 px-3 py-1 ${isUser ? 'items-end' : 'items-start'}`}>
	<button
		class={`max-w-[65%] rounded-xl border-none px-4 py-1.5 pb-2.5 text-left break-words transition-all duration-150
            ${ShowTS && MsgShowingTS === chatID ? 'brightness-90' : ''}
            ${isUser ? 'bg-pp-pink text-pp-white' : 'bg-pp-white text-pp-black'}
            whitespace-pre-line`}
		onclick={() => toggleTS(chatID)}
	>
		{contents}
	</button>

	{#if ShowTS && MsgShowingTS === chatID}
		<div class="text-pp-gray mt-1 flex items-center px-2 text-xs">
			<CheckOutline class="h-4 w-4" />
			{timestamp}
		</div>
	{/if}
</div>
