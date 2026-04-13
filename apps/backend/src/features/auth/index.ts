import { Hono } from "hono";
import { ForgotBodySchema, LoginBodySchema, ResetBodySchema, SignupBodySchema } from "./types";
import { forgot, login, logout, refresh, reset, signup, get_me } from "./service";
import response from "../../utils/response";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { CookieOptions } from "hono/utils/cookie";

const getCookieOptions = (environment: string): CookieOptions => ({
    httpOnly: true,
    secure: environment === "PRODUCTION",
    sameSite: "lax",
    path: "/",
});

const app = new Hono<{ Bindings: Bindings }>()
.post("/signup", zValidator("json", SignupBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await signup(
        c.env.DB,
        data,
        c.env.ACCESS_TOKEN_SECRET,
        c.env.REFRESH_TOKEN_SECRET,
    );

    if(res.success) {
        const cookieOptions = getCookieOptions(c.env.ENVIRONMENT);
        
        setCookie(c, "access_token", res.data.access_token, {
            ...cookieOptions,
            maxAge: 60 * 15,
        });
        
        setCookie(c, "refresh_token", res.data.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 7,
        });
    }
      
    return response(c, res);
})
.post("/login", zValidator("json", LoginBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await login(
        c.env.DB,
        data,
        c.env.ACCESS_TOKEN_SECRET,
        c.env.REFRESH_TOKEN_SECRET,
    );

    if (res.success) {
        const cookieOptions = getCookieOptions(c.env.ENVIRONMENT);

        setCookie(c, "access_token", res.data.access_token, {
            ...cookieOptions,
            maxAge: 60 * 15,
        });

        setCookie(c, "refresh_token", res.data.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    return response(c, res);
})
.post("/refresh", async (c) => {
    const refresh_token = getCookie(c, "refresh_token");

    if (!refresh_token) {
        return response(c, {
            success: false,
            message: "Refresh token is required",
            data: null,
            error: null,
            code: 401,
        });
    }

    const res = await refresh(
        c.env.DB,
        refresh_token,
        c.env.ACCESS_TOKEN_SECRET,
        c.env.REFRESH_TOKEN_SECRET,
    );

    if (res.success) {
        const cookieOptions = getCookieOptions(c.env.ENVIRONMENT);

        setCookie(c, "access_token", res.data.access_token, {
            ...cookieOptions,
            maxAge: 60 * 15,
        });

        setCookie(c, "refresh_token", res.data.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    return response(c, res);
})
.post("/logout", async (c) => {
    const refresh_token = getCookie(c, "refresh_token");

    if (!refresh_token) {
        return response(c, {
            success: false,
            message: "Refresh token is required",
            data: null,
            error: null,
            code: 401,
        });
    }

    const res = await logout(
        c.env.DB,
        refresh_token,
        c.env.REFRESH_TOKEN_SECRET,
    );

    if (res.success) {
        const cookieOptions = getCookieOptions(c.env.ENVIRONMENT);

        setCookie(c, "access_token", "", {
            ...cookieOptions,
            maxAge: 0,
        });

        setCookie(c, "refresh_token", "", {
            ...cookieOptions,
            maxAge: 0,
        });
    }

    return response(c, res);
})
.get("/me", async (c) => {
    const access_token = getCookie(c, "access_token");

    if (!access_token) {
        return response(c, {
            success: false,
            message: "Access token is required",
            data: null,
            error: null,
            code: 401,
        });
    }

    try {
        const payload = await verify(access_token, c.env.ACCESS_TOKEN_SECRET, "HS256") as JWTPayload;

        if (!payload.id) {
            return response(c, {
                success: false,
                message: "Invalid access token",
                data: null,
                error: null,
                code: 401,
            });
        }

        const res = await get_me(c.env.DB, payload.id as string);

        return response(c, res);
    } catch (error) {
        return response(c, {
            success: false,
            message: "Invalid access token",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 401,
        });
    }
})
.post("/forgot", zValidator("json", ForgotBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await forgot(c.env.DB, data, c.env.RESEND_API_KEY, c.env.API_URL);

    return response(c, res);
})
.post("/reset", zValidator("json", ResetBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await reset(c.env.DB, data);

    return response(c, res);
});

export default app;
