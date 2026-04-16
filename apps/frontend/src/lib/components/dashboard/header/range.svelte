<script lang="ts">
	import { dashboard } from "$lib/stores/dashboard.svelte";
	import type { RangeSlug } from "$lib/types/dashboard";
	import { Popover } from "bits-ui";

	let popover_open = $state(false);

	let { range } = $derived(dashboard);

	const ranges: { value: RangeSlug; label: string }[][] = [
		[
			{ value: "today", label: "Today" },
			{ value: "yesterday", label: "Yesterday" },
			{ value: "this_week", label: "This Week" },
			{ value: "this_month", label: "This Month" },
			{ value: "this_year", label: "This Year" }
		],
		[
			{ value: "7d", label: "Last 7 Days" },
			{ value: "30d", label: "Last 30 Days" },
			{ value: "6m", label: "Last 6 Months" },
			{ value: "12m", label: "Last 12 Months" }
		],
		[{ value: "all", label: "All Time" }]
	];

	const get_selected_range_label = (): string => {
		const flat_ranges = ranges.flat();
		return flat_ranges.find((r) => r.value === range)?.label || "Select";
	};
</script>

<Popover.Root bind:open={popover_open}>
	<Popover.Trigger
		class="group flex cursor-pointer items-center gap-2 rounded-md border border-accent bg-background px-3 py-1.5 text-sm transition-colors hover:bg-accent"
	>
		<span class="text-xs font-medium text-zinc-300">{get_selected_range_label()}</span>
		<svg
			class="h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform group-data-[state=open]:rotate-180"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</Popover.Trigger>

	<Popover.Content
		class="w-[160px] rounded-xl border border-accent bg-background p-1.5 shadow-2xl backdrop-blur-xl"
		align="end"
		sideOffset={8}
	>
		<div class="flex flex-col py-1">
			{#each ranges as range_categories, i}
				{#each range_categories as range_item}
					<button
						onclick={() => {
							dashboard.range = range_item.value;
							popover_open = false;
						}}
						class="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent {range ===
						range_item.value
							? 'text-zinc-100'
							: 'text-zinc-400'}"
					>
						<span>{range_item.label}</span>
						{#if range === range_item.value}
							<svg
								class="h-4 w-4 shrink-0 text-zinc-300"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						{/if}
					</button>
				{/each}
				{#if i + 1 !== ranges.length}
					<div class="my-1 h-px w-full bg-accent"></div>
				{/if}
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
