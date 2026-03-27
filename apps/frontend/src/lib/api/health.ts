import { api } from "./client";

const check = async () => {
    const res = await api.health.$get();
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

export const health = {
    check,
};
