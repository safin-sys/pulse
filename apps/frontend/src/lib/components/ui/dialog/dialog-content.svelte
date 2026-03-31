<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		children,
		...restProps
	}: DialogPrimitive.ContentProps = $props();
</script>

<DialogPrimitive.Portal>
	<DialogPrimitive.Overlay class="fixed inset-0 z-50 bg-black/80" />
	<DialogPrimitive.Content
		class={cn(
			"fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-xl border border-white/10 bg-[#0f0f0f] p-6 shadow-popover outline-none sm:max-w-[490px]",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</DialogPrimitive.Content>
</DialogPrimitive.Portal>
