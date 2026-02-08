<script>
	import HomeIcon from './home.svelte';
	import MsgIcon from './messages.svelte';
	import StoreIcon from './profile.svelte';
	import ProfileIcon from './store.svelte';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<nav class="bg-pp-white sticky bottom-0 z-10 w-full">
	<ul class="flex justify-evenly py-5">
		<li>
			<a class="flex h-full items-center" href={resolve('/')}>
				<StoreIcon active={page.url.pathname === '/'} />
				{#if page.url.pathname === '/'}
					<div class="bg-pp-pink absolute -bottom-1 h-1 w-1 rounded-full"></div>
				{/if}
			</a>
		</li>
		<li>
			<a class="relative flex h-full flex-col items-center" href={resolve('/home/')}>
				<HomeIcon active={page.url.pathname === '/home'} />
				{#if page.url.pathname === '/home'}
					<div class="bg-pp-pink absolute -bottom-1 h-1 w-1 rounded-full"></div>
				{/if}
			</a>
		</li>
		<li>
			<a class="flex h-full items-center" href={resolve('/')}>
				<MsgIcon active={page.url.pathname === '/'} />
				{#if page.url.pathname === '/'}
					<div class="bg-pp-pink absolute -bottom-1 h-1 w-1 rounded-full"></div>
				{/if}
			</a>
		</li>
		<li>
			<a class="flex h-full items-center" href={resolve('/')}>
				<ProfileIcon active={page.url.pathname === '/'} />
				{#if page.url.pathname === '/'}
					<div class="bg-pp-pink absolute -bottom-1 h-1 w-1 rounded-full"></div>
				{/if}
			</a>
		</li>
	</ul>
</nav>
