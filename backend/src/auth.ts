import { Hono } from "hono"

const app = new Hono<{ Bindings: Bindings }>()

app.get('/signup', async (c) => {
    // c.env.D1
    return c.json({
        message: 'Hello World'
    }, 200)
})

export default app