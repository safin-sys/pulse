import { Hono } from "hono";
import { ForgotBodySchema, LoginBodySchema, ResetBodySchema, SignupBodySchema } from "./types";
import { forgot, login, logout, refresh, reset, signup } from "./service";
import response from "../../utils/response";
import { validate } from "../../middleware/validate";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/signup", validate("json", SignupBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await signup(
        c.env.DB,
        data,
        c.env.ACCESS_TOKEN_SECRET,
        c.env.REFRESH_TOKEN_SECRET,
    );

    return response(c, res);
});

app.post("/login", validate("json", LoginBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await login(
        c.env.DB,
        data,
        c.env.ACCESS_TOKEN_SECRET,
        c.env.REFRESH_TOKEN_SECRET,
    );

    return response(c, res);
});

app.post("/refresh", async (c) => {
    const refresh_token = c.req.header("Authorization")?.split(" ")[1];

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

    return response(c, res);
});

app.post("/logout", async (c) => {
    const refresh_token = c.req.header("Authorization")?.split(" ")[1];

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

    return response(c, res);
});

app.post("/forgot", validate("json", ForgotBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await forgot(c.env.DB, data, c.env.RESEND_API_KEY);

    return response(c, res);
});

app.post("/reset", validate("json", ResetBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await reset(c.env.DB, data);

    return response(c, res);
});

export default app;
