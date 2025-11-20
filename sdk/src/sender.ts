export const sendBatch = async (events: any[]) => {
    const endpoint = "http://localhost:3000/api/collect";
    if (events.length === 0) return;

    const payload = JSON.stringify(events);

    // Try sendBeacon first if available and payload is small enough
    if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        if (navigator.sendBeacon(endpoint, blob)) {
            return;
        }
    }

    // Fallback to fetch with keepalive
    try {
        await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: payload,
            keepalive: true,
        });
    } catch (e) {
        console.error('Analytics: Failed to send batch', e);
    }
};
