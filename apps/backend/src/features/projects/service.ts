import { generateToken } from "../../utils/crypto";
import { CreateProjectBody, UpdateProjectBody, Project } from "./types";
import {
    create_project,
    update_project,
    get_project_by_id,
    get_projects_by_owner_id,
    delete_project,
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
        api_key: `an_${generateToken()}`,
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
        return {
            success: true,
            message: "Project updated successfully",
            data: {
                project: {
                    name: project.name,
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

const getAll = async (
    db: D1Database,
    owner_id: string,
): Promise<AResponse> => {
    try {
        const projects = await get_projects_by_owner_id(db, owner_id);

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

const deleteOne = async (
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

export { create, update, getAll, deleteOne };
