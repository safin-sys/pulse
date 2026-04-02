import type { RequestHandler } from "./$types";
import { WORKER_URL } from "$env/static/private";

const handler: RequestHandler = async ({ request, params }) => {
	const url = new URL(request.url);
	const targetUrl = `${WORKER_URL}/${params.path}${url.search}`;

	try {
		const hasBody = request.method !== "GET" && request.method !== "HEAD";
		const body = hasBody ? await request.text() : undefined;

		const response = await fetch(targetUrl, {
			method: request.method,
			headers: request.headers,
			body
		});

		const responseBody = await response.text();

		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete("content-encoding");
		responseHeaders.delete("content-length");

		return new Response(responseBody, {
			status: response.status,
			headers: responseHeaders
		});
	} catch (e) {
		console.error("proxy error:", e);
		return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
	}
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;
