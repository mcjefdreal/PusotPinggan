<script>
	import logo from '$lib/icons/logomark.svg';

	import { resolve } from '$app/paths';
</script>

<div
	class="from-pp-pink to-pp-light-pink flex h-screen flex-col items-center justify-center bg-linear-to-t"
>
	<img src={logo} alt="Puso't Pinggan Logo" class="max-h-36" />

	<div class="bg-pp-white m-6 w-80 rounded-xl">
		<p class="text-pp-pink pt-5 pb-3 text-center text-4xl font-medium">Welcome!</p>

		<form>
			<div class="mb-6 grid gap-2 px-6">
				<div>
					<label for="phone" class="text-pp-gray mb-2.5 text-xs font-medium">Phone number</label>
					<input
						type="tel"
						id="phone"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="0912 345 6789"
						required
					/>
				</div>

				<div>
					<label for="first_name" class="text-pp-gray mb-2.5 text-xs font-medium">First name</label>
					<input
						type="text"
						id="first_name"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="Juan"
						required
					/>
				</div>

				<div>
					<label for="last_name" class="text-pp-gray mb-2.5 text-xs font-medium">Last name</label>
					<input
						type="text"
						id="last_name"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="Dela Cruz"
						required
					/>
				</div>

				<div>
					<label for="password" class="text-pp-gray mb-2.5 text-xs font-medium">Password</label>
					<input
						type="password"
						id="password"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="•••••••••"
						required
					/>
				</div>

				<div>
					<label for="confirm_password" class="text-pp-gray mb-2.5 text-xs font-medium"
						>Confirm password</label
					>
					<input
						type="password"
						id="confirm_password"
						class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
						placeholder="•••••••••"
						required
					/>
				</div>
			</div>
		</form>

		<div class="pr-6 pb-12">
			<button class="bg-pp-pink text-pp-white float-right rounded px-4 py-1 text-xs hover:bg-pp-darker-pink">
				Sign up
			</button>
		</div>

		<p class="text-pp-gray px-6 pb-8 text-xs">
			Already have an account? Log in <a class="text-pp-pink underline hover:text-pp-darker-pink" href={resolve('/login/')}>
				here!
			</a>
		</p>
	</div>
</div>
