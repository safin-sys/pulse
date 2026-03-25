import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

interface Payload {
    id: string;
    role: string;
    exp?: number;
    iat?: number;
    data?: any;
}

const token_hash = async (token: string) => {
    return crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(token))
        .then((hash) => {
            return Array.from(new Uint8Array(hash))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
        })
        .catch((error) => {
            console.error(error);
            return null;
        });
};

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
        const refresh_hash = await token_hash(token);
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

const verify_token = async (db: D1Database, token: string, secret: string) => {
    const refresh_hash = await token_hash(token);
    const refresh_token = await db
        .prepare("SELECT * FROM refresh_tokens WHERE token_hash = ?")
        .bind(refresh_hash)
        .run();

    if (refresh_token.results.length === 0) {
        return null;
    }

    return (await verify(token, secret, "HS256")) as JWTPayload;
};

export { generate_token, token_hash, verify_token };
