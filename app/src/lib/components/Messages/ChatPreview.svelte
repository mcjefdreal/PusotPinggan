<script lang=ts>
    let {
		// userPic,
		userName = 'John Pork',
		latestMsg = 'heyyyyyyy',
        timestamp = '7m',
        read = false
	} = $props();
</script>

<div class="flex flex-row">
    <div class="bg-pp-light-pink h-20 w-20 rounded-full"> </div>
    <div class="flex flex-col justify-center gap-1 pl-4">
        <p class="text-lg font-semibold"> {userName} </p>
        <div class="flex flex-row gap-4 {read ? 'text-pp-gray' : 'text-pp-black'}"> 
            <p> {latestMsg} </p>
            <p> · </p>
            <p> {timestamp} </p>
        </div>
    </div>
</div>