import {
    ChartPoint,
    DashboardFilters,
    DashboardQueryParams,
    DashboardResponse,
    DateRange,
    DevicesBlock,
    LocationsBlock,
    PagesBlock,
    SourcesBlock,
    SummaryBlock,
} from "./types";

const get_dashboard = async (
    domain: string,
    params: DashboardQueryParams,
): Promise<DashboardResponse> => {
    const {
        range: param_range,
        // global filters
        hostname,
        page,
        referrer,
        country,
        device,
        browser,
        os,
    } = params;
    const range: DateRange = {
        from: "",
        to: "",
    };
    const filters: DashboardFilters = {
        hostname,
        page,
        referrer,
        country,
        device,
        browser,
        os,
    };
    const summary: SummaryBlock = { entries: 0, visitors: 0, sessions: 0 };
    const chart: ChartPoint[] = [
        {
            date: "",
            entries: 0,
            visitors: 0,
            sessions: 0,
        },
    ];
    const pages: PagesBlock = {
        view: "top",
        rows: [
            {
                path: "/",
                entries: 0,
                visitors: 0,
            },
        ],
    };
    const sources: SourcesBlock = {
        view: "referrer",
        rows: [
            {
                referrer: "google",
                entries: 0,
                visitors: 0,
            },
        ],
    };
    const locations: LocationsBlock = {
        view: "country",
        rows: [
            {
                countryCode: "BD",
                visitors: 0,
            },
        ],
    };
    const devices: DevicesBlock = {
        view: "browser",
        rows: [
            {
                browser: "Chrome",
                visitors: 0,
                percentage: 0,
            },
        ],
    };
    return {
        range,
        filters,
        summary,
        chart,
        pages,
        sources,
        locations,
        devices,
    };
};

export { get_dashboard };
