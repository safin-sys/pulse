<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { goto } from "$app/navigation";
	import { auth } from "$lib/api";

	let loading = $state(false);
	let error = $state<string | null>(null);
	let email = $state("");
	let password = $state("");

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (!email || !password) {
			error = "All fields are required";
			return;
		}
		loading = true;
		error = null;
		try {
			const { data } = await auth.login({
				email,
				password
			});

			if (!data?.success) {
				error = data?.error || "Invalid credentials";
				return;
			}
			goto("/dashboard");
		} catch (e) {
			error = "Something went wrong";
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Sign in — Pulse</title>
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

		<!-- Login Card -->
		<div class="mx-auto max-w-md">
			<div class="overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl">
				<div class="border-b border-white/10 px-6 py-4">
					<h1 class="text-xl font-semibold">Welcome back</h1>
				</div>
				<div class="flex flex-col gap-6 p-6">
					<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
						<div class="flex flex-col gap-2">
							<label for="email" class="text-sm font-medium text-white/70">Email</label>
							<Input
								name="email"
								id="email"
								type="email"
								placeholder="you@example.com"
								oninput={(e) => (email = e.currentTarget.value)}
							/>
						</div>

						<div class="flex flex-col gap-2">
							<label for="password" class="text-sm font-medium text-white/70">Password</label>
							<Input
								name="password"
								id="password"
								type="password"
								placeholder="Enter your password"
								oninput={(e) => (password = e.currentTarget.value)}
							/>
						</div>

						<p class="invisible text-sm text-red-500" class:visible={error}>
							{error ?? "Unknown Error"}
						</p>

						<Button
							type="submit"
							disabled={loading}
							class="w-full rounded-lg bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 p-6 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
						>
							{#if loading}
								<svg
									class="mr-2 h-4 w-4 animate-spin"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Signing in...
							{:else}
								Sign in
							{/if}
						</Button>
					</form>

					<!-- Footer -->
					<div>
						<p class="text-center text-sm text-white/40">
							Forgot password?
							<a href="/forgot" class="ml-1 font-medium text-cyan-400 hover:text-cyan-300"
								>Reset</a
							>
						</p>
						<p class="text-center text-sm text-white/40">
							Don't have an account?
							<a href="/signup" class="ml-1 font-medium text-cyan-400 hover:text-cyan-300"
								>Sign up</a
							>
						</p>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Floating nav -->
	<div class="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
		<nav
			class="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-2 shadow-2xl backdrop-blur-xl"
		>
			<a href="/">
				<Button
					variant="ghost"
					size="sm"
					class="rounded-full px-4 text-white/70 hover:bg-white/10 hover:text-white"
				>
					Home
				</Button>
			</a>
			<Button
				variant="ghost"
				size="sm"
				class="rounded-full px-4 text-white/70 hover:bg-white/10 hover:text-white"
			>
				How it works
			</Button>
			<Button
				variant="ghost"
				size="sm"
				class="rounded-full px-4 text-white/70 hover:bg-white/10 hover:text-white"
			>
				Pricing
			</Button>
			<div class="mx-1 h-6 w-px bg-white/10"></div>
			<a href="/signup">
				<Button
					size="sm"
					class="rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 px-5 font-medium text-white hover:opacity-90"
				>
					Sign up
				</Button>
			</a>
		</nav>
	</div>
</div>
