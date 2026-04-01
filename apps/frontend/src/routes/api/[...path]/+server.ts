import type { RequestHandler } from './$types';
import { WORKER_URL } from '$env/static/private';

const handler: RequestHandler = async ({ request, params }) => {
    const url = new URL(request.url);
    const targetUrl = `${WORKER_URL}/${params.path}${url.search}`;

    return fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        // @ts-ignore
        duplex: 'half'
    });
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;