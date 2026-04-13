<script lang="ts">
	import { Popover } from "bits-ui";
	import { projects as store, fetch_projects, create_project, select_project } from "$lib/stores/projects.svelte";
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
	let rangePopoverOpen = $state(false);
	let createName = $state("");
	let createDomain = $state("");
	let showCreateForm = $state(false);

	function getSelectedRangeLabel(): string {
		return ranges.find(r => r.value === selectedRange)?.label || "Select";
	}

	function handleSelectProject(project: Project) {
		select_project(project.id);
		onProjectChange(project);
		popoverOpen = false;
	}

	function openCreateForm() {
		showCreateForm = true;
		createName = "";
		createDomain = "";
	}

	async function handleCreate(e: SubmitEvent) {
		e.preventDefault();

		const success = await create_project(createName, createDomain);

		showCreateForm = false;
		popoverOpen = false;
		createName = "";
		createDomain = "";

		if (success) {
			await fetch_projects();
			onProjectCreated();
		}
	}

	function handleCancelCreate() {
		showCreateForm = false;
		createName = "";
		createDomain = "";
	}
</script>

<header class="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
		<div class="flex items-center gap-4">
			<!-- Logo -->
			<div class="flex items-center gap-2.5">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="22"
					height="22"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					class="text-zinc-100"
				>
					<path
						d="M22 8.5C22 9.88071 20.8807 11 19.5 11C18.1193 11 17 9.88071 17 8.5C17 7.11929 18.1193 6 19.5 6C20.8807 6 22 7.11929 22 8.5Z"
					/>
					<path
						d="M5.63604 18.364C4.00736 16.7353 3 14.4853 3 12C3 7.02944 7.02944 3 12 3C13.6393 3 15.1762 3.43827 16.5 4.20404M8.5 20.2941C9.57589 20.7487 10.7586 21 12 21C16.9706 21 21 16.9706 21 12C21 11.5348 20.9647 11.0778 20.8966 10.6315"
					/>
					<path
						d="M21.1733 6.37998C22.0683 4.52002 22.2767 3.07282 21.6005 2.39789C20.7268 1.52568 18.5637 2.13056 15.8873 3.78543M18.3049 10.8298C17.2978 12.1187 16.1137 13.4588 14.7889 14.7838C9.48663 20.0868 3.93971 23.1394 2.39946 21.6018C1.52229 20.7262 2.13378 18.5507 3.8022 15.8604"
					/>
				</svg>
				<span class="text-base font-semibold tracking-tight text-zinc-100">Orbit</span>
			</div>

			<!-- Divider -->
			<div class="h-5 w-px bg-white/10"></div>

			<!-- Project Switcher -->
			<PopoverRoot bind:open={popoverOpen}>
				<PopoverTrigger
					class="group flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-white/5"
				>
					<span class="max-w-[140px] truncate font-medium text-zinc-200">{currentProject.name}</span>
					<span class="hidden max-w-[100px] truncate text-xs text-zinc-500 sm:inline"
						>{currentProject.domain}</span
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
				</PopoverTrigger>

				<PopoverContent
					class="w-[300px] rounded-xl border border-white/10 bg-zinc-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
					align="start"
					sideOffset={8}
				>
					{#if showCreateForm}
						<!-- Create Project Form -->
						<div class="flex flex-col gap-3 p-2">
							<div class="flex items-center justify-between">
								<h3 class="text-sm font-semibold text-zinc-100">New Project</h3>
								<button
									onclick={handleCancelCreate}
									class="rounded p-1 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
								>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M18 6 6 18"/><path d="m6 6 12 12"/>
									</svg>
								</button>
							</div>
							<form onsubmit={handleCreate} class="flex flex-col gap-3">
								<div class="flex flex-col gap-1.5">
									<label for="new-project-name" class="text-xs font-medium text-zinc-400"
										>Name</label
									>
									<input
										id="new-project-name"
										type="text"
										placeholder="My Project"
										bind:value={createName}
										disabled={store.loading}
										required
										class="h-9 w-full rounded-md border border-white/10 bg-zinc-950/50 px-3 text-sm text-zinc-100 transition-colors placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/50"
									/>
								</div>
								<div class="flex flex-col gap-1.5">
									<label for="new-project-domain" class="text-xs font-medium text-zinc-400"
										>Domain</label
									>
									<input
										id="new-project-domain"
										type="text"
										placeholder="example.com"
										bind:value={createDomain}
										disabled={store.loading}
										required
										class="h-9 w-full rounded-md border border-white/10 bg-zinc-950/50 px-3 text-sm text-zinc-100 transition-colors placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/50"
									/>
									<p class="text-[10px] text-zinc-600">Your website's domain</p>
								</div>

								{#if store.error}
									<p class="text-xs text-red-400">{store.error}</p>
								{/if}

								<div class="flex gap-2 pt-1">
									<button
										type="button"
										onclick={handleCancelCreate}
										disabled={store.loading}
										class="h-9 flex-1 cursor-pointer rounded-md text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200 disabled:opacity-50"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={store.loading}
										class="h-9 flex-1 cursor-pointer rounded-md bg-zinc-100 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white disabled:opacity-50"
									>
										{store.loading ? "Creating..." : "Create"}
									</button>
								</div>
							</form>
						</div>
					{:else}
						<!-- Projects List -->
						<div class="flex flex-col py-1">
							<div class="flex max-h-[240px] flex-col overflow-y-auto no-scrollbar">
								{#each projects as project}
									<button
										onclick={() => handleSelectProject(project)}
										class="group/item flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-white/5 {currentProject.id ===
										project.id
											? 'bg-white/5'
											: ''}"
									>
										<div class="flex w-full items-center justify-between">
											<span class="truncate text-sm font-medium text-zinc-200">{project.name}</span>
											{#if currentProject.id === project.id}
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
								onclick={openCreateForm}
								class="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-white/5"
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
				</PopoverContent>
			</PopoverRoot>
		</div>

		<!-- Range Selector -->
		<PopoverRoot bind:open={rangePopoverOpen}>
			<PopoverTrigger
				class="group flex cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-zinc-900/50 px-3 py-1.5 text-sm transition-colors hover:bg-white/5"
			>
				<span class="text-xs font-medium text-zinc-300">{getSelectedRangeLabel()}</span>
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
			</PopoverTrigger>

			<PopoverContent
				class="w-[160px] rounded-xl border border-white/10 bg-zinc-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
				align="end"
				sideOffset={8}
			>
				<div class="flex flex-col py-1">
					{#each ranges as range}
						<button
							onclick={() => { onRangeChange(range.value); rangePopoverOpen = false; }}
							class="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-white/5 {selectedRange === range.value
								? 'text-zinc-100'
								: 'text-zinc-400'}"
						>
							<span>{range.label}</span>
							{#if selectedRange === range.value}
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
						</button>
					{/each}
				</div>
			</PopoverContent>
		</PopoverRoot>
	</div>
</header>
