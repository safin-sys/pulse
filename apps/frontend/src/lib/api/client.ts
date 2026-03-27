import { hc } from "hono/client";
import { PUBLIC_API_URL } from "$env/static/public";
import type { AppType } from "@pulse/backend";

export type ApiClient = ReturnType<typeof createClient>;

const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+"));
    return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const cookies = {
    getAccessToken: () => getCookie("access_token"),
    getRefreshToken: () => getCookie("refresh_token"),
    setTokens: (accessToken: string, refreshToken: string) => {
        setCookie("access_token", accessToken);
        setCookie("refresh_token", refreshToken);
    },
    clearTokens: () => {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
    },
};

const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    return fetch(input, {
        ...init,
        credentials: "include",
    });
};

export const createClient = () => {
    return hc<AppType>(PUBLIC_API_URL, { fetch: customFetch });
};

export const api = createClient();
