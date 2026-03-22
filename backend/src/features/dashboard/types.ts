// range
export type RangeSlug =
    | "today"
    | "yesterday"
    | "this_week"
    | "this_month"
    | "this_year"
    | "7d"
    | "30d"
    | "6m"
    | "12m"
    | "all";

export interface DateRange {
    from: string;
    to: string;
}

// filters
export type PageView = "top" | "entered";
export type SourceView = "referrer";
export type LocationView = "country" | "region" | "city";
export type DeviceView = "browser" | "os" | "device";

export interface DashboardFilters {
    hostname?: string;
    page?: string;
    referrer?: string;
    country?: string;
    device?: string;
    browser?: string;
    os?: string;
}

// request body
export interface DashboardQueryParams {
    range: RangeSlug;

    // section views
    pageView?: PageView;
    sourceView?: SourceView;
    locationView?: LocationView;
    deviceView?: DeviceView;

    // global filters (all optional, all combinable)
    hostname?: string;
    page?: string;
    referrer?: string;
    country?: string;
    device?: string;
    browser?: string;
    os?: string;
}

// summary
export interface SummaryBlock {
    pageviews: number;
    visitors: number;
    sessions: number;
}

// chart
export interface ChartPoint {
    date: string;
    pageviews: number;
    visitors: number;
    sessions: number;
}

// pages
export interface PageRow {
    path: string;
    pageviews: number;
    visitors: number;
}

export interface EnteredPageRow {
    path: string;
    entries: number;
    visitors: number;
}

export interface PagesBlock {
    view: PageView;
    rows: PageRow[] | EnteredPageRow[];
}

// sources
export interface ReferrerRow {
    referrer: string;
    visitors: number;
    pageviews: number;
}

export interface SourcesBlock {
    view: SourceView;
    rows: ReferrerRow[];
}

// locations
export interface CountryRow {
    country: string;
    countryCode: string;
    visitors: number;
}

export interface RegionRow {
    region: string;
    country: string;
    countryCode: string;
    visitors: number;
}

export interface CityRow {
    city: string;
    region: string;
    country: string;
    countryCode: string;
    visitors: number;
}

export interface LocationsBlock {
    view: LocationView;
    rows: CountryRow[] | RegionRow[] | CityRow[];
}

// devices
export interface BrowserRow {
    browser: string;
    visitors: number;
    percentage: number;
}

export interface OsRow {
    os: string;
    visitors: number;
    percentage: number;
}

export interface DeviceRow {
    device: string;
    visitors: number;
    percentage: number;
}

export interface DevicesBlock {
    view: DeviceView;
    rows: BrowserRow[] | OsRow[] | DeviceRow[];
}

// response
export interface DashboardResponse {
    range: DateRange;
    filters: DashboardFilters;
    summary: SummaryBlock;
    chart: ChartPoint[];
    pages: PagesBlock;
    sources: SourcesBlock;
    locations: LocationsBlock;
    devices: DevicesBlock;
}
