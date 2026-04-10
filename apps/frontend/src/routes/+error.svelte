<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	const status = page.status;
	const message = page.error?.message ?? 'Something went wrong';
</script>

<svelte:head>
	<title>{status} — Pulse</title>
</svelte:head>

<div class="min-h-screen bg-black text-white overflow-x-hidden font-sans">
	<!-- Ambient background -->
	<div class="fixed inset-0 -z-10">
		<div class="absolute inset-0 bg-linear-to-b from-[#0a0a0a] to-black"></div>
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px]"></div>
		<div class="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-violet-500/10 rounded-full blur-[120px]"></div>
		<div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px]"></div>
	</div>

	<main class="container mx-auto px-6 pt-32 pb-40">
		<!-- Logo -->
		<div class="flex justify-center mb-16">
			<a href="/" class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round">
					<path d="M22 8.5C22 9.88071 20.8807 11 19.5 11C18.1193 11 17 9.88071 17 8.5C17 7.11929 18.1193 6 19.5 6C20.8807 6 22 7.11929 22 8.5Z" />
					<path d="M5.63604 18.364C4.00736 16.7353 3 14.4853 3 12C3 7.02944 7.02944 3 12 3C13.6393 3 15.1762 3.43827 16.5 4.20404M8.5 20.2941C9.57589 20.7487 10.7586 21 12 21C16.9706 21 21 16.9706 21 12C21 11.5348 20.9647 11.0778 20.8966 10.6315" />
					<path d="M21.1733 6.37998C22.0683 4.52002 22.2767 3.07282 21.6005 2.39789C20.7268 1.52568 18.5637 2.13056 15.8873 3.78543M18.3049 10.8298C17.2978 12.1187 16.1137 13.4588 14.7889 14.7838C9.48663 20.0868 3.93971 23.1394 2.39946 21.6018C1.52229 20.7262 2.13378 18.5507 3.8022 15.8604" />
				</svg>
				<span class="text-2xl font-bold">Pulse</span>
			</a>
		</div>

		<!-- Error Content -->
		<div class="text-center max-w-2xl mx-auto">
			<div class="text-8xl md:text-9xl font-bold tracking-tighter mb-4">
				<span class="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-violet-400">
					{status}
				</span>
			</div>
			
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-6">
				<span class="bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
					{status === 404 ? 'Page not found' : 'Something went wrong'}
				</span>
			</h1>
			
			<p class="text-xl text-white/50 mb-12 leading-relaxed">
				{status === 404 ? "The page you're looking for doesn't exist or has been moved." : message}
			</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/">
					<Button size="lg" class="bg-white text-black hover:bg-white/90 h-14 px-10 text-base font-semibold rounded-full">
						Go home
					</Button>
				</a>
				<Button size="lg" variant="outline" class="border-white/20 text-white hover:bg-white/10 h-14 px-10 text-base font-medium rounded-full" onclick={() => history.back()}>
					Go back
				</Button>
			</div>
		</div>
	</main>

	<!-- Floating nav -->
	<div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
		<nav class="flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
			<a href="/">
				<Button variant="ghost" size="sm" class="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4">
					Home
				</Button>
			</a>
			<Button variant="ghost" size="sm" class="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4">
				How it works
			</Button>
			<Button variant="ghost" size="sm" class="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4">
				Pricing
			</Button>
			<div class="w-px h-6 bg-white/10 mx-1"></div>
			<Button size="sm" class="bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 text-white hover:opacity-90 rounded-full px-5 font-medium">
				Sign in
			</Button>
		</nav>
	</div>
</div>
