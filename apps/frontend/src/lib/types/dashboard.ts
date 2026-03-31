export interface SummaryBlock {
    entries: number;
    visitors: number;
    sessions: number;
}

export interface ChartPoint {
    date: string;
    entries: number;
    visitors: number;
    sessions: number;
}

export interface PageRow {
    path: string;
    entries: number;
    visitors: number;
}

export interface PagesBlock {
    view: "top" | "entered";
    rows: PageRow[];
}

export interface ReferrerRow {
    referrer: string;
    visitors: number;
    entries: number;
}

export interface SourcesBlock {
    view: "referrer";
    rows: ReferrerRow[];
}

export interface CountryRow {
    countryCode: string;
    visitors: number;
}

export interface RegionRow {
    region: string;
    countryCode: string;
    visitors: number;
}

export interface CityRow {
    city: string;
    region: string;
    countryCode: string;
    visitors: number;
}

export type LocationRow = CountryRow | RegionRow | CityRow;

export interface LocationsBlock {
    view: "country" | "region" | "city";
    rows: CountryRow[] | RegionRow[] | CityRow[];
}

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

export type DeviceRowType = BrowserRow | OsRow | DeviceRow;

export interface DevicesBlock {
    view: "browser" | "os" | "device";
    rows: DeviceRowType[];
}

export interface DashboardFilters {
    hostname?: string;
    page?: string;
    referrer?: string;
    country?: string;
    device?: string;
    browser?: string;
    os?: string;
}

export interface DateRange {
    from: string;
    to: string;
}

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

export interface DashboardQueryParams {
    range?: RangeSlug;
    pageView?: "top" | "entered";
    sourceView?: "referrer";
    locationView?: "country" | "region" | "city";
    deviceView?: "browser" | "os" | "device";
    hostname?: string;
    page?: string;
    referrer?: string;
    country?: string;
    device?: "Desktop" | "Mobile" | "Tablet";
    browser?: string;
    os?: string;
}
