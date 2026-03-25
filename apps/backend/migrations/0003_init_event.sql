CREATE TABLE IF NOT EXISTS events (
    id          TEXT PRIMARY KEY,
    project_id  TEXT NOT NULL,

    -- identity
    visitor_id  TEXT NOT NULL,
    session_id  TEXT NOT NULL,

    -- event
    type        TEXT NOT NULL,
    timestamp   INTEGER NOT NULL,
    received_at INTEGER NOT NULL,

    -- page context
    path        TEXT,
    query       TEXT,
    title       TEXT,
    referrer    TEXT,

    -- click-specific
    tag_name    TEXT,
    element_id  TEXT,
    class_name  TEXT,
    text        TEXT,
    href        TEXT,

    -- context
    user_agent  TEXT,
    browser     TEXT,
    os          TEXT,
    device      TEXT,
    language    TEXT,
    screen      TEXT,
    hostname    TEXT,

    -- enriched
    country     TEXT,
    city        TEXT,
    region      TEXT,
    timezone    TEXT,
    ip          TEXT,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_events_project_id ON events(project_id);
CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp  ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_type       ON events(type);
CREATE INDEX IF NOT EXISTS idx_projects_api_key  ON projects(api_key);