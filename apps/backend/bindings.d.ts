type Bindings = {
    ENVIRONMENT: "DEVELOPMENT" | "PRODUCTION"
    DB: D1Database
    CACHE_KV: KVNamespace
    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
    RESEND_API_KEY: string
    API_URL: string
}

interface AResponse {
    success: boolean,
    message: string,
    data: any,
    error: any,
    code: ContentfulStatusCode
}