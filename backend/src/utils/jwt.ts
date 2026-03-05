import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { hash } from "./password";

interface Payload {
    id: string;
    role: string;
    exp?: number;
    iat?: number;
    data?: any;
}

const generate_token = async (
    payload: Payload,
    type: "access" | "refresh",
    secret: string,
    db?: D1Database,
) => {
    const { access_expiration, refresh_expiration } = {
        access_expiration: 60 * 5, // 5 minutes
        refresh_expiration: 60 * 60 * 24 * 30, // 30 days
    };

    const jwt_payload: JWTPayload = {
        id: payload.id,
        role: payload.role,
        type,
        exp:
            payload.exp ??
            Math.floor(Date.now() / 1000) +
                (type === "access" ? access_expiration : refresh_expiration),
        iat: payload.iat ?? Math.floor(Date.now() / 1000),
        data: payload.data,
    };

    const token = await sign(jwt_payload, secret);

    if (type === "refresh") {
        const refresh_hash = await hash(token);

        await db
            ?.prepare(
                "INSERT INTO refresh_tokens (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
            )
            .bind(
                refresh_hash,
                payload.id,
                Date.now(),
                Date.now() + refresh_expiration * 1000,
            )
            .run();
    }

    return token;
};

const verify_token = async (token: string, secret: string) => {
    return await verify(token, secret) as JWTPayload;
};

export { generate_token, verify_token };
