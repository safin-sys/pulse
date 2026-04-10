<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fade } from 'svelte/transition';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="dark" in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
	{@render children()}
</div>
