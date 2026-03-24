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

    return await DB.batch([...eventBatch]);
};

const rollup_tables_insert = async (DB: D1Database, events: EventRow[]) => {
    const pageViews = events.filter((e) => e.type === "page_view");
    if (pageViews.length === 0) return;

    const stmts: D1PreparedStatement[] = [];

    // Prepared statements (defined once, bound per event)
    const statsEnsure = DB.prepare(`
        INSERT INTO daily_stats (project_id, date, pageviews, sessions, visitors)
        VALUES (?, ?, 0, 0, 0)
        ON CONFLICT (project_id, date) DO NOTHING
    `);

    const statsPageview = DB.prepare(`
        UPDATE daily_stats SET pageviews = pageviews + 1
        WHERE project_id = ? AND date = ?
    `);

    const sessionDedup = DB.prepare(`
        INSERT OR IGNORE INTO daily_sessions (project_id, date, session_id)
        VALUES (?, ?, ?)
    `);

    const statsSession = DB.prepare(`
        UPDATE daily_stats SET sessions = sessions + 1
        WHERE project_id = ? AND date = ? AND (SELECT changes()) = 1
    `);

    const visitorDedup = DB.prepare(`
        INSERT OR IGNORE INTO daily_visitors (project_id, date, visitor_id)
        VALUES (?, ?, ?)
    `);

    const statsVisitor = DB.prepare(`
        UPDATE daily_stats SET visitors = visitors + 1
        WHERE project_id = ? AND date = ? AND (SELECT changes()) = 1
    `);

    const pageUpsert = DB.prepare(`
        INSERT INTO daily_pages (project_id, date, path, pageviews)
        VALUES (?, ?, ?, 1)
        ON CONFLICT (project_id, date, path) DO UPDATE SET pageviews = pageviews + 1
    `);

    const referrerUpsert = DB.prepare(`
        INSERT INTO daily_referrers (project_id, date, referrer, count)
        VALUES (?, ?, ?, 1)
        ON CONFLICT (project_id, date, referrer) DO UPDATE SET count = count + 1
    `);

    const countryUpsert = DB.prepare(`
        INSERT INTO daily_countries (project_id, date, country, count)
        VALUES (?, ?, ?, 1)
        ON CONFLICT (project_id, date, country) DO UPDATE SET count = count + 1
    `);

    const browserUpsert = DB.prepare(`
        INSERT INTO daily_browsers (project_id, date, browser, count)
        VALUES (?, ?, ?, 1)
        ON CONFLICT (project_id, date, browser) DO UPDATE SET count = count + 1
    `);

    const deviceUpsert = DB.prepare(`
        INSERT INTO daily_devices (project_id, date, device, count)
        VALUES (?, ?, ?, 1)
        ON CONFLICT (project_id, date, device) DO UPDATE SET count = count + 1
    `);

    for (const e of pageViews) {
        const drift = Math.abs(e.timestamp - e.received_at);
        const timestamp =
            drift > 24 * 60 * 60 * 1000 ? e.received_at : e.timestamp;

        const date = new Date(timestamp).toISOString().slice(0, 10);
        const pid = e.project_id;

        // Ensure the daily_stats row exists first
        stmts.push(statsEnsure.bind(pid, date));

        // Pageview increment
        stmts.push(statsPageview.bind(pid, date));

        // Session dedup → conditional increment
        stmts.push(sessionDedup.bind(pid, date, e.session_id));
        stmts.push(statsSession.bind(pid, date));

        // Visitor dedup → conditional increment
        stmts.push(visitorDedup.bind(pid, date, e.visitor_id));
        stmts.push(statsVisitor.bind(pid, date));

        // Dimension tables
        if (e.path) stmts.push(pageUpsert.bind(pid, date, e.path));
        if (e.referrer) stmts.push(referrerUpsert.bind(pid, date, e.referrer));
        if (e.country) stmts.push(countryUpsert.bind(pid, date, e.country));
        if (e.browser) stmts.push(browserUpsert.bind(pid, date, e.browser));
        if (e.device) stmts.push(deviceUpsert.bind(pid, date, e.device));
    }

    await DB.batch(stmts);
};

export { get_project, event_insert, rollup_tables_insert };
