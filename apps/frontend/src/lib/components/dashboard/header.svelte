<script lang="ts">
	import { Popover } from "bits-ui";
	import { projects as projectsApi } from "$lib/api/projects";
	import type { RangeSlug } from "$lib/types/dashboard";

	const PopoverRoot = Popover.Root;
	const PopoverTrigger = Popover.Trigger;
	const PopoverContent = Popover.Content;

	interface Project {
		id: string;
		name: string;
		domain: string;
	}

	interface Props {
		projects: Project[];
		currentProject: Project;
		selectedRange: RangeSlug;
		ranges: { value: RangeSlug; label: string }[];
		onProjectChange: (project: Project) => void;
		onRangeChange: (range: RangeSlug) => void;
		onProjectCreated: () => void;
	}

	let {
		projects,
		currentProject,
		selectedRange,
		ranges,
		onProjectChange,
		onRangeChange,
		onProjectCreated
	}: Props = $props();

	let popoverOpen = $state(false);
	let createName = $state("");
	let createDomain = $state("");
	let creating = $state(false);
	let createError = $state("");
	let showCreateForm = $state(false);

	function handleSelectProject(project: Project) {
		onProjectChange(project);
		popoverOpen = false;
	}

	function openCreateForm() {
		showCreateForm = true;
		createName = "";
		createDomain = "";
		createError = "";
	}

	async function handleCreate(e: SubmitEvent) {
		e.preventDefault();
		creating = true;
		createError = "";

		const result = await projectsApi.create({ name: createName, domain: createDomain });

		if (result.error) {
			createError = result.error.message || "Failed to create project";
			creating = false;
			return;
		}

		creating = false;
		showCreateForm = false;
		popoverOpen = false;
		createName = "";
		createDomain = "";
		onProjectCreated();
	}

	function handleCancelCreate() {
		showCreateForm = false;
		createName = "";
		createDomain = "";
		createError = "";
	}
</script>

<header class="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
		<div class="flex items-center gap-3">
			<!-- Logo -->
			<div class="flex items-center gap-2">
				<div class="w-8 h-8 rounded-[20%] bg-linear-to-br from-cyan-500 via-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
					<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 12h4l3-9 4 18 3-9h4"/>
					</svg>
				</div>
				<span class="text-lg font-semibold tracking-tight">Pulse</span>
			</div>

			<!-- Divider -->
			<div class="h-5 w-px bg-white/10"></div>

			<!-- Project Switcher -->
			<PopoverRoot bind:open={popoverOpen}>
				<PopoverTrigger class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors outline-none">
					<span class="font-medium text-white truncate max-w-[160px]">{currentProject.name}</span>
					<span class="text-white/40 truncate max-w-[120px] hidden sm:inline">{currentProject.domain}</span>
					<svg class="w-4 h-4 text-white/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m6 9 6 6 6-6"/>
					</svg>
				</PopoverTrigger>

				<PopoverContent class="w-[280px] p-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50" align="start">
					{#if showCreateForm}
						<!-- Create Project Form -->
						<div class="flex flex-col gap-3 p-2">
							<h3 class="text-sm font-semibold text-white">New Project</h3>
							<form onsubmit={handleCreate} class="flex flex-col gap-3">
								<div class="flex flex-col gap-1.5">
									<label for="new-project-name" class="text-xs font-medium text-white/70">Name</label>
									<input
										id="new-project-name"
										type="text"
										placeholder="My Project"
										bind:value={createName}
										disabled={creating}
										required
										class="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500 transition-colors"
									/>
								</div>
								<div class="flex flex-col gap-1.5">
									<label for="new-project-domain" class="text-xs font-medium text-white/70">Domain</label>
									<input
										id="new-project-domain"
										type="text"
										placeholder="example.com"
										bind:value={createDomain}
										disabled={creating}
										required
										class="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500 transition-colors"
									/>
									<p class="text-[10px] text-white/40">Your website's domain</p>
								</div>

								{#if createError}
									<p class="text-xs text-red-400">{createError}</p>
								{/if}

								<div class="flex gap-2 pt-1">
									<button
										type="button"
										onclick={handleCancelCreate}
										disabled={creating}
										class="flex-1 h-9 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={creating}
										class="flex-1 h-9 rounded-lg text-sm font-medium text-white bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
									>
										{creating ? "Creating..." : "Create"}
									</button>
								</div>
							</form>
						</div>
					{:else}
						<!-- Projects List -->
						<div class="flex flex-col max-h-[320px] overflow-y-auto">
							{#each projects as project}
								<button
									onclick={() => handleSelectProject(project)}
									class="flex flex-col items-start gap-0.5 w-full px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors mb-2 cursor-pointer {currentProject.id === project.id ? 'bg-white/5' : ''}"
								>
									<div class="flex items-center gap-2 w-full">
										<span class="text-sm font-medium text-white truncate">{project.name}</span>
										{#if currentProject.id === project.id}
											<svg class="w-4 h-4 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
												<path d="M20 6 9 17l-5-5"/>
											</svg>
										{/if}
									</div>
									<span class="text-xs text-white/40 truncate">{project.domain}</span>
								</button>
							{/each}

							<!-- Divider -->
							<div class="h-px bg-white/10 my-1.5 mx-2"></div>

							<!-- Create New Project -->
							<button
								onclick={openCreateForm}
								class="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors cursor-pointer"
							>
								<svg class="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M12 5v14M5 12h14"/>
								</svg>
								<span class="text-sm text-white/70">New Project</span>
							</button>
						</div>
					{/if}
				</PopoverContent>
			</PopoverRoot>
		</div>

		<!-- Range Selector -->
		<div class="flex items-center gap-2">
			<select
				value={selectedRange}
				onchange={(e) => onRangeChange(e.currentTarget.value as RangeSlug)}
				class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none hover:bg-white/10 focus:border-blue-500 transition-colors cursor-pointer"
			>
				{#each ranges as range}
					<option value={range.value} class="bg-zinc-900">{range.label}</option>
				{/each}
			</select>
		</div>
	</div>
</header>
