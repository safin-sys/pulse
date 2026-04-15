<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogTitle,
		DialogDescription,
		DialogClose
	} from "$lib/components/ui/dialog";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { projects, create_project, fetch_projects } from "$lib/stores/projects.svelte";
	import { toast } from "svelte-sonner";

	let { open = $bindable(false) } = $props();

	let name = $state("");
	let domain = $state("");

	const handle_submit = async (e: SubmitEvent) => {
		e.preventDefault();

		const success = await create_project(name, domain);

		if (!success) {
			return;
		}

		toast.success("Project created", {
			description: `${domain} is now being tracked.`,
			position: "top-center"
		});

		name = "";
		domain = "";
		await fetch_projects();
		open = false;
	};

	const handle_close = () => {
		name = "";
		domain = "";
		open = false;
	};
</script>

<Dialog bind:open>
	<DialogContent class="bg-background">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-1">
				<DialogTitle>Create your first project</DialogTitle>
				<DialogDescription>Add a name and domain to get started with Orbit</DialogDescription>
			</div>

			<form onsubmit={handle_submit} class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<label for="project-name" class="text-sm font-medium text-white">Name</label>
					<Input
						id="project-name"
						type="text"
						placeholder="My Awesome Project"
						value={name}
						oninput={(e) => (name = (e.target as HTMLInputElement).value)}
						disabled={projects.loading}
						required
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="project-domain" class="text-sm font-medium text-white">Domain</label>
					<Input
						id="project-domain"
						type="text"
						placeholder="example.com"
						value={domain}
						oninput={(e) => (domain = (e.target as HTMLInputElement).value)}
						disabled={projects.loading}
						required
					/>
					<p class="text-xs text-white/40">Enter your website's domain (e.g., example.com)</p>
				</div>

				{#if projects.error}
					<p class="text-sm text-red-400">{projects.error}</p>
				{/if}

				<div class="flex justify-end gap-3 pt-2">
					<Button type="button" variant="ghost" onclick={handle_close} disabled={projects.loading}>
						Cancel
					</Button>
					<Button type="submit" disabled={projects.loading}>
						{projects.loading ? "Creating..." : "Create Project"}
					</Button>
				</div>
			</form>
		</div>

		<DialogClose class="absolute top-4 right-4 rounded-md p-1 hover:bg-white/5">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M18 6 6 18" /><path d="m6 6 12 12" />
			</svg>
			<span class="sr-only">Close</span>
		</DialogClose>
	</DialogContent>
</Dialog>
