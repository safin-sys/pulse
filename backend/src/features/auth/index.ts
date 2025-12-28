import { Hono } from "hono";
import { SignupBodySchema } from "./types";
import { signup } from "./service";
import response from "../../utils/response";
import { validate } from "../../middleware/validate";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/signup", validate("json", SignupBodySchema), async (c) => {
    const data = c.req.valid("json");

    const res = await signup(
        c.env.DB,
        data,
        c.env.ACCESS_TOKEN_SECRET,
        c.env.REFRESH_TOKEN_SECRET
    );

    return response(c, res);
});

export default app;
