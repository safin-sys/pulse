import { sendBatch } from "./sender.js";

export interface BatcherConfig {
    apiKey: string;
    batchSize?: number;
    timeout?: number;
    context: BatchContext;
}

export interface BatchContext {
    userAgent: string;
    language: string;
    screen: string;
    hostname: string;
}

export interface AnalyticsEvent {
    [key: string]: any;
}

export interface BatchPayload {
    apiKey: string;
    context: BatchContext;
    events: AnalyticsEvent[];
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
            apiKey: config.apiKey,
            context: config.context,
            events: [...queue],
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
