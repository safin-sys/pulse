import { JWTPayload } from "hono/utils/jwt/types";
import { User } from "./types";
import { token_hash } from "../../utils/jwt";

const check_user_exists = async (db: D1Database, email: string) => {
    return await db.prepare(
        "SELECT * FROM users WHERE email = ?",
    )
        .bind(email)
        .first<User>();
}

const create_user = async (db: D1Database, data: User) => {
    return await db.prepare(
        "INSERT INTO users (id, email, password_hash, name, avatar_url, created_at, updated_at, is_active, email_verified, failed_login_attempts, last_login_at, last_logout_at, last_failed_login_at, locked_at, locked_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
        .bind(
            data.id,
            data.email,
            data.password_hash,
            data.name,
            data.avatar_url,
            data.created_at,
            data.updated_at,
            data.is_active,
            data.email_verified,
            data.failed_login_attempts,
            data.last_login_at,
            data.last_logout_at,
            data.last_failed_login_at,
            data.locked_at,
            data.locked_until,
        )
        .run();
}

const delete_refresh_token = async (db: D1Database, token: string) => {
    const refresh_hash = await token_hash(token);
    return await db.prepare(
        "DELETE FROM refresh_tokens WHERE token_hash = ?",
    )
        .bind(refresh_hash)
        .run();
}

export { check_user_exists, create_user, delete_refresh_token }