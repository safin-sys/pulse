import type { Batcher } from "./batcher.js";

export const track = (eventName: string, properties: Record<string, any> = {}, { batcher, visitorId }: { batcher: Batcher, visitorId: string }) => {
    const event = {
        type: eventName,
        visitorId,
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

    batcher.add(event);
};

export const setupClickTracking = ({ batcher, visitorId }: { batcher: Batcher, visitorId: string }) => {
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        // Walk up the tree to find a button or link
        const element = target.closest('button, a');

        if (element) {
            const el = element as HTMLElement;
            track('click', {
                tagName: el.tagName.toLowerCase(),
                id: el.id,
                className: el.className,
                text: el.innerText || el.textContent,
                href: (el as HTMLAnchorElement).href
            }, { batcher, visitorId });
        }
    }, true);
};