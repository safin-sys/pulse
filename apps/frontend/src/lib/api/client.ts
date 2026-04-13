import { hc } from "hono/client";
import { PUBLIC_API_URL } from "$env/static/public";
import type { AppType } from "@orbit/backend";
import { auth } from "./auth";
import { logout } from "$lib/stores/auth.svelte";

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const subscribeToRefresh = (callback: () => void) => {
	refreshSubscribers.push(callback);
};

const onRefreshed = () => {
	refreshSubscribers.forEach((cb) => cb());
	refreshSubscribers = [];
};

const tryRefreshToken = async (): Promise<void> => {
	if (isRefreshing) {
		return new Promise<void>((resolve) => {
			subscribeToRefresh(resolve);
		});
	}

	isRefreshing = true;

	try {
		const res = await auth.refresh();

		if (res.error) throw new Error("Refresh failed");

		onRefreshed();
	} catch {
		onRefreshed();
	} finally {
		isRefreshing = false;
	}
};

const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
	try {
		const url = typeof input === "string" ? input : input.toString();

		const response = await fetch(input, {
			...init,
			credentials: "include"
		});

		const isAuthRequest = url.includes("/auth/");

		if (response.status === 401 && !isAuthRequest) {
			try {
				await tryRefreshToken();
				return fetch(input, {
					...init,
					credentials: "include"
				});
			} catch {
				await logout();
				return response;
			}
		}

		return response;
	} catch (error) {
		throw error;
	}
};

export const api = hc<AppType>(PUBLIC_API_URL, {
	fetch: customFetch,
	init: { credentials: "include" }
});
