import { generateToken } from "../../utils/crypto";
import { CreateProjectBody, Project } from "./types";
import { create_project } from "./repository";

const create = async (
    db: D1Database,
    owner_id: string,
    data: CreateProjectBody,
): Promise<AResponse> => {
    const now = Date.now();

    const project: Project = {
        id: crypto.randomUUID(),
        owner_id,
        name: data.name,
        domain: data.domain,
        public_key: `pub_${generateToken()}`,
        secret_key: `sec_${generateToken()}`,
        created_at: now,
        updated_at: now,
        is_active: true,
        current_event_count: 0,
        monthly_event_limit: null,
        usage_period_start: null,
        usage_period_end: null,
        settings_json: null,
    };

    try {
        await create_project(db, project);

        return {
            success: true,
            message: "Project created successfully",
            data: {
                project,
            },
            error: null,
            code: 201,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create project",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 500,
        };
    }
};

export { create };
