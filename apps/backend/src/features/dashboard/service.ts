// import {
//     ChartPoint,
//     DashboardFilters,
//     DashboardQueryParams,
//     DashboardResponse,
//     DateRange,
//     DevicesBlock,
//     LocationsBlock,
//     PagesBlock,
//     SourcesBlock,
//     SummaryBlock,
// } from "./types";

// const get_dashboard = async (
//     domain: string,
//     params: DashboardQueryParams,
// ): Promise<DashboardResponse> => {
//     const {
//         range: param_range,
//         // global filters
//         hostname,
//         page,
//         referrer,
//         country,
//         device,
//         browser,
//         os,
//     } = params;
//     const range: DateRange = {
//         from: "",
//         to: "",
//     };
//     const filters: DashboardFilters = {
//         hostname,
//         page,
//         referrer,
//         country,
//         device,
//         browser,
//         os,
//     };
//     const summary: SummaryBlock = { entries: 0, visitors: 0, sessions: 0 };
//     const chart: ChartPoint[] = [
//         {
//             date: "",
//             entries: 0,
//             visitors: 0,
//             sessions: 0,
//         },
//     ];
//     const pages: PagesBlock = {
//         view: "top",
//         rows: [
//             {
//                 path: "/",
//                 entries: 0,
//                 visitors: 0,
//             },
//         ],
//     };
//     const sources: SourcesBlock = {
//         view: "referrer",
//         rows: [
//             {
//                 referrer: "google",
//                 entries: 0,
//                 visitors: 0,
//             },
//         ],
//     };
//     const locations: LocationsBlock = {
//         view: "country",
//         rows: [
//             {
//                 countryCode: "BD",
//                 visitors: 0,
//             },
//         ],
//     };
//     const devices: DevicesBlock = {
//         view: "browser",
//         rows: [
//             {
//                 browser: "Chrome",
//                 visitors: 0,
//                 percentage: 0,
//             },
//         ],
//     };
//     return {
//         range,
//         filters,
//         summary,
//         chart,
//         pages,
//         sources,
//         locations,
//         devices,
//     };
// };

// export { get_dashboard };

import { resolve_range } from "../../utils/range";
import {
    query_summary,
    query_chart,
    query_pages,
    query_sources,
    query_locations,
    query_devices,
} from "./repository";
import {
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

    const range = resolve_range(rangeSlug);
    const filters: DashboardFilters = filterParams;

    const [summary, chart, pages, sources, locations, devices] =
        await Promise.all([
            query_summary(DB, projectId, range, filters),
            query_chart(DB, projectId, range, filters),
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
