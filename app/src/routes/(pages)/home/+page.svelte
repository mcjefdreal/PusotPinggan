<script lang="ts">
	let { data } = $props();

	let email = $derived(data.user?.email);
</script>

<div class="min-h-screen w-full">
	<h1>hello, {email}</h1>
</div>
