<script lang="ts">
	import { ArrowLeftOutline, EditOutline } from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Toast } from 'flowbite-svelte';

	const { data } = $props();

	let showToast = $state(false);
	let toastMessage = $state('');
	let isSuccess = $state(false);

	let firstname = $derived(data.pub_user?.first_name || '');
	let lastname = $derived(data.pub_user?.last_name || '');
	let phone = $derived(data.pub_user?.phone_number || '');

	let selectedFile = $state<File | null>(null);
	let imgUrl = $derived.by(() => {
		const baseUrl = data.pub_user?.img_url;
		if (!baseUrl) return '';

		if (selectedFile) {
			return URL.createObjectURL(selectedFile);
		}

		const timestamp = data.pub_user?.updated_at
			? new Date(data.pub_user.updated_at).getTime()
			: Date.now();
		return `${baseUrl}?t=${timestamp}`;
	});

	let fileInput: HTMLInputElement;
	let form: HTMLFormElement;

	let isSaving = $state(false);

	function handleImageClick() {
		fileInput?.click();
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			selectedFile = file;
		}
	}
</script>

<div class="relative h-screen overflow-hidden">
	<div class="from-pp-pink to-pp-light-pink relative h-[17.5%] bg-gradient-to-t p-6">
		{#if showToast}
			<Toast color={isSuccess ? 'green' : 'red'} class="fixed top-4 right-4 z-50">
				{toastMessage}
			</Toast>
		{/if}

		<a
			href={resolve('/profile')}
			class="text-pp-white active:text-pp-darker-pink absolute top-6 left-6 flex items-center gap-1 transition"
		>
			<ArrowLeftOutline class="h-8 w-8" />
		</a>

		<div class="text-pp-white text-center text-2xl font-semibold">Edit Profile</div>

		<form
			method="POST"
			enctype="multipart/form-data"
			bind:this={form}
			use:enhance={() => {
				isSaving = true;
				return async ({ result, update }) => {
					if (result.type === 'success') {
						const formData = result.data as { success?: boolean; message?: string } | undefined;
						if (formData?.success) {
							toastMessage = 'Profile updated successfully!';
							isSuccess = true;
						} else {
							toastMessage = formData?.message || 'Update failed';
							isSuccess = false;
						}
					} else if (result.type === 'failure') {
						const errorData = result.data as { message?: string } | undefined;
						toastMessage = errorData?.message || 'An error occurred';
						isSuccess = false;
					} else {
						toastMessage = 'Profile updated successfully!';
						isSuccess = true;
					}
					await update({ reset: false });
					isSaving = false;
					showToast = true;
					setTimeout(() => (showToast = false), 2000);
					await invalidateAll();
				};
			}}
		>
			<div class="mt-8 flex flex-col items-center">
				<div
					class="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-white"
				>
					<img src={imgUrl} alt="Profile" class="h-full w-full rounded-full object-cover" />
				</div>
				<input
					type="file"
					accept="image/*"
					bind:this={fileInput}
					onchange={handleFileChange}
					class="hidden"
					name="profile_image"
				/>
				<button type="button" onclick={handleImageClick} class="focus:outline-none">
					<div
						class="flex h-10 w-10 translate-x-12 -translate-y-9 items-center justify-center
								rounded-full bg-emerald-400 active:bg-emerald-500"
					>
						<EditOutline class="absolute left-2.5 h-6 w-6 text-white" />
					</div>
				</button>
			</div>
		</form>
	</div>

	<div class="absolute top-[23%] left-1/2 mx-auto mt-10 w-84 -translate-x-1/2">
		<div class="mb-1 grid gap-2.5 px-3 pt-2">
			<div>
				<label for="firstname" class="text-pp-gray mb-2.5 text-sm font-medium">First Name</label>
				<input
					type="text"
					id="firstname"
					name="firstname"
					bind:value={firstname}
					class="border-pp-gray placeholder-pp-gray w-full rounded-md border px-2.5 py-2.5 text-xs"
					placeholder="First Name"
					required
				/>
			</div>

			<div>
				<label for="lastname" class="text-pp-gray mb-2.5 text-sm font-medium">Last Name</label>
				<input
					type="text"
					id="lastname"
					name="lastname"
					bind:value={lastname}
					class="border-pp-gray placeholder-pp-gray w-full rounded-md border px-2.5 py-2.5 text-xs"
					placeholder="Last Name"
					required
				/>
			</div>

			<div>
				<label for="phone" class="text-pp-gray mb-2.5 text-sm font-medium">Phone Number</label>
				<input
					type="tel"
					id="phone"
					name="phone"
					bind:value={phone}
					class="border-pp-gray placeholder-pp-gray w-full rounded-md border px-2.5 py-2.5 text-xs"
					placeholder="+63 912 345 6789"
					required
				/>
			</div>
		</div>

		<div class="pt-4 pr-6 pb-12">
			<button
				type="submit"
				class="bg-pp-pink text-pp-white active:bg-pp-darker-pink float-right rounded-lg px-4 py-1 text-xs"
				disabled={isSaving}
			>
				{isSaving ? 'Saving...' : 'Save changes'}
			</button>
		</div>
	</div>
</div>
