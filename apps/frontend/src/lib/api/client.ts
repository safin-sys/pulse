import { hc } from "hono/client";
import { PUBLIC_API_URL } from "$env/static/public";
import type { AppType } from "@pulse/backend";

export type ApiClient = ReturnType<typeof createClient>;

const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
	return fetch(input, {
		...init,
		credentials: "include"
	});
};

export const createClient = () => {
	return hc<AppType>(PUBLIC_API_URL, { fetch: customFetch, init: { credentials: "include" } });
};

export const api = createClient();
