<script lang="ts">
	import { untrack } from "svelte";
	import Chart from "$lib/components/dashboard/view/chart.svelte";
	import { Button } from "$lib/components/ui/button";
	import Card, { CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { dashboard, fetch_dashboard, handle_params } from "$lib/stores/dashboard.svelte";

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

	const formatNumber = (num: number): string => {
		if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
		if (num >= 1000) return (num / 1000).toFixed(1) + "K";
		return num.toString();
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		return `${monthNames[date.getMonth()]} ${date.getDate()}`;
	};

	const getCountryName = (code: string): string => {
		const countryNames: Record<string, string> = {
			US: "United States",
			GB: "United Kingdom",
			DE: "Germany",
			FR: "France",
			JP: "Japan",
			IN: "India",
			BR: "Brazil",
			CA: "Canada",
			AU: "Australia",
			CN: "China"
		};
		return countryNames[code] || code;
	};

	const getCountryEmoji = (code: string): string => {
		const emojis: Record<string, string> = {
			US: "🇺🇸",
			GB: "🇬🇧",
			DE: "🇩🇪",
			FR: "🇫🇷",
			JP: "🇯🇵",
			IN: "🇮🇳",
			BR: "🇧🇷",
			CA: "🇨🇦",
			AU: "🇦🇺",
			CN: "🇨🇳"
		};
		return emojis[code] || "🌍";
	};

	const getDeviceEmoji = (name: string, type: "browser" | "os" | "device" | undefined): string => {
		if (type === "browser") {
			const emojis: Record<string, string> = {
				Chrome: "🅱️",
				Firefox: "🦊",
				Safari: "🧭",
				Edge: "📘"
			};
			return emojis[name] || "🌐";
		}
		if (type === "os") {
			const emojis: Record<string, string> = {
				Windows: "🪟",
				macOS: "🍎",
				Linux: "🐧",
				Android: "🤖",
				iOS: "📱"
			};
			return emojis[name] || "💻";
		}
		const emojis: Record<string, string> = {
			Desktop: "💻",
			Mobile: "📱",
			Tablet: "📲"
		};
		return emojis[name] || "📱";
	};

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
				<section class="relative h-[500px]">
					<Chart data={data.chart} className="mt-16" />
					<div class="absolute right-0 top-[-64px] z-10 flex flex-col gap-1 border-2 border-accent p-2 rounded-md bg-background/10 backdrop-blur-md">
						<div class="flex gap-4 text-sm text-muted-foreground">
							<span>Visitors</span>
							<span class="text-foreground">{formatNumber(data.summary.visitors)}</span>
							<span>Views</span>
							<span class="text-foreground">{formatNumber(data.summary.entries)}</span>
							<span>Sessions</span>
							<span class="text-foreground">{formatNumber(data.summary.sessions)}</span>
						</div>
						<div class="text-sm text-muted-foreground">
							{formatDate(data.range.from)} - {formatDate(data.range.to)}
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
													<div class="font-medium">{formatNumber(page.visitors)}</div>
													<div class="text-xs text-muted-foreground">visitors</div>
												</div>
												<div class="text-right">
													<div class="font-medium">{formatNumber(page.entries)}</div>
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
													<div class="font-medium">{formatNumber(source.visitors)}</div>
													<div class="text-xs text-muted-foreground">visitors</div>
												</div>
												<div class="text-right">
													<div class="font-medium">{formatNumber(source.entries)}</div>
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
												<span class="text-lg">{getCountryEmoji(countryCode)}</span>
												<span class="text-sm">
													{#if loc.region && loc.city}
														{loc.city}, {loc.region}
													{:else if loc.region}
														{loc.region}, {countryCode}
													{:else}
														{getCountryName(countryCode)}
													{/if}
												</span>
											</div>
											<div class="text-right">
												<div class="font-medium">{formatNumber(visitors)}</div>
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
												<span class="text-lg"
													>{getDeviceEmoji(name, dashboard.params.deviceView)}</span
												>
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
