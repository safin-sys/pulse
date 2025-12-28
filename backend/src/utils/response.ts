import { Context } from "hono"

const response = (c: Context, { success, message, data, error, code }: AResponse) => {
    return c.json({
        success,
        message,
        data,
        error,
        code
    }, code)
}

export default response