<script lang="ts">
	import { untrack } from "svelte";
	import Chart from "$lib/components/dashboard/view/chart.svelte";
	import { Button } from "$lib/components/ui/button";
	import Card, { CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { dashboard, fetch_dashboard, handle_params } from "$lib/stores/dashboard.svelte";
	import { format_number } from "$lib/helpers/format_number";
	import { format_date } from "$lib/helpers/format_date";
	import { get_country_name } from "$lib/helpers/get_country_name";
	import { get_country_flag } from "$lib/helpers/get_country_flag";
	import { get_device_icon } from "$lib/helpers/get_device_icon";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { Computer, Mobile, Tablet } from "@hugeicons/core-free-icons";

	let { data, error, loading } = $derived(dashboard);

	const locationViews = [
		{ value: "country", label: "Countries" },
		{ value: "region", label: "Regions" },
		{ value: "city", label: "Cities" }
	] as const;

	const deviceViews = [
		{ value: "browser", label: "Browsers" },
		{ value: "os", label: "Operating Systems" },
		{ value: "device", label: "Devices" }
	] as const;

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
	<div class="flex h-full flex-col">
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
						<Card>
							<CardHeader>
								<CardTitle>Top Pages</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="space-y-3">
									{#each data.pages.rows.slice(0, 5) as page}
										<div class="flex items-center justify-between rounded-lg bg-secondary p-3">
											<div class="flex-1 truncate font-mono text-sm">{page.path}</div>
											<div class="flex items-center gap-4 text-sm">
												<div class="text-right">
													<div class="font-medium">{format_number(page.visitors)}</div>
													<div class="text-xs text-muted-foreground">visitors</div>
												</div>
												<div class="text-right">
													<div class="font-medium">{format_number(page.entries)}</div>
													<div class="text-xs text-muted-foreground">views</div>
												</div>
											</div>
										</div>
									{:else}
										<p class="py-8 text-center text-muted-foreground">No page data</p>
									{/each}
								</div>
							</CardContent>
						</Card>
					</section>

					<section>
						<Card>
							<CardHeader>
								<CardTitle>Referrers</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="space-y-3">
									{#each data.sources.rows.slice(0, 5) as source}
										<div class="flex items-center justify-between rounded-lg bg-secondary p-3">
											<div class="flex-1 truncate text-sm">
												{source.referrer || "(Direct)"}
											</div>
											<div class="flex items-center gap-4 text-sm">
												<div class="text-right">
													<div class="font-medium">{format_number(source.visitors)}</div>
													<div class="text-xs text-muted-foreground">visitors</div>
												</div>
												<div class="text-right">
													<div class="font-medium">{format_number(source.entries)}</div>
													<div class="text-xs text-muted-foreground">entries</div>
												</div>
											</div>
										</div>
									{:else}
										<p class="py-8 text-center text-muted-foreground">No referrer data</p>
									{/each}
								</div>
							</CardContent>
						</Card>
					</section>
				</div>

				<div class="grid gap-6 lg:grid-cols-2">
					<section>
						<Card>
							<CardHeader>
								<div class="flex items-center justify-between">
									<CardTitle>Locations</CardTitle>
									<div class="flex gap-1">
										{#each locationViews as view}
											<button
												onclick={() => handle_params("locationView", view.value)}
												class="rounded-md px-2 py-1 text-xs transition-colors {dashboard.params
													.locationView === view.value
													? 'bg-primary text-primary-foreground'
													: 'bg-secondary text-muted-foreground hover:bg-accent'}"
											>
												{view.label}
											</button>
										{/each}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div class="space-y-3">
									{#each data.locations.rows.slice(0, 5) as location}
										{@const loc = location as any}
										{@const countryCode = loc.countryCode || loc.countryCode}
										{@const visitors = loc.visitors}
										<div class="flex items-center justify-between rounded-lg bg-secondary p-3">
											<div class="flex items-center gap-3">
												<img
													src={get_country_flag(countryCode)}
													alt={countryCode}
													class="h-4 w-6 object-cover"
												/>
												<span class="text-sm">
													{#if loc.region && loc.city}
														{loc.city}, {loc.region}
													{:else if loc.region}
														{loc.region}, {countryCode}
													{:else}
														{get_country_name(countryCode)}
													{/if}
												</span>
											</div>
											<div class="text-right">
												<div class="font-medium">{format_number(visitors)}</div>
												<div class="text-xs text-muted-foreground">visitors</div>
											</div>
										</div>
									{:else}
										<p class="py-8 text-center text-muted-foreground">No location data</p>
									{/each}
								</div>
							</CardContent>
						</Card>
					</section>

					<section>
						<Card>
							<CardHeader>
								<div class="flex items-center justify-between">
									<CardTitle>Devices</CardTitle>
									<div class="flex gap-1">
										{#each deviceViews as view}
											<button
												onclick={() => handle_params("deviceView", view.value)}
												class="rounded-md px-2 py-1 text-xs transition-colors {dashboard.params
													.deviceView === view.value
													? 'bg-primary text-primary-foreground'
													: 'bg-secondary text-muted-foreground hover:bg-accent'}"
											>
												{view.label}
											</button>
										{/each}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div class="space-y-3">
									{#each data.devices.rows.slice(0, 5) as device}
										{@const name =
											"browser" in device
												? device.browser
												: "os" in device
													? device.os
													: device.device}
										{@const pct = device.percentage}
										<div class="flex items-center justify-between rounded-lg bg-secondary p-3">
											<div class="flex items-center gap-3">
												{#if dashboard.params.deviceView === "device"}
													{#if name === "Desktop"}
														<HugeiconsIcon icon={Computer} strokeWidth={2} class="size-4" />
													{/if}
													{#if name === "Mobile"}
														<HugeiconsIcon icon={Mobile} strokeWidth={2} class="size-4" />
													{/if}
													{#if name === "Tablet"}
														<HugeiconsIcon icon={Tablet} strokeWidth={2} class="size-4" />
													{/if}
												{:else}
													<img
														src={get_device_icon(name, dashboard.params.deviceView)}
														alt={name}
														class="h-6 w-6"
													/>
												{/if}
												<span class="text-sm">{name}</span>
											</div>
											<div class="flex items-center gap-3">
												<div class="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
													<div class="h-full rounded-full bg-primary" style="width: {pct}%"></div>
												</div>
												<div class="w-12 text-right text-sm">
													<span class="font-medium">{pct}%</span>
												</div>
											</div>
										</div>
									{:else}
										<p class="py-8 text-center text-muted-foreground">No device data</p>
									{/each}
								</div>
							</CardContent>
						</Card>
					</section>
				</div>
			</div>
		</main>
	</div>
{/if}
