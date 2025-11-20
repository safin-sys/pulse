import { Batcher } from './batcher.js';
import { getVisitorId } from './ids.js';
import { track, setupClickTracking } from './tracker.js';

interface AnalyticsOptions {
    batchSize?: number;
    batchTimeout?: number;
}

export const analytics = (apiKey: string, options: AnalyticsOptions = {}) => {
    const batcher = new Batcher({
        apiKey,
        batchSize: options.batchSize || 10,
        timeout: options.batchTimeout || 5000,
    });

    const trackerOptions = {
        batcher,
        visitorId: getVisitorId(),
    }

    // Initial Page View
    track('page_view', {}, trackerOptions);

    // History changes
    window.addEventListener('popstate', () => track('page_view', {}, trackerOptions));

    // Click tracking
    setupClickTracking(trackerOptions);
};