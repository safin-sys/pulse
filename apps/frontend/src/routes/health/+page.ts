import { health } from '$lib/api';

export const load = async () => {
	try {
		return await health.check();
	} catch (error) {
		return { error: error instanceof Error ? error.message : 'Unknown error' };
	}
};
