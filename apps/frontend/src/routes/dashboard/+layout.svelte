<script lang="ts">
	import Header from "$lib/components/dashboard/header/index.svelte";
	import FloatingNav from "$lib/components/floating-nav.svelte";

	let { children } = $props();
</script>

<div class="h-screen overflow-x-hidden bg-background font-sans text-foreground">
	<Header />
	{@render children?.()}
	<FloatingNav />
</div>
