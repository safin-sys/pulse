import { api } from "./client";

const getDashboard = async (domain: string, query?: {
    range?: string;
    pageView?: string;
    sourceView?: string;
    locationView?: string;
    deviceView?: string;
    hostname?: string;
    page?: string;
    referrer?: string;
    country?: string;
    device?: string;
    browser?: string;
    os?: string;
}) => {
    const res = await api.dashboard[":domain"].$get({
        param: { domain },
        query: query ?? {}
    } as any);
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

export const dashboard = {
    get: getDashboard,
};
