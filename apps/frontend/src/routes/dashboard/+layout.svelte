<script lang="ts">
	import Header from "$lib/components/dashboard/header/index.svelte";
	import FloatingNav from "$lib/components/floating-nav.svelte";
	import { projects } from "$lib/stores/projects.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>{projects.selected_project?.name || "Orbit"} | Dashboard</title>
</svelte:head>

<div class="h-screen overflow-x-hidden bg-background font-sans text-foreground">
	<Header />
	{@render children?.()}
	<FloatingNav />
</div>
