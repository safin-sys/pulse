import { hash } from "../utils/password";
import * as crypto from "crypto";

// ---- config ----
const NOW = Date.now();
const DAY = 86400000;
const MONTH = 30 * DAY;

// ---- ids ----
const userId = crypto.randomUUID();
const passwordHash = await hash("password123");

// ---- helpers ----
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const uuid = () => crypto.randomUUID();
const escape = (s: string) => s.replace(/'/g, "''");

// ---- projects ----
const projects = [
    { name: "E-Commerce Platform", domain: "shop.example.com", visitorMultiplier: 2.0 },
    { name: "SaaS Dashboard", domain: "app.example.com", visitorMultiplier: 1.5 },
    { name: "Blog", domain: "blog.example.com", visitorMultiplier: 0.8 },
    { name: "Documentation", domain: "docs.example.com", visitorMultiplier: 0.5 },
];

const projectIds = projects.map(() => crypto.randomUUID());
const apiKeys = projects.map(() => `orb_${crypto.randomBytes(16).toString("hex")}`);

// ---- seed data pools ----
const paths = {
    "shop.example.com": ["/", "/products", "/products/category", "/cart", "/checkout", "/account", "/search"],
    "app.example.com": ["/", "/dashboard", "/settings", "/users", "/analytics", "/reports"],
    "blog.example.com": ["/", "/about", "/contact", "/posts", "/posts/category", "/tags"],
    "docs.example.com": ["/", "/getting-started", "/api-reference", "/guides", "/changelog"],
};
const defaultPaths = ["/", "/about", "/pricing", "/blog", "/contact"];

const referrers = ["https://google.com", "https://twitter.com", "https://github.com", "https://linkedin.com", "https://reddit.com", ""];
const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
const oses = ["Windows", "macOS", "Linux", "iOS", "Android"];
const devices = ["desktop", "desktop", "desktop", "mobile", "tablet"];
const countries = ["US", "GB", "DE", "FR", "BD", "IN", "CA", "AU", "BR", "JP", "NL", "SE", "SG"];
const cities = ["New York", "London", "Berlin", "Paris", "Dhaka", "Mumbai", "Toronto", "Sydney", "Tokyo", "Amsterdam"];
const timezones = ["America/New_York", "Europe/London", "Europe/Berlin", "Asia/Dhaka", "Asia/Tokyo", "Australia/Sydney"];
const languages = ["en-US", "en-GB", "de-DE", "fr-FR", "bn-BD", "ja-JP"];
const screens = ["1920x1080", "1440x900", "1280x800", "390x844", "768x1024", "2560x1440"];

const titles: Record<string, (path: string) => string> = {
    "shop.example.com": (p) => p === "/" ? "Shop Home" : `${p.replace(/\//g, "").replace(/-/g, " ")} | Shop`,
    "app.example.com": (p) => p === "/" ? "Dashboard" : `${p.replace(/\//g, "").replace(/-/g, " ")} | App`,
    "blog.example.com": (p) => p === "/" ? "Blog" : `${p.replace(/\//g, "").replace(/-/g, " ")} | Blog`,
    "docs.example.com": (p) => p === "/" ? "Documentation" : `${p.replace(/\//g, "").replace(/-/g, " ")} | Docs`,
};

// ---- event interface ----
interface EventRow {
    id: string;
    project_id: string;
    visitor_id: string;
    session_id: string;
    type: string;
    timestamp: number;
    received_at: number;
    path: string;
    query: string;
    title: string;
    referrer: string;
    tag_name: string | null;
    element_id: string | null;
    class_name: string | null;
    text: string | null;
    href: string | null;
    user_agent: string | null;
    browser: string;
    os: string;
    device: string;
    language: string;
    screen: string;
    hostname: string;
    country: string;
    city: string;
    region: string;
    timezone: string;
    ip: string;
}

// ---- generate events per project ----
const allEvents: EventRow[] = [];

projects.forEach((project, pIdx) => {
    const projectId = projectIds[pIdx];
    const hostname = project.domain;
    const projectPaths = paths[hostname as keyof typeof paths] || defaultPaths;
    const getTitle = titles[hostname] || ((p: string) => `${p} | ${project.name}`);
    const multiplier = project.visitorMultiplier;

    const visitorCount = Math.floor(20 * multiplier);
    const visitorIds = Array.from({ length: visitorCount }, () => `vis_${crypto.randomBytes(8).toString("hex")}`);

    // session map per visitor
    const sessionMap = new Map<string, string[]>();
    visitorIds.forEach(vid => {
        const count = Math.floor(Math.random() * 3) + 1;
        sessionMap.set(vid, Array.from({ length: count }, () => `ses_${crypto.randomBytes(8).toString("hex")}`));
    });

    // 12 months of data, with realistic patterns
    for (let day = 365; day >= 0; day--) {
        const dayStart = NOW - day * DAY;
        const dayOfWeek = new Date(dayStart).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // traffic patterns: lower on weekends, higher mid-week
        const dayMultiplier = isWeekend ? 0.6 : (dayOfWeek === 3 || dayOfWeek === 4 ? 1.2 : 1.0);

        // monthly growth trend (10% overall growth over 12 months)
        const monthsAgo = day / 30;
        const growthFactor = 1 + (monthsAgo * -0.08); // older = less traffic

        const baseEvents = Math.floor(10 * multiplier);
        const eventCount = Math.floor(baseEvents * dayMultiplier * growthFactor * (0.7 + Math.random() * 0.6));

        for (let i = 0; i < eventCount; i++) {
            const visitorId = rand(visitorIds);
            const sessions = sessionMap.get(visitorId)!;
            const sessionId = rand(sessions);
            const path = rand(projectPaths);
            const timestamp = dayStart + Math.floor(Math.random() * DAY);
            const country = rand(countries);
            const browser = rand(browsers);
            const device = rand(devices);

            allEvents.push({
                id: uuid(),
                project_id: projectId,
                visitor_id: visitorId,
                session_id: sessionId,
                type: "page_view",
                timestamp,
                received_at: timestamp + Math.floor(Math.random() * 500),
                path,
                query: Math.random() > 0.8 ? `?utm_source=${rand(["newsletter", "social", "search"])}` : "",
                title: getTitle(path),
                referrer: rand(referrers),
                tag_name: null,
                element_id: null,
                class_name: null,
                text: null,
                href: null,
                user_agent: null,
                browser,
                os: rand(oses),
                device,
                language: rand(languages),
                screen: rand(screens),
                hostname,
                country,
                city: rand(cities),
                region: rand(cities),
                timezone: rand(timezones),
                ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0.1`,
            });

            // 30% chance of click event
            if (Math.random() > 0.7) {
                allEvents.push({
                    id: uuid(),
                    project_id: projectId,
                    visitor_id: visitorId,
                    session_id: sessionId,
                    type: "click",
                    timestamp: timestamp + Math.floor(Math.random() * 5000),
                    received_at: timestamp + Math.floor(Math.random() * 5500),
                    path,
                    query: "",
                    title: getTitle(path),
                    referrer: "",
                    tag_name: rand(["button", "a", "div"]),
                    element_id: rand(["cta-btn", "nav-link", "hero-btn", "submit-btn", ""]),
                    class_name: rand(["btn-primary", "nav-item", "cta", ""]),
                    text: rand(["Get Started", "Learn More", "Sign Up", "Contact Us", "View More"]),
                    href: rand(["https://example.com/signup", "https://example.com/pricing", "https://example.com/features", null as unknown as string]),
                    user_agent: null,
                    browser,
                    os: rand(oses),
                    device,
                    language: rand(languages),
                    screen: rand(screens),
                    hostname,
                    country,
                    city: rand(cities),
                    region: rand(cities),
                    timezone: rand(timezones),
                    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0.1`,
                });
            }
        }
    }
});

