<script lang="ts">
	import { toast } from "svelte-sonner";
	import { projects, update_project, delete_project } from "$lib/stores/projects.svelte";
	import { projects as projectsApi } from "$lib/api/projects";
	import { dashboard } from "$lib/stores/dashboard.svelte";
	let { demo } = $derived(dashboard);
	import Card, { CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import {
		Dialog,
		DialogContent,
		DialogTitle,
		DialogDescription,
		DialogClose
	} from "$lib/components/ui/dialog";
	import { Separator } from "$lib/components/ui/separator";
	import { CopyIcon, RedoIcon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";

	let name = $state(projects.selected_project?.name || "");
	let saving = $state(false);
	let deleting = $state(false);
	let rotating = $state(false);
	let showDeleteDialog = $state(false);
	let showRotateKeyDialog = $state(false);
	$effect(() => {
		if (projects.selected_project) {
			name = projects.selected_project.name;
		}
	});
	const handle_save_name = async () => {
		if (demo) {
			toast.error("Not available in demo mode", {
				position: "top-center"
			});
			return;
		}
		if (!projects.selected_project || name === projects.selected_project.name) return;
		saving = true;
		const success = await update_project(projects.selected_project.id, { name });
		saving = false;
		if (success) {
			toast.success("Project name updated", {
				position: "top-center"
			});
		} else {
			toast.error("Failed to update project name", {
				position: "top-center"
			});
		}
	};

	const handle_copy_api_key = async () => {
		if (!projects.selected_project?.api_key) return;
		await navigator.clipboard.writeText(projects.selected_project.api_key);
		toast.success("API key copied to clipboard", {
			position: "top-center"
		});
	};

	const handle_rotate_api_key = async () => {
		if (demo) {
			toast.error("Not available in demo mode", {
				position: "top-center"
			});
			showRotateKeyDialog = false;
			return;
		}
		if (!projects.selected_project) return;
		rotating = true;
		const { data, error } = await projectsApi.rotate_api_key(projects.selected_project.id);
		rotating = false;
		showRotateKeyDialog = false;
		if (data?.success && data.data?.api_key) {
			projects.selected_project.api_key = data.data.api_key;
			toast.success("API key rotated successfully", {
				position: "top-center"
			});
		} else {
			toast.error(error?.message || "Failed to rotate API key", {
				position: "top-center"
			});
		}
	};

	const handle_delete = async () => {
		if (demo) {
			toast.error("Not available in demo mode", {
				position: "top-center"
			});
			showDeleteDialog = false;
			return;
		}
		if (!projects.selected_project) return;
		deleting = true;
		const success = await delete_project(projects.selected_project.id);
		deleting = false;
		showDeleteDialog = false;
		if (success) {
			toast.success("Project deleted", {
				position: "top-center"
			});
		} else {
			toast.error("Failed to delete project", {
				position: "top-center"
			});
		}
	};
</script>

<div class="space-y-6">
	<Card>
		<CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
		<CardContent class="space-y-4">
			<div class="flex flex-col gap-2">
				<label for="project-name" class="text-sm font-medium text-muted-foreground">
					Project Name
				</label>
				<Input
					id="project-name"
					type="text"
					value={name}
					oninput={(e) => (name = e.currentTarget.value)}
					disabled={saving}
					class="h-10"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label for="project-domain" class="text-sm font-medium text-muted-foreground">
					Domain
				</label>
				<Input
					id="project-domain"
					type="text"
					value={projects.selected_project?.domain}
					disabled
					readonly
					class="h-10"
				/>
				<p class="text-xs text-muted-foreground">
					Domain cannot be changed after project creation.
				</p>
			</div>
			<Button
				onclick={handle_save_name}
				disabled={saving || name === projects.selected_project?.name}
			>
				{saving ? "Saving..." : "Save"}
			</Button>
		</CardContent>
	</Card>
	<Card>
		<CardHeader><CardTitle>API Key</CardTitle></CardHeader>
		<CardContent>
			<div class="mb-2 flex gap-2">
				<Input
					type="text"
					value={projects.selected_project?.api_key || ""}
					readonly
					class="h-8 flex-1 font-mono text-xs"
				/>
			</div>
			<p class="mb-4 text-xs text-muted-foreground">
				This key is public. Only requests from your domain and allowed domains will be accepted.
			</p>
			<div class="flex gap-2">
				<Button onclick={() => (showRotateKeyDialog = true)} variant="outline">
					<HugeiconsIcon
						icon={RedoIcon}
						strokeWidth={2}
						class={`size-4 ${rotating ?? "animate-spin"}`}
					/> Rotate Key
				</Button>
				<Button onclick={handle_copy_api_key} variant="outline">
					<HugeiconsIcon icon={CopyIcon} strokeWidth={2} class="size-4" />
					Copy
				</Button>
			</div>
		</CardContent>
	</Card>
	<Card class="border-destructive/50">
		<CardHeader><CardTitle class="text-destructive">Danger Zone</CardTitle></CardHeader>
		<CardContent>
			<p class="mb-4 text-sm text-muted-foreground">
				Permanently delete this project and all its data. This action cannot be undone.
			</p>
			<Button onclick={() => (showDeleteDialog = true)} variant="destructive">
				Delete Project
			</Button>
		</CardContent>
	</Card>
</div>
<Dialog bind:open={showRotateKeyDialog}>
	<DialogContent class="bg-black p-4">
		<DialogTitle>Rotate API Key</DialogTitle>
		<DialogDescription>
			Are you sure you want to rotate your API key? This will invalidate your current key and you
			will need to update it in your scripts.
		</DialogDescription>
		<Separator class="my-2" />
		<div class="flex justify-end gap-2">
			<DialogClose><Button variant="outline">Cancel</Button></DialogClose>
			<Button onclick={handle_rotate_api_key} variant="destructive" disabled={rotating}>
				{rotating ? "Rotating..." : "Rotate"}
			</Button>
		</div>
	</DialogContent>
</Dialog>
<Dialog bind:open={showDeleteDialog}>
	<DialogContent class="bg-black p-4">
		<DialogTitle>Delete Project</DialogTitle>
		<DialogDescription>
			Are you sure you want to delete this project? This action cannot be undone.
		</DialogDescription>
		<Separator class="my-2" />
		<div class="flex justify-end gap-2">
			<DialogClose><Button variant="outline">Cancel</Button></DialogClose>
			<Button onclick={handle_delete} variant="destructive" disabled={deleting}>
				{deleting ? "Deleting..." : "Delete"}
			</Button>
		</div>
	</DialogContent>
</Dialog>
