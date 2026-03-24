import {
    BrowserRow,
    ChartPoint,
    CityRow,
    CountryRow,
    DateRange,
    DashboardFilters,
    DeviceRow,
    OsRow,
    PageRow,
    ReferrerRow,
    RegionRow,
    SummaryBlock,
} from "./types";

// ---- filter builder ----

type FilterClause = { sql: string; bindings: unknown[] };

const build_filters = (
    projectId: string,
    range: DateRange,
    filters: DashboardFilters,
): FilterClause => {
    const parts: string[] = [
        "project_id = ?",
        "type = 'page_view'",
        "DATE(timestamp / 1000, 'unixepoch') BETWEEN ? AND ?",
    ];
    const bindings: unknown[] = [projectId, range.from, range.to];

    if (filters.hostname) {
        parts.push("hostname = ?");
        bindings.push(filters.hostname);
    }
    if (filters.page) {
        parts.push("path = ?");
        bindings.push(filters.page);
    }
    if (filters.referrer) {
        parts.push("referrer = ?");
        bindings.push(filters.referrer);
    }
    if (filters.country) {
        parts.push("country = ?");
        bindings.push(filters.country);
    }
    if (filters.device) {
        parts.push("device = ?");
        bindings.push(filters.device);
    }
    if (filters.browser) {
        parts.push("browser = ?");
        bindings.push(filters.browser);
    }
    if (filters.os) {
        parts.push("os = ?");
        bindings.push(filters.os);
    }

    return { sql: parts.join(" AND "), bindings };
};

// ---- queries ----

export const query_summary = async (
    DB: D1Database,
    projectId: string,
    range: DateRange,
    filters: DashboardFilters,
): Promise<SummaryBlock> => {
    const { sql, bindings } = build_filters(projectId, range, filters);
    const result = await DB.prepare(`
        SELECT
            COUNT(*) as entries,
            COUNT(DISTINCT visitor_id) as visitors,
            COUNT(DISTINCT session_id) as sessions
        FROM events
        WHERE ${sql}
    `).bind(...bindings).first<SummaryBlock>();

    return result ?? { entries: 0, visitors: 0, sessions: 0 };
};

export const query_chart = async (
    DB: D1Database,
    projectId: string,
    range: DateRange,
    filters: DashboardFilters,
): Promise<ChartPoint[]> => {
    const { sql, bindings } = build_filters(projectId, range, filters);
    const result = await DB.prepare(`
        SELECT
            DATE(timestamp / 1000, 'unixepoch') as date,
            COUNT(*) as entries,
            COUNT(DISTINCT visitor_id) as visitors,
            COUNT(DISTINCT session_id) as sessions
        FROM events
        WHERE ${sql}
        GROUP BY date
        ORDER BY date ASC
    `).bind(...bindings).all<ChartPoint>();

    return result.results;
};

export const query_pages = async (
    DB: D1Database,
    projectId: string,
    range: DateRange,
    filters: DashboardFilters,
    view: "top" | "entered",
): Promise<PageRow[]> => {
    const { sql, bindings } = build_filters(projectId, range, filters);

    // "entered" = first event of each session (entry pages)
    // "top"     = all pageviews grouped by path
    const query =
        view === "entered"
            ? `
        SELECT
            path,
            COUNT(*) as entries,
            COUNT(DISTINCT visitor_id) as visitors
        FROM events
        WHERE ${sql}
          AND (project_id, session_id, timestamp) IN (
              SELECT project_id, session_id, MIN(timestamp)
              FROM events
              WHERE ${sql}
              GROUP BY project_id, session_id
          )
        GROUP BY path
        ORDER BY entries DESC
        LIMIT 50
    `
            : `
        SELECT
            path,
            COUNT(*) as entries,
            COUNT(DISTINCT visitor_id) as visitors
        FROM events
        WHERE ${sql}
        GROUP BY path
        ORDER BY entries DESC
        LIMIT 50
    `;

    // "entered" view uses the filter clause twice (inner + outer subquery)
    const b = view === "entered" ? [...bindings, ...bindings] : bindings;
    const result = await DB.prepare(query).bind(...b).all<PageRow>();
    return result.results;
};

