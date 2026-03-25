<script lang="ts">
	let {
		// userPic,
		userName = 'John Pork'
		// activeStatus = '7m ago',
	} = $props();
</script>

<div class="flex flex-row p-4 px-6">
	<div class="bg-pp-light-pink h-16 w-16 rounded-full"></div>
	<div class="flex flex-col justify-center gap-1 pl-4">
		<p class="text-lg font-semibold">{userName}</p>
		<!-- <div class="flex flex-row gap-4 text-sm text-pp-gray">
            <p> Active {activeStatus} </p>
        </div> -->
	</div>
</div>
