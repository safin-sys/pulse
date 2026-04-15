import type { RangeSlug } from "$lib/types/dashboard";

export let dashboard = $state({
	range: "today" as RangeSlug
});
