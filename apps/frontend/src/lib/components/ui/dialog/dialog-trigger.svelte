<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		children,
		...restProps
	}: DialogPrimitive.TriggerProps = $props();
</script>

<DialogPrimitive.Trigger class={cn("cursor-pointer", className)} {...restProps}>
	{@render children?.()}
</DialogPrimitive.Trigger>
