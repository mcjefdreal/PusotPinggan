<script>
    import HomeIcon from './home.svelte';
    import MsgIcon from './messages.svelte';
    import StoreIcon from './profile.svelte';
    import ProfileIcon from './store.svelte';

    import { page } from '$app/state';
    import { resolve } from '$app/paths';

</script>

<nav class="sticky w-full bottom-0 bg-pp-white z-10">
    <ul class="flex justify-evenly py-5"> 
        <li>
            <a class="flex h-full items-center" href="{resolve('/')}">
                <StoreIcon active={page.url.pathname === '/'}/>
            </a>
        </li>
        <li>
            <a class="flex h-full items-center" href="{resolve('/home/')}">
                <HomeIcon active={page.url.pathname === '/home'}/>
            </a>
        </li>
        <li>
            <a class="flex h-full items-center" href="{resolve('/')}">
                <MsgIcon active={page.url.pathname === '/'}/>
            </a>
        </li>
        <li>
            <a class="flex h-full items-center" href="{resolve('/')}">
                <ProfileIcon active={page.url.pathname === '/'}/>
            </a>
        </li>
    </ul>
</nav>