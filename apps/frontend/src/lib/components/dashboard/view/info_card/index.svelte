<script lang="ts">
	import Card, { CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { dashboard, handle_params } from "$lib/stores/dashboard.svelte";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
	import Row from "./row.svelte";

	let { type }: { type: "top_pages" | "referrers" | "locations" | "devices" } = $props();

	let data = $derived(dashboard.data);
	let title = $derived(get_title());
	let views = $derived(get_views());
	let active_view = $derived(get_active_view());
	let view_field = $derived(get_view_field());

	let scroll_container = $state<HTMLDivElement>();
	let show_indicator = $state(true);
	let can_scroll = $state(false);

	$effect(() => {
		data;
		type;
		active_view;
		show_indicator = true;
		can_scroll = false;
	});

	$effect(() => {
		if (!scroll_container) return;
		const { scrollHeight, clientHeight } = scroll_container;
		can_scroll = scrollHeight > clientHeight;
		show_indicator = can_scroll;
	});

	function get_title() {
		switch (type) {
			case "top_pages":
				return "Top Pages";
			case "referrers":
				return "Referrers";
			case "locations":
				return "Locations";
			case "devices":
				return "Devices";
		}
	}

	function get_views() {
		switch (type) {
			case "locations":
				return [
					{ value: "country", label: "Countries" },
					{ value: "region", label: "Regions" },
					{ value: "city", label: "Cities" }
				];
			case "devices":
				return [
					{ value: "browser", label: "Browsers" },
					{ value: "os", label: "Operating Systems" },
					{ value: "device", label: "Devices" }
				];
			default:
				return [];
		}
	}

	function get_active_view() {
		if (!data) return null;
		switch (type) {
			case "locations":
				return data.locations.view;
			case "devices":
				return data.devices.view;
			default:
				return null;
		}
	}

	function get_view_field() {
		switch (type) {
			case "locations":
				return "locationView";
			case "devices":
				return "deviceView";
			default:
				return null;
		}
	}

	function handle_scroll(e: Event) {
		const container = e.target as HTMLDivElement;
		const first_entry = container.querySelector("[data-first-entry]") as HTMLElement;
		if (!first_entry) return;
		const container_rect = container.getBoundingClientRect();
		const entry_rect = first_entry.getBoundingClientRect();
		show_indicator = entry_rect.bottom > container_rect.top;
	}
</script>

{#if data}
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle>{title}</CardTitle>
				{#if views.length > 0 && view_field}
					<div class="flex gap-1">
						{#each views as view}
							<button
								onclick={() => handle_params(view_field as any, view.value as any)}
								class="rounded-md px-2 py-1 text-xs transition-colors {active_view === view.value
									? 'bg-primary text-primary-foreground'
									: 'bg-secondary text-muted-foreground hover:bg-accent'}"
							>
								{view.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</CardHeader>
		<CardContent class="relative">
			<div
				bind:this={scroll_container}
				class="space-y-3 h-72 overflow-y-auto thin-scrollbar"
				onscroll={handle_scroll}
			>
				{#if type === "top_pages"}
					{#each data.pages.rows as row, i}
						<Row type="top_pages" {row} first={i === 0} />
					{:else}
						<p class="flex h-72 items-center justify-center text-muted-foreground">No {title.toLowerCase()} data</p>
					{/each}
				{:else if type === "referrers"}
					{#each data.sources.rows as row, i}
						<Row type="referrers" {row} first={i === 0} />
					{:else}
						<p class="flex h-72 items-center justify-center text-muted-foreground">No {title.toLowerCase()} data</p>
					{/each}
				{:else if type === "locations"}
					{#each data.locations.rows as row, i}
						<Row type="locations" {row} first={i === 0} />
					{:else}
						<p class="flex h-72 items-center justify-center text-muted-foreground">No {title.toLowerCase()} data</p>
					{/each}
				{:else if type === "devices"}
					{#each data.devices.rows as row, i}
						<Row type="devices" {row} first={i === 0} />
					{:else}
						<p class="flex h-72 items-center justify-center text-muted-foreground">No {title.toLowerCase()} data</p>
					{/each}
				{/if}
			</div>
			{#if can_scroll}
				<div
					class="pointer-events-none absolute right-0 bottom-0 left-0 flex justify-center rounded-b-lg bg-linear-to-t from-card py-2 transition-all duration-300 {show_indicator
						? 'translate-y-0 opacity-100'
						: 'translate-y-4 opacity-0'}"
				>
					<HugeiconsIcon
						icon={ArrowDown01Icon}
						class="size-4 animate-bounce text-muted-foreground"
					/>
				</div>
			{/if}
		</CardContent>
	</Card>
{/if}
