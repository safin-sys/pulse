import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function flyAndScale(
	node: HTMLElement,
	params: { duration?: number; origin?: string } = {}
) {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	return {
		duration: params.duration || 150,
		easing: (t: number) => 1 - Math.pow(1 - t, 3),
		css: (t: number) => {
			const scale = 0.95 + (1 - t) * 0.05;
			return `
			transform: translate(-50%, -50%) ${transform} scale(${scale});
			opacity: ${t}
			`;
		},
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
