import { Hono } from "hono";
import auth from "./features/auth";
import health from "./features/health";
import projects from "./features/projects";
import ingest from "./features/ingest";
import dashboard from "./features/dashboard";
import response from "./utils/response";
import { ZodError } from "zod";

const app = new Hono();

const routes = app
    .route("/auth", auth)
    .route("/health", health)
    .route("/projects", projects)
    .route("/ingest", ingest)
    .route("/dashboard", dashboard)
    .onError((err, c) => {
        if (err instanceof ZodError) {
            return response(c, {
                success: false,
                message: "Invalid data received",
                data: null,
                error: err.issues[0].message,
                code: 400,
            });
        }
        return response(c, {
            success: false,
            message: "Internal server error",
            data: null,
            error: err.message,
            code: 500,
        });
    });
    
export default app;
export type AppType = typeof routes;
