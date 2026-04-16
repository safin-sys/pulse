import { User } from "./types";
import { token_hash } from "../../utils/jwt";
import { generateToken, sha256 } from "../../utils/crypto";

const check_user_exists = async (db: D1Database, email: string) => {
    return await db
        .prepare("SELECT * FROM users WHERE email = ?")
        .bind(email)
        .first<User>();
};

const create_user = async (db: D1Database, data: User) => {
    return await db
        .prepare(
            "INSERT INTO users (id, email, password_hash, name, avatar_url, created_at, updated_at, is_active, email_verified, failed_login_attempts, last_login_at, last_logout_at, last_failed_login_at, locked_at, locked_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
};

const delete_refresh_token = async (db: D1Database, token: string) => {
    const refresh_hash = await token_hash(token);
    return await db
        .prepare("DELETE FROM refresh_tokens WHERE token_hash = ?")
        .bind(refresh_hash)
        .run();
};

const generate_reset_token = async (db: D1Database, user_id: string) => {
    const token = generateToken();
    const hash = await sha256(token);

    await db
        ?.prepare(
            "INSERT INTO reset_tokens (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
        )
        .bind(hash, user_id, Date.now(), Date.now() + 1000 * 60 * 30)
        .run();

    return {
        token,
        hash,
    };
};

const validate_reset_token = async (db: D1Database, token: string) => {
    const hash = await sha256(token);

    const { results } = await db
        ?.prepare("SELECT * FROM reset_tokens WHERE token_hash = ?")
        .bind(hash)
        .run();

    if (!results || results.length === 0) {
        return null;
    }

    const reset_token = results[0] as {
        expires_at: number;
        used_at?: number | null;
        [key: string]: unknown;
        id: string;
        user_id: string;
        token_hash: string;
        created_at: number;
    };

    if (reset_token.expires_at <= Date.now()) {
        return null;
    }

    if (reset_token.used_at) {
        return null;
    }

    return reset_token;
};

const update_with_new_password = async (
    db: D1Database,
    user_id: string,
    password_hash: string,
): Promise<AResponse> => {
    try {
        await db
            .prepare(
                "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
            )
            .bind(password_hash, Date.now(), user_id)
            .run();

        return {
            success: true,
            message: "Password updated successfully",
            data: null,
            error: null,
            code: 200,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update password",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 500,
        };
    }
};

const get_user_by_id = async (db: D1Database, id: string) => {
    return await db
        .prepare(
            "SELECT id, email, name, avatar_url FROM users WHERE id = ?",
        )
        .bind(id)
        .first<User>();
};

export {
    check_user_exists,
    create_user,
    delete_refresh_token,
    generate_reset_token,
    validate_reset_token,
    update_with_new_password,
    get_user_by_id,
};
