<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '../lib/icons/logomark.svg';

	import { GoogleSolid } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';

	let isOnline = $state(true);
	let checking = $state(false);

	const isTrulyOnline = async () => {
		try {
			await fetch('https://google.com', { mode: 'no-cors' });
			return true;
		} catch (error) {
			return false;
		}
	};

	async function checkOnlineStatus() {
		checking = true;
		isOnline = await isTrulyOnline();
		if (isOnline) {
			handleRetry();
		}
		checking = false;
	}

	async function handleRetry() {
		await invalidateAll();
	}

	onMount(() => {
		checkOnlineStatus();
		
		// Poll every 5 seconds to check connection status
		const interval = setInterval(checkOnlineStatus, 5000);
		
		return () => clearInterval(interval);
	});
</script>

{#if isOnline}
  <!-- Existing login UI -->
  <div class="from-pp-pink to-pp-light-pink flex h-screen flex-col items-center justify-center bg-linear-to-t">
    <img src={logo} alt="Puso't Pinggan Logo" class="max-h-52" />
    <h1 class="text-pp-white text-3xl font-semibold">Puso't Pinggan</h1>
    <div class="mt-10">
      <form method="POST" action="?/google" class="bg-pp-white text-pp-pink flex h-10 w-60 items-center rounded px-4 py-1">
        <GoogleSolid class="h-6 w-6 shrink-0" />
        <button class="pl-4" type="submit"> Sign in with Google </button>
      </form>
    </div>
  </div>
{:else}
  <!-- Offline UI -->
	<div
		class="from-pp-pink to-pp-light-pink flex h-screen flex-col items-center justify-center bg-linear-to-t text-center"
	>
		<h1 class="text-pp-white text-2xl font-semibold">No internet connection detected</h1>
		<h1 class="text-pp-white text-l font-semibold w-[75%]">Please check your internet connection and try again</h1>
		<button
			onclick={handleRetry}
			disabled={checking}
			class="mt-6 rounded-md px-4 py-2 text-pp-white disabled:opacity-50 outline-pp-white outline"
		>
			{checking ? 'Checking...' : 'Try Again'}
		</button>
	</div>
{/if}
