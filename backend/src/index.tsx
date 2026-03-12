import { Hono } from "hono";
import auth from "./features/auth";
import health from "./features/health";

const app = new Hono();

app.route("/auth", auth);
app.route("/health", health);

export default app;
