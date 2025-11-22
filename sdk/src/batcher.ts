import { sendBatch } from "./sender.js";

export interface BatcherConfig {
    apiKey: string;
    batchSize?: number;
    timeout?: number;
}

export interface AnalyticsEvent {
    [key: string]: any;
}

export interface BatchPayload {
    events: AnalyticsEvent[];
    apiKey: string;
}

export interface Batcher {
    add: (event: AnalyticsEvent) => void;
    flush: () => Promise<void>;
}

const defaultConfig = {
    batchSize: 10,
    timeout: 5000,
}

export const createBatcher = (props: BatcherConfig): Batcher => {
    const config = { ...defaultConfig, ...props };
    let queue: AnalyticsEvent[] = [];
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const flush = async (): Promise<void> => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        if (queue.length === 0) return;

        const payload: BatchPayload = {
            events: [...queue],
            apiKey: config.apiKey,
        };

        queue = [];

        await sendBatch(payload);
    };

    const add = (event: AnalyticsEvent): void => {
        queue.push({ ...event });

        if (queue.length >= config.batchSize) {
            flush();
            return;
        }

        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(flush, config.timeout);
    };

    return { add, flush };
}
