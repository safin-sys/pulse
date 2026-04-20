<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import ProjectDetailsTab from "$lib/components/settings/project-details-tab.svelte";
	import AllowDomainListTab from "$lib/components/settings/allow-domain-list-tab.svelte";
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="flex h-full flex-col">
	<main class="flex-1 p-4 md:p-6 lg:p-8">
		<div class="mx-auto max-w-md">
			<Tabs value="project-details" class="w-full">
				<TabsList class="justify-start bg-background">
					<TabsTrigger class="cursor-pointer p-4" value="project-details"
						>Project Details</TabsTrigger
					>
					<TabsTrigger class="cursor-pointer p-4" value="allow-domain-list"
						>Allow Domain List</TabsTrigger
					>
				</TabsList>
				<TabsContent value="project-details">
					<ProjectDetailsTab />
				</TabsContent>
				<TabsContent value="allow-domain-list">
					<AllowDomainListTab />
				</TabsContent>
			</Tabs>
		</div>
	</main>
</div>
