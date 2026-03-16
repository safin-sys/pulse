export const getVisitorId = (): string => {
    const key = "analytics_visitor_id";
    let visitorId = localStorage.getItem(key);
    if (!visitorId) {
        visitorId = generateId();
        localStorage.setItem(key, visitorId);
    }
    return visitorId;
};

export const getSessionId = (): string => {
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min
    const stored = sessionStorage.getItem("_sid");
    const lastActivity = sessionStorage.getItem("_sid_t");
    const now = Date.now();

    if (
        stored &&
        lastActivity &&
        now - parseInt(lastActivity) < SESSION_TIMEOUT
    ) {
        sessionStorage.setItem("_sid_t", now.toString());
        return stored;
    }

    // new session
    const id = generateId();
    sessionStorage.setItem("_sid", id);
    sessionStorage.setItem("_sid_t", now.toString());
    return id;
};

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
