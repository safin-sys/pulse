import { countries } from "countries-list";

export const get_country_name = (code: string): string => {
	return (countries as Record<string, { name: string }>)[code]?.name || code;
};