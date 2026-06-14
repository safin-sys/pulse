import { generateToken } from "../../utils/crypto";
import { CreateProjectBody, UpdateProjectBody, Project } from "./types";
import {
    create_project,
    update_project,
    get_project_by_id,
    get_projects_by_owner_id,
    delete_project,
    update_api_key,
} from "./repository";

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
        api_key: `orb_${generateToken()}`,
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

const update = async (
    db: D1Database,
    CACHE_KV: KVNamespace,
    project_id: string,
    owner_id: string,
    data: UpdateProjectBody,
): Promise<AResponse> => {
    try {
        const project = await get_project_by_id(db, project_id);
        if (!project) {
            return {
                success: false,
                message: "Project not found",
                data: null,
                error: null,
                code: 404,
            };
        }

        if (project.owner_id !== owner_id) {
            return {
                success: false,
                message: "Unauthorized to update this project",
                data: null,
                error: null,
                code: 403,
            };
        }

        await update_project(db, project_id, data);

        // Invalidate cache if allowed_domains is updated
        if (
            JSON.stringify(data.allowed_domains ?? null) !==
            JSON.stringify(
                project.allowed_domains
                    ? (JSON.parse(project.allowed_domains) as string[])
                    : null,
            )
        ) {
            await CACHE_KV.delete(project.api_key);
            await CACHE_KV.delete(owner_id);
        }
        return {
            success: true,
            message: "Project updated successfully",
            data: {
                project: {
                    name: data.name ?? project.name,
                    allowed_domains:
                        data.allowed_domains ??
                        (project.allowed_domains
                            ? (JSON.parse(project.allowed_domains) as string[])
                            : null),
                },
            },
            error: null,
            code: 200,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update project",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 500,
        };
    }
};

const get_all = async (
    db: D1Database,
    owner_id: string,
): Promise<AResponse> => {
    try {
        const rows = await get_projects_by_owner_id(db, owner_id);
        const projects = rows.map((p) => ({
            ...p,
            allowed_domains: p.allowed_domains
                ? JSON.parse(p.allowed_domains)
                : null,
        }));

        return {
            success: true,
            message: "Projects retrieved successfully",
            data: {
                projects,
            },
            error: null,
            code: 200,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to retrieve projects",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 500,
        };
    }
};

const delete_one = async (
    db: D1Database,
    project_id: string,
    owner_id: string,
): Promise<AResponse> => {
    try {
        const project = await get_project_by_id(db, project_id);
        if (!project) {
            return {
                success: false,
                message: "Project not found",
                data: null,
                error: null,
                code: 404,
            };
        }

        if (project.owner_id !== owner_id) {
            return {
                success: false,
                message: "Unauthorized to delete this project",
                data: null,
                error: null,
                code: 403,
            };
        }

        await delete_project(db, project_id, owner_id);

        return {
            success: true,
            message: "Project deleted successfully",
            data: null,
            error: null,
            code: 200,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete project",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 500,
        };
    }
};

const rotate_api_key = async (
    db: D1Database,
    CACHE_KV: KVNamespace,
    project_id: string,
    owner_id: string,
): Promise<AResponse> => {
    try {
        const project = await get_project_by_id(db, project_id);
        if (!project) {
            return {
                success: false,
                message: "Project not found",
                data: null,
                error: null,
                code: 404,
            };
        }

        if (project.owner_id !== owner_id) {
            return {
                success: false,
                message: "Unauthorized to rotate API key for this project",
                data: null,
                error: null,
                code: 403,
            };
        }

        // Invalidate cache
        await CACHE_KV.delete(project.api_key);

        const new_api_key = `orb_${generateToken()}`;
        await update_api_key(db, project_id, owner_id, new_api_key);

        return {
            success: true,
            message: "API key rotated successfully",
            data: {
                api_key: new_api_key,
            },
            error: null,
            code: 200,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to rotate API key",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            code: 500,
        };
    }
};

export { create, update, get_all, delete_one, rotate_api_key };
