<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type InputProps = HTMLInputAttributes;

	let {
		class: className,
		...rest
	}: InputProps = $props();
</script>

<input
	class={cn(
		'flex h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
		className
	)}
	{...rest}
/>
