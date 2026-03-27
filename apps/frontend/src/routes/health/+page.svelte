<script lang="ts">
	let props = $props();

	const statusColor = $derived(props.data.error
		? "text-red-400"
		: props.data.data?.status === "ok"
			? "text-emerald-400"
			: "text-amber-400");
	const statusBg = $derived(props.data.error
		? "bg-red-500/20 border-red-500/30"
		: props.data.data?.status === "ok"
			? "bg-emerald-500/20 border-emerald-500/30"
			: "bg-amber-500/20 border-amber-500/30");
</script>

<svelte:head>
	<title>Health — Pulse</title>
</svelte:head>

<div class="min-h-screen overflow-x-hidden bg-black font-sans text-white">
	<!-- Ambient background -->
	<div class="fixed inset-0 -z-10">
		<div class="absolute inset-0 bg-linear-to-b from-[#0a0a0a] to-black"></div>
		<div
			class="absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[120px]"
		></div>
		<div
			class="absolute right-1/4 bottom-0 h-[300px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]"
		></div>
	</div>

	<main class="container mx-auto px-6 py-20">
		<!-- Header -->
		<div class="mb-12 flex justify-center">
			<a href="/" class="flex items-center gap-3 transition-opacity hover:opacity-80">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-[20%] bg-linear-to-br from-cyan-500 via-blue-500 to-violet-500 shadow-lg shadow-cyan-500/25"
				>
					<svg
						class="h-6 w-6 text-white"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M3 12h4l3-9 4 18 3-9h4" />
					</svg>
				</div>
				<span class="text-2xl font-bold">Pulse</span>
			</a>
		</div>

		<!-- Status Card -->
		<div class="mx-auto max-w-md">
			<div class="overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl">
				<div class="border-b border-white/10 px-6 py-4">
					<h1 class="text-xl font-semibold">System Status</h1>
				</div>
				<div class="p-8">
{#if props.data.error}
						<div class="text-center">
							<div class="w-16 h-16 mx-auto mb-4 rounded-full {statusBg} flex items-center justify-center">
								<svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
								</svg>
							</div>
							<div class="text-red-400 font-semibold text-lg mb-2">System Offline</div>
							<p class="text-white/40 text-sm">Unable to connect to the API</p>
						</div>
					{:else if props.data.data}
						<div class="text-center">
							<div
								class="mx-auto mb-4 h-16 w-16 rounded-full {statusBg} flex items-center justify-center"
							>
								{#if props.data.data.status === "ok"}
									<svg
										class="h-8 w-8 text-emerald-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								{:else}
									<svg
										class="h-8 w-8 text-amber-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
								{/if}
							</div>
							<div class="{statusColor} mb-2 text-lg font-semibold">
								{props.data.data.status === "ok" ? "All Systems Operational" : "Degraded"}
							</div>
							<p class="text-sm text-white/40">API is responding normally</p>
						</div>
					{:else}
						<div class="text-center">
							<div
								class="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-white/10"
							>
								<svg
									class="h-8 w-8 text-white/40"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
							</div>
							<div class="mb-2 font-medium text-white/60">Checking status...</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</main>
</div>
