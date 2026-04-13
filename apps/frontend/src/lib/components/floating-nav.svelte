<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { auth, logout } from "$lib/stores/auth.svelte";

	const isLogin = $derived(page.url.pathname === "/login");
	const isSignup = $derived(page.url.pathname === "/signup");
	const isHome = $derived(page.url.pathname === (auth.is_authenticated ? "/dashboard" : "/"));

	const handleLogout = async () => {
		await logout();
		goto("/");
	};
</script>

<div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
	<nav
		class="flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-2 py-2 shadow-2xl backdrop-blur-xl"
	>
		<a
			href={auth.is_authenticated ? "/dashboard" : "/"}
			class="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 {isHome
				? 'bg-white/20 text-white'
				: 'text-white/40 hover:scale-105 hover:bg-white/10 hover:text-white'}"
			title="Home"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<circle cx="12" cy="12" r="4" />
			</svg>
		</a>

		{#if auth.is_authenticated}
			<button
				onclick={handleLogout}
				disabled={auth.loading}
				class="rounded-full px-4 py-2 text-sm whitespace-nowrap text-white/40 transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:text-white disabled:opacity-50"
			>
				Log out
			</button>
		{:else}
			<a
				href="/login"
				class="rounded-full px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 {isLogin
					? 'scale-105 text-white'
					: 'text-white/40 hover:scale-105 hover:bg-white/10 hover:text-white'}"
			>
				Log in
			</a>
			<a
				href="/signup"
				class="rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 {isSignup
					? 'scale-105 border-white/40 text-white'
					: 'border-white/10 text-white/40 hover:scale-105 hover:border-white/30 hover:bg-white/5 hover:text-white'}"
			>
				Sign up
			</a>
		{/if}
	</nav>
</div>
