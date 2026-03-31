<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		children,
		...restProps
	}: DialogPrimitive.CloseProps = $props();
</script>

<DialogPrimitive.Close class={cn("cursor-pointer", className)} {...restProps}>
	{@render children?.()}
</DialogPrimitive.Close>
