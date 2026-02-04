<script>
	import logo from '../lib/icons/logomark.svg';

	import { resolve } from '$app/paths';
</script>

<div
	class="from-pp-pink to-pp-light-pink flex h-screen flex-col items-center justify-center bg-linear-to-t"
>
	<img src={logo} alt="Puso't Pinggan Logo" class="max-h-52" />

	<h1 class="text-pp-white text-3xl font-semibold">Puso't Pinggan</h1>

	<div class="grid place-items-center space-y-3 py-20">
		<a
			class="border-pp-white text-pp-white flex h-10 w-50 items-center justify-center rounded-lg border text-lg font-medium"
			href="{resolve('/login/')}"
		>
			Log In
		</a>

		<a
			class="border-pp-white bg-pp-white text-pp-pink flex h-10 w-50 items-center justify-center rounded-lg border text-lg font-medium"
			href="{resolve('/signup/')}"
		>
			Sign Up
		</a>
	</div>
</div>
