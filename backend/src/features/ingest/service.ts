import { UAParser } from "ua-parser-js";
import { CachedProject, EnrichedBody, EventRow, Payload } from "./types";
import { Context } from "hono";
import { get_project, store_db } from "./repository";

const api_validation = async (
    CACHE_KV: KVNamespace,
    DB: D1Database,
    api_key: string,
): Promise<AResponse> => {
    let project = await CACHE_KV.get<CachedProject>(api_key, "json");

    if (!project) {
        const row = await get_project(DB, api_key);

        if (!row) {
            return {
                success: false,
                message: "Invalid API key",
                data: null,
                error: null,
                code: 401,
            };
        }

        project = { projectId: row.id, domain: row.domain };

        // populate cache
        await CACHE_KV.put(api_key, JSON.stringify(project), {
            expirationTtl: 3600,
        });
    }

    return {
        success: true,
        message: "",
        data: project,
        error: null,
        code: null,
    };
};

const domain_validation = (origin: string | undefined, domain: string) => {
    const originHostname = origin ? new URL(origin).hostname : null;

    if (!originHostname || originHostname !== domain) {
        return {
            success: false,
            message: "Unauthorized domain",
            data: null,
            error: null,
            code: 401,
        };
    }
};

const enrichment = (c: Context, userAgent: string): EnrichedBody => {
    const cf = c.req.raw.cf as IncomingRequestCfProperties;
    const ua = new UAParser(userAgent);
    const ip = c.req.header("CF-Connecting-IP") ?? null;

    return {
        country: cf?.country ?? null,
        city: cf?.city ?? null,
        timezone: cf?.timezone ?? null,
        region: cf?.region ?? null,
        browser: ua.getBrowser().name ?? null,
        os: ua.getOS().name ?? null,
        device: ua.getDevice().type ?? "desktop",
        org: cf.asOrganization ?? null,
        lat: cf.latitude ?? 0,
        lng: cf.longitude ?? 0,
        ip,
    };
};

const store = async (
    DB: D1Database,
    data: { payload: Payload; enriched: EnrichedBody; project: CachedProject },
) => {
    const { enriched, payload, project } = data;
    const receivedAt = Date.now();

    const rows: EventRow[] = payload.events.map((event) => {
        const p = event.properties;
        return {
            id:          crypto.randomUUID(),
            project_id:  project.projectId,
            visitor_id:  event.visitorId,
            session_id:  event.sessionId,
            type:        event.type,
            timestamp:   event.timestamp,
            received_at: receivedAt,
            path:        p.path       ?? null,
            query:       p.query      ?? null,
            title:       p.title      ?? null,
            referrer:    p.referrer   ?? null,
            tag_name:    p.tagName    ?? null,
            element_id:  p.id        ?? null,
            class_name:  p.className  ?? null,
            text:        p.text       ?? null,
            href:        p.href       ?? null,
            user_agent:  payload.context.userAgent,
            browser:     enriched.browser,
            os:          enriched.os,
            device:      enriched.device,
            language:    payload.context.language,
            screen:      payload.context.screen,
            hostname:    payload.context.hostname,
            country:     enriched.country,
            city:        enriched.city,
            region:      enriched.region,
            timezone:    enriched.timezone,
            ip:          enriched.ip,
        };
    });

    return await store_db(DB, rows);
};

export { api_validation, domain_validation, enrichment, store };
