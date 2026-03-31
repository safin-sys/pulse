import type { Batcher } from "./batcher.js";

interface TrackerOptions {
    batcher: Batcher;
    visitorId: string;
    sessionId: string;
}

export const track = (
    eventName: string,
    properties: Record<string, any> = {},
    { batcher, visitorId, sessionId }: TrackerOptions,
) => {
    const event = {
        type: eventName,
        visitorId,
        sessionId,
        timestamp: Date.now(),
        properties: {
            ...properties,
            path: window.location.pathname,
            query: window.location.search,
            title: document.title,
            ...(eventName === "page_view" && { referrer: document.referrer }),
        },
    };

    batcher.add(event);
};

export const setupClickTracking = ({
    batcher,
    visitorId,
    sessionId,
}: TrackerOptions) => {
    document.addEventListener(
        "click",
        (e) => {
            const target = e.target as HTMLElement;
            // Walk up the tree to find a button or link
            const element = target.closest("button, a");

            if (element) {
                const el = element as HTMLElement;
                track(
                    "click",
                    {
                        tagName: el.tagName.toLowerCase(),
                        id: el.id,
                        className: el.className,
                        text: el.innerText || el.textContent,
                        href: (el as HTMLAnchorElement).href,
                    },
                    { batcher, visitorId, sessionId },
                );
            }
        },
        true,
    );
};
