<script lang="ts">
	import { projects } from "$lib/api";
	import CreateProjectModal from "$lib/components/create-project-modal.svelte";
	import { onMount } from "svelte";

	let showModal = $state(false);
	let project: any = $state(null);

	const get_projects = async () => {
		const { data } = await projects.getAll();

		if (data.data.projects.length === 0) {
			showModal = true;
		}

		project = data.data.projects[0];
	};

	onMount(() => {
		get_projects();
	});

	function handleModalClose(open: boolean) {
		showModal = open;
	}

	function handleSuccess() {
		window.location.reload();
	}
</script>

<h1>{project?.name ?? "WIP"}</h1>

<CreateProjectModal
	bind:open={showModal}
	onOpenChange={handleModalClose}
	onSuccess={handleSuccess}
/>
