import { auth } from "./auth.svelte";
import { projects } from "./projects.svelte";

export let store = $state({
	auth,
	projects
});
