import { email, z } from "zod";

export const SignupBodySchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
    avatar_url: z.url("Invalid avatar url").optional().nullable(),
});

export type SignupBody = z.infer<typeof SignupBodySchema>;

export const LoginBodySchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const ForgotBodySchema = z.object({
    email: z.email("Invalid email format"),
});

export type ForgotBody = z.infer<typeof ForgotBodySchema>;

export interface User {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    avatar_url?: string | null;
    created_at: number;
    updated_at: number;
    is_active: boolean;
    email_verified: boolean;
    last_login_at: number;
    last_logout_at: number;
    failed_login_attempts: number;
    last_failed_login_at: number;
    locked_at: number;
    locked_until: number;
}
