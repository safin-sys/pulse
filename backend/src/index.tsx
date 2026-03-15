import { Hono } from "hono";
import auth from "./features/auth";
import health from "./features/health";
import projects from "./features/projects";
import ingest from "./features/ingest";

const app = new Hono();

app.route("/auth", auth);
app.route("/health", health);
app.route("/projects", projects);
app.route("/ingest", ingest);

export default app;
