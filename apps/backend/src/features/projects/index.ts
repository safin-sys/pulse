import { Hono } from "hono";
import { verify } from "hono/jwt";
import response from "../../utils/response";
import { CreateProjectBodySchema, UpdateProjectBodySchema } from "./types";
import { create, update, getAll, deleteOne, rotateApiKey } from "./service";
import { zValidator } from "@hono/zod-validator";
import { getCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Bindings }>()
.post("/", zValidator("json", CreateProjectBodySchema), async (c) => {
    const token = getCookie(c, "access_token");

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
            "HS256"
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
})
.patch(
    "/:projectId",
    zValidator("json", UpdateProjectBodySchema),
    async (c) => {
        const token = getCookie(c, "access_token");

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
                "HS256"
            )) as unknown as {
                id: string;
                role: string;
            };

            const projectId = c.req.param("projectId");
            const data = c.req.valid("json");

            const res = await update(c.env.DB, projectId, payload.id, data);

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
    },
)
.get("/", async (c) => {
    const token = getCookie(c, "access_token");

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
            "HS256"
        )) as unknown as {
            id: string;
            role: string;
        };

        const res = await getAll(c.env.DB, payload.id);

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
})
.delete("/:projectId", async (c) => {
    const token = getCookie(c, "access_token");

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
            "HS256"
        )) as unknown as {
            id: string;
            role: string;
        };

        const projectId = c.req.param("projectId");

        const res = await deleteOne(c.env.DB, projectId, payload.id);

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
})
.post("/:projectId/rotate-api-key", async (c) => {
    const token = getCookie(c, "access_token");

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
            "HS256"
        )) as unknown as {
            id: string;
            role: string;
        };

        const projectId = c.req.param("projectId");

        const res = await rotateApiKey(c.env.DB, projectId, payload.id);

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