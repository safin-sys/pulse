import { auth as api } from "$lib/api";
import { goto } from "$app/navigation";

export let auth = $state({
	user: null,
	is_authenticated: false,
	loading: false,
	error: ""
});

export const init = async () => {
	auth.loading = true;
	const { data, error } = await api.me();
	if (error) {
		auth.user = null;
		auth.is_authenticated = false;
		if (error?.code === 401) {
			await logout();
		}
	} else {
		auth.user = data.user;
		auth.is_authenticated = true;
	}
	auth.loading = false;
};

export const login = async (email: string, password: string) => {
	auth.error = "";
	auth.loading = true;
	const { error } = await api.login({ email, password });
	if (error) {
		auth.error = error?.message || "Something went wrong";
		auth.loading = false;
		return false;
	}

	const { data, error: meError } = await api.me();
	if (meError) {
		auth.error = meError;
		auth.loading = false;
		return false;
	}
	auth.user = data.user;
	auth.is_authenticated = true;
	auth.loading = false;
	return true;
};

export const signup = async (email: string, password: string, name: string) => {
	auth.error = "";
	auth.loading = true;
	const { error } = await api.signup({ email, password, name });
	if (error) {
		auth.error = error?.message || "Something went wrong";
		auth.loading = false;
		return false;
	}
	const { data, error: meError } = await api.me();
	if (meError) {
		auth.error = meError;
		auth.loading = false;
		return false;
	}
	auth.user = data.user;
	auth.is_authenticated = true;
	auth.loading = false;
	return true;
};

export const logout = async () => {
	auth.loading = true;
	const { error } = await api.logout();
	auth.user = null;
	auth.is_authenticated = false;
	auth.loading = false;
	goto("/login");
	return !error;
};
