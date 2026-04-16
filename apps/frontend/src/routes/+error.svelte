<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import FloatingNav from '$lib/components/floating-nav.svelte';

	const status = page.status;
	const message = page.error?.message ?? 'Something went wrong';
</script>

<svelte:head>
	<title>{status} — Orbit</title>
</svelte:head>

<div class="h-screen overflow-x-hidden bg-background text-foreground font-sans">
	<main class="relative z-10 container mx-auto px-6 pt-32 pb-40">
		<!-- Logo -->
		<div class="flex justify-center mb-16">
			<a href="/" class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
					<path d="M22 8.5C22 9.88071 20.8807 11 19.5 11C18.1193 11 17 9.88071 17 8.5C17 7.11929 18.1193 6 19.5 6C20.8807 6 22 7.11929 22 8.5Z" />
					<path d="M5.63604 18.364C4.00736 16.7353 3 14.4853 3 12C3 7.02944 7.02944 3 12 3C13.6393 3 15.1762 3.43827 16.5 4.20404M8.5 20.2941C9.57589 20.7487 10.7586 21 12 21C16.9706 21 21 16.9706 21 12C21 11.5348 20.9647 11.0778 20.8966 10.6315" />
					<path d="M21.1733 6.37998C22.0683 4.52002 22.2767 3.07282 21.6005 2.39789C20.7268 1.52568 18.5637 2.13056 15.8873 3.78543M18.3049 10.8298C17.2978 12.1187 16.1137 13.4588 14.7889 14.7838C9.48663 20.0868 3.93971 23.1394 2.39946 21.6018C1.52229 20.7262 2.13378 18.5507 3.8022 15.8604" />
				</svg>
				<span class="text-2xl font-medium tracking-tight">Orbit</span>
				<span class="text-[10px] font-medium uppercase tracking-widest px-1.5 py-0.5 rounded-md border border-border text-muted-foreground">Alpha</span>
			</a>
		</div>

		<!-- Error Content -->
		<div class="text-center max-w-2xl mx-auto">
			<div class="text-8xl md:text-9xl font-bold tracking-tighter mb-4 text-foreground">
				{status}
			</div>
			
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
				{status === 404 ? 'Page not found' : 'Something went wrong'}
			</h1>
			
			<p class="text-xl text-muted-foreground mb-12 leading-relaxed">
				{status === 404 ? "The page you're looking for doesn't exist or has been moved." : message}
			</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/">
					<Button size="lg" class="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-base font-semibold rounded-full">
						Go home
					</Button>
				</a>
				<Button size="lg" variant="outline" class="border-border text-foreground hover:bg-accent h-14 px-10 text-base font-medium rounded-full" onclick={() => history.back()}>
					Go back
				</Button>
			</div>
		</div>
	</main>

	<FloatingNav />
</div>
