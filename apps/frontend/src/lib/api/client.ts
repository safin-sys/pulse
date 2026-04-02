import { hc } from "hono/client";
import { PUBLIC_API_URL } from "$env/static/public";
import type { AppType } from "@pulse/backend";
import { auth } from "./auth";

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
		const res = await auth.refresh()

		if (res.error) throw new Error("Refresh failed");

		onRefreshed();
	} finally {
		isRefreshing = false;
	}
};

const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
	try {
		const response = await fetch(input, {
			...init,
			credentials: "include"
		});

		if (response.status === 401) {
			try {
				await tryRefreshToken();
				return fetch(input, {
					...init,
					credentials: "include"
				});
			} catch {
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
