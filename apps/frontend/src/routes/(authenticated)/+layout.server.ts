import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
	const access_token = cookies.get("access_token");
	if (!access_token) {
		redirect(303, "/login");
	}
};
