import { Hono } from "hono";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", (c) => {
	// validate domain
	// validate api key (handle cache)
	// send the batch to event queue
    return c.json({ status: "ok" });
});

export default app;
