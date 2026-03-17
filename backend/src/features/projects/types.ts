import { z } from "zod";

export const CreateProjectBodySchema = z.object({
    name: z.string().min(1, "Project name is required"),
    domain: z
        .string()
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
});

export type CreateProjectBody = z.infer<typeof CreateProjectBodySchema>;

export const UpdateProjectBodySchema = z.object({
    name: z.string().min(1, "Project name is required").optional(),
});

export type UpdateProjectBody = z.infer<typeof UpdateProjectBodySchema>;

export interface Project {
    id: string;
    owner_id: string;
    // basics
    name: string;
    domain: string;
    // api keys
    api_key: string;
    // unix timestamps
    created_at: number;
    updated_at: number;
    // states
    is_active: boolean;
    // usage info
    current_event_count: number;
    monthly_event_limit?: number | null;
    usage_period_start?: number | null;
    usage_period_end?: number | null;
    // misc
    settings_json?: string | null;
}
