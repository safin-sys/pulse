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
				<div class="w-10 h-10 rounded-[20%] bg-linear-to-br from-cyan-500 via-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
					<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 12h4l3-9 4 18 3-9h4"/>
					</svg>
				</div>
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
