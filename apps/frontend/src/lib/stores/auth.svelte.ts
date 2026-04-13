import { auth as api } from "$lib/api";

export let auth = $state({
	user: null,
	is_authenticated: false,
	loading: false,
	error: ""
});

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
	if (error) {
		auth.error = error?.message || "Something went wrong";
		auth.loading = false;
		return false;
	}
	auth.user = null;
	auth.is_authenticated = false;
	auth.loading = false;
	return true;
};
