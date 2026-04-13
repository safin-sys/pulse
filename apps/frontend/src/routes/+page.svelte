<script lang="ts">
	import FloatingNav from "$lib/components/floating-nav.svelte";
	import SaturnCanvas from "$lib/components/saturn-canvas.svelte";
	import { Button } from "$lib/components/ui/button";
</script>

<svelte:head>
	<title>Orbit — Ship faster. Track everything.</title>
</svelte:head>

<div class="min-h-screen overflow-x-hidden bg-[#0a0a0a] font-sans text-white">
	<SaturnCanvas />
	<main class="relative z-10 container mx-auto px-6 pt-32 pb-40">
		<div class="max-w-3xl">
			<div class="mb-16 flex items-center gap-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					color="currentColor"
					fill="none"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="round"
				>
					<path
						d="M22 8.5C22 9.88071 20.8807 11 19.5 11C18.1193 11 17 9.88071 17 8.5C17 7.11929 18.1193 6 19.5 6C20.8807 6 22 7.11929 22 8.5Z"
					/>
					<path
						d="M5.63604 18.364C4.00736 16.7353 3 14.4853 3 12C3 7.02944 7.02944 3 12 3C13.6393 3 15.1762 3.43827 16.5 4.20404M8.5 20.2941C9.57589 20.7487 10.7586 21 12 21C16.9706 21 21 16.9706 21 12C21 11.5348 20.9647 11.0778 20.8966 10.6315"
					/>
					<path
						d="M21.1733 6.37998C22.0683 4.52002 22.2767 3.07282 21.6005 2.39789C20.7268 1.52568 18.5637 2.13056 15.8873 3.78543M18.3049 10.8298C17.2978 12.1187 16.1137 13.4588 14.7889 14.7838C9.48663 20.0868 3.93971 23.1394 2.39946 21.6018C1.52229 20.7262 2.13378 18.5507 3.8022 15.8604"
					/>
				</svg>
				<span class="text-2xl font-medium tracking-tight">Orbit</span>
				<span
					class="rounded-md border border-white/20 px-1.5 py-0.5 text-[10px] font-medium tracking-widest text-white/50 uppercase"
					>Alpha</span
				>
			</div>

			<h1 class="mb-8 text-6xl leading-[0.9] font-bold tracking-tighter md:text-8xl">
				Ship faster.<br />
				Track everything.
			</h1>

			<p class="mb-12 max-w-xl text-xl leading-relaxed text-white/40">
				One script. Infinite insights. Understand your users better with privacy-first analytics.
			</p>

			<div class="flex gap-4">
				<a href="/signup">
					<Button
						size="lg"
						class="h-14 rounded-full bg-white px-8 text-base font-medium text-black transition-all duration-200 hover:scale-105 hover:bg-white/90"
					>
						Start
					</Button>
				</a>
				<a href="/demo">
					<Button
						size="lg"
						variant="outline"
						class="h-14 rounded-full border-white/20 px-8 text-base font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-white/10"
					>
						Demo
					</Button>
				</a>
			</div>
		</div>
	</main>

	<FloatingNav />
</div>
