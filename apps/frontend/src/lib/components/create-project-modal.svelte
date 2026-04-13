<script lang="ts">
	import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "$lib/components/ui/dialog";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { projects as store, create_project, fetch_projects } from "$lib/stores/projects.svelte";
	import { toast } from "svelte-sonner";

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		onSuccess?: () => void;
	}

	let { open = $bindable(false), onOpenChange, onSuccess }: Props = $props();

	let name = $state("");
	let domain = $state("");

	async function handleSubmit(e: SubmitEvent) {
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
		onOpenChange(false);
		onSuccess?.();
	}

	function handleClose() {
		name = "";
		domain = "";
		open = false;
	}

	function handleNameInput(e: Event) {
		name = (e.target as HTMLInputElement).value;
	}

	function handleDomainInput(e: Event) {
		domain = (e.target as HTMLInputElement).value;
	}
</script>

<Dialog bind:open onOpenChange={(open) => !store.loading && onOpenChange(open)}>
	<DialogContent class="bg-background">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-1">
				<DialogTitle>Create your first project</DialogTitle>
				<DialogDescription>
					Add a name and domain to get started with Pulse.
				</DialogDescription>
			</div>

			<form onsubmit={handleSubmit} class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<label for="project-name" class="text-sm font-medium text-white">Name</label>
					<Input
						id="project-name"
						type="text"
						placeholder="My Awesome Project"
						value={name}
						oninput={handleNameInput}
						disabled={store.loading}
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
						oninput={handleDomainInput}
						disabled={store.loading}
						required
					/>
					<p class="text-xs text-white/40">Enter your website's domain (e.g., example.com)</p>
				</div>

				{#if store.error}
					<p class="text-sm text-red-400">{store.error}</p>
				{/if}

				<div class="flex justify-end gap-3 pt-2">
					<Button type="button" variant="ghost" onclick={handleClose} disabled={store.loading}>
						Cancel
					</Button>
					<Button type="submit" disabled={store.loading}>
						{store.loading ? "Creating..." : "Create Project"}
					</Button>
				</div>
			</form>
		</div>

		<DialogClose class="absolute right-4 top-4 rounded-md p-1 hover:bg-white/5">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M18 6 6 18"/><path d="m6 6 12 12"/>
			</svg>
			<span class="sr-only">Close</span>
		</DialogClose>
	</DialogContent>
</Dialog>
