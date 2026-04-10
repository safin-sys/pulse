import { createBatcher, type BatchContext } from './batcher.js';
import { getSessionId, getVisitorId } from './ids.js';
import { track, setupClickTracking } from './tracker.js';

const script = Array.from(document.querySelectorAll('script')).find(
    s => s.src.includes('orbit.js')
) as HTMLScriptElement;

const apiKey = script?.dataset.apiKey;
const batchSize = script?.dataset.batchSize ? parseInt(script.dataset.batchSize) : undefined;
const batchTimeout = script?.dataset.batchTimeout ? parseInt(script.dataset.batchTimeout) : undefined;

if (!apiKey) {
    console.error('[Orbit] Missing data-api-key attribute');
} else {
    const context: BatchContext = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
        hostname: window.location.hostname,
    };

    const batcher = createBatcher({
        apiKey,
        context,
        ...(batchSize && { batchSize }),
        ...(batchTimeout && { timeout: batchTimeout }),
    });

    const trackerOptions = {
        batcher,
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
    };

    track('page_view', {}, trackerOptions);
    window.addEventListener('popstate', () => track('page_view', {}, trackerOptions));
    setupClickTracking(trackerOptions);
}