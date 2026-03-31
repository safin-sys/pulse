import { hc } from "hono/client";
import { PUBLIC_API_URL } from "$env/static/public";
import type { AppType } from "@pulse/backend";
import { browser } from "$app/environment";

export type ApiClient = ReturnType<typeof createClient>;

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeToRefresh = (callback: (token: string) => void) => {
	refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
	refreshSubscribers.forEach((cb) => cb(token));
	refreshSubscribers = [];
};

export const tryRefreshToken = async () => {
	if (isRefreshing) {
		return new Promise<string>((resolve) => {
			subscribeToRefresh((token) => resolve(token));
		});
	}

	isRefreshing = true;

	try {
		const res = await fetch(`${PUBLIC_API_URL}auth/refresh`, {
			method: "POST",
			credentials: "include"
		});

		if (res.ok) {
			const json = await res.json();
			if (browser) {
				localStorage.setItem("auth-check", Date.now().toString());
			}
			onRefreshed(json.access_token);
			return json.access_token;
		} else {
			if (browser) {
				localStorage.setItem("auth-check", "logout");
			}
			throw new Error("Refresh failed");
		}
	} finally {
		isRefreshing = false;
	}
};

const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
	const makeRequest = async (token?: string): Promise<Response> => {
		const headers: Record<string, string> = {
			...(init?.headers as Record<string, string> || {})
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		return fetch(input, {
			...init,
			headers,
			credentials: "include"
		});
	};

	try {
		const response = await makeRequest();

		if (response.status === 401) {
			try {
				const token = await tryRefreshToken();
				return makeRequest(token);
			} catch {
				return response;
			}
		}

		return response;
	} catch (error) {
		throw error;
	}
};

export const createClient = () => {
	return hc<AppType>(PUBLIC_API_URL, { fetch: customFetch, init: { credentials: "include" } });
};

export const api = createClient();
