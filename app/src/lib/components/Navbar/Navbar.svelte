<script lang="ts">
	import HomeIcon from '$lib/components/Navbar/home.svelte';
	import MsgIcon from '$lib/components/Navbar/messages.svelte';
	import StoreIcon from '$lib/components/Navbar/store.svelte';
	import ProfileIcon from '$lib/components/Navbar/profile.svelte';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { data }: { data?: { unreadCount?: number } } = $props();

	let unreadCount = $derived(data?.unreadCount || 0);
</script>

<nav class="bg-pp-white border-pp-gray sticky bottom-0 z-10 w-full border-t-1">
	<ul class="flex justify-evenly py-5">
		<li>
			<a class="relative flex h-full flex-col items-center" href={resolve('/store/')}>
				<StoreIcon active={page.url.pathname.includes('/store')} />
				{#if page.url.pathname.includes('/store')}
					<div class="bg-pp-pink absolute -bottom-1 h-1 w-1 rounded-full"></div>
				{/if}
			</a>
		</li>
		<li>
			<a class="relative flex h-full flex-col items-center" href={resolve('/home/')}>
				<HomeIcon
					active={page.url.pathname.includes('/home') || page.url.pathname.includes('/search')}
				/>
				{#if page.url.pathname.includes('/home') || page.url.pathname.includes('/search')}
					<div class="bg-pp-pink absolute -bottom-1 h-1 w-1 rounded-full"></div>
				{/if}
			</a>
		</li>
		<li>
			<a class="relative flex h-full flex-col items-center" href={resolve('/messages/')}>
				<MsgIcon active={page.url.pathname.includes('/messages')} />
				{#if page.url.pathname.includes('/messages')}
					<div class="bg-pp-pink absolute -bottom-1 h-1 w-1 rounded-full"></div>
				{/if}
				{#if unreadCount > 0}
					<div
						class="absolute top-0 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
					>
						{unreadCount > 9 ? '9+' : unreadCount}
					</div>
				{/if}
			</a>
		</li>
		<li>
			<a class="relative flex h-full flex-col items-center" href={resolve('/profile/')}>
				<ProfileIcon active={page.url.pathname.includes('/profile')} />
				{#if page.url.pathname.includes('/profile')}
					<div class="bg-pp-pink absolute -bottom-1 h-1 w-1 rounded-full"></div>
				{/if}
			</a>
		</li>
	</ul>
</nav>
