CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
 
-- basics
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
 
-- api key (per project)
  api_key TEXT NOT NULL UNIQUE,
 
-- unix timestamps
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
 
-- states
  is_active BIT DEFAULT 1,
 
-- usage info (per billing/usage period)
  current_event_count INTEGER DEFAULT 0,
  monthly_event_limit INTEGER,
  usage_period_start INTEGER,
  usage_period_end INTEGER,
 
-- misc project-level settings (JSON blob)
  settings_json TEXT,
 
  FOREIGN KEY (owner_id) REFERENCES users(id),
  UNIQUE (owner_id, domain)
);
 
CREATE INDEX idx_projects_owner_id ON projects(owner_id);

