export interface SignupBody {
    email: string
    password: string
    name: string
    avatar_url?: string | null
}

export interface User {
    id: string
    email: string
    password_hash: string
    name: string
    avatar_url?: string | null
    created_at: number
    updated_at: number
    is_active: boolean
    email_verified: boolean
    last_login_at: number
    last_logout_at: number
    failed_login_attempts: number
    last_failed_login_at: number
    locked_at: number
    locked_until: number
}