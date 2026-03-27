import { api, cookies } from "./client";

const signup = async (body: {
    email: string;
    password: string;
    name: string;
    avatar_url?: string | null;
}) => {
    const res = await api.auth.signup.$post({ json: body });
    if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
            cookies.setTokens(json.data.access_token, json.data.refresh_token);
        }
        return { data: json, error: null };
    }
    return { data: null, error: await res.json() };
};

const login = async (body: {
    email: string;
    password: string;
}) => {
    const res = await api.auth.login.$post({ json: body });
    if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
            cookies.setTokens(json.data.access_token, json.data.refresh_token);
        }
        return { data: json, error: null };
    }
    return { data: null, error: await res.json() };
};

const refresh = async () => {
    const refreshToken = cookies.getRefreshToken();
    if (!refreshToken) {
        return { data: null, error: { message: "No refresh token" } };
    }
    const res = await api.auth.refresh.$post({}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
    });
    if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
            cookies.setTokens(json.data.access_token, json.data.refresh_token);
        }
        return { data: json, error: null };
    }
    return { data: null, error: await res.json() };
};

const logout = async () => {
    const refreshToken = cookies.getRefreshToken();
    if (!refreshToken) {
        cookies.clearTokens();
        return { data: { success: true, message: "Already logged out" }, error: null };
    }
    const res = await api.auth.logout.$post({}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
    });
    cookies.clearTokens();
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

const forgot = async (body: { email: string }) => {
    const res = await api.auth.forgot.$post({ json: body });
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

const reset = async (body: { token: string; new_password: string }) => {
    const res = await api.auth.reset.$post({ json: body });
    if (res.ok) {
        return { data: await res.json(), error: null };
    }
    return { data: null, error: await res.json() };
};

export const auth = {
    signup,
    login,
    refresh,
    logout,
    forgot,
    reset,
};
