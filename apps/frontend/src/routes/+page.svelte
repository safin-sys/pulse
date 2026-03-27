<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Pulse — Event Analytics</title>
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
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-[20%] bg-linear-to-br from-cyan-500 via-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
					<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 12h4l3-9 4 18 3-9h4"/>
					</svg>
				</div>
				<span class="text-2xl font-bold">Pulse</span>
			</div>
		</div>

		<!-- Hero -->
		<div class="text-center max-w-4xl mx-auto mb-24">
			<h1 class="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]">
				<span class="bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
					Know your
				</span>
				<br />
				<span class="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-violet-400">
					users intimately
				</span>
			</h1>
			
			<p class="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
				Pulse captures every interaction, every click, every journey — so you can build products people actually love.
			</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button size="lg" class="bg-white text-black hover:bg-white/90 h-14 px-10 text-base font-semibold rounded-full">
					Start free
				</Button>
				<Button size="lg" variant="outline" class="border-white/20 text-white hover:bg-white/10 h-14 px-10 text-base font-medium rounded-full">
					Read docs
				</Button>
			</div>
		</div>

		<!-- Code snippet -->
		<div class="max-w-2xl mx-auto mb-32">
			<div class="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl overflow-hidden">
				<div class="flex items-center gap-2 px-4 py-3 border-b border-white/10">
					<div class="w-3 h-3 rounded-full bg-red-500/50"></div>
					<div class="w-3 h-3 rounded-full bg-violet-500/50"></div>
					<div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
					<span class="ml-4 text-xs text-white/30 font-mono">index.html</span>
				</div>
				<div class="p-6 text-left bg-[#282c34]">
					<pre class="text-sm font-mono leading-relaxed"><code><span class="text-gray-500">&lt;!-- One Dark Pro --&gt;</span>
<span class="text-purple-400">&lt;script</span> <span class="text-blue-400">src</span>=<span class="text-green-400">"https://pulse.so/sdk.js"</span>
  <span class="text-blue-400">data-project-id</span>=<span class="text-green-400">"your-project-id"</span><span class="text-purple-400">&gt;</span>
<span class="text-purple-400">&lt;/script&gt;</span>

<span class="text-gray-500">&lt;!-- Track events --&gt;</span>
<span class="text-cyan-400">&lt;pulse-track</span> <span class="text-blue-400">event</span>=<span class="text-green-400">"pageview"</span><span class="text-cyan-400">&gt;&lt;/pulse-track&gt;</span>
<span class="text-cyan-400">&lt;pulse-track</span> <span class="text-blue-400">event</span>=<span class="text-green-400">"button_click"</span> <span class="text-blue-400">data-cta</span>=<span class="text-green-400">"signup"</span><span class="text-cyan-400">&gt;&lt;/pulse-track&gt;</span></code></pre>
				</div>
			</div>
		</div>

		<!-- How it works -->
		<div class="max-w-4xl mx-auto mb-32">
			<h2 class="text-3xl font-bold text-center mb-4">How it works</h2>
			<p class="text-white/40 text-center mb-16">Three steps to knowing your users</p>
			
			<div class="space-y-8">
				<div class="flex gap-6 items-start">
					<div class="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold shrink-0">1</div>
					<div>
						<h3 class="text-xl font-semibold mb-2">Add the script</h3>
						<p class="text-white/40">Copy one line of code into your website. No configuration needed.</p>
					</div>
				</div>
				<div class="flex gap-6 items-start">
					<div class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">2</div>
					<div>
						<h3 class="text-xl font-semibold mb-2">Events start flowing</h3>
						<p class="text-white/40">Pageviews, clicks, and custom events are captured automatically.</p>
					</div>
				</div>
				<div class="flex gap-6 items-start">
					<div class="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
					<div>
						<h3 class="text-xl font-semibold mb-2">Explore in dashboard</h3>
						<p class="text-white/40">See user journeys, funnels, and retention in real-time.</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Metrics cards -->
		<div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-32">
			<div class="p-8 rounded-2xl border border-white/10 bg-white/5">
				<div class="text-5xl font-bold text-cyan-400 mb-2">50ms</div>
				<div class="text-white/40">Average latency</div>
			</div>
			<div class="p-8 rounded-2xl border border-white/10 bg-white/5">
				<div class="text-5xl font-bold text-blue-400 mb-2">10M</div>
				<div class="text-white/40">Events per day</div>
			</div>
			<div class="p-8 rounded-2xl border border-white/10 bg-white/5">
				<div class="text-5xl font-bold text-violet-400 mb-2">$0</div>
				<div class="text-white/40">First 100k events</div>
			</div>
		</div>
	</main>

	<!-- Floating nav -->
	<div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
		<nav class="flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
			<Button variant="ghost" size="sm" class="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4">
				Home
			</Button>
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
