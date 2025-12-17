import generate_token from "../../utils/jwt"
import { hash } from "../../utils/password"
import { check_user_exists, create_user } from "./repository"
import { SignupBody, User } from "./types"

const signup = async (
    db: D1Database,
    data: SignupBody,
    access_token_secret: string,
    refresh_token_secret: string
): Promise<AResponse> => {
    const user = await check_user_exists(db, data.email)
    if (user) {
        return { success: false, message: 'User already exists', data: null, error: null, code: 400 }
    }

    const password_hash = await hash(data.password)

    const body: User = {
        id: crypto.randomUUID(),
        email: data.email,
        password_hash,
        name: data.name,
        avatar_url: data.avatar_url ?? null,
        created_at: Date.now(),
        updated_at: Date.now(),
        is_active: true,
        email_verified: false,
        failed_login_attempts: 0,
        last_login_at: Date.now(),
        last_logout_at: Date.now(),
        last_failed_login_at: Date.now(),
        locked_at: Date.now(),
        locked_until: Date.now(),
    }

    await create_user(db, body)

    const payload = {
        id: body.id,
        role: 'user',
    }

    const access_token = await generate_token(
        payload,
        "access",
        access_token_secret
    )

    const refresh_token = await generate_token(
        payload,
        "refresh",
        refresh_token_secret
    )

    return { success: true, message: 'User created successfully', data: { access_token, refresh_token }, error: null, code: 201 }
}

export { signup }