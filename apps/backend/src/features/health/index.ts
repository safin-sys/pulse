import { Hono } from "hono";

const app = new Hono<{ Bindings: Bindings }>()
    .get("/", (c) => c.json({ status: "ok" }));

export default app;
