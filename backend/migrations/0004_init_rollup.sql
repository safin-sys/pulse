-- stats
CREATE TABLE IF NOT EXISTS daily_stats (
    project_id  TEXT    NOT NULL,
    date        TEXT    NOT NULL,   -- YYYY-MM-DD
    entries     INTEGER NOT NULL DEFAULT 0,
    visitors    INTEGER NOT NULL DEFAULT 0,
    sessions    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, date),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- pages
CREATE TABLE IF NOT EXISTS daily_pages (
    project_id  TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    path        TEXT    NOT NULL,
    entries     INTEGER NOT NULL DEFAULT 0,   -- total page_view hits on this path
    visitors    INTEGER NOT NULL DEFAULT 0,   -- unique visitors
    sessions    INTEGER NOT NULL DEFAULT 0,   -- unique sessions
    entered     INTEGER NOT NULL DEFAULT 0,   -- sessions that started on this path
    PRIMARY KEY (project_id, date, path),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- sources
CREATE TABLE IF NOT EXISTS daily_sources (
    project_id   TEXT    NOT NULL,
    date         TEXT    NOT NULL,

    -- raw referrer, e.g. "google.com", "" = direct
    referrer     TEXT    NOT NULL DEFAULT "",

    -- utm params, "" = not set
    utm_source   TEXT    NOT NULL DEFAULT "",
    utm_medium   TEXT    NOT NULL DEFAULT "",
    utm_campaign TEXT    NOT NULL DEFAULT "",
    utm_content  TEXT    NOT NULL DEFAULT "",
    utm_term     TEXT    NOT NULL DEFAULT "",

    visitors     INTEGER NOT NULL DEFAULT 0,
    entries      INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (project_id, date, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- locations
CREATE TABLE IF NOT EXISTS daily_cities (
    project_id   TEXT    NOT NULL,
    date         TEXT    NOT NULL,
    city         TEXT    NOT NULL,
    region       TEXT    NOT NULL,
    country_code TEXT    NOT NULL,
    visitors     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, date, country_code, region, city),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_regions (
    project_id   TEXT    NOT NULL,
    date         TEXT    NOT NULL,
    region       TEXT    NOT NULL,
    country_code TEXT    NOT NULL,
    visitors     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, date, country_code, region),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_countries (
    project_id   TEXT    NOT NULL,
    date         TEXT    NOT NULL,
    country_code TEXT    NOT NULL,
    visitors     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, date, country_code),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- devices
CREATE TABLE IF NOT EXISTS daily_browsers (
    project_id  TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    browser     TEXT    NOT NULL,   -- e.g. "Chrome", "Firefox", "Unknown"
    visitors    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, date, browser),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_os (
    project_id  TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    os          TEXT    NOT NULL,   -- e.g. "Windows", "macOS", "iOS"
    visitors    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, date, os),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_devices (
    project_id  TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    device      TEXT    NOT NULL,   -- "Desktop" | "Mobile" | "Tablet"
    visitors    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, date, device),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_daily_stats_project_date      ON daily_stats(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_pages_project_date      ON daily_pages(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_sources_project_date    ON daily_sources(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_countries_project_date  ON daily_countries(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_regions_project_date    ON daily_regions(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_cities_project_date     ON daily_cities(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_browsers_project_date   ON daily_browsers(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_os_project_date         ON daily_os(project_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_devices_project_date    ON daily_devices(project_id, date);