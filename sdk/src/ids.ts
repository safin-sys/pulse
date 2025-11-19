export const getVisitorId = (): string => {
    const key = 'analytics_visitor_id';
    let visitorId = localStorage.getItem(key);
    if (!visitorId) {
        visitorId = generateId();
        localStorage.setItem(key, visitorId);
    }
    return visitorId;
};

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
