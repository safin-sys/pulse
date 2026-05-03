<script lang="ts">
	import { format_number } from "$lib/helpers/format_number";
	import { get_country_name } from "$lib/helpers/get_country_name";
	import { get_country_flag } from "$lib/helpers/get_country_flag";
	import { get_device_icon } from "$lib/helpers/get_device_icon";
	import { dashboard } from "$lib/stores/dashboard.svelte";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { Computer, Mobile, Tablet } from "@hugeicons/core-free-icons";
	import type { PageRow, ReferrerRow, LocationRow, DeviceRowType } from "$lib/types/dashboard";

	type RowType = "top_pages" | "referrers" | "locations" | "devices";

	let {
		type,
		row,
		first
	}: { type: RowType; row: PageRow | ReferrerRow | LocationRow | DeviceRowType; first: boolean } =
		$props();
</script>

{#if type === "top_pages"}
	{@const r = row as PageRow}
	<div
		class="flex items-center justify-between rounded-lg bg-secondary p-3"
		data-first-entry={first ? true : undefined}
	>
		<div class="flex-1 truncate font-mono text-sm">{r.path}</div>
		<div class="flex items-center gap-4 text-sm">
			<div class="text-right">
				<div class="font-medium">{format_number(r.visitors)}</div>
				<div class="text-xs text-muted-foreground">visitors</div>
			</div>
			<div class="text-right">
				<div class="font-medium">{format_number(r.entries)}</div>
				<div class="text-xs text-muted-foreground">views</div>
			</div>
		</div>
	</div>
{:else if type === "referrers"}
	{@const r = row as ReferrerRow}
	<div
		class="flex items-center justify-between rounded-lg bg-secondary p-3"
		data-first-entry={first ? true : undefined}
	>
		<div class="flex-1 truncate text-sm">{r.referrer || "(Direct)"}</div>
		<div class="flex items-center gap-4 text-sm">
			<div class="text-right">
				<div class="font-medium">{format_number(r.visitors)}</div>
				<div class="text-xs text-muted-foreground">visitors</div>
			</div>
			<div class="text-right">
				<div class="font-medium">{format_number(r.entries)}</div>
				<div class="text-xs text-muted-foreground">views</div>
			</div>
		</div>
	</div>
{:else if type === "locations"}
	{@const r = row as LocationRow}
	{@const country_code = (r as any).countryCode || ""}
	{@const location_name =
		"city" in r && "region" in r && r.city && r.region
			? `${r.city}, ${r.region}`
			: "region" in r && (r as any).region
				? `${(r as any).region}, ${country_code}`
				: get_country_name(country_code)}
	<div
		class="flex items-center justify-between rounded-lg bg-secondary p-3"
		data-first-entry={first ? true : undefined}
	>
		<div class="flex items-center gap-3">
			<img src={get_country_flag(country_code)} alt={country_code} class="h-4 w-6 object-cover" />
			<span class="text-sm">{location_name}</span>
		</div>
		<div class="text-right">
			<div class="font-medium">{format_number(r.visitors)}</div>
			<div class="text-xs text-muted-foreground">visitors</div>
		</div>
	</div>
{:else if type === "devices"}
	{@const r = row as DeviceRowType}
	{@const device_name = "browser" in r ? r.browser : "os" in r ? r.os : (r as any).device}
	{@const device_view = dashboard.params.deviceView}
	{@const pct = (r as any).percentage}
	<div
		class="flex items-center justify-between rounded-lg bg-secondary p-3"
		data-first-entry={first ? true : undefined}
	>
		<div class="flex items-center gap-3">
			{#if device_view === "device"}
				{#if device_name === "Desktop"}
					<HugeiconsIcon icon={Computer} strokeWidth={2} class="size-4" />
				{/if}
				{#if device_name === "Mobile"}
					<HugeiconsIcon icon={Mobile} strokeWidth={2} class="size-4" />
				{/if}
				{#if device_name === "Tablet"}
					<HugeiconsIcon icon={Tablet} strokeWidth={2} class="size-4" />
				{/if}
			{:else}
				<img src={get_device_icon(device_name, device_view)} alt={device_name} class="h-6 w-6" />
			{/if}
			<span class="text-sm">{device_name}</span>
		</div>
		<div class="flex items-center gap-3">
			<div class="w-12 text-right text-sm">
				<span class="font-medium">{pct}%</span>
			</div>
		</div>
	</div>
{/if}
