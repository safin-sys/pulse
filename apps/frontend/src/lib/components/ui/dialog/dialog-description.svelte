<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		children,
		...restProps
	}: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description class={cn("text-sm text-white/60", className)} {...restProps}>
	{@render children?.()}
</DialogPrimitive.Description>
