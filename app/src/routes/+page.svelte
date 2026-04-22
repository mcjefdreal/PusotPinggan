<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '../lib/icons/logomark.svg';

	import { GoogleSolid } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';

	let isOnline = $state(true);
	let checking = $state(false);

	const isTrulyOnline = async () => {
		if (navigator.onLine) {
			// Try a quick fetch as secondary verification
			try {
				await fetch('/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
				return true;
			} catch {
				return true; // Browser says online, trust it
			}
		}
		return false;
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
		// checkOnlineStatus();

		// // Poll every 5 seconds to check connection status
		// const interval = setInterval(checkOnlineStatus, 5000);

		// return () => clearInterval(interval);
		const handleOnline = () => {
			isOnline = true;
			handleRetry();
		};
		const handleOffline = () => {
			isOnline = false;
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		checkOnlineStatus();

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	});
</script>

{#if isOnline}
	<!-- Existing login UI -->
	<div
		class="from-pp-pink to-pp-light-pink flex h-screen flex-col items-center justify-center bg-linear-to-t"
	>
		<img src={logo} alt="Puso't Pinggan Logo" class="max-h-52" />
		<h1 class="text-pp-white text-3xl font-semibold">Puso't Pinggan</h1>
		<div class="mt-10">
			<form
				method="POST"
				action="?/google"
				class="bg-pp-white text-pp-pink flex h-10 w-60 items-center rounded px-4 py-1"
			>
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
		<h1 class="text-pp-white text-l w-[75%] font-semibold">
			Please check your internet connection and try again
		</h1>
		<button
			onclick={handleRetry}
			disabled={checking}
			class="text-pp-white outline-pp-white mt-6 rounded-md px-4 py-2 outline disabled:opacity-50"
		>
			{checking ? 'Checking...' : 'Try Again'}
		</button>
	</div>
{/if}
