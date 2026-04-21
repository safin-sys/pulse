import { api } from "./client";

const create = async (body: { name: string; domain: string }) => {
    const res = await api.projects.$post({ json: body });
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

const update = async (projectId: string, body: { name?: string }) => {
    const res = await api.projects[":projectId"].$patch({
        param: { projectId } as any,
        json: body
    });
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

const getAll = async () => {
    const res = await api.projects.$get();
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

const deleteOne = async (projectId: string) => {
    const res = await api.projects[":projectId"].$delete({
        param: { projectId } as any
    });
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

const rotateApiKey = async (projectId: string) => {
    const res = await api.projects[":projectId"]["rotate-api-key"].$post({
        param: { projectId }
    });
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

export const projects = {
    create,
    update,
    getAll,
    delete: deleteOne,
    rotateApiKey,
};
