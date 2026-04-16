<script lang="ts">
	import { create_project, fetch_projects, projects } from "$lib/stores/projects.svelte";
	import { toast } from "svelte-sonner";

	let {
		popover_open = $bindable(true),
		create_open = $bindable(true),
		new_project_name = $bindable(""),
		new_project_domain = $bindable("")
	} = $props();

	const handle_cancel = () => {
		create_open = false;
		new_project_name = "";
		new_project_domain = "";
	};

	const handle_create = async (e: SubmitEvent) => {
		e.preventDefault();

		const success = await create_project(new_project_name, new_project_domain);

		if (success) {
			create_open = false;
			popover_open = false;
			await fetch_projects();
			toast.success("Project created", {
				description: `${new_project_domain} is now being tracked.`,
				position: "top-center"
			});
			new_project_name = "";
			new_project_domain = "";
		}
	};
</script>

<div class="flex flex-col gap-3 p-2">
	<div class="flex items-center justify-between">
		<h3 class="text-sm font-semibold text-zinc-100">New Project</h3>
		<button
			onclick={handle_cancel}
			class="rounded-md p-1 text-zinc-500 hover:cursor-pointer hover:bg-white/5 hover:text-zinc-300"
			title="Cross Icon"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M18 6 6 18" /><path d="m6 6 12 12" />
			</svg>
		</button>
	</div>
	<form onsubmit={handle_create} class="flex flex-col gap-3">
		<div class="flex flex-col gap-1.5">
			<label for="new-project-name" class="text-xs font-medium text-zinc-400">Name</label>
			<input
				id="new-project-name"
				type="text"
				placeholder="My Project"
				bind:value={new_project_name}
				disabled={projects.loading}
				required
				class="h-9 w-full rounded-md border border-white/10 bg-zinc-950/50 px-3 text-sm text-zinc-100 transition-colors placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/50 focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-1.5">
			<label for="new-project-domain" class="text-xs font-medium text-zinc-400">Domain</label>
			<input
				id="new-project-domain"
				type="text"
				placeholder="example.com"
				bind:value={new_project_domain}
				disabled={projects.loading}
				required
				class="h-9 w-full rounded-md border border-white/10 bg-zinc-950/50 px-3 text-sm text-zinc-100 transition-colors placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/50 focus:outline-none"
			/>
			<p class="text-[10px] text-zinc-600">Your website's domain</p>
		</div>

		{#if projects.error}
			<p class="text-xs text-red-400">{projects.error}</p>
		{/if}

		<div class="flex gap-2 pt-1">
			<button
				type="button"
				onclick={handle_cancel}
				disabled={projects.loading}
				class="h-9 flex-1 cursor-pointer rounded-md text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200 disabled:opacity-50"
			>
				Cancel
			</button>
			<button
				type="submit"
				disabled={projects.loading}
				class="h-9 flex-1 cursor-pointer rounded-md bg-zinc-100 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white disabled:opacity-50"
			>
				{projects.loading ? "Creating..." : "Create"}
			</button>
		</div>
	</form>
</div>
