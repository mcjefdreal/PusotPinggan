<script lang="ts">
	let {
		// userPic,
		userName = 'John Pork',
		latestMsg = 'heyyyyyyyasajkhahdfgdjgddhdjhjdkj',
		timestamp = '7m',
		read = false
	} = $props();
</script>

<div class="flex min-w-0 flex-row px-4 py-4">
	<div class="bg-pp-light-pink h-20 w-20 shrink-0 rounded-full"></div>
	<div class="flex min-w-0 flex-col justify-center gap-1 pl-4">
		<p class="truncate text-lg font-semibold">{userName}</p>
		<div class="flex flex-row gap-4 {read ? 'text-pp-gray' : 'text-pp-black'}">
			<p class="min-w-0 flex-1 truncate">{latestMsg}</p>
			<p>·</p>
			<p>{timestamp}</p>
		</div>
	</div>
</div>
