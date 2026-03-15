import { Hono } from "hono";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", (c) => {
    return c.json({ status: "ok" });
});

export default app;
