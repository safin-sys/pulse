import { createBatcher, type BatchContext, type BatcherConfig } from './batcher.js';
import { getSessionId, getVisitorId } from './ids.js';
import { track, setupClickTracking } from './tracker.js';

interface AnalyticsOptions {
    batchSize?: number;
    batchTimeout?: number;
}

export const pulse = (apiKey: string, options: AnalyticsOptions = {}) => {
    const context: BatchContext = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
        hostname: window.location.hostname,
    };
    
    const batcherOptions: BatcherConfig = {
        apiKey,
        context,
        ...(options.batchSize && { batchSize: options.batchSize }),
        ...(options.batchTimeout && { timeout: options.batchTimeout }),
    };

    const batcher = createBatcher(batcherOptions);

    const trackerOptions = {
        batcher,
        visitorId: getVisitorId(),
        sessionId: getSessionId()
    }

    // Initial Page View
    track('page_view', {}, trackerOptions);

    // History changes
    window.addEventListener('popstate', () => track('page_view', {}, trackerOptions));

    // Click tracking
    setupClickTracking(trackerOptions);
};