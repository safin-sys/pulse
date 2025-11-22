import { createBatcher, type BatcherConfig } from './batcher.js';
import { getVisitorId } from './ids.js';
import { track, setupClickTracking } from './tracker.js';

interface AnalyticsOptions {
    batchSize?: number;
    batchTimeout?: number;
}

export const analytics = (apiKey: string, options: AnalyticsOptions = {}) => {
    const batcherOptions: BatcherConfig = { apiKey };
    if (options.batchSize) batcherOptions.batchSize = options.batchSize;
    if (options.batchTimeout) batcherOptions.timeout = options.batchTimeout;

    const batcher = createBatcher(batcherOptions);

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