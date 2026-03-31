<script lang="ts">
	import { onMount } from "svelte";
	import { projects, dashboard } from "$lib/api";
	import CreateProjectModal from "$lib/components/create-project-modal.svelte";
	import FloatingNav from "$lib/components/floating-nav.svelte";
	import Chart from "$lib/components/chart.svelte";
	import { Button } from "$lib/components/ui/button";
	import Card, { CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import type { DashboardResponse, RangeSlug, DashboardQueryParams } from "$lib/types/dashboard";

	let showModal = $state(false);
	let project: { id: string; name: string; domain: string } | null = $state(null);
	let dashboardData: DashboardResponse | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	let selectedRange: RangeSlug = $state("today");
	let locationView: "country" | "region" | "city" = $state("country");
	let deviceView: "browser" | "os" | "device" = $state("browser");

	const ranges: { value: RangeSlug; label: string }[] = [
		{ value: "today", label: "Today" },
		{ value: "yesterday", label: "Yesterday" },
		{ value: "this_week", label: "This Week" },
		{ value: "this_month", label: "This Month" },
		{ value: "this_year", label: "This Year" },
		{ value: "7d", label: "Last 7 Days" },
		{ value: "30d", label: "Last 30 Days" },
		{ value: "6m", label: "Last 6 Months" },
		{ value: "12m", label: "Last 12 Months" },
		{ value: "all", label: "All Time" }
	];

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

	const get_projects = async () => {
		const { data } = await projects.getAll();
		
		if (data && data.data.projects.length === 0) {
			showModal = true;
			loading = false;
			return;
		}
		project = data.data.projects[0];
	};

	const fetchDashboard = async () => {
		if (!project) return;
		loading = true;
		error = null;

		const params: DashboardQueryParams = {
			range: selectedRange,
			locationView,
			deviceView
		};

		const { data, error: err } = await dashboard.get(project.domain, params);
		if (err) {
			error = err.message || "Failed to fetch dashboard";
			loading = false;
			return;
		}

		dashboardData = data.data;
		loading = false;
	};

	const handleRangeChange = (range: RangeSlug) => {
		selectedRange = range;
		fetchDashboard();
	};

	const handleLocationViewChange = (view: "country" | "region" | "city") => {
		locationView = view;
		fetchDashboard();
	};

	const handleDeviceViewChange = (view: "browser" | "os" | "device") => {
		deviceView = view;
		fetchDashboard();
	};

	const formatNumber = (num: number): string => {
		if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
		if (num >= 1000) return (num / 1000).toFixed(1) + "K";
		return num.toString();
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

	const getDeviceEmoji = (name: string, type: "browser" | "os" | "device"): string => {
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

	onMount(async () => {
		await get_projects();
	});

	$effect(() => {
		if (project) {
			fetchDashboard();
		}
	});

	function handleModalClose(open: boolean) {
		showModal = open;
	}

	function handleSuccess() {
		window.location.reload();
	}
</script>

<div class="min-h-screen overflow-x-hidden bg-black font-sans text-white">
	{#if !project && !loading}
		<CreateProjectModal bind:open={showModal} onOpenChange={handleModalClose} onSuccess={handleSuccess} />
		<FloatingNav />
	{:else if loading}
		<div class="flex min-h-screen items-center justify-center">
			<div class="flex flex-col items-center gap-4">
				<div class="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blue-500"></div>
				<p class="text-sm text-white/50">Loading dashboard...</p>
			</div>
		</div>
	{:else if error}
		<div class="flex min-h-screen items-center justify-center">
			<div class="flex flex-col items-center gap-4">
				<p class="text-red-400">{error}</p>
				<Button onclick={() => fetchDashboard()}>Retry</Button>
			</div>
		</div>
	{:else if dashboardData}
		<div class="flex min-h-screen flex-col">
			<header class="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
				<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
					<div class="flex items-center gap-4">
						<h1 class="text-xl font-semibold tracking-tight">{project?.name}</h1>
						<span class="text-sm text-white/50">{project?.domain}</span>
					</div>
					<div class="flex items-center gap-2">
						<select
							value={selectedRange}
							onchange={(e) => handleRangeChange(e.currentTarget.value as RangeSlug)}
							class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none hover:bg-white/10 focus:border-blue-500"
						>
							{#each ranges as range}
								<option value={range.value} class="bg-zinc-900">{range.label}</option>
							{/each}
						</select>
					</div>
				</div>
			</header>

			<main class="flex-1 p-4 md:p-6 lg:p-8">
				<div class="mx-auto max-w-7xl space-y-6">
					<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle class="text-sm font-medium text-white/70">Total Visitors</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="text-3xl font-bold tracking-tight">
									{formatNumber(dashboardData.summary.visitors)}
								</div>
								<p class="mt-1 text-xs text-white/50">
									{dashboardData.range.from} - {dashboardData.range.to}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle class="text-sm font-medium text-white/70">Total Entries</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="text-3xl font-bold tracking-tight">
									{formatNumber(dashboardData.summary.entries)}
								</div>
								<p class="mt-1 text-xs text-white/50">
									Page views
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle class="text-sm font-medium text-white/70">Sessions</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="text-3xl font-bold tracking-tight">
									{formatNumber(dashboardData.summary.sessions)}
								</div>
								<p class="mt-1 text-xs text-white/50">
									Unique sessions
								</p>
							</CardContent>
						</Card>
					</section>

					<section>
						<Card>
							<CardHeader>
								<CardTitle>Visitors Over Time</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="h-[300px]">
									<Chart data={dashboardData.chart} />
								</div>
							</CardContent>
						</Card>
					</section>

					<div class="grid gap-6 lg:grid-cols-2">
						<section>
							<Card>
								<CardHeader>
									<CardTitle>Top Pages</CardTitle>
								</CardHeader>
								<CardContent>
									<div class="space-y-3">
										{#each dashboardData.pages.rows.slice(0, 5) as page}
											<div class="flex items-center justify-between rounded-lg bg-white/5 p-3">
												<div class="flex-1 truncate font-mono text-sm">{page.path}</div>
												<div class="flex items-center gap-4 text-sm">
													<div class="text-right">
														<div class="font-medium">{formatNumber(page.visitors)}</div>
														<div class="text-xs text-white/50">visitors</div>
													</div>
													<div class="text-right">
														<div class="font-medium">{formatNumber(page.entries)}</div>
														<div class="text-xs text-white/50">views</div>
													</div>
												</div>
											</div>
										{:else}
											<p class="py-8 text-center text-white/50">No page data</p>
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
										{#each dashboardData.sources.rows.slice(0, 5) as source}
											<div class="flex items-center justify-between rounded-lg bg-white/5 p-3">
												<div class="flex-1 truncate text-sm">
													{source.referrer || "(Direct)"}
												</div>
												<div class="flex items-center gap-4 text-sm">
													<div class="text-right">
														<div class="font-medium">{formatNumber(source.visitors)}</div>
														<div class="text-xs text-white/50">visitors</div>
													</div>
													<div class="text-right">
														<div class="font-medium">{formatNumber(source.entries)}</div>
														<div class="text-xs text-white/50">entries</div>
													</div>
												</div>
											</div>
										{:else}
											<p class="py-8 text-center text-white/50">No referrer data</p>
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
													onclick={() => handleLocationViewChange(view.value)}
													class="rounded-md px-2 py-1 text-xs transition-colors {locationView === view.value
														? 'bg-blue-500 text-white'
														: 'bg-white/5 text-white/70 hover:bg-white/10'}"
												>
													{view.label}
												</button>
											{/each}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div class="space-y-3">
										{#each dashboardData.locations.rows.slice(0, 5) as location}
											{@const loc = location as any}
											{@const countryCode = loc.countryCode || loc.countryCode}
											{@const visitors = loc.visitors}
											<div class="flex items-center justify-between rounded-lg bg-white/5 p-3">
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
													<div class="text-xs text-white/50">visitors</div>
												</div>
											</div>
										{:else}
											<p class="py-8 text-center text-white/50">No location data</p>
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
													onclick={() => handleDeviceViewChange(view.value)}
													class="rounded-md px-2 py-1 text-xs transition-colors {deviceView === view.value
														? 'bg-blue-500 text-white'
														: 'bg-white/5 text-white/70 hover:bg-white/10'}"
												>
													{view.label}
												</button>
											{/each}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div class="space-y-3">
										{#each dashboardData.devices.rows.slice(0, 5) as device}
											{@const name = "browser" in device ? device.browser : "os" in device ? device.os : device.device}
											{@const pct = device.percentage}
											<div class="flex items-center justify-between rounded-lg bg-white/5 p-3">
												<div class="flex items-center gap-3">
													<span class="text-lg">{getDeviceEmoji(name, deviceView)}</span>
													<span class="text-sm">{name}</span>
												</div>
												<div class="flex items-center gap-3">
													<div class="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
														<div class="h-full rounded-full bg-blue-500" style="width: {pct}%"></div>
													</div>
													<div class="w-12 text-right text-sm">
														<span class="font-medium">{pct}%</span>
													</div>
												</div>
											</div>
										{:else}
											<p class="py-8 text-center text-white/50">No device data</p>
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

	<FloatingNav />
</div>
