import { Hono } from "hono";
import { PayloadSchema, type Payload } from "./types";
import response from "../../utils/response";
import {
    api_validation,
    domain_validation,
    enrichment,
    store,
} from "./service";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Bindings }>()
    .use(
        "*",
        cors({
            origin: "*",
            allowMethods: ["POST", "OPTIONS"],
            allowHeaders: ["Content-Type"],
        }),
    )
    .post("/", async (c) => {
        const raw = await c.req.text();
        let payload: Payload;
        try {
            payload = PayloadSchema.parse(JSON.parse(raw));
        } catch {
            return response(c, {
                success: false,
                message: "Invalid payload",
                data: null,
                error: null,
                code: 400,
            });
        }

        // API KEY VALIDATION
        const api_validation_result = await api_validation(
            c.env.CACHE_KV,
            c.env.DB,
            payload.apiKey,
        );

        if (!api_validation_result.success) {
            return response(c, api_validation_result);
        }

        // DOMAIN VALIDATION
        const domain_validation_result = domain_validation(
            c.req.header("Origin"),
            api_validation_result.data.domain,
            api_validation_result.data.allowed_domains,
        );

        if (
            c.env.ENVIRONMENT === "PRODUCTION" &&
            domain_validation_result &&
            !domain_validation_result.success
        ) {
            return response(c, domain_validation_result);
        }

        // ENRICH
        const enriched = enrichment(c, payload.context.userAgent);

        // DB
        await store(c, {
            enriched,
            payload,
            project: api_validation_result.data,
        });
        return response(c, {
            success: true,
            message: "Batch received succesfully",
            data: null,
            error: null,
            code: 200,
        });
    });

export default app;
