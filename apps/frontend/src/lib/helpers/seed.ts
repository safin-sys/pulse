import { faker } from "@faker-js/faker";
import type { DashboardQueryParams, DashboardResponse, RangeSlug } from "$lib/types/dashboard";
import type { Project } from "$lib/types/project";

function get_date_range_from_slug(slug: RangeSlug): { from: string; to: string } {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	switch (slug) {
		case "today":
			return { from: today.toISOString(), to: now.toISOString() };
		case "yesterday": {
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);
			return { from: yesterday.toISOString(), to: today.toISOString() };
		}
		case "this_week": {
			const startOfWeek = new Date(today);
			startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
			return { from: startOfWeek.toISOString(), to: now.toISOString() };
		}
		case "this_month": {
			const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
			return { from: startOfMonth.toISOString(), to: now.toISOString() };
		}
		case "this_year": {
			const startOfYear = new Date(today.getFullYear(), 0, 1);
			return { from: startOfYear.toISOString(), to: now.toISOString() };
		}
		case "7d": {
			const start = new Date(today);
			start.setDate(start.getDate() - 7);
			return { from: start.toISOString(), to: now.toISOString() };
		}
		case "30d": {
			const start = new Date(today);
			start.setDate(start.getDate() - 30);
			return { from: start.toISOString(), to: now.toISOString() };
		}
		case "6m": {
			const start = new Date(today);
			start.setMonth(start.getMonth() - 6);
			return { from: start.toISOString(), to: now.toISOString() };
		}
		case "12m": {
			const start = new Date(today);
			start.setFullYear(start.getFullYear() - 1);
			return { from: start.toISOString(), to: now.toISOString() };
		}
		case "all": {
			const startOf2025 = new Date("2025-01-01");
			return { from: startOf2025.toISOString(), to: now.toISOString() };
		}
		default:
			return { from: today.toISOString(), to: now.toISOString() };
	}
}

function compute_seed(projectId: string, params: DashboardQueryParams): number {
	const str = `${projectId}-${params.range || "today"}-${params.hostname || ""}-${params.page || ""}-${params.referrer || ""}-${params.country || ""}-${params.device || ""}-${params.browser || ""}-${params.os || ""}`;
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return Math.abs(hash);
}

export function seed_projects(count: number): Project[] {
	const projects: Project[] = [];
	for (let i = 0; i < count; i++) {
		projects.push({
			id: faker.string.uuid(),
			name: faker.company.name(),
			domain: faker.internet.domainName(),
			api_key: `orb_${faker.string.alphanumeric(32)}`,
		});
	}
	return projects;
}

