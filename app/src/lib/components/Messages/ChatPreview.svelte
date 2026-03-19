<script lang=ts>
    let {
		// userPic,
		userName = 'John Pork',
		latestMsg = 'heyyyyyyyasajkhahdfgdjgddhdjhjdkj',
        timestamp = '7m',
        read = false
	} = $props();
</script>

<div class="flex flex-row py-4 px-4 min-w-0">
    <div class="bg-pp-light-pink h-20 w-20 rounded-full shrink-0"> </div>
    <div class="flex flex-col justify-center gap-1 pl-4 min-w-0">
        <p class="text-lg font-semibold truncate"> {userName} </p>
        <div class="flex flex-row gap-4 {read ? 'text-pp-gray' : 'text-pp-black'}"> 
            <p class="flex-1 min-w-0 truncate"> {latestMsg} </p>
            <p> · </p>
            <p> {timestamp} </p>
        </div>
    </div>
</div>