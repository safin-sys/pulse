import { Hono } from "hono";
import { verify } from "hono/jwt";
import response from "../../utils/response";
import { validate } from "../../middleware/validate";
import { CreateProjectBodySchema } from "./types";
import { create } from "./service";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", validate("json", CreateProjectBodySchema), async (c) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return response(c, {
            success: false,
            message: "Authorization token is required",
            data: null,
            error: null,
            code: 401,
        });
    }

    try {
        const payload = (await verify(
            token,
            c.env.ACCESS_TOKEN_SECRET,
        )) as unknown as {
            id: string;
            role: string;
        };

        const data = c.req.valid("json");

        const res = await create(c.env.DB, payload.id, data);

        return response(c, res);
    } catch (error) {
        return response(c, {
            success: false,
            message: "Invalid or expired token",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 401,
        });
    }
});

export default app;