<script>
	import { resolve } from '$app/paths';

	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	import Order from '$lib/components/BasketOrders/Order.svelte';
</script>

<div class="min-h-screen w-full bg-rose-50">
	<div class="sticky start-0 top-0 z-20">
		<div
			class="from-pp-pink to-pp-light-pink grid w-full grid-cols-3 justify-center bg-linear-to-t p-4 py-8"
		>
			<a href={resolve('/profile')}>
				<button
					class="text-pp-white flex items-center gap-2 rounded-full transition active:text-pp-darker-pink"
				>
					<ArrowLeftOutline class="h-8 w-8" />
				</button>
			</a>

			<div class="text-pp-white text-center text-2xl font-semibold">My Basket</div>

			<div></div>
		</div>

		<div class="bg-pp-white mb-1 flex h-14 w-full">
			<a
				href={resolve('/profile/basket/ordered')}
				class="flex flex-1 items-center justify-center transition active:bg-gray-300">Ordered</a
			>
			<a
				href={resolve('/profile/basket/completed')}
				class="border-pp-pink flex flex-1 items-center justify-center border-b-2 transition active:bg-gray-300"
			>
				<div class="text-pp-pink">Completed</div>
			</a>
			<a
				href={resolve('/profile/basket/cancelled')}
				class="flex flex-1 items-center justify-center transition active:bg-gray-300">Cancelled</a
			>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center gap-y-2 py-1">
		<Order
			sellerName="Sisko"
			productName="Sisko Rice"
			quantity={5}
			status="Completed"
			unitPrice={85}
		></Order>
		<Order
			sellerName="Tomo Coffee"
			productName="Spanish Latte Large"
			quantity={2}
			status="Completed"
			unitPrice={105}
		></Order>
	</div>
</div>
