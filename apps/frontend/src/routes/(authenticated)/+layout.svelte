<script lang="ts">
	import { page } from "$app/stores";
	import Header from "$lib/components/dashboard/header/index.svelte";
	import FloatingNav from "$lib/components/floating-nav.svelte";
	import { projects } from "$lib/stores/projects.svelte";

	let { children } = $props();

	let pageTitle = $derived(() => {
		const pathname = $page.url.pathname;
		if (pathname === "/settings") return "Settings";
		return "Dashboard";
	});
</script>

<svelte:head>
	<title>{projects.selected_project?.name || "Orbit"} | {pageTitle()}</title>
</svelte:head>

<div class="h-screen overflow-x-hidden bg-background font-sans text-foreground">
	<Header />
	{@render children?.()}
	<FloatingNav />
</div>
