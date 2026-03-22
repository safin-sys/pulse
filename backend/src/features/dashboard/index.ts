import { Hono } from "hono";
import response from "../../utils/response";
import { verify } from "hono/jwt";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/:domain", async (c) => {
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
        (await verify(token, c.env.ACCESS_TOKEN_SECRET)) as unknown as {
            id: string;
            role: string;
        };

        const { domain } = c.req.param();
        const {
            range,
            pageView,
            sourceView,
            deviceView,
            locationView,
            hostname,
            page,
            referrer,
            country,
            device,
            browser,
            os,
        } = c.req.query();

        const params = {
            range,

            // section filters
            pageView,
            sourceView,
            deviceView,
            locationView,

            // global filters
            hostname,
            page,
            referrer,
            country,
            device,
            browser,
            os,
        };

        return response(c, {
            success: true,
            message: "",
            data: { domain, ...params },
            error: null,
            code: 200,
        });
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
