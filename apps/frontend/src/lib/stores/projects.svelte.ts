import { projects as api } from "$lib/api/projects";

export let projects = $state({
	data: [] as any[],
	selected_project: null as any,
	loading: false,
	error: ""
});

export const fetch_projects = async () => {
	projects.error = "";
	projects.loading = true;
	const { data, error } = await api.getAll();
	if (error) {
		projects.error = error?.message || "Something went wrong";
		projects.loading = false;
		return false;
	}
	projects.data = data.projects;
	projects.loading = false;
	return true;
};

export const create_project = async (name: string, domain: string) => {
	projects.error = "";
	projects.loading = true;
	const { data, error } = await api.create({ name, domain });
	if (error) {
		projects.error = error?.message || "Something went wrong";
		projects.loading = false;
		return false;
	}
	projects.data = [data.project, ...projects.data];
	projects.loading = false;
	return true;
};

export const update_project = async (project_id: string, body: { name?: string }) => {
	projects.error = "";
	projects.loading = true;
	const { data, error } = await api.update(project_id, body);
	if (error) {
		projects.error = error?.message || "Something went wrong";
		projects.loading = false;
		return false;
	}
	projects.data = projects.data.map((p) =>
		p.id === project_id ? data.project : p
	);
	projects.loading = false;
	return true;
};

export const delete_project = async (project_id: string) => {
	projects.error = "";
	projects.loading = true;
	const { error } = await api.delete(project_id);
	if (error) {
		projects.error = error?.message || "Something went wrong";
		projects.loading = false;
		return false;
	}
	const was_selected = projects.selected_project?.id === project_id;
	projects.data = projects.data.filter((p) => p.id !== project_id);
	if (was_selected) {
		projects.selected_project = projects.data[0] || null;
	}
	projects.loading = false;
	return true;
};

export const select_project = (project: string) => {
	projects.selected_project = project;
};