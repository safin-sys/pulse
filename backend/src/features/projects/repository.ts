import { Project } from "./types";

const create_project = async (db: D1Database, data: Project) => {
    return await db
        .prepare(
            "INSERT INTO projects (id, owner_id, name, domain, public_key, secret_key, created_at, updated_at, is_active, current_event_count, monthly_event_limit, usage_period_start, usage_period_end, settings_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(
            data.id,
            data.owner_id,
            data.name,
            data.domain,
            data.public_key,
            data.secret_key,
            data.created_at,
            data.updated_at,
            data.is_active,
            data.current_event_count,
            data.monthly_event_limit ?? null,
            data.usage_period_start ?? null,
            data.usage_period_end ?? null,
            data.settings_json ?? null,
        )
        .run();
};

export { create_project };
