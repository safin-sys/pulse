<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fade } from 'svelte/transition';
	import { init } from '$lib/stores/auth.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { dashboard, reset_dashboard } from '$lib/stores/dashboard.svelte';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	onMount(() => {
		init();
	});

	beforeNavigate((nav) => {
		if (dashboard.demo && nav.to?.url && !nav.to.url.pathname.startsWith('/demo')) {
			reset_dashboard();
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Toaster />
<div in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
	{@render children()}
</div>
