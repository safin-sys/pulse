import { sign } from "hono/jwt"
import { JWTPayload } from "hono/utils/jwt/types"

interface Payload {
    id: string,
    role: string,
    exp?: number,
    iat?: number,
    data?: any,
}

const generate_token = async (
    payload: Payload,
    type: "access" | "refresh",
    secret: string,
) => {
    const jwt_payload: JWTPayload = {
        id: payload.id,
        role: payload.role,
        exp: payload.exp ?? Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
        iat: payload.iat ?? Math.floor(Date.now() / 1000),
        data: payload.data,
    }

    switch (type) {
        case "access":
            return await sign(jwt_payload, secret)
        case "refresh":
            return await sign(jwt_payload, secret)
    }
}

export default generate_token;