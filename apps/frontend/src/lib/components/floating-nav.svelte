<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/api';

	const isDashboard = $derived($page.url.pathname.startsWith('/dashboard'));

	const handleLogout = async () => {
		await auth.logout();
		goto('/');
	};
</script>

<div class="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
	<nav
		class="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-2 shadow-2xl backdrop-blur-xl"
	>
		{#if isDashboard}
			<button
				onclick={handleLogout}
				class="rounded-full px-4 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
			>
				Log out
			</button>
		{:else}
			<a href="/">
				<Button
					variant="ghost"
					size="sm"
					class="rounded-full px-4 text-white/70 hover:bg-white/10 hover:text-white"
				>
					Home
				</Button>
			</a>
			<a href="/login">
				<Button
					variant="ghost"
					size="sm"
					class="rounded-full px-4 text-white/70 hover:bg-white/10 hover:text-white"
				>
					Log in
				</Button>
			</a>
			<a href="/signup">
				<Button
					size="sm"
					class="rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 px-5 font-medium text-white hover:opacity-90"
				>
					Sign up
				</Button>
			</a>
		{/if}
	</nav>
</div>