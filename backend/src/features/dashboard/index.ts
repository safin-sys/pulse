import { Hono } from "hono";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/");

export default app;