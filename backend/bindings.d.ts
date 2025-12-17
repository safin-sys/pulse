type Bindings = {
    DB: D1Database
    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
}

interface AResponse {
    success: boolean,
    message: string,
    data: any,
    error: any,
    code: ContentfulStatusCode
}