import { z } from "zod";

// Range
export const RangeSlugSchema = z.enum([
    "today",
    "yesterday",
    "this_week",
    "this_month",
    "this_year",
    "7d",
    "30d",
    "6m",
    "12m",
    "all",
]);

export const DateRangeSchema = z.object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
});

export type RangeSlug = z.infer<typeof RangeSlugSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;

// Views
export const PageViewSchema = z.enum(["top", "entered"]);
export const SourceViewSchema = z.enum(["referrer"]);
export const LocationViewSchema = z.enum(["country", "region", "city"]);
export const DeviceViewSchema = z.enum(["browser", "os", "device"]);

export type PageView = z.infer<typeof PageViewSchema>;
export type SourceView = z.infer<typeof SourceViewSchema>;
export type LocationView = z.infer<typeof LocationViewSchema>;
export type DeviceView = z.infer<typeof DeviceViewSchema>;

// Request body
export const DashboardQueryParamsSchema = z.object({
    range: RangeSlugSchema.default("today"),

    // section views
    pageView: PageViewSchema.default("top"),
    sourceView: SourceViewSchema.default("referrer"),
    locationView: LocationViewSchema.default("country"),
    deviceView: DeviceViewSchema.default("browser"),

    // global filters
    hostname: z.string().optional(),
    page: z.string().startsWith("/", "Page path must start with /").optional(),
    referrer: z.string().optional(),
    country: z.string().length(2, "Must be ISO 3166-1 alpha-2").optional(),
    device: z.enum(["Desktop", "Mobile", "Tablet"]).optional(),
    browser: z.string().optional(),
    os: z.string().optional(),
});

export type DashboardQueryParams = z.infer<typeof DashboardQueryParamsSchema>;

// Filters (subset echoed back in the response)

export const DashboardFiltersSchema = DashboardQueryParamsSchema.pick({
    hostname: true,
    page: true,
    referrer: true,
    country: true,
    device: true,
    browser: true,
    os: true,
});

export type DashboardFilters = z.infer<typeof DashboardFiltersSchema>;

// Response types (no Zod needed — these are outbound shapes)

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

// pages
export interface PageRow {
    path: string;
    entries: number;
    visitors: number;
}

export interface PagesBlock {
    view: PageView;
    rows: PageRow[];
}

// sources
export interface ReferrerRow {
    referrer: string;
    visitors: number;
    entries: number;
}

export interface SourcesBlock {
    view: SourceView;
    rows: ReferrerRow[];
}

// locations
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

// Dashboard Response
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