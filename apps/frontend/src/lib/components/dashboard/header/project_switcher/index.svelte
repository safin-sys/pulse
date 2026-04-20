<script lang="ts">
	import { projects } from "$lib/stores/projects.svelte";
	import { dashboard } from "$lib/stores/dashboard.svelte";
	import { Popover } from "bits-ui";
	import CreateProjectForm from "./create_project_form.svelte";
	import type { Project } from "$lib/types/project";
	import { toast } from "svelte-sonner";

	let popover_open = $state(false);
	let selected_project = $derived(projects.selected_project);
	let { demo } = $derived(dashboard);

	// create project form logic ---------
	let create_open = $state(false);
	let new_project_name = $state("");
	let new_project_domain = $state("");

	const open_create_form = () => {
		if (demo) {
			toast.error("Creating projects is not available in demo mode", {
				position: "top-center"
			});
			return;
		}
		create_open = true;
		new_project_name = "";
		new_project_domain = "";
	};
	// create project form logic ---------

	const handle_select_project = (project: Project) => {
		projects.selected_project = project;
		popover_open = false;
	};
</script>

<Popover.Root bind:open={popover_open}>
	<Popover.Trigger
		class="group flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-accent"
	>
		<span class="max-w-[140px] truncate font-medium text-zinc-200">{selected_project?.name}</span>
		<span class="hidden max-w-[100px] truncate text-xs text-zinc-500 sm:inline"
			>{selected_project?.domain}</span
		>
		<svg
			class="h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform group-data-[state=open]:rotate-180"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</Popover.Trigger>

	<Popover.Content
		class="w-[300px] rounded-xl border border-accent bg-background p-1.5 shadow-2xl backdrop-blur-xl"
		align="start"
		sideOffset={8}
	>
		{#if create_open}
			<CreateProjectForm
				bind:popover_open
				bind:create_open
				bind:new_project_name
				bind:new_project_domain
			/>
		{:else}
			<!-- Projects List -->
			<div class="flex flex-col py-1">
				<div class="no-scrollbar flex max-h-[240px] flex-col gap-2 overflow-y-auto">
					{#each projects.data as project}
						<button
							onclick={() => handle_select_project(project)}
							class="group/item flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent {selected_project?.id ===
							project.id
								? 'bg-accent'
								: ''}"
						>
							<div class="flex w-full items-center justify-between">
								<span class="truncate text-sm font-medium text-zinc-200">{project.name}</span>
								{#if selected_project?.id === project.id}
									<svg
										class="h-4 w-4 shrink-0 text-zinc-300"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M20 6 9 17l-5-5" />
									</svg>
								{/if}
							</div>
							<span class="truncate text-xs text-zinc-500">{project.domain}</span>
						</button>
					{/each}
				</div>

				<!-- Divider -->
				<div class="mx-2 my-1.5 h-px bg-white/10"></div>

				<!-- Create New Project -->
				<button
					onclick={open_create_form}
					class="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent"
				>
					<span class="flex h-5 w-5 items-center justify-center rounded-md border border-zinc-700">
						<svg
							class="h-3 w-3 text-zinc-500"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 5v14M5 12h14" />
						</svg>
					</span>
					<span class="text-sm text-zinc-400">New Project</span>
				</button>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
