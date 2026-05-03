<script lang="ts">
	import { untrack } from "svelte";
	import Chart from "$lib/components/dashboard/view/chart.svelte";
	import { Button } from "$lib/components/ui/button";
	import { dashboard, fetch_dashboard } from "$lib/stores/dashboard.svelte";
	import { format_number } from "$lib/helpers/format_number";
	import { format_date } from "$lib/helpers/format_date";
	import InfoCard from "$lib/components/dashboard/view/info_card/index.svelte";

	let { data, error, loading } = $derived(dashboard);

	$effect(() => {
		JSON.stringify(dashboard.params); // track params only
		untrack(() => fetch_dashboard());
	});
</script>

{#if loading}
	<div class="flex h-full items-center justify-center">
		<div class="flex flex-col items-center gap-4">
			<div class="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary"></div>
			<p class="text-sm text-muted-foreground">Loading dashboard...</p>
		</div>
	</div>
{:else if error && !data}
	<div class="flex h-full items-center justify-center">
		<div class="flex flex-col items-center gap-4">
			<p class="text-destructive">{error}</p>
			<Button onclick={() => fetch_dashboard()}>Retry</Button>
		</div>
	</div>
{:else if data}
	<main class="flex-1 p-4 md:p-6 lg:p-8">
		<div class="mx-auto max-w-7xl space-y-6">
			<section class="relative h-125">
				<Chart data={data.chart} className="mt-16" />
				<div
					class="absolute -top-16 right-0 z-10 flex flex-col gap-1 rounded-md border-2 border-accent bg-background/10 p-2 backdrop-blur-md"
				>
					<div class="flex gap-4 text-sm text-muted-foreground">
						<span>Visitors</span>
						<span class="text-foreground">{format_number(data.summary.visitors)}</span>
						<span>Views</span>
						<span class="text-foreground">{format_number(data.summary.entries)}</span>
						<span>Sessions</span>
						<span class="text-foreground">{format_number(data.summary.sessions)}</span>
					</div>
					<div class="text-sm text-muted-foreground">
						{format_date(data.range.from)} - {format_date(data.range.to)}
					</div>
				</div>
			</section>

			<div class="grid gap-6 lg:grid-cols-2">
				<section>
					<InfoCard type="top_pages" />
				</section>
				<section>
					<InfoCard type="referrers" />
				</section>
			</div>

			<div class="grid gap-6 lg:grid-cols-2">
				<section>
					<InfoCard type="locations" />
				</section>
				<section>
					<InfoCard type="devices" />
				</section>
			</div>
		</div>
	</main>
	<div class="h-32"></div>
{/if}
