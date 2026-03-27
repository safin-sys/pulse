import { hc } from "hono/client";
import type { AppType } from "@pulse/backend";
import { PUBLIC_API_URL } from '$env/static/public';

const client = hc<AppType>(PUBLIC_API_URL);

export const load = async () => {
	const res = await client.health.$get();

	const data = await res.json();
	return data;
};