export function seed_dashboard(params: DashboardQueryParams, projectId: string): DashboardResponse {
	const seed = compute_seed(projectId, params);
	faker.seed(seed);

	const range = get_date_range_from_slug(params.range || "today");

	const summary = {
		entries: faker.number.int({ min: 100, max: 10000 }),
		visitors: faker.number.int({ min: 50, max: 5000 }),
		sessions: faker.number.int({ min: 50, max: 8000 }),
	};

	const days_diff = Math.max(1, Math.ceil((new Date(range.to).getTime() - new Date(range.from).getTime()) / (1000 * 60 * 60 * 24)));
	const chart = [];
	for (let i = 0; i < days_diff; i++) {
		const date = new Date(range.from);
		date.setDate(date.getDate() + i);
		chart.push({
			date: date.toISOString().split("T")[0],
			entries: faker.number.int({ min: 10, max: 500 }),
			visitors: faker.number.int({ min: 5, max: 300 }),
			sessions: faker.number.int({ min: 5, max: 400 }),
		});
	}

	const pages = {
		view: params.pageView || "top" as const,
		rows: Array.from({ length: 10 }, () => ({
			path: `/${faker.helpers.slugify(faker.word.noun())}`,
			entries: faker.number.int({ min: 5, max: 200 }),
			visitors: faker.number.int({ min: 3, max: 150 }),
		})),
	};

	const sources = {
		view: "referrer" as const,
		rows: Array.from({ length: 8 }, () => ({
			referrer: faker.helpers.arrayElement([
				"google.com",
				"twitter.com",
				"facebook.com",
				"linkedin.com",
				"github.com",
				"reddit.com",
				"youtube.com",
				"bing.com",
			]),
			visitors: faker.number.int({ min: 10, max: 500 }),
			entries: faker.number.int({ min: 5, max: 300 }),
		})),
	};

	const countries = [
		{ countryCode: "US", country: "United States" },
		{ countryCode: "GB", country: "United Kingdom" },
		{ countryCode: "DE", country: "Germany" },
		{ countryCode: "FR", country: "France" },
		{ countryCode: "CA", country: "Canada" },
		{ countryCode: "AU", country: "Australia" },
		{ countryCode: "JP", country: "Japan" },
		{ countryCode: "BR", country: "Brazil" },
		{ countryCode: "IN", country: "India" },
		{ countryCode: "NL", country: "Netherlands" },
	];
	const countryRows = countries.map(c => ({ countryCode: c.countryCode, visitors: faker.number.int({ min: 50, max: 1000 }) }));

	const regionRows = [
		{ region: "California", countryCode: "US", visitors: faker.number.int({ min: 50, max: 800 }) },
		{ region: "New York", countryCode: "US", visitors: faker.number.int({ min: 50, max: 600 }) },
		{ region: "Texas", countryCode: "US", visitors: faker.number.int({ min: 30, max: 400 }) },
		{ region: "England", countryCode: "GB", visitors: faker.number.int({ min: 40, max: 500 }) },
		{ region: "Ontario", countryCode: "CA", visitors: faker.number.int({ min: 30, max: 300 }) },
		{ region: "Berlin", countryCode: "DE", visitors: faker.number.int({ min: 20, max: 250 }) },
		{ region: "Ile-de-France", countryCode: "FR", visitors: faker.number.int({ min: 20, max: 200 }) },
		{ region: "Tokyo", countryCode: "JP", visitors: faker.number.int({ min: 30, max: 300 }) },
	];

	const cityRows = [
		{ city: "San Francisco", countryCode: "US", visitors: faker.number.int({ min: 50, max: 500 }) },
		{ city: "New York", countryCode: "US", visitors: faker.number.int({ min: 40, max: 400 }) },
		{ city: "Los Angeles", countryCode: "US", visitors: faker.number.int({ min: 30, max: 300 }) },
		{ city: "London", countryCode: "GB", visitors: faker.number.int({ min: 40, max: 350 }) },
		{ city: "Toronto", countryCode: "CA", visitors: faker.number.int({ min: 25, max: 200 }) },
		{ city: "Berlin", countryCode: "DE", visitors: faker.number.int({ min: 20, max: 180 }) },
		{ city: "Paris", countryCode: "FR", visitors: faker.number.int({ min: 15, max: 150 }) },
		{ city: "Tokyo", countryCode: "JP", visitors: faker.number.int({ min: 20, max: 200 }) },
	];

	const locationView = params.locationView || "country";
	const locations = {
		view: locationView as "country" | "region" | "city",
		rows: locationView === "city" ? cityRows : locationView === "region" ? regionRows : countryRows,
	};

	const browsers_data = [
		{ browser: "Chrome", visitors: faker.number.int({ min: 1000, max: 3000 }), percentage: 65 },
		{ browser: "Safari", visitors: faker.number.int({ min: 500, max: 1500 }), percentage: 20 },
		{ browser: "Firefox", visitors: faker.number.int({ min: 200, max: 800 }), percentage: 10 },
		{ browser: "Edge", visitors: faker.number.int({ min: 100, max: 500 }), percentage: 4 },
		{ browser: "Opera", visitors: faker.number.int({ min: 20, max: 100 }), percentage: 1 },
	];

	const os_data = [
		{ os: "Windows", visitors: faker.number.int({ min: 1000, max: 2500 }), percentage: 45 },
		{ os: "macOS", visitors: faker.number.int({ min: 800, max: 2000 }), percentage: 30 },
		{ os: "Android", visitors: faker.number.int({ min: 500, max: 1500 }), percentage: 15 },
		{ os: "iOS", visitors: faker.number.int({ min: 300, max: 1000 }), percentage: 8 },
		{ os: "Linux", visitors: faker.number.int({ min: 50, max: 200 }), percentage: 2 },
	];

	const device_data = [
		{ device: "Desktop", visitors: faker.number.int({ min: 2000, max: 4000 }), percentage: 60 },
		{ device: "Mobile", visitors: faker.number.int({ min: 1000, max: 2500 }), percentage: 35 },
		{ device: "Tablet", visitors: faker.number.int({ min: 50, max: 300 }), percentage: 5 },
	];

	const deviceView = params.deviceView || "browser";
	const devices_output = {
		view: deviceView as "browser" | "os" | "device",
		rows: deviceView === "os" ? os_data : deviceView === "device" ? device_data : browsers_data,
	};

	return {
		range,
		filters: {},
		summary,
		chart,
		pages,
		sources,
		locations,
		devices: devices_output,
	};
}
