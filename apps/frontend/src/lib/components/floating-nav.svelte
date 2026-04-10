<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/api';

	const isDashboard = $derived($page.url.pathname.startsWith('/dashboard'));
	const isLogin = $derived($page.url.pathname === '/login');
	const isSignup = $derived($page.url.pathname === '/signup');
	const isHome = $derived($page.url.pathname === '/');

	const handleLogout = async () => {
		await auth.logout();
		goto('/');
	};
</script>

<div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
	<nav
		class="flex items-center rounded-full border border-white/10 bg-black/80 px-2 py-2 shadow-2xl backdrop-blur-xl"
	>
		<a 
			href="/" 
			class="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 {isHome ? 'bg-white/20 text-white' : 'text-white/40 hover:bg-white/10 hover:text-white hover:scale-105'}"
			title="Home"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
				<circle cx="12" cy="12" r="4"/>
			</svg>
		</a>

		{#if isDashboard}
			<button
				onclick={handleLogout}
				class="rounded-full px-4 py-2 text-sm text-white/40 transition-all duration-200 hover:text-white hover:bg-white/10 hover:scale-105"
			>
				Log out
			</button>
		{:else}
			<a 
				href="/login" 
				class="rounded-full px-4 py-2 text-sm transition-all duration-200 {isLogin ? 'text-white scale-105' : 'text-white/40 hover:text-white hover:bg-white/10 hover:scale-105'}"
			>
				Log in
			</a>
			<a 
				href="/signup" 
				class="rounded-full border px-4 py-2 text-sm transition-all duration-200 {isSignup ? 'border-white/40 text-white scale-105' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 hover:scale-105'}"
			>
				Sign up
			</a>
		{/if}
	</nav>
</div>
