<script lang="ts">
	import FloatingNav from '$lib/components/floating-nav.svelte';

	let props = $props();
</script>

<svelte:head>
	<title>Health — Orbit</title>
</svelte:head>

<div class="h-screen overflow-hidden bg-background text-foreground font-sans">
	<main class="relative z-10 container mx-auto px-6 py-20">
		<div class="mx-auto max-w-md">
			<div class="mb-12 flex justify-center">
				<a href="/" class="flex items-center gap-3 transition-opacity hover:opacity-80">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
						<path d="M22 8.5C22 9.88071 20.8807 11 19.5 11C18.1193 11 17 9.88071 17 8.5C17 7.11929 18.1193 6 19.5 6C20.8807 6 22 7.11929 22 8.5Z" />
						<path d="M5.63604 18.364C4.00736 16.7353 3 14.4853 3 12C3 7.02944 7.02944 3 12 3C13.6393 3 15.1762 3.43827 16.5 4.20404M8.5 20.2941C9.57589 20.7487 10.7586 21 12 21C16.9706 21 21 16.9706 21 12C21 11.5348 20.9647 11.0778 20.8966 10.6315" />
						<path d="M21.1733 6.37998C22.0683 4.52002 22.2767 3.07282 21.6005 2.39789C20.7268 1.52568 18.5637 2.13056 15.8873 3.78543M18.3049 10.8298C17.2978 12.1187 16.1137 13.4588 14.7889 14.7838C9.48663 20.0868 3.93971 23.1394 2.39946 21.6018C1.52229 20.7262 2.13378 18.5507 3.8022 15.8604" />
					</svg>
					<span class="text-2xl font-medium tracking-tight">Orbit</span>
					<span class="text-[10px] font-medium uppercase tracking-widest px-1.5 py-0.5 rounded-md border border-border text-muted-foreground">Alpha</span>
				</a>
			</div>

			<div class="overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-xl">
				<div class="border-b border-border px-6 py-4">
					<h1 class="text-xl font-semibold">System Status</h1>
				</div>
				<div class="p-8">
					{#if !props.data}
						<div class="text-center">
							<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
								<svg class="h-8 w-8 text-muted-foreground animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
								</svg>
							</div>
							<div class="mb-2 text-lg font-medium text-muted-foreground">Checking status...</div>
						</div>
					{:else if props.data.error}
						<div class="text-center">
							<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/20">
								<svg class="h-8 w-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
								</svg>
							</div>
							<div class="mb-2 text-lg font-semibold text-destructive">System Offline</div>
							<p class="text-sm text-muted-foreground">Unable to connect to the API</p>
						</div>
					{:else if props.data.data?.status === 'ok'}
						<div class="text-center">
							<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20">
								<svg class="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
								</svg>
							</div>
							<div class="mb-2 text-lg font-semibold text-emerald-400">All Systems Operational</div>
							<p class="text-sm text-muted-foreground">API is responding normally</p>
						</div>
					{:else}
						<div class="text-center">
							<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20">
								<svg class="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
								</svg>
							</div>
							<div class="mb-2 text-lg font-semibold text-amber-400">Degraded</div>
							<p class="text-sm text-muted-foreground">Some services are experiencing issues</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</main>

	<FloatingNav />
</div>