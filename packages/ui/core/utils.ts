import { cloneElement, Fragment, type ReactElement } from "react";
import type { Dict } from "./types";

export const objectAssign = <
	T extends Record<string, unknown>,
	U extends Record<string, unknown>,
>(
	root: T,
	source: U,
) => Object.assign(root, source) as T & U;

export const cloneSingleElement = <T extends Dict>(
	element: ReactElement,
	props: T,
) => {
	if (element.type === Fragment) {
		console.error(
			"cloneSingleElement: Cannot clone a Fragment element. Please provide a single React element instead.",
		);
		return element;
	}

	return cloneElement(element, props) as ReactElement<T>;
};

export const cn = (...classes: (string | undefined | null | false)[]) => {
	return classes.filter(Boolean).join(" ");
};

export const prefersReducedMotion = () =>
	typeof window !== "undefined" &&
	window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
