import { Hono } from "hono"
import { SignupBody } from "./types"
import { signup } from "./service"
import response from "../../utils/response"

const app = new Hono<{ Bindings: Bindings }>()

app.post('/signup', async (c) => {
    const data = await c.req.json() as SignupBody

    const res = await signup(c.env.DB, data, c.env.ACCESS_TOKEN_SECRET, c.env.REFRESH_TOKEN_SECRET)

    return response(c, res)
})

export default app
