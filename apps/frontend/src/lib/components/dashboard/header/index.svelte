<script lang="ts">
	import { fetch_projects } from "$lib/stores/projects.svelte";
	import Logo from "./logo.svelte";
	import ProjectSwitcher from "./project_switcher/index.svelte";
	import Range from "./range.svelte";
	import { onMount } from "svelte";

	onMount(async () => {
		await fetch_projects();
	});
</script>

<header class="sticky top-0 z-40 border-b border-accent bg-background backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
		<div class="flex items-center gap-4">
			<!-- Logo -->
			<Logo />

			<!-- Divider -->
			<div class="h-5 w-px bg-white/10"></div>

			<!-- Project Switcher -->
			<ProjectSwitcher />
		</div>

		<!-- Range Selector -->
		<Range />
	</div>
</header>
