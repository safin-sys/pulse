import send_email from "../../utils/emails";
import { generate_token, verify_token } from "../../utils/jwt";
import { hash, verify } from "../../utils/password";
import {
    check_user_exists,
    create_user,
    delete_refresh_token,
    generate_reset_token,
} from "./repository";
import { ForgotBody, LoginBody, SignupBody, User } from "./types";

const signup = async (
    db: D1Database,
    data: SignupBody,
    access_token_secret: string,
    refresh_token_secret: string,
): Promise<AResponse> => {
    const user = await check_user_exists(db, data.email);
    if (user) {
        return {
            success: false,
            message: "User already exists",
            data: null,
            error: null,
            code: 400,
        };
    }

    const password_hash = await hash(data.password);

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
    };

    await create_user(db, body);

    const payload = {
        id: body.id,
        role: "user",
    };

    const access_token = await generate_token(
        payload,
        "access",
        access_token_secret,
    );

    const refresh_token = await generate_token(
        payload,
        "refresh",
        refresh_token_secret,
        db,
    );

    return {
        success: true,
        message: "User created successfully",
        data: { access_token, refresh_token },
        error: null,
        code: 201,
    };
};

const login = async (
    db: D1Database,
    data: LoginBody,
    access_token_secret: string,
    refresh_token_secret: string,
): Promise<AResponse> => {
    const user = await check_user_exists(db, data.email);

    if (!user) {
        return {
            success: false,
            message: "Invalid email or password",
            data: null,
            error: null,
            code: 401,
        };
    }

    const isPasswordValid = await verify(data.password, user.password_hash);

    if (!isPasswordValid) {
        return {
            success: false,
            message: "Invalid email or password",
            data: null,
            error: null,
            code: 401,
        };
    }

    // generate access and refresh tokens
    const payload = {
        id: user.id,
        role: "user",
    };

    const access_token = await generate_token(
        payload,
        "access",
        access_token_secret,
    );

    const refresh_token = await generate_token(
        payload,
        "refresh",
        refresh_token_secret,
        db,
    );

    return {
        success: true,
        message: "Login successful",
        data: { access_token, refresh_token },
        error: null,
        code: 200,
    };
};

const refresh = async (
    db: D1Database,
    refresh_token: string,
    access_token_secret: string,
    refresh_token_secret: string,
): Promise<AResponse> => {
    try {
        const token = await verify_token(
            db,
            refresh_token,
            refresh_token_secret,
        );
        if (!token || token.type !== "refresh") {
            return {
                success: false,
                message: "Invalid refresh token",
                data: null,
                error: null,
                code: 401,
            };
        }

        const new_access_token = await generate_token(
            { id: token.id as string, role: token.role as string },
            "access",
            access_token_secret,
        );

        const new_refresh_token = await generate_token(
            { id: token.id as string, role: token.role as string },
            "refresh",
            refresh_token_secret,
            db,
        );

        return {
            success: true,
            message: "Refresh successful",
            data: {
                access_token: new_access_token,
                refresh_token: new_refresh_token,
            },
            error: null,
            code: 200,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Invalid refresh token",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 401,
        };
    }
};

const logout = async (
    db: D1Database,
    refresh_token: string,
    refresh_token_secret: string,
): Promise<AResponse> => {
    try {
        const token = await verify_token(
            db,
            refresh_token,
            refresh_token_secret,
        );
        if (!token || token.type !== "refresh") {
            return {
                success: true,
                message: "Already logged out",
                data: null,
                error: null,
                code: 200,
            };
        }

        await delete_refresh_token(db, refresh_token);

        return {
            success: true,
            message: "Logout successful",
            data: null,
            error: null,
            code: 200,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Internal server error",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 500,
        };
    }
};

const forgot = async (
    db: D1Database,
    data: ForgotBody,
    resend_api_key: string,
): Promise<AResponse> => {
    const user = await check_user_exists(db, data.email);

    if (!user) {
        return {
            success: true,
            message: "A reset link has been sent to your email",
            data: null,
            error: null,
            code: 200,
        };
    }

    const { token } = await generate_reset_token(db, user.id);

    const email_payload = {
        to: user.email,
        url: `http://localhost:3000/reset/${token}`,
    };

    try {
        await send_email(resend_api_key, email_payload, "reset");
        return {
            success: true,
            message: "A reset link has been sent to your email",
            data: null,
            error: null,
            code: 200,
        };
    } catch (error) {
        console.error(error);
        return {
            code: 500,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Internal Server Error",
            success: false,
        };
    }
};

export { signup, login, refresh, logout, forgot };
