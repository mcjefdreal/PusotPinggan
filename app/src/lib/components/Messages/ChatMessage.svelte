<script lang=ts>
    let {
		contents = `gagawin 🔥 ko 💚 ang 🌳 lahat 🌎 para 💪🏽 protektahan 🛡️ ang 😠 aking 🏡 bansa iingatan ❤️‍🩹 ko 🦸🏻‍♀️ kayo 🧑‍🧑‍🧒‍🧒 hanggang 🏘️ dulo 🌈 basta ✋🏼 iingatan 🥺 niyo 👥 din 🫀ako 🧝🏽‍♀️`,
        isUser = false
	} = $props();
</script>

<div class={`flex px-4 py-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
    <div class={`px-4 py-2 rounded-xl max-w-[65%] break-words ${isUser ? 'bg-pp-pink' : 'bg-pp-white'}`}>
        <p class={`whitespace-pre-line ${isUser ? 'text-pp-white' : 'text-pp-black'} text-base`}>
            {contents}
        </p>
    </div>
</div>