import { Project } from "./types";

const create_project = async (db: D1Database, data: Project) => {
    return await db
        .prepare(
            "INSERT INTO projects (id, owner_id, name, domain, api_key, created_at, updated_at, is_active, current_event_count, monthly_event_limit, usage_period_start, usage_period_end, settings_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(
            data.id,
            data.owner_id,
            data.name,
            data.domain,
            data.api_key,
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

const update_project = async (
    db: D1Database,
    id: string,
    updates: Partial<Project>,
) => {
    const fields = [];
    const values = [];
    if (updates.name !== undefined) {
        fields.push("name = ?");
        values.push(updates.name);
    }
    fields.push("updated_at = ?");
    values.push(Date.now());

    const query = `UPDATE projects SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    return await db
        .prepare(query)
        .bind(...values)
        .run();
};

const get_project_by_id = async (
    db: D1Database,
    id: string,
): Promise<Project | null> => {
    const result = await db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .bind(id)
        .first();
    return result as Project | null;
};

const get_projects_by_owner_id = async (
    db: D1Database,
    owner_id: string,
): Promise<{ id: string; name: string }[]> => {
    const result = await db
        .prepare("SELECT id, name, domain FROM projects WHERE owner_id = ? AND is_active = true")
        .bind(owner_id)
        .all();
    return result.results as { id: string; name: string; domain: string }[];
};

const delete_project = async (db: D1Database, id: string, owner_id: string) => {
    return await db
        .prepare("UPDATE projects SET is_active = false, updated_at = ? WHERE id = ? AND owner_id = ?")
        .bind(Date.now(), id, owner_id)
        .run();
};

export {
    create_project,
    update_project,
    get_project_by_id,
    get_projects_by_owner_id,
    delete_project,
};
