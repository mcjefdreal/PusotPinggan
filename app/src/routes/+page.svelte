<script lang="ts">
	import logo from '../lib/icons/logomark.svg';

	import { GoogleSolid } from 'flowbite-svelte-icons';

	import { resolve } from '$app/paths';
	import { redirect } from '@sveltejs/kit';
</script>

<div
	class="from-pp-pink to-pp-light-pink flex h-screen flex-col items-center justify-center bg-linear-to-t"
>
	<img src={logo} alt="Puso't Pinggan Logo" class="max-h-52" />

	<h1 class="text-pp-white text-3xl font-semibold">Puso't Pinggan</h1>

	<div class="mt-10">
		<form method="POST" action="?/google" class="bg-pp-white text-pp-pink flex items-center h-10 w-60 rounded px-4 py-1">
			<GoogleSolid class="shrink-0 h-6 w-6" />
			<button
				class="pl-4"
				type="submit"
			>
				Sign in with Google
			</button>
		</form>
	</div>
</div>
