import type { DashboardQueryParams, DashboardResponse, RangeSlug } from "$lib/types/dashboard";
import { projects } from "./projects.svelte";
import { dashboard as api } from "$lib/api/dashboard";
import { seed_dashboard } from "$lib/helpers/seed";

export let dashboard = $state({
	demo: false,
	params: {
		range: "today" as RangeSlug,
		pageView: undefined,
		sourceView: undefined,
		locationView: "country",
		deviceView: "browser",
		hostname: undefined,
		page: undefined,
		referrer: undefined,
		country: undefined,
		device: undefined,
		browser: undefined,
		os: undefined
	} as DashboardQueryParams,
	data: null as null | DashboardResponse,
	loading: true,
	error: ""
});

let selected_project = $derived(projects.selected_project);

export const fetch_dashboard = async () => {
	if (!selected_project) return;
	dashboard.loading = dashboard.data === null;
	dashboard.error = "";

	if (dashboard.demo) {
		dashboard.data = seed_dashboard(dashboard.params, selected_project.id);
		dashboard.loading = false;
		return;
	}

	const { data, error: err } = await api.get(selected_project.domain, dashboard.params);
	if (err) {
		dashboard.error = err.message || "Failed to fetch dashboard";
		dashboard.loading = false;
		return;
	}

	dashboard.data = data.data;
	dashboard.loading = false;
};

export const handle_params = <K extends keyof DashboardQueryParams>(
	field: K,
	value: DashboardQueryParams[K]
) => {
	dashboard.params[field] = value;
	// fetch_dashboard();
};

export const reset_dashboard = () => {
	dashboard.demo = false;
	dashboard.params = {
		range: "today" as RangeSlug,
		pageView: undefined,
		sourceView: undefined,
		locationView: "country",
		deviceView: "browser",
		hostname: undefined,
		page: undefined,
		referrer: undefined,
		country: undefined,
		device: undefined,
		browser: undefined,
		os: undefined
	};
	dashboard.data = null;
	dashboard.loading = true;
	dashboard.error = "";
};
