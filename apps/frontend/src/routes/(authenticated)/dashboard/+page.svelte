<script lang="ts">
	import { dashboard } from "$lib/api";
	import DashboardView from "$lib/components/dashboard/view.svelte";
	import { dashboard as dashboardStore } from "$lib/stores/dashboard.svelte";
	import { projects as projectsStore } from "$lib/stores/projects.svelte";
	import type { DashboardResponse, RangeSlug, DashboardQueryParams } from "$lib/types/dashboard";

	let projectsList = $derived(projectsStore.data);
	let project = $derived(projectsStore.selected_project);
	let projectLoading = $derived(projectsStore.loading);
	let dashboardData: DashboardResponse | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	let selectedRange: RangeSlug = $derived(dashboardStore.range);
	let locationView: "country" | "region" | "city" = $state("country");
	let deviceView: "browser" | "os" | "device" = $state("browser");

	const fetchDashboard = async () => {
		if (!project) return;
		loading = true;
		error = null;

		const params: DashboardQueryParams = {
			range: selectedRange,
			locationView,
			deviceView
		};

		const { data, error: err } = await dashboard.get(project.domain, params);
		if (err) {
			error = err.message || "Failed to fetch dashboard";
			loading = false;
			return;
		}

		dashboardData = data.data;
		loading = false;
	};

	const handleLocationViewChange = (view: "country" | "region" | "city") => {
		locationView = view;
		fetchDashboard();
	};

	const handleDeviceViewChange = (view: "browser" | "os" | "device") => {
		deviceView = view;
		fetchDashboard();
	};

	$effect(() => {
		if (project) {
			fetchDashboard();
		}
	});
</script>

{#if projectLoading}
	<div class="flex h-full items-center justify-center">
		<div class="flex flex-col items-center gap-4">
			<div class="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary"></div>
			<p class="text-sm text-muted-foreground">Loading dashboard...</p>
		</div>
	</div>
{:else}
	<DashboardView
		data={dashboardData}
		{loading}
		{error}
		project={project}
		{locationView}
		{deviceView}
		onLocationViewChange={handleLocationViewChange}
		onDeviceViewChange={handleDeviceViewChange}
		onRetry={fetchDashboard}
	/>
{/if}