<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { fade } from "svelte/transition";

	let {
		open = $bindable(false),
		onOpenChange,
		...restProps
	}: DialogPrimitive.RootProps = $props();
</script>

<DialogPrimitive.Root bind:open {onOpenChange} {...restProps} />
