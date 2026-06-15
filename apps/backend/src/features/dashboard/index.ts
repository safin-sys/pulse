import { Hono } from "hono";
import response from "../../utils/response";
import { verify } from "hono/jwt";
import { get_dashboard, verify_ownership } from "./service";
import { DashboardQueryParamsSchema } from "./types";
import { getCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Bindings }>().get("/:domain", async (c) => {
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
		// validate ownership
        const { domain } = c.req.param();

        const user = (await verify(
            token,
            c.env.ACCESS_TOKEN_SECRET,
            "HS256",
        )) as unknown as {
            id: string;
            role: string;
        };

        const ownership_verifed = await verify_ownership(
            c.env.DB,
            c.env.CACHE_KV,
            user.id,
            domain,
        );

        if (!ownership_verifed) {
            return response(c, {
                success: false,
                message: "User not authorized for this project",
                data: null,
                error: null,
                code: 403,
            });
        }
        // query params and shit
        const params_result = DashboardQueryParamsSchema.safeParse(
            c.req.query(),
        );

        if (!params_result.success) {
            return response(c, {
                success: false,
                message: "Invalid query params",
                data: null,
                error: params_result.error.message ?? "Unknown error",
                code: 400,
            });
        }

        const params = params_result.data;

        // get the actual dashboard data
        // da real shmeat of the func
        const dashboard = await get_dashboard(c.env.DB, domain, params);

        return response(c, {
            success: true,
            message: "Dashboard successfully received",
            data: dashboard,
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
