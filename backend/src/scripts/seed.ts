import { hash } from "../utils/password";
import * as crypto from "crypto";

// ---- config ----
const NOW = Date.now();
const DAY = 86400000;

// ---- ids ----
const userId      = crypto.randomUUID();
const projectId   = crypto.randomUUID();
const apiKey      = `pk_${crypto.randomBytes(16).toString("hex")}`;
const passwordHash = await hash("password123");

// ---- helpers ----
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const uuid = () => crypto.randomUUID();
const escape = (s: string) => s.replace(/'/g, "''");

// ---- seed data pools ----
const visitorIds  = Array.from({ length: 20 }, () => `vis_${crypto.randomBytes(8).toString("hex")}`);
const paths       = ["/", "/about", "/pricing", "/blog", "/blog/post-1", "/blog/post-2", "/contact", "/docs"];
const referrers   = ["https://google.com", "https://twitter.com", "https://github.com", "https://hn.com", ""];
const browsers    = ["Chrome", "Firefox", "Safari", "Edge"];
const oses        = ["Windows", "macOS", "Linux", "iOS", "Android"];
const devices     = ["desktop", "desktop", "desktop", "mobile", "tablet"]; // weighted toward desktop
const countries   = ["US", "GB", "DE", "FR", "BD", "IN", "CA", "AU", "BR", "JP"];
const cities      = ["New York", "London", "Berlin", "Paris", "Dhaka", "Mumbai", "Toronto", "Sydney"];
const timezones   = ["America/New_York", "Europe/London", "Europe/Berlin", "Asia/Dhaka"];
const languages   = ["en-US", "en-GB", "de-DE", "fr-FR", "bn-BD"];
const screens     = ["1920x1080", "1440x900", "1280x800", "390x844", "768x1024"];

// ---- session map: visitorId -> [sessionId, ...] ----
// each visitor gets 1-3 sessions spread across the month
const sessionMap = new Map<string, string[]>();
visitorIds.forEach(vid => {
    const count = Math.floor(Math.random() * 3) + 1;
    sessionMap.set(vid, Array.from({ length: count }, () => `ses_${crypto.randomBytes(8).toString("hex")}`));
});

// ---- generate events ----
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

const events: EventRow[] = [];

for (let day = 29; day >= 0; day--) {
    const dayStart = NOW - day * DAY;
    // 10-40 events per day
    const eventCount = Math.floor(Math.random() * 30) + 10;

    for (let i = 0; i < eventCount; i++) {
        const visitorId = rand(visitorIds);
        const sessions  = sessionMap.get(visitorId)!;
        const sessionId = rand(sessions);
        const path      = rand(paths);
        const timestamp = dayStart + Math.floor(Math.random() * DAY);
        const country   = rand(countries);
        const browser   = rand(browsers);
        const device    = rand(devices);

        // page_view
        events.push({
            id:          uuid(),
            project_id:  projectId,
            visitor_id:  visitorId,
            session_id:  sessionId,
            type:        "page_view",
            timestamp,
            received_at: timestamp + Math.floor(Math.random() * 500),
            path,
            query:       Math.random() > 0.8 ? "?ref=newsletter" : "",
            title:       `${path === "/" ? "Home" : path.replace("/", "").replace(/-/g, " ")} | MySite`,
            referrer:    rand(referrers),
            tag_name:    null,
            element_id:  null,
            class_name:  null,
            text:        null,
            href:        null,
            user_agent:  null,
            browser,
            os:          rand(oses),
            device,
            language:    rand(languages),
            screen:      rand(screens),
            hostname:    "example.com",
            country,
            city:        rand(cities),
            region:      rand(cities),
            timezone:    rand(timezones),
            ip:          `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.0.1`,
        });

        // 30% chance of a click after page_view
        if (Math.random() > 0.7) {
            events.push({
                id:          uuid(),
                project_id:  projectId,
                visitor_id:  visitorId,
                session_id:  sessionId,
                type:        "click",
                timestamp:   timestamp + Math.floor(Math.random() * 5000),
                received_at: timestamp + Math.floor(Math.random() * 5500),
                path,
                query:       "",
                title:       `${path} | MySite`,
                referrer:    "",
                tag_name:    rand(["button", "a", "div"]),
                element_id:  rand(["cta-btn", "nav-link", "hero-btn", ""]),
                class_name:  rand(["btn-primary", "nav-item", ""]),
                text:        rand(["Get Started", "Learn More", "Sign Up", "Contact Us"]),
                href:        rand(["https://example.com/signup", "https://example.com/pricing", null as any]),
                user_agent:  null,
                browser,
                os:          rand(oses),
                device,
                language:    rand(languages),
                screen:      rand(screens),
                hostname:    "example.com",
                country,
                city:        rand(cities),
                region:      rand(cities),
                timezone:    rand(timezones),
                ip:          `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.0.1`,
            });
        }
    }
}

// ---- sql builders ----
const val = (v: any): string => v === null ? "NULL" : `'${escape(String(v))}'`;

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

const projectSQL = `
INSERT INTO projects (id, owner_id, name, domain, api_key, created_at, updated_at, is_active, current_event_count)
VALUES (
    '${projectId}',
    '${userId}',
    'My Demo Site',
    'example.com',
    '${apiKey}',
    ${NOW},
    ${NOW},
    1,
    ${events.length}
);`;

// chunk events into batches of 100 to avoid SQL size limits
const chunkSize = 100;
const eventChunks: EventRow[][] = [];
for (let i = 0; i < events.length; i += chunkSize) {
    eventChunks.push(events.slice(i, i + chunkSize));
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

// ---- write and execute ----
import * as fs from "fs";
import * as path from "path";

const outDir  = path.join(process.cwd(), ".wrangler/seed");
const outFile = path.join(outDir, "seed.sql");

fs.mkdirSync(outDir, { recursive: true });

const sql = [userSQL, projectSQL, eventSQL].join("\n\n");
fs.writeFileSync(outFile, sql);

console.log(`\n🌱 Seed file written: ${outFile}`);
console.log(`   Users:    1 (demo@example.com / password123)`);
console.log(`   Projects: 1 (example.com)`);
console.log(`   Events:   ${events.length}`);
console.log(`   API Key:  ${apiKey}\n`);