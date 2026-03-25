CREATE TABLE users (
-- basics
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,

-- unix timestamps
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,

-- states
  is_active BIT DEFAULT 1,
  email_verified BIT DEFAULT 0,

-- auth timestamps
  last_login_at INTEGER,
  last_logout_at INTEGER,
  failed_login_attempts INTEGER DEFAULT 0,
  last_failed_login_at INTEGER,
  locked_at INTEGER,
  locked_until INTEGER
);

CREATE TABLE refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked BIT DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);