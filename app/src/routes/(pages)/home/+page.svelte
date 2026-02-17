<script lang="ts">
	let { data } = $props();

	let email = $derived(data.user?.email);
</script>

<div class="w-full min-h-screen">
	<h1>hello, {email}</h1>
</div>
