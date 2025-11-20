import { sendBatch } from './sender.js';

interface BatcherConfig {
    batchSize: number;
    timeout: number;
    apiKey: string;
}

export class Batcher {
    private queue: any[] = [];
    private timeoutId: number | null = null;
    private config: BatcherConfig;

    constructor(config: BatcherConfig) {
        this.config = config;
    }

    add(event: any) {
        this.queue.push({ ...event, apiKey: this.config.apiKey });
        if (this.queue.length >= this.config.batchSize) {
            this.flush();
        } else if (!this.timeoutId) {
            this.timeoutId = window.setTimeout(() => this.flush(), this.config.timeout);
        }
    }

    flush() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        if (this.queue.length > 0) {
            const eventsToSend = [...this.queue];
            this.queue = [];
            sendBatch(eventsToSend);
        }
    }
}