export const query_sources = async (
    DB: D1Database,
    projectId: string,
    range: DateRange,
    filters: DashboardFilters,
): Promise<ReferrerRow[]> => {
    const { sql, bindings } = build_filters(projectId, range, filters);
    const result = await DB.prepare(`
        SELECT
            COALESCE(NULLIF(referrer, ''), 'Direct') as referrer,
            COUNT(*) as entries,
            COUNT(DISTINCT visitor_id) as visitors
        FROM events
        WHERE ${sql}
        GROUP BY referrer
        ORDER BY visitors DESC
        LIMIT 50
    `).bind(...bindings).all<ReferrerRow>();

    return result.results;
};

export const query_locations = async (
    DB: D1Database,
    projectId: string,
    range: DateRange,
    filters: DashboardFilters,
    view: "country" | "region" | "city",
): Promise<CountryRow[] | RegionRow[] | CityRow[]> => {
    const { sql, bindings } = build_filters(projectId, range, filters);

    if (view === "country") {
        const result = await DB.prepare(`
            SELECT
                country as countryCode,
                COUNT(DISTINCT visitor_id) as visitors
            FROM events
            WHERE ${sql} AND country IS NOT NULL
            GROUP BY country
            ORDER BY visitors DESC
            LIMIT 50
        `).bind(...bindings).all<CountryRow>();
        return result.results;
    }

    if (view === "region") {
        const result = await DB.prepare(`
            SELECT
                region,
                country as countryCode,
                COUNT(DISTINCT visitor_id) as visitors
            FROM events
            WHERE ${sql} AND region IS NOT NULL
            GROUP BY region, country
            ORDER BY visitors DESC
            LIMIT 50
        `).bind(...bindings).all<RegionRow>();
        return result.results;
    }

    // city
    const result = await DB.prepare(`
        SELECT
            city,
            region,
            country as countryCode,
            COUNT(DISTINCT visitor_id) as visitors
        FROM events
        WHERE ${sql} AND city IS NOT NULL
        GROUP BY city, region, country
        ORDER BY visitors DESC
        LIMIT 50
    `).bind(...bindings).all<CityRow>();
    return result.results;
};

export const query_devices = async (
    DB: D1Database,
    projectId: string,
    range: DateRange,
    filters: DashboardFilters,
    view: "browser" | "os" | "device",
): Promise<BrowserRow[] | OsRow[] | DeviceRow[]> => {
    const { sql, bindings } = build_filters(projectId, range, filters);

    const col = view; // column name matches view name in all three cases

    const raw = await DB.prepare(`
        SELECT
            ${col} as label,
            COUNT(DISTINCT visitor_id) as visitors
        FROM events
        WHERE ${sql} AND ${col} IS NOT NULL
        GROUP BY ${col}
        ORDER BY visitors DESC
        LIMIT 50
    `).bind(...bindings).all<{ label: string; visitors: number }>();

    const total = raw.results.reduce((sum, r) => sum + r.visitors, 0);

    if (view === "browser") {
        return raw.results.map((r) => ({
            browser: r.label,
            visitors: r.visitors,
            percentage: total > 0 ? Math.round((r.visitors / total) * 100) : 0,
        })) as BrowserRow[];
    }
    if (view === "os") {
        return raw.results.map((r) => ({
            os: r.label,
            visitors: r.visitors,
            percentage: total > 0 ? Math.round((r.visitors / total) * 100) : 0,
        })) as OsRow[];
    }
    return raw.results.map((r) => ({
        device: r.label,
        visitors: r.visitors,
        percentage: total > 0 ? Math.round((r.visitors / total) * 100) : 0,
    })) as DeviceRow[];
};