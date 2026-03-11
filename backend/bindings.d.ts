type Bindings = {
    DB: D1Database
    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
    RESEND_API_KEY: string
}

interface AResponse {
    success: boolean,
    message: string,
    data: any,
    error: any,
    code: ContentfulStatusCode
}