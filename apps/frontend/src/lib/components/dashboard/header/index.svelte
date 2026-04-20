<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { fetch_projects, projects } from "$lib/stores/projects.svelte";
	import Logo from "./logo.svelte";
	import Modal from "./modal.svelte";
	import ProjectSwitcher from "./project_switcher/index.svelte";
	import Range from "./range.svelte";
	import { toast } from "svelte-sonner";
	import { dashboard } from "$lib/stores/dashboard.svelte";
	import { onMount } from "svelte";

	let modal = $state(false);
	let { demo } = $derived(dashboard);

	onMount(async () => {
		await fetch_projects();
		if (projects.data.length === 0) {
			modal = true;
		}
	});

	const handle_create_project = () => {
		if (demo) {
			toast.error("Creating projects is not available in demo mode", {
				position: "top-center"
			});
			return;
		}
		modal = true;
	};
</script>

<header class="sticky top-0 z-40 border-b border-accent bg-background backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
		<div class="flex items-center gap-4">
			<!-- Logo -->
			<Logo />

			{#if projects.data.length}
				<!-- Divider -->
				<div class="h-5 w-px bg-white/10"></div>
				<!-- Project Switcher -->
				<ProjectSwitcher />
			{/if}
		</div>

		{#if projects.data.length}
			<!-- Range Selector -->
			<Range />
		{:else}
			<!-- Create new project button -->
			<Button variant="outline" disabled={projects.loading} onclick={handle_create_project}
				>Create Project</Button
			>
		{/if}
	</div>
	<Modal bind:open={modal} />
</header>
