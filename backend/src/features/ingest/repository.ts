import { EventRow } from "./types";

const get_project = async (
    DB: D1Database,
    api_key: string,
): Promise<{ id: string; domain: string } | null> => {
    return await DB.prepare(
        `SELECT id, domain FROM projects WHERE api_key = ? AND is_active = 1 LIMIT 1`,
    )
        .bind(api_key)
        .first<{ id: string; domain: string }>();
};

const event_insert = async (DB: D1Database, events: EventRow[]) => {
    // Events
    const eventStmt = DB.prepare(`
        INSERT INTO events (
            id, project_id, visitor_id, session_id, type,
            timestamp, received_at, path, query, title, referrer,
            tag_name, element_id, class_name, text, href,
            user_agent, browser, os, device, language, screen, hostname,
            country, city, region, timezone, ip
        ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?
        )
    `);

    const eventBatch = events.map((e) =>
        eventStmt.bind(
            e.id,
            e.project_id,
            e.visitor_id,
            e.session_id,
            e.type,
            e.timestamp,
            e.received_at,
            e.path,
            e.query,
            e.title,
            e.referrer,
            e.tag_name,
            e.element_id,
            e.class_name,
            e.text,
            e.href,
            e.user_agent,
            e.browser,
            e.os,
            e.device,
            e.language,
            e.screen,
            e.hostname,
            e.country,
            e.city,
            e.region,
            e.timezone,
            e.ip,
        ),
    );

    return await DB.batch([
        ...eventBatch
    ]);
};

export { get_project, event_insert };
