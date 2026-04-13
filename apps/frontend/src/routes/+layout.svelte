<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fade } from 'svelte/transition';
	import { init } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		init();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
	{@render children()}
</div>
