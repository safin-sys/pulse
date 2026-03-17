import { z } from "zod";

export const PayloadSchema = z.object({
    apiKey: z.string(),
    context: z.object({
        userAgent: z.string(),
        language: z.string(),
        screen: z.string(),
        hostname: z.string(),
    }),
    events: z
        .array(
            z.object({
                type: z.string(),
                visitorId: z.string(),
                sessionId: z.string(),
                timestamp: z.number(),
                properties: z.record(z.string(), z.unknown()),
            }),
        )
        .min(1),
});

export type Payload = z.infer<typeof PayloadSchema>;

export interface CachedProject {
    projectId: string;
    domain: string;
}

export interface EnrichedBody {
    country: string | null;
    city: string | null;
    timezone: string | null;
    region: string | null;
    browser: string | null;
    os: string | null;
    device: string | "desktop";
    org: string | null;
    lat: string | 0;
    lng: string | 0;
    ip: string | null;
}

export interface EventRow {
    id: string;
    project_id: string;
    visitor_id: string;
    session_id: string;
    type: string;
    timestamp: number;
    received_at: number;
    path: {} | null;
    query: {} | null;
    title: {} | null;
    referrer: {} | null;
    tag_name: {} | null;
    element_id: {} | null;
    class_name: {} | null;
    text: {} | null;
    href: {} | null;
    user_agent: string;
    browser: string | null;
    os: string | null;
    device: string;
    language: string;
    screen: string;
    hostname: string;
    country: string | null;
    city: string | null;
    region: string | null;
    timezone: string | null;
    ip: string | null;
}[]
