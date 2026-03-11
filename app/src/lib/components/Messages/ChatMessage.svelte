<script lang=ts>
    let {
        chatID,
		contents = `gagawin 🔥 ko 💚 ang 🌳 lahat 🌎 para 💪🏽 protektahan 🛡️ ang 😠 aking 🏡 bansa iingatan ❤️‍🩹 ko 🦸🏻‍♀️ kayo 🧑‍🧑‍🧒‍🧒 hanggang 🏘️ dulo 🌈 basta ✋🏼 iingatan 🥺 niyo 👥 din 🫀ako 🧝🏽‍♀️`,
        isUser = false,
        timestamp = "12:00 PM",
        MsgShowingTS,
        ShowTS,
        toggleTS
	} = $props();    

    import { CheckOutline } from "flowbite-svelte-icons";
</script>

<div class={`flex flex-col px-3 py-1 gap-y-0 ${isUser ? 'items-end' : 'items-start'}`}>
    <button class={`px-4 py-1.5 pb-2.5 rounded-xl max-w-[65%] break-words border-none text-left transition-all duration-150
            ${ShowTS && MsgShowingTS === chatID ? 'brightness-90' : ''}
            ${isUser ? 'bg-pp-pink text-pp-white' : 'bg-pp-white text-pp-black'}
            whitespace-pre-line`}
            onclick={() => toggleTS(chatID)}>
            {contents}
    </button>

    {#if ShowTS && MsgShowingTS === chatID}
        <div class="flex items-center text-xs text-pp-gray mt-1 px-2">
            <CheckOutline class="h-4 w-4" />
            {timestamp}
        </div>
    {/if}

</div>