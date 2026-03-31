import { api } from "./client";

const signup = async (body: {
	email: string;
	password: string;
	name: string;
	avatar_url?: string | null;
}) => {
	const res = await api.auth.signup.$post({ json: body });
	if (res.ok) {
		const json = await res.json();
		return { data: json, error: null };
	}
	return { data: null, error: await res.json() };
};

const login = async (body: { email: string; password: string }) => {
	const res = await api.auth.login.$post({ json: body });
	if (res.ok) {
		const json = await res.json();
		return { data: json, error: null };
	}
	return { data: null, error: await res.json() };
};

const refresh = async () => {
	const res = await api.auth.refresh.$post();
	if (res.ok) {
		const json = await res.json();
		return { data: json, error: null };
	}
	return { data: null, error: await res.json() };
};

const logout = async () => {
	const res = await api.auth.logout.$post();
	if (res.ok) {
		return { data: await res.json(), error: null };
	}
	return { data: null, error: await res.json() };
};

const forgot = async (body: { email: string }) => {
	const res = await api.auth.forgot.$post({ json: body });
	if (res.ok) {
		return { data: await res.json(), error: null };
	}
	return { data: null, error: await res.json() };
};

const reset = async (body: { token: string; new_password: string }) => {
	const res = await api.auth.reset.$post({ json: body });
	if (res.ok) {
		return { data: await res.json(), error: null };
	}
	return { data: null, error: await res.json() };
};

export const auth = {
	signup,
	login,
	refresh,
	logout,
	forgot,
	reset
};