// ---- sql builders ----
const val = (v: unknown): string => v === null ? "NULL" : `'${escape(String(v))}'`;

const userSQL = `
INSERT INTO users (id, email, password_hash, name, created_at, updated_at, is_active, email_verified)
VALUES (
    '${userId}',
    'demo@example.com',
    '${passwordHash}',
    'Demo User',
    ${NOW},
    ${NOW},
    1,
    1
);`;

const projectSQLs = projects.map((project, i) => `
INSERT INTO projects (id, owner_id, name, domain, api_key, created_at, updated_at, is_active, current_event_count)
VALUES (
    '${projectIds[i]}',
    '${userId}',
    '${project.name}',
    '${project.domain}',
    '${apiKeys[i]}',
    ${NOW},
    ${NOW},
    1,
    ${allEvents.filter(e => e.project_id === projectIds[i]).length}
);`).join("\n\n");

// chunk events into batches of 100
const chunkSize = 100;
const eventChunks: EventRow[][] = [];
for (let i = 0; i < allEvents.length; i += chunkSize) {
    eventChunks.push(allEvents.slice(i, i + chunkSize));
}

const eventSQL = eventChunks.map(chunk => {
    const rows = chunk.map(e => `(
        ${val(e.id)}, ${val(e.project_id)}, ${val(e.visitor_id)}, ${val(e.session_id)},
        ${val(e.type)}, ${e.timestamp}, ${e.received_at},
        ${val(e.path)}, ${val(e.query)}, ${val(e.title)}, ${val(e.referrer)},
        ${val(e.tag_name)}, ${val(e.element_id)}, ${val(e.class_name)}, ${val(e.text)}, ${val(e.href)},
        ${val(e.user_agent)}, ${val(e.browser)}, ${val(e.os)}, ${val(e.device)},
        ${val(e.language)}, ${val(e.screen)}, ${val(e.hostname)},
        ${val(e.country)}, ${val(e.city)}, ${val(e.region)}, ${val(e.timezone)}, ${val(e.ip)}
    )`).join(",\n");

    return `INSERT INTO events (
        id, project_id, visitor_id, session_id, type,
        timestamp, received_at, path, query, title, referrer,
        tag_name, element_id, class_name, text, href,
        user_agent, browser, os, device, language, screen, hostname,
        country, city, region, timezone, ip
    ) VALUES ${rows};`;
}).join("\n\n");

// ---- write file ----
import * as fs from "fs";
import * as path from "path";

const outDir = path.join(process.cwd(), ".wrangler/seed");
const outFile = path.join(outDir, "seed.sql");

fs.mkdirSync(outDir, { recursive: true });

const sql = [userSQL, projectSQLs, eventSQL].join("\n\n");
fs.writeFileSync(outFile, sql);

console.log(`\n🌱 Seed file written: ${outFile}`);
console.log(`   Users:    1 (demo@example.com / password123)`);
console.log(`   Projects: ${projects.length}`);
projects.forEach((p, i) => {
    const count = allEvents.filter(e => e.project_id === projectIds[i]).length;
    console.log(`   - ${p.name} (${p.domain}): ${count} events | API Key: ${apiKeys[i]}`);
});
console.log(`   Total Events: ${allEvents.length}\n`);
