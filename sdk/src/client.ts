import { Batcher } from './batcher.js';
import { getVisitorId } from './ids.js';

interface AnalyticsOptions {
    endpoint?: string;
    batchSize?: number;
    batchTimeout?: number;
}

class Analytics {
    private apiKey?: string;
    private batcher?: Batcher;
    private visitorId: string;

    constructor() {
        this.visitorId = getVisitorId();
    }

    init(apiKey: string, options: AnalyticsOptions = {}) {
        this.apiKey = apiKey;
        const endpoint = options.endpoint || 'http://localhost:3000/api/collect'; // Default placeholder

        this.batcher = new Batcher({
            batchSize: options.batchSize || 10,
            timeout: options.batchTimeout || 5000,
            endpoint: endpoint
        });

        this.track('page_view');

        // Optional: Track history changes for SPAs
        window.addEventListener('popstate', () => this.track('page_view'));
    }

    track(eventName: string, properties: Record<string, any> = {}) {
        if (!this.batcher || !this.apiKey) {
            console.error('Analytics not initialized. Call init() first.');
            return;
        }

        const event = {
            type: eventName,
            apiKey: this.apiKey,
            visitorId: this.visitorId,
            timestamp: Date.now(),
            properties: {
                ...properties,
                path: window.location.pathname,
                query: window.location.search,
                title: document.title,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                language: navigator.language,
                screen: `${window.screen.width}x${window.screen.height}`,
                hostname: window.location.hostname,
            }
        };

        this.batcher.add(event);
    }
}

export const analytics = new Analytics();