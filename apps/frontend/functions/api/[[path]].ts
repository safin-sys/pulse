export const onRequest: PagesFunction = async (context) => {
    const url = new URL(context.request.url);
    const targetUrl = `https://api.pulsed.workers.dev${url.pathname.replace('/api', '')}${url.search}`;

    return fetch(targetUrl, {
        method: context.request.method,
        headers: context.request.headers,
        body: context.request.body,
    });
};