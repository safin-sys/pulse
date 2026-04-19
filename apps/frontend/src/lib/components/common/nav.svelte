<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { auth, logout } from "$lib/stores/auth.svelte";

	const isLogin = $derived(page.url.pathname === "/login");
	const isSignup = $derived(page.url.pathname === "/signup");
	const isHome = $derived(page.url.pathname === (auth.is_authenticated ? "/dashboard" : "/"));
	const isSettings = $derived(page.url.pathname.includes("settings"));

	const handleLogout = async () => {
		await logout();
		goto("/");
	};
</script>

<div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
	<nav
		class="flex items-center gap-2 rounded-full border border-border bg-background/80 px-2 py-2 shadow-2xl backdrop-blur-xl"
	>
		<a
			href={auth.is_authenticated ? "/dashboard" : "/"}
			class="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 {isHome
				? 'bg-accent text-foreground'
				: 'text-muted-foreground hover:scale-105 hover:bg-accent hover:text-foreground'}"
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
			<a
				href="/settings"
				class="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 {isSettings
					? 'bg-accent text-foreground'
					: 'text-muted-foreground hover:scale-105 hover:bg-accent hover:text-foreground'}"
				title="Settings"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
					<circle cx="12" cy="12" r="3"/>
				</svg>
			</a>
			<button
				onclick={handleLogout}
				disabled={auth.loading}
				class="rounded-full px-4 py-2 text-sm whitespace-nowrap text-muted-foreground transition-all duration-200 hover:scale-105 hover:bg-accent hover:text-foreground disabled:opacity-50 cursor-pointer"
			>
				Log out
			</button>
		{:else}
			<a
				href="/login"
				class="rounded-full px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 {isLogin
					? 'scale-105 text-foreground'
					: 'text-muted-foreground hover:scale-105 hover:bg-accent hover:text-foreground'}"
			>
				Log in
			</a>
			<a
				href="/signup"
				class="rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 {isSignup
					? 'scale-105 border-muted text-foreground'
					: 'border-border text-muted-foreground hover:scale-105 hover:border-muted-foreground hover:bg-accent hover:text-foreground'}"
			>
				Sign up
			</a>
		{/if}
	</nav>
</div>
