export const sendBatch = async (batch: { events: any[], apiKey: string }) => {
    const endpoint = `https://api.pulsed.workers.dev/ingest`;
    if (batch.events.length === 0) return;

    const payload = JSON.stringify(batch);

    // Try sendBeacon first if available and payload is small enough
    // if (navigator.sendBeacon) {
    //     const blob = new Blob([payload], { type: 'application/json' });
    //     if (navigator.sendBeacon(endpoint, blob)) {
    //         return;
    //     }
    // }

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
        console.error('[Pulse] Failed to send batch', e);
    }
};
