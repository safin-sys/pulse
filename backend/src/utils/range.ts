import { DateRange, RangeSlug } from "../features/dashboard/types";

const toDate = (d: Date) => d.toISOString().slice(0, 10);

const startOfWeek = (d: Date) => {
    const day = d.getDay(); // 0 = Sunday
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(d.getFullYear(), d.getMonth(), diff);
};

export const resolve_range = (slug: RangeSlug): DateRange => {
    const now = new Date();
    const today = toDate(now);

    switch (slug) {
        case "today":
            return { from: today, to: today };

        case "yesterday": {
            const d = new Date(now);
            d.setDate(d.getDate() - 1);
            const yest = toDate(d);
            return { from: yest, to: yest };
        }

        case "this_week": {
            return { from: toDate(startOfWeek(now)), to: today };
        }

        case "this_month": {
            const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
            return { from, to: today };
        }

        case "this_year": {
            return { from: `${now.getFullYear()}-01-01`, to: today };
        }

        case "7d": {
            const d = new Date(now);
            d.setDate(d.getDate() - 6);
            return { from: toDate(d), to: today };
        }

        case "30d": {
            const d = new Date(now);
            d.setDate(d.getDate() - 29);
            return { from: toDate(d), to: today };
        }

        case "6m": {
            const d = new Date(now);
            d.setMonth(d.getMonth() - 6);
            return { from: toDate(d), to: today };
        }

        case "12m": {
            const d = new Date(now);
            d.setFullYear(d.getFullYear() - 1);
            return { from: toDate(d), to: today };
        }

        case "all":
            return { from: "2000-01-01", to: today };
    }
};