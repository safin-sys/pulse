import { hc } from "hono/client";
import type { AppType } from "@pulse/backend";

const client = hc<AppType>("http://localhost:5173/");

export const load = async () => {
	const res = await client.health.$get();

	const data = await res.json();
	return data;
};
