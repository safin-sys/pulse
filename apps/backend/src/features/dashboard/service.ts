import { resolve_range } from "../../utils/range";
import { get_projects_by_owner_id } from "../projects/repository";
import {
    query_summary,
    query_chart,
    query_pages,
    query_sources,
    query_locations,
    query_devices,
} from "./repository";
import {
    CachedProject,
    DashboardFilters,
    DashboardQueryParams,
    DashboardResponse,
} from "./types";

export const get_dashboard = async (
    DB: D1Database,
    domain: string,
    params: DashboardQueryParams,
): Promise<DashboardResponse> => {
    const project = await DB.prepare(
        `SELECT id FROM projects WHERE domain = ? LIMIT 1`,
    )
        .bind(domain)
        .first<{ id: string }>();

    if (!project) throw new Error("Project not found");

    const projectId = project?.id;

    const {
        range: rangeSlug,
        pageView,
        sourceView,
        locationView,
        deviceView,
        ...filterParams
    } = params;

    const { range, chart_range } = resolve_range(rangeSlug);
    const filters: DashboardFilters = filterParams;

    const [summary, chart, pages, sources, locations, devices] =
        await Promise.all([
            query_summary(DB, projectId, range, filters),
            query_chart(DB, projectId, chart_range, filters),
            query_pages(DB, projectId, range, filters, pageView),
            query_sources(DB, projectId, range, filters),
            query_locations(DB, projectId, range, filters, locationView),
            query_devices(DB, projectId, range, filters, deviceView),
        ]);

    return {
        range,
        filters,
        summary,
        chart,
        pages: { view: pageView, rows: pages },
        sources: { view: sourceView, rows: sources },
        locations: { view: locationView, rows: locations },
        devices: { view: deviceView, rows: devices },
    };
};

export const verify_ownership = async (
    DB: D1Database,
    CACHE_KV: KVNamespace,
    id: string,
    domain: string,
): Promise<boolean> => {
    let projects = await CACHE_KV.get<CachedProject[]>(id, "json");

    if (!projects) {
        const rows = await get_projects_by_owner_id(DB, id);

        if (!rows.length) {
            return false;
        }

        projects = rows.map((p) => ({
            ...p,
            allowed_domains: p.allowed_domains
                ? JSON.parse(p.allowed_domains)
                : null,
        }));

        // populate cache
        await CACHE_KV.put(id, JSON.stringify(projects), {
            expirationTtl: 3600,
        });
    }

    const users_domains = projects.flatMap((p) => [
        p.domain,
        ...(p.allowed_domains ?? []),
    ]);

    return users_domains.includes(domain);
};
