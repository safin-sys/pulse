<script lang="ts">
	import { toast } from "svelte-sonner";
	import { projects, update_project } from "$lib/stores/projects.svelte";
	import { dashboard } from "$lib/stores/dashboard.svelte";
	let { demo } = $derived(dashboard);
	import Card, { CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { Add01Icon, Cancel01Icon, GlobeIcon, InternetIcon } from "@hugeicons/core-free-icons";

	let domains = $state<string[]>([]);
	let newDomain = $state("");
	let domainError = $state("");

	const domainPattern = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;

	const validate_domain = (value: string): string => {
		if (!value) return "";
		if (!domainPattern.test(value)) return "Enter a valid domain (e.g. example.com)";
		return "";
	};

	$effect(() => {
		domainError = validate_domain(newDomain.trim().toLowerCase());
	});

	$effect(() => {
		if (projects.selected_project) {
			domains = projects.selected_project.allowed_domains || [];
		}
	});

	const add_domain = async () => {
		const domain = newDomain.trim().toLowerCase();
		if (!domain) return;
		if (domainError) {
			toast.error(domainError, { position: "top-center" });
			return;
		}
		if (domains.includes(domain)) {
			toast.error("Domain already in list", { position: "top-center" });
			return;
		}
		if (demo) {
			toast.error("Not available in demo mode", { position: "top-center" });
			return;
		}
		if (!projects.selected_project) return;
		const updated = [...domains, domain];
		const success = await update_project(projects.selected_project.id, {
			allowed_domains: updated
		});
		if (success) {
			domains = updated;
			newDomain = "";
			toast.success("Domain added", { position: "top-center" });
		} else {
			toast.error("Failed to add domain", { position: "top-center" });
		}
	};

	const remove_domain = async (domain: string) => {
		if (demo) {
			toast.error("Not available in demo mode", { position: "top-center" });
			return;
		}
		if (!projects.selected_project) return;
		const updated = domains.filter((d) => d !== domain);
		const success = await update_project(projects.selected_project.id, {
			allowed_domains: updated
		});
		if (success) {
			domains = updated;
			toast.success("Domain removed", { position: "top-center" });
		} else {
			toast.error("Failed to remove domain", { position: "top-center" });
		}
	};
</script>

<Card>
	<CardHeader>
		<CardTitle>Allowed Domains</CardTitle>
		<p class="text-sm text-muted-foreground">
			Only requests from these domains and your project domain will be accepted.
		</p>
	</CardHeader>
	<CardContent class="space-y-4">
		{#if domains.length === 0}
			<div class="flex flex-col items-center gap-2 py-8 text-center">
				<div class="flex size-10 items-center justify-center rounded-full bg-muted">
					<HugeiconsIcon icon={GlobeIcon} strokeWidth={1.5} class="size-5 text-muted-foreground" />
				</div>
				<div class="space-y-1">
					<p class="text-sm font-medium">No allowed domains</p>
					<p class="text-xs text-muted-foreground">
						Add domains below to accept requests from other origins.
					</p>
				</div>
			</div>
		{:else}
			<div class="space-y-1">
				{#each domains as domain (domain)}
					<div class="flex items-center justify-between rounded-lg border px-3 py-2.5">
						<div class="flex items-center gap-3">
							<div class="flex size-7 items-center justify-center rounded-md border bg-muted/40">
								<HugeiconsIcon
									icon={InternetIcon}
									strokeWidth={1.5}
									class="size-3.5 text-muted-foreground"
								/>
							</div>
							<span
								title={domain}
								class="max-w-45 truncate font-mono text-sm tracking-tight sm:max-w-70"
								>{domain}</span
							>
						</div>
						<Button
							onclick={() => remove_domain(domain)}
							variant="destructive"
							size="icon-sm"
							aria-label="Remove {domain}"
						>
							<HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} class="size-3.5" />
						</Button>
					</div>
				{/each}
			</div>
		{/if}
		<div class="flex flex-col gap-2">
			<label for="new-domain" class="text-sm font-medium text-muted-foreground"> Add Domain </label>
			<div class="flex gap-2">
				<div class="relative flex-1">
					<Input
						id="new-domain"
						type="text"
						placeholder="example.com"
						value={newDomain}
						oninput={(e) => (newDomain = e.currentTarget.value)}
						onkeydown={(e) => e.key === "Enter" && add_domain()}
						class="h-10 w-full"
						aria-invalid={!!domainError}
					/>
				</div>
				<Button onclick={add_domain} disabled={!newDomain.trim() || !!domainError} class="h-10">
					<HugeiconsIcon icon={Add01Icon} strokeWidth={2} class="size-4" />
				</Button>
			</div>
		</div>
	</CardContent>
</Card>
