<script lang="ts">
	import { page } from "$app/state";
	import Header from "$lib/components/dashboard/header/index.svelte";
	import FloatingNav from "$lib/components/common/nav.svelte";
	import { projects } from "$lib/stores/projects.svelte";
	import { dashboard } from "$lib/stores/dashboard.svelte";

	dashboard.demo = true;

	let { children } = $props();

	let pageTitle = $derived(() => {
		const pathname = page.url.pathname;
		if (pathname === "/settings") return "Settings";
		return "Dashboard";
	});
</script>

<svelte:head>
	<title>{projects.selected_project?.name || "Orbit"} | {pageTitle()}</title>
</svelte:head>

<div class="h-screen overflow-x-hidden bg-background font-sans text-foreground">
	<Header />
	{#if projects.data.length}
		{@render children?.()}
	{:else}
		<div class="flex h-full items-center justify-center">
			<div class="flex flex-col items-center gap-4">
				<p class="text-muted-foreground">Waiting for a project to be created...</p>
			</div>
		</div>
	{/if}
	<FloatingNav />
</div>
