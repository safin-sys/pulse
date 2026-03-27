import { health } from '$lib/api';

export const load = async () => {
    return await health.check();
};
